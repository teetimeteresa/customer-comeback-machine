#!/usr/bin/env node
/**
 * Rate-Limited Email Outreach Engine
 * 
 * Processes high-intent leads (high_intent=1, sales_email_sent=0)
 * with a strict daily limit to prevent Resend blocks.
 * 
 * Rate limit: 80 emails/day (~5/hour during business hours)
 * Tracks daily sends via a state file to survive restarts.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────────────────
const DAILY_LIMIT = 80;
const DELAY_BETWEEN_EMAILS_MS = 3000; // 3 seconds between sends
const STATE_FILE = '/home/team/shared/outreach_state.json';
const LOG_FILE = '/home/team/shared/outreach_rate_limited.log';
const BATCH_SIZE = 10; // How many leads to fetch at once

// Load .env if not already loaded
if (!process.env.RESEND_API_KEY) {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#\s=]+)=(.*)$/);
        if (match) {
          let value = match[2].trim();
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[match[1]]) {
            process.env[match[1]] = value;
          }
        }
      });
    }
  } catch (e) { /* ignore */ }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  fs.appendFileSync(LOG_FILE, line + '\n');
  console.log(line);
}

function runQuery(sql, retries = 5) {
  if (typeof sql !== 'string') {
    sql = JSON.stringify(sql);
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = spawnSync('/home/team/shared/scripts/team-db-locked.sh', [sql], {
        maxBuffer: 50 * 1024 * 1024,
        timeout: 30000,
      });
      if (res.status === 0) {
        const output = res.stdout.toString().trim();
        try { return JSON.parse(output); } catch (e) { return output; }
      } else {
        const err = (res.stderr || '').toString();
        if (err.includes('Locking') || err.includes('locked') || err.includes('GenericFailure')) {
          const delay = attempt * 3000 + Math.random() * 2000;
          log(`DB locked (attempt ${attempt}), retrying in ${Math.round(delay)}ms...`);
          spawnSync('sleep', [String(Math.round(delay / 1000))]);
        } else {
          log(`DB Error: ${err}`);
          return null;
        }
      }
    } catch (err) {
      log(`Execution error: ${err.message}`);
      return null;
    }
  }
  log(`DB failed after ${retries} retries`);
  return null;
}

function getState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) { /* ignore */ }
  return { date: '', sent_today: 0, total_sent: 0 };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendEmailViaApi(to, subject, html) {
  try {
    const response = await fetch('http://localhost:3000/api/email/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: to }),
    });
    if (response.ok) {
      return { success: true };
    }
    const text = await response.text();
    return { success: false, error: text };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function sendEmailDirect(to, lead) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Use the API to send via Resend's API key already configured
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CCM <noreply@customercomebackmachine.com>',
        to: [to],
        subject: `Your Reputation Guard Score is ready — ${lead.business_name || 'see inside'}`,
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2 style="color: #F59E0B;">Your Reputation Guard Score</h2>
          <p>Hi ${lead.business_name ? lead.business_name + ' Team' : 'there'},</p>
          <p>Thanks for using our Reputation Guard Audit tool.</p>
          <p>You've already taken the first step toward building a more loyal customer base. We'd love to show you how to turn those audit insights into real retention results.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${appUrl}/signup" style="background-color: #F59E0B; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Start Your 14-Day Free Trial →
            </a>
          </p>
          <p style="color: #64748b; font-size: 12px;">Customer Comeback Machine — Giving every customer a reason to come home.</p>
        </div>`,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, id: data.id };
    }
    return { success: false, error: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  log('=== Rate-Limited Outreach Engine START ===');
  
  const state = getState();
  const today = getToday();

  // Reset daily counter if new day
  if (state.date !== today) {
    state.date = today;
    state.sent_today = 0;
  }

  // Check if we've hit the daily limit
  if (state.sent_today >= DAILY_LIMIT) {
    log(`Daily limit reached: ${state.sent_today}/${DAILY_LIMIT}. Exiting.`);
    return;
  }

  const remaining = DAILY_LIMIT - state.sent_today;
  log(`Today: ${state.sent_today} sent, ${remaining} remaining (limit: ${DAILY_LIMIT}/day)`);

  // Fetch pending high-intent leads (Priority: Austin, TX)
  const leads = runQuery(
    `SELECT id, email, business_name, business_type, city FROM leads WHERE city LIKE '%Austin%' AND high_intent = 1 AND sales_email_sent = 0 LIMIT ${Math.min(BATCH_SIZE, remaining)}`
  );

  if (!leads || leads.length === 0) {
    log('No pending leads found. Exiting.');
    return;
  }

  log(`Fetched ${leads.length} leads to process`);

  let batchSent = 0;
  let batchErrors = 0;

  for (const lead of leads) {
    // Check remaining capacity
    if (state.sent_today >= DAILY_LIMIT) {
      log('Daily limit hit mid-batch. Stopping.');
      break;
    }

    // Send via the /api/email/sales endpoint
    log(`Sending to ${lead.email} (${lead.business_name || 'unknown'})...`);
    
    try {
      const result = await sendEmailDirect(lead.email, lead);
      
      if (result.success) {
        // Mark lead as emailed
        runQuery(
          `UPDATE leads SET sales_email_sent = 1, last_sequence_step = 1, last_sequence_at = datetime('now') WHERE id = '${lead.id.replace(/'/g, "''")}'`
        );
        state.sent_today++;
        state.total_sent++;
        batchSent++;
        saveState(state);
        log(`✓ Sent to ${lead.email} (${state.sent_today}/${DAILY_LIMIT} today)`);
      } else {
        log(`✗ Failed for ${lead.email}: ${JSON.stringify(result.error)}`);
        batchErrors++;
        
        // If we get a rate limit or auth error, pause
        const errorStr = JSON.stringify(result.error).toLowerCase();
        if (errorStr.includes('rate') || errorStr.includes('429') || errorStr.includes('unauthorized')) {
          log('Rate limit or auth error detected. Pausing engine.');
          saveState(state);
          return;
        }
      }
    } catch (err) {
      log(`✗ Error sending to ${lead.email}: ${err.message}`);
      batchErrors++;
    }

    // Delay between sends
    await sleep(DELAY_BETWEEN_EMAILS_MS);
  }

  saveState(state);
  log(`=== Batch complete: ${batchSent} sent, ${batchErrors} errors ===`);
  log(`Total all-time: ${state.total_sent}`);
}

main().catch(err => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});