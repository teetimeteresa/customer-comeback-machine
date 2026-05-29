#!/usr/bin/env node

const { OpenAI } = require('openai');
const { Resend } = require('resend');
const Stripe = require('stripe');
const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOG_FILE = '/home/team/shared/service_health.log';
const ENV_PATH = '/home/team/shared/.env';
const APP_DIR = '/home/team/shared';
const DB_WAL_PATH = '/home/team/.data/agent-team-910b1375.db-wal';
const DB_PATH = '/home/team/.data/agent-team-910b1375.db';
const WAL_SIZE_THRESHOLD = 5 * 1024 * 1024; // 5MB

function loadEnv() {
  if (fs.existsSync(ENV_PATH)) {
    const envConfig = fs.readFileSync(ENV_PATH, 'utf8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^([^#\s=]+)=(.*)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

async function checkOpenAI() {
  if (!process.env.OPENAI_API_KEY) return { status: 'MISSING_KEY' };
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'health check' }],
      max_tokens: 5,
    });
    return { status: 'OK' };
  } catch (error) {
    return { status: 'ERROR', message: error.message };
  }
}

async function checkResend() {
  if (!process.env.RESEND_API_KEY) return { status: 'MISSING_KEY' };
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const response = await resend.domains.list();
    if (response.error) throw new Error(response.error.message);
    return { status: 'OK' };
  } catch (error) {
    return { status: 'ERROR', message: error.message };
  }
}

async function checkStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return { status: 'MISSING_KEY' };
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    await stripe.checkout.sessions.list({ limit: 1 });
    return { status: 'OK' };
  } catch (error) {
    return { status: 'ERROR', message: error.message };
  }
}

async function checkTurso() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) return { status: 'MISSING_KEY' };
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  try {
    await client.execute('SELECT 1');
    return { status: 'OK' };
  } catch (error) {
    return { status: 'ERROR', message: error.message };
  }
}

function checkAppPort() {
  try {
    execSync('ss -Htln | grep -E ":3000|:3001"');
    return { status: 'OK' };
  } catch (error) {
    return { status: 'DOWN', message: 'Neither port 3000 nor 3001 is listening' };
  }
}

function checkAndCheckpointWAL() {
  if (!fs.existsSync(DB_WAL_PATH)) return { status: 'OK', message: 'No WAL file' };
  const stats = fs.statSync(DB_WAL_PATH);
  if (stats.size > WAL_SIZE_THRESHOLD) {
    console.log(`WAL file size (${stats.size} bytes) exceeds threshold. Attempting checkpoint...`);
    try {
      // Try PASSIVE first
      let result = execSync(`sqlite3 ${DB_PATH} "PRAGMA wal_checkpoint(PASSIVE);"`, { encoding: 'utf8' }).trim();
      console.log(`Passive checkpoint result: ${result}`);
      
      // If it didn't fully checkpoint (result contains 1s in the 2nd or 3rd column), try to be more aggressive if it's really large
      if (stats.size > WAL_SIZE_THRESHOLD * 2) {
          console.log("WAL still large, attempting RESTART checkpoint...");
          result = execSync(`sqlite3 ${DB_PATH} "PRAGMA wal_checkpoint(RESTART);"`, { encoding: 'utf8' }).trim();
          console.log(`Restart checkpoint result: ${result}`);
      }
      
      return { status: 'CHECKPOINTED', size: stats.size, result };
    } catch (error) {
      console.error(`Checkpoint failed: ${error.message}`);
      return { status: 'ERROR', message: error.message };
    }
  }
  return { status: 'OK', size: stats.size };
}

function checkLoad() {
  const load = fs.readFileSync('/proc/loadavg', 'utf8').split(' ').slice(0, 3);
  const avg = parseFloat(load[0]);
  if (avg > 10) {
    return { status: 'HIGH_LOAD', value: avg, details: load.join(', ') };
  }
  return { status: 'OK', value: avg };
}

async function run() {
  const timestamp = new Date().toISOString();
  const results = {
    load: checkLoad(),
    openai: await checkOpenAI(),
    resend: await checkResend(),
    stripe: await checkStripe(),
    turso: await checkTurso(),
    app: checkAppPort(),
    db_wal: checkAndCheckpointWAL(),
  };

  const logEntry = { timestamp, ...results };
  fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');

  // Check for Turso Sync Engine failure specifically
  if (results.turso.status === 'ERROR' && (results.turso.message.includes('unable to checkpoint synced portion of WAL') || results.turso.message.includes('GenericFailure'))) {
      console.error('CRITICAL: Turso Sync Engine stalled. Attempting emergency reset of local sync state...');
      try {
          // Emergency reset: clear .data directory
          // Note: team-db and other processes might be holding locks, so we try to kill them first if they are ours
          execSync('rm -rf /home/team/.data/*');
          console.log('Local sync state cleared. It will resync on next access.');
          
          // Retry check
          const retry = await checkTurso();
          results.turso = retry;
          console.log(`Post-reset Turso check: ${retry.status}`);
      } catch (e) {
          console.error('Failed to reset sync state:', e.message);
      }
  }

  const failures = Object.entries(results).filter(([name, res]) => {
      if (name === 'db_wal') return res.status === 'ERROR';
      return res.status !== 'OK' && res.status !== 'CHECKPOINTED';
  });

  if (failures.length > 0) {
    const msg = `Failures detected at ${timestamp}: ${failures.map(([n, r]) => `${n}: ${r.message || r.status}`).join(', ')}`;
    console.error(msg);
    
    // Auto-restart app if down
    if (results.app.status === 'DOWN') {
      console.log('Attempting to restart dev server...');
      try {
        // Clear port if stuck?
        try {
            const pids = execSync('lsof -t -i :3000 -i :3001', { encoding: 'utf8' }).trim().split('\n');
            for (const pid of pids) {
                if (pid) {
                    console.log(`Killing process ${pid} on port 3000/3001`);
                    execSync(`kill -9 ${pid}`);
                }
            }
        } catch (e) {}

        execSync(`cd ${APP_DIR} && rm -rf .next && nohup npm run dev > ${APP_DIR}/dev.log 2>&1 &`, { shell: '/bin/bash' });
        console.log('Restart command issued.');
      } catch (e) {
        console.error('Failed to issue restart command:', e.message);
      }
    }

    // High-priority message to Lead
    try {
      const dbMsg = `ALERT: Service health issues detected. ${failures.length} service(s) affected. App auto-restart attempted if down. Check /home/team/shared/service_health.log`;
      execSync(`team-db "INSERT INTO inbox (from_agent, to_agent, body) VALUES ('agent-infrastructure-expert', 'agent-lead', '${dbMsg}')"`);
    } catch (e) {
      console.error('Failed to message lead via team-db:', e.message);
    }
  } else {
    console.log('All services healthy.');
  }
}

run();
