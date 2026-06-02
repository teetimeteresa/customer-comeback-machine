#!/usr/bin/env node
/**
 * Production Setup Script - No external dependencies
 * Handles:
 * 1. Resend domain verification
 * 2. Stripe webhook secret info
 * 3. Database subscription_plans table creation + seeding
 */

// Load env manually
const fs = require('fs');
const path = require('path');
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
        const [key, ...rest] = line.split('=');
        env[key.trim()] = rest.join('=').trim();
    }
});

const RESEND_API_KEY = env.RESEND_API_KEY;
const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
const TURSO_DATABASE_URL = env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = env.TURSO_AUTH_TOKEN;
const EMAIL_FROM = env.EMAIL_FROM;

const https = require('https');

// Simple fetch polyfill using https
function fetch(url, opts = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: opts.method || 'GET',
            headers: opts.headers || {}
        };
        const req = https.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        json: () => JSON.parse(body),
                        text: () => body
                    });
                } catch (e) {
                    resolve({ ok: false, status: res.statusCode, text: () => body });
                }
            });
        });
        req.on('error', reject);
        if (opts.body) req.write(opts.body);
        req.end();
    });
}

// ─── TASK 1: Resend Domain Setup ─────────────────────────────────────────────
async function setupResend() {
    console.log('\n=== TASK 1: Resend Domain Setup ===');
    console.log('Current EMAIL_FROM:', EMAIL_FROM);
    
    const domainRes = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` }
    });
    const domainData = await domainRes.json();
    console.log('Resend domains:', JSON.stringify(domainData, null, 2));
    
    const existingDomain = (domainData.data || []).find(d => d.name === 'customercomebackmachine.com');
    
    if (existingDomain) {
        console.log(`\nDomain found: status=${existingDomain.status}`);
        if (existingDomain.status === 'verified') {
            console.log('✅ Domain is VERIFIED! Ready for production email.');
            return;
        } else {
            console.log('DNS records needed:');
            (existingDomain.dns_records || []).forEach(rec => {
                console.log(`  ${rec.type} | ${rec.name} | ${rec.value} ${rec.priority ? '| Priority: '+rec.priority : ''}`);
            });
            return;
        }
    }
    
    console.log('\n📋 ADDING NEW DOMAIN...');
    const addRes = await fetch('https://api.resend.com/domains', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'customercomebackmachine.com', region: 'us-east-1' })
    });
    const addData = await addRes.json();
    console.log('Response:', JSON.stringify(addData, null, 2));
    
    if (addData.error) {
        console.log('Error:', addData.error.message);
        if (addData.error.message.includes('unauthorized')) {
            console.log('⚠️  Invalid Resend API key. Please check your RESEND_API_KEY in .env');
        }
        return;
    }
    
    if (addData.id) {
        console.log('\n🆕 DOMAIN ADDED! DNS RECORDS TO CONFIGURE:');
        console.log('==========================================');
        console.log('Add these DNS records at your domain registrar, then wait 5-30 min for auto-verification:');
        console.log('');
        (addData.dns_records || []).forEach(rec => {
            console.log(`  Type: ${rec.type}`);
            console.log(`  Name: ${rec.name}`);
            console.log(`  Value: ${rec.value}`);
            console.log(`  Priority: ${rec.priority || 'N/A'}`);
            console.log('');
        });
        console.log('==========================================');
        console.log('📧 ONCE VERIFIED, UPDATE .env:');
        console.log('   EMAIL_FROM=Customer Comeback Machine <noreply@customercomebackmachine.com>');
    }
}

// ─── TASK 2: Stripe Info ──────────────────────────────────────────────────────
async function setupStripe() {
    console.log('\n=== TASK 2: Stripe Production Setup ===');
    
    const isTestMode = STRIPE_SECRET_KEY.startsWith('sk_test_');
    console.log('Mode:', isTestMode ? 'TEST (⚠️  Not live)' : 'LIVE ✅');
    
    if (isTestMode) {
        console.log('\n⚠️  STRIPE IN TEST MODE');
        console.log('📋 TO GO LIVE:');
        console.log('   1. Log into https://dashboard.stripe.com');
        console.log('   2. Go to Developers > API Keys');
        console.log('   3. Toggle to "Live mode" view');
        console.log('   4. Copy sk_live_... and pk_live_... keys');
        console.log('   5. Update STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in .env');
        console.log('');
        console.log('   6. Go to https://dashboard.stripe.com/webhooks');
        console.log('   7. Add endpoint: https://customercomebackmachine.com/api/stripe/webhook');
        console.log('   8. Select events: checkout.session.completed, customer.subscription.updated,');
        console.log('      customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed');
        console.log('   9. Copy the signing secret (whsec_...) to STRIPE_WEBHOOK_SECRET in .env');
    } else {
        console.log('✅ Using LIVE Stripe keys');
    }
}

// ─── TASK 3: Seed Subscription Plans ────────────────────────────────────────
async function seedSubscriptionPlans() {
    console.log('\n=== TASK 3: Seed Subscription Plans ===');
    
    const db = await import('@libsql/client').then(m => m.createClient({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN
    }));
    
    // Create table
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS subscription_plans (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                price INTEGER NOT NULL,
                price_id TEXT,
                interval TEXT DEFAULT 'month',
                setup_fee INTEGER DEFAULT 0,
                description TEXT,
                features TEXT,
                is_active INTEGER DEFAULT 1,
                created_at TEXT DEFAULT (datetime('now'))
            )
        `);
        console.log('✅ subscription_plans table ready');
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log('ℹ️  Table already exists');
        } else {
            console.log('Note:', e.message.split('\n')[0]);
        }
    }
    
    // Clear and seed
    await db.execute('DELETE FROM subscription_plans');
    
    const plans = [
        { id: 'plan_starter', name: 'Starter Plan', slug: 'starter', price: 4900, price_id: 'price_1TZbfDRChQpSKxdxsv74zbW7', interval: 'month', description: 'Perfect for getting started', features: ['Custom opt-in page','QR code','Email automation','Thank-you email','Review request','Comeback offer','Basic dashboard'] },
        { id: 'plan_growth', name: 'Growth Plan', slug: 'growth', price: 9900, price_id: 'price_1TZbjORChQpSKxdxoQhywOuM', interval: 'month', description: 'Birthdays, referrals, win-back', features: ['Everything in Starter','Birthday club','Referral requests','Win-back campaigns','Monthly suggestions','Customer tags','Downloadable list'] },
        { id: 'plan_pro', name: 'Pro Plan', slug: 'pro', price: 19900, price_id: 'price_1TZblGRChQpSKxdxGUaYbDEg', interval: 'month', description: 'Complete retention machine', features: ['Everything in Growth','SMS option','Advanced campaigns','Seasonal automation','Review replies','Testimonial repurposing','Priority support'] },
        { id: 'plan_done_for_you', name: 'Done-for-You Setup', slug: 'done-for-you', price: 49700, price_id: 'price_1TZbnZRChQpSKxdx4pUpTqTZ', interval: 'one-time', description: 'We set up everything', features: ['Profile setup','Message customization','QR sign setup','30-min onboarding call'] }
    ];
    
    for (const plan of plans) {
        await db.execute({
            sql: `INSERT INTO subscription_plans (id, name, slug, price, price_id, interval, description, features)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [plan.id, plan.name, plan.slug, plan.price, plan.price_id, plan.interval, plan.description, JSON.stringify(plan.features)]
        });
        console.log(`✅ ${plan.name} — $${(plan.price/100).toFixed(2)}/${plan.interval}`);
    }
    
    const result = await db.execute('SELECT * FROM subscription_plans');
    console.log('\n📋 Plans seeded:');
    result.rows.forEach(p => console.log(`   • ${p.name} (${p.price_id})`));
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🚀 Customer Comeback Machine - Production Setup');
    console.log('==============================================\n');
    
    await seedSubscriptionPlans();
    await setupStripe();
    await setupResend();
    
    console.log('\n==============================================');
    console.log('📋 ACTION ITEMS TO GO LIVE:');
    console.log('==============================================');
    console.log('✅ Task 3 DONE: subscription_plans seeded');
    console.log('');
    console.log('📋 Task 1 (Resend): Check DNS records above, update EMAIL_FROM in .env once verified');
    console.log('📋 Task 2 (Stripe): Get live keys + webhook secret from dashboard.stripe.com');
    console.log('');
    console.log('Then run: source ~/.bashrc && cd /home/team/shared && npm run build');
}

main().catch(console.error);
