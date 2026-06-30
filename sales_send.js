/**
 * Sales Send — Individual Email Outreach
 * 
 * Usage: node sales_send.js "customer@example.com" "Subject" "<html>Body</html>"
 * 
 * Features:
 * - Reads RESEND_API_KEY from environment (never hardcoded)
 * - 15-second timeout on API calls
 * - Detailed error reporting for blocks/bounces/rate-limits
 * - Dry-run mode: node sales_send.js --dry-run "email" "Subject" "<html>"
 */

const fs = require('fs');
const path = require('path');

// ─── Configuration ───────────────────────────────────────────────────────────
const TIMEOUT_MS = 15000; // 15 second timeout for Resend API

// Load API key from environment (never hardcode)
let RESEND_API_KEY = process.env.RESEND_API_KEY;

// Fallback: try loading from .env if not in env
if (!RESEND_API_KEY) {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const m = line.match(/^RESEND_API_KEY=(.*)$/);
        if (m) {
          RESEND_API_KEY = m[1].trim().replace(/^["']|["']$/g, '');
          break;
        }
      }
    }
  } catch (e) { /* ignore */ }
}

if (!RESEND_API_KEY) {
  console.error('FATAL: RESEND_API_KEY not found. Set it in environment or .env file.');
  process.exit(1);
}

// ─── Send Email with Timeout ────────────────────────────────────────────────

async function sendPersonalOutreach(to, subject, html) {
  // Validate inputs
  if (!to || !subject || !html) {
    return { success: false, error: 'Missing required arguments: to, subject, html' };
  }

  // Check for dry-run mode
  if (process.argv.includes('--dry-run')) {
    console.log(`[DRY RUN] Would send to: ${to}`);
    console.log(`[DRY RUN] Subject: ${subject.substring(0, 80)}...`);
    return { success: true, dryRun: true };
  }

  try {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    console.log(`Sending to: ${to}`);
    console.log(`Subject: ${subject.substring(0, 80)}${subject.length > 80 ? '...' : ''}`);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CCM <noreply@customercomebackmachine.com>',
        to: [to],
        subject: subject,
        html: html,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (response.ok) {
      console.log(`✓ Sent successfully! ID: ${data.id}`);
      return { success: true, id: data.id };
    }

    // Detailed error analysis
    const statusCode = response.status;
    const errorBody = JSON.stringify(data);

    if (statusCode === 429) {
      console.error(`✗ RATE LIMITED (429): ${errorBody}`);
      return { success: false, error: 'rate_limited', details: data, retryAfter: response.headers.get('retry-after') };
    }
    if (statusCode === 403) {
      console.error(`✗ FORBIDDEN (403): API key restricted or domain not verified: ${errorBody}`);
      return { success: false, error: 'forbidden', details: data };
    }
    if (statusCode >= 500) {
      console.error(`✗ SERVER ERROR (${statusCode}): ${errorBody}`);
      return { success: false, error: 'server_error', details: data };
    }

    console.error(`✗ Error (${statusCode}): ${errorBody}`);
    return { success: false, error: 'send_failed', details: data };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`✗ TIMEOUT after ${TIMEOUT_MS}ms — Resend API did not respond`);
      return { success: false, error: 'timeout' };
    }
    console.error(`✗ Unexpected error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// ─── CLI Entry Point ─────────────────────────────────────────────────────────

const args = process.argv.slice(2).filter(a => a !== '--dry-run');
const [to, subject, html] = args;

if (to && subject && html) {
  sendPersonalOutreach(to, subject, html)
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Fatal error:', err.message);
      process.exit(1);
    });
} else {
  console.log(`
Sales Send — Individual Email Outreach
========================================
Usage:
  node sales_send.js "email@example.com" "Subject Line" "<html>Body</html>"
  node sales_send.js --dry-run "email@example.com" "Subject" "<html>"

Options:
  --dry-run    Validate but don't actually send

Environment:
  RESEND_API_KEY    Required. Your Resend API key.
  (Also loaded from .env file automatically)
`);
}