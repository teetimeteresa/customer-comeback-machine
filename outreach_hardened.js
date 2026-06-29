#!/usr/bin/env node
/**
 * HARDENED Outreach Engine v2.2 — Multi-Niche & Local SQLite
 * 
 * Supports niche-specific templates:
 * - Med Spa: "The 90-Day Refresh Problem"
 * - Veterinary: "The Chewy Problem / Online Drift"
 * - Fallback: Reputation Guard Generic
 * 
 * Rate limit: 80 emails/day, 3s between sends
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DAILY_LIMIT = 80;
const DELAY_MS = 3000;
const DB_PATH = '/home/team/shared/austin_leads_v2.db';
const STATE_FILE = '/home/team/shared/outreach_state.json';
const LOG_FILE = '/home/team/shared/outreach_rate_limited.log';

// Load .env for RESEND_API_KEY
if (!process.env.RESEND_API_KEY) {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const m = line.match(/^([^#\s=]+)=(.*)$/);
        if (m) {
          let v = m[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[m[1]]) process.env[m[1]] = v;
        }
      }
    }
  } catch (e) {}
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  fs.appendFileSync(LOG_FILE, line + '\n');
  console.log(line);
}

function dbQuery(sql) {
  try {
    const result = execSync(`sqlite3 -json "${DB_PATH}" "${sql}"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
    if (!result) return [];
    return JSON.parse(result);
  } catch (e) {
    log(`DB error: ${e.message}`);
    return [];
  }
}

function dbExec(sql) {
  try {
    execSync(`sqlite3 "${DB_PATH}" "${sql}"`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    log(`DB exec error: ${e.message}`);
    return false;
  }
}

function getState() {
  try {
    if (fs.existsSync(STATE_FILE)) return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (e) {}
  return { date: '', sent_today: 0, total_sent: 0 };
}

function saveState(s) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTemplate(lead) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const businessName = lead.business_name || 'there';
  const bt = (lead.business_type || '').toLowerCase();

  // ─── Med Spa Template ──────────────────────────────────────────────────────
  if (bt.includes('med_spa') || bt.includes('medspa') || bt.includes('aesthetic')) {
    return {
      subject: `You're spending $300 to acquire clients who never come back 💉`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
        <h2 style="color:#F59E0B;">The 90-Day Refresh Problem</h2>
        <p>Hi ${businessName} Team,</p>
        <p>You spend a fortune to acquire each client. But if they don't return for their refresh, that's a massive retention gap.</p>
        <p><strong>Customer Comeback Machine</strong> automates your follow-ups so your $600 clients stay loyal to you, not a competitor's "New Patient Special."</p>
        <p>We're offering a <strong>$49/mo Founding Member rate</strong> for the first 10 Med Spas. No setup fee.</p>
        <p style="text-align:center;margin:30px 0">
          <a href="${appUrl}/signup" style="background:#F59E0B;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
            Start Your 14-Day Free Trial →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px">Customer Comeback Machine — Giving every customer a reason to come home.</p>
      </div>`
    };
  }

  // ─── Veterinary Template ───────────────────────────────────────────────────
  if (bt.includes('vet') || bt.includes('animal clinic') || bt.includes('veterinary')) {
    return {
      subject: `🐾 Is Chewy taking your pharmacy revenue?`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
        <h2 style="color:#F59E0B;">Stop the "Online Drift"</h2>
        <p>Hi ${businessName} Team,</p>
        <p>Clients are drifting. They're buying their heartworm meds on Chewy and skipping annual wellness exams because their pet "seems fine."</p>
        <p><strong>Customer Comeback Machine</strong> is an automated "Wellness Watch" that sends perfectly timed reminders for exams and refills — keeping you top-of-mind so they book with you first.</p>
        <p>We're offering a <strong>$49/mo Founding Member rate</strong> for the first 10 Veterinary clinics. Setup fee waived.</p>
        <p style="text-align:center;margin:30px 0">
          <a href="${appUrl}/signup" style="background:#F59E0B;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
            Start Your 14-Day Free Trial →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px">Customer Comeback Machine — Giving every customer a reason to come home.</p>
      </div>`
    };
  }

  // ─── Dental / Cosmetic Dentistry Template ─────────────────────────────────
  if (bt.includes('dental') || bt.includes('dentistry') || bt.includes('dentist') || bt.includes('cosmetic dentistry')) {
    return {
      subject: `Your Reputation Guard Score: [Score]/100 — ${businessName}`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
        <h2 style="color:#F59E0B;">Your Reputation Guard Score</h2>
        <p>Hi ${businessName} Team,</p>
        <p>We ran a quick audit of your online presence. Your <strong>Reputation Guard Score</strong> tells a story — and there's a hidden opportunity.</p>
        <p>The biggest gap we see isn't about your service — it's the <strong>"Silent Drift"</strong> — patients who loved their first visit but never scheduled their 6-month checkup. Most dental practices lose 60-70% of first-time patients within 90 days.</p>
        <p>We built a free tool that shows exactly how much revenue is walking out your door every month from patients who don't come back.</p>
        <p style="text-align:center;margin:30px 0">
          <a href="${appUrl}/audit" style="background:#F59E0B;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
            Get Your Free Audit →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px">Customer Comeback Machine — Giving every customer a reason to come home.</p>
      </div>`
    };
  }

  // ─── HVAC Template ──────────────────────────────────────────────────────
  if (bt.includes('hvac') || bt.includes('heating') || bt.includes('cooling') || bt.includes('home services')) {
    return {
      subject: `Summer is coming. Are your HVAC customers ready?`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
        <h2 style="color:#F59E0B;">The Seasonal Retention Gap</h2>
        <p>Hi ${businessName} Team,</p>
        <p>Spring is when HVAC customers make decisions about summer AC maintenance. Most companies blast discount emails and hope for the best.</p>
        <p>The businesses that win aren't the ones with the best coupons — they're the ones who stayed top-of-heart since last summer.</p>
        <p>Our free <strong>Lost Customer ROI Calculator</strong> shows you exactly how much revenue you left on the table last year from customers who called someone else.</p>
        <p style="text-align:center;margin:30px 0">
          <a href="${appUrl}/roi-calculator" style="background:#F59E0B;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
            Calculate Your Lost Revenue →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px">Customer Comeback Machine — Giving every customer a reason to come home.</p>
      </div>`
    };
  }

  // ─── Chiropractic Template ──────────────────────────────────────────────
  if (bt.includes('chiro') || bt.includes('chiropractic') || bt.includes('personal injury')) {
    return {
      subject: `60% of your patients won't come back — here's why`,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
        <h2 style="color:#F59E0B;">The Churn Cycle</h2>
        <p>Hi ${businessName} Team,</p>
        <p>Personal injury churn is brutal — 60% of patients never return after their case settles. Not because you did anything wrong — just because the referral pipeline went quiet.</p>
        <p>We help practices like yours automate <strong>patient re-engagement</strong> so every person who walks through your door becomes a long-term patient, not a one-time visit.</p>
        <p>We're offering a special <strong>$49/mo Founding Member rate</strong> for the first 10 chiropractic practices. No setup fee. Full 14-day free trial.</p>
        <p style="text-align:center;margin:30px 0">
          <a href="${appUrl}/signup" style="background:#F59E0B;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
            Start Your 14-Day Free Trial →
          </a>
        </p>
        <p style="color:#64748b;font-size:12px">Customer Comeback Machine — Giving every customer a reason to come home.</p>
      </div>`
    };
  }

  // ─── Reputation Guard Score (Generic Lead Magnet) ────────────────────────
  return {
    subject: `Your Reputation Guard Score is ready — ${businessName}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:20px">
      <h2 style="color:#F59E0B;">Your Reputation Guard Score</h2>
      <p>Hi ${businessName} Team,</p>
      <p>We ran a quick audit of your online presence. Your <strong>Reputation Guard Score</strong> reveals the hidden revenue gap most local businesses miss.</p>
      <p>The biggest opportunity we see? The <strong>"Silent Drift"</strong> — customers who loved their first visit but never came back. Most [niche] businesses lose 60-70% of first-time customers within 90 days.</p>
      <p>We built a free tool that shows exactly how much revenue is walking out your door every month from customers who don't come back.</p>
      <p style="text-align:center;margin:30px 0">
        <a href="${appUrl}/audit" style="background:#F59E0B;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
          Get Your Free Audit →
        </a>
      </p>
      <p style="color:#64748b;font-size:12px">Customer Comeback Machine — Giving every customer a reason to come home.</p>
    </div>`
  };
}

async function sendEmail(to, subject, html) {
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

async function main() {
  log('=== HARDENED Outreach Engine v2.2 START ===');
  
  // Ensure local DB exists
  dbExec("CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, email TEXT, business_name TEXT, business_type TEXT, city TEXT, sales_email_sent INTEGER DEFAULT 0, high_intent INTEGER DEFAULT 1)");
  
  const state = getState();
  const today = new Date().toISOString().slice(0, 10);
  if (state.date !== today) { state.date = today; state.sent_today = 0; }
  saveState(state);

  if (state.sent_today >= DAILY_LIMIT) {
    log(`Daily limit reached: ${state.sent_today}/${DAILY_LIMIT}. Exiting.`);
    return;
  }

  const remaining = Math.min(10, DAILY_LIMIT - state.sent_today);
  log(`Today: ${state.sent_today}/${DAILY_LIMIT}, processing up to ${remaining} leads`);

  // Fetch leads from LOCAL SQLite
  let leads = dbQuery(
    `SELECT id, email, business_name, business_type, city FROM leads WHERE sales_email_sent = 0 LIMIT ${remaining}`
  );

  if (!leads || leads.length === 0) {
    log('No leads in local DB. Trying to seed from team-db...');
    
    // Try to get from team-db as fallback
    try {
      const teamResult = execSync(
        `cd /home/team/shared && scripts/team-db-locked.sh "SELECT id, email, business_name, business_type, city FROM leads WHERE high_intent = 1 AND sales_email_sent = 0 LIMIT 100" 2>/dev/null`,
        { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
      ).trim();
      
      if (teamResult && teamResult !== '[]') {
        const teamLeads = JSON.parse(teamResult);
        for (const l of teamLeads) {
          const e = (l.email || '').replace(/'/g, "''");
          const n = (l.business_name || '').replace(/'/g, "''");
          const t = (l.business_type || '').replace(/'/g, "''");
          const c = (l.city || '').replace(/'/g, "''");
          dbExec(`INSERT OR IGNORE INTO leads (id, email, business_name, business_type, city) VALUES ('${l.id}', '${e}', '${n}', '${t}', '${c}')`);
        }
        log(`Seeded ${teamLeads.length} leads from team-db`);
      }
    } catch (e) {
      log(`team-db seed failed: ${e.message}`);
    }
    
    // Re-check
    const refetched = dbQuery(`SELECT id, email, business_name, business_type, city FROM leads WHERE sales_email_sent = 0 LIMIT ${remaining}`);
    if (!refetched || refetched.length === 0) {
      log('Still no leads. Exiting.');
      return;
    }
    leads = refetched;
  }

  log(`Processing ${leads.length} leads`);
  let sent = 0;

  for (const lead of leads) {
    if (state.sent_today >= DAILY_LIMIT) break;

    const { subject, html } = getTemplate(lead);

    log(`Sending to ${lead.email} (${lead.business_name || 'there'})...`);
    const result = await sendEmail(lead.email, subject, html);

    if (result.success) {
      dbExec(`UPDATE leads SET sales_email_sent = 1 WHERE id = '${lead.id}'`);
      state.sent_today++;
      state.total_sent++;
      sent++;
      saveState(state);
      log(`✓ Sent (${state.sent_today}/${DAILY_LIMIT} today)`);
    } else {
      log(`✗ Failed: ${JSON.stringify(result.error)}`);
      const errStr = JSON.stringify(result.error).toLowerCase();
      if (errStr.includes('rate') || errStr.includes('429') || errStr.includes('unauthorized')) {
        log('Rate/auth error — pausing');
        break;
      }
    }

    await sleep(DELAY_MS);
  }

  log(`=== Batch: ${sent} sent, total: ${state.total_sent} ===`);
}

main().catch(e => { log(`FATAL: ${e.message}`); process.exit(1); });
