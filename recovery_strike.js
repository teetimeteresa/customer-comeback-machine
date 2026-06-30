#!/usr/bin/env node
/**
 * RECOVERY STRIKE — Mea Culpa Campaign v1.0
 *
 * Sends a 'broken link apology' email to the 221 leads who received
 * localhost:3000 links in our earlier outreach batches.
 *
 * This campaign uses honesty as a conversion lever:
 * "I messed up" + "Here's a real link" + "Special rate as apology"
 *
 * Rate limit: 80/day (shares the daily cap), 3s between sends
 */

const fs = require('fs');
const path = require('path');

// Auto-load .env file
try {
  const envPath = '/home/team/shared/.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const eqIdx = trimmed.indexOf('=');
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {
  console.error('Warning: Could not load .env file', e.message);
}

const DAILY_LIMIT = 80;
const DELAY_MS = 3000;
const STATE_FILE = '/home/team/shared/outreach_state.json';
const RECOVERY_LIST_FILE = '/home/team/shared/REPORTS/recovery_list.txt';
const SENT_LOG = '/home/team/shared/recovery_sent_log.json';

// ─── State Management ──────────────────────────────────────────────────────
function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { date: '', sent_today: 0, total_sent: 0 };
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function readSentLog() {
  try {
    return JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'));
  } catch {
    return { sent_emails: [] };
  }
}

function writeSentLog(log) {
  fs.writeFileSync(SENT_LOG, JSON.stringify(log, null, 2));
}

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${msg}`);
}

// ─── Mea Culpa Template ────────────────────────────────────────────────────
const APP_URL = 'https://www.customercomebackmachine.com';

function getTemplate(email) {
  return {
    subject: `Oops... I sent you a broken link (Fixed!) 🛠️`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
      <h2 style="color:#F59E0B;">I owe you an apology (and a real link)</h2>
      <p>Hi there,</p>
      <p>I'm writing with a bit of a red face. In my previous email, I accidentally sent you a link that pointed to my internal test server. If you tried to click it, I'm truly sorry for wasting your time — that's on me.</p>
      <p>Here are the <strong>real, working links</strong>:</p>
      <table style="width:100%;margin:20px 0">
        <tr>
          <td style="padding:10px;background:#fef3c7;border-radius:8px">
            <p style="margin:0 0 5px 0"><strong>🔍 Your Free Retention Audit</strong></p>
            <a href="${APP_URL}/audit" style="color:#F59E0B;">${APP_URL}/audit</a>
            <p style="margin:5px 0 0 0;font-size:13px;color:#64748b;">See your Reputation Guard Score — free, no signup required.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px;background:#fef3c7;border-radius:8px;margin-top:10px">
            <p style="margin:0 0 5px 0"><strong>💰 Lost Customer ROI Calculator</strong></p>
            <a href="${APP_URL}/roi-calculator" style="color:#F59E0B;">${APP_URL}/roi-calculator</a>
            <p style="margin:5px 0 0 0;font-size:13px;color:#64748b;">See exactly how much revenue walked out your door last year.</p>
          </td>
        </tr>
      </table>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:15px;margin:20px 0">
        <p style="margin:0 0 5px 0"><strong>🎁 A Special Gift for the Trouble</strong></p>
        <p style="margin:0;font-size:14px;">Because I dropped the ball, I'm unlocking a special <strong>Founding Member rate</strong> for you: <strong>$49/mo (Lifetime)</strong> instead of our standard $99 plan. That's half price, locked in forever. No setup fee. 14-day free trial. No contracts.</p>
      </div>
      <p style="text-align:center;margin:25px 0">
        <a href="${APP_URL}/signup" style="background:#F59E0B;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
          Lock In $49/mo Lifetime → 
        </a>
      </p>
      <p style="font-size:13px;color:#64748b;">Just reply with <strong>'YES'</strong> and I'll set it up for you personally.</p>
      <p style="color:#64748b;font-size:12px;border-top:1px solid #e2e8f0;padding-top:12px">Customer Comeback Machine — Giving every customer a reason to come home.</p>
    </div>`
  };
}

// ─── Send via Resend ───────────────────────────────────────────────────────
async function sendEmail(to, subject, html) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Alex from CCM <noreply@customercomebackmachine.com>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });
    const data = await res.json();
    if (res.ok) return { success: true, id: data.id };
    return { success: false, error: data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── Main Execution ────────────────────────────────────────────────────────
async function main() {
  log('=== RECOVERY STRIKE v1.0 START ===');

  // Read state
  const state = readState();
  const today = new Date().toISOString().split('T')[0];

  if (state.date !== today) {
    log(`New day detected: ${today}. Resetting counter.`);
    state.date = today;
    state.sent_today = 0;
  }

  if (state.sent_today >= DAILY_LIMIT) {
    log(`Daily limit reached: ${state.sent_today}/${DAILY_LIMIT}. Exiting.`);
    return;
  }

  // Read recovery list
  const raw = fs.readFileSync(RECOVERY_LIST_FILE, 'utf8').trim().split('\n');
  const allTargets = raw.map(l => l.trim()).filter(l => l && l.includes('@'));

  // Read sent log to avoid duplicates
  const sentLog = readSentLog();
  const alreadySent = new Set(sentLog.sent_emails);

  // Filter to unsent targets
  const unsent = allTargets.filter(email => !alreadySent.has(email));
  log(`Recovery targets: ${allTargets.length} total, ${unsent.length} unsent`);

  // Calculate how many we can send today
  const remaining = Math.min(10, DAILY_LIMIT - state.sent_today);
  const batch = unsent.slice(0, remaining);

  if (batch.length === 0) {
    log('No unsent targets remaining. All recovered!');
    return;
  }

  log(`Today: ${state.sent_today}/${DAILY_LIMIT}, sending up to ${batch.length} recovery emails`);

  // Send batch
  for (const email of batch) {
    if (state.sent_today >= DAILY_LIMIT) {
      log('Daily limit reached mid-batch. Stopping.');
      break;
    }

    const tpl = getTemplate(email);
    const result = await sendEmail(email, tpl.subject, tpl.html);

    if (result.success) {
      state.sent_today++;
      state.total_sent++;
      sentLog.sent_emails.push(email);
      writeSentLog(sentLog);
      writeState(state);
      log(`✓ Recovery sent to ${email} (${state.sent_today}/${DAILY_LIMIT} today)`);
    } else {
      log(`✗ FAILED to send to ${email}: ${JSON.stringify(result.error)}`);
    }

    // Delay between sends
    if (state.sent_today < DAILY_LIMIT) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  log(`=== Batch done: ${batch.length} sent, total: ${state.total_sent} ===`);
  log(`Recovery progress: ${sentLog.sent_emails.length}/${allTargets.length} recovered`);
}

main().catch(err => log(`FATAL: ${err.message}`));
