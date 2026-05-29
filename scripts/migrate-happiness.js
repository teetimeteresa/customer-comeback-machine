/**
 * Database Migration: Happiness Pulse & Milestone Detection
 * Run this once: node scripts/migrate-happiness.js
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

async function migrate() {
    const { createClient } = await import('@libsql/client');
    const db = createClient({
        url: env.TURSO_DATABASE_URL,
        authToken: env.TURSO_AUTH_TOKEN
    });

    console.log('🔄 Running Happiness Pulse & Milestone migration...\n');

    // 1. Add happiness_pulse_sent to subscriptions
    try {
        await db.execute(`
            ALTER TABLE subscriptions 
            ADD COLUMN happiness_pulse_sent INTEGER DEFAULT 0
        `);
        console.log('✅ Added happiness_pulse_sent to subscriptions');
    } catch (e) {
        if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
            console.log('ℹ️  happiness_pulse_sent already exists in subscriptions');
        } else {
            console.log('⚠️  subscriptions alter:', e.message.split('\n')[0]);
        }
    }

    try {
        await db.execute(`
            ALTER TABLE subscriptions 
            ADD COLUMN happiness_pulse_date TEXT
        `);
        console.log('✅ Added happiness_pulse_date to subscriptions');
    } catch (e) {
        if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
            console.log('ℹ️  happiness_pulse_date already exists in subscriptions');
        } else {
            console.log('⚠️  subscriptions alter:', e.message.split('\n')[0]);
        }
    }

    // 2. Add milestone columns to businesses
    try {
        await db.execute(`
            ALTER TABLE businesses 
            ADD COLUMN milestone_50_sent INTEGER DEFAULT 0
        `);
        console.log('✅ Added milestone_50_sent to businesses');
    } catch (e) {
        if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
            console.log('ℹ️  milestone_50_sent already exists in businesses');
        } else {
            console.log('⚠️  businesses alter:', e.message.split('\n')[0]);
        }
    }

    try {
        await db.execute(`
            ALTER TABLE businesses 
            ADD COLUMN milestone_50_date TEXT
        `);
        console.log('✅ Added milestone_50_date to businesses');
    } catch (e) {
        if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
            console.log('ℹ️  milestone_50_date already exists in businesses');
        } else {
            console.log('⚠️  businesses alter:', e.message.split('\n')[0]);
        }
    }

    // 3. Add story columns to businesses (for Storyteller approach)
    try {
        await db.execute(`
            ALTER TABLE businesses 
            ADD COLUMN story_eye TEXT DEFAULT ''
        `);
        console.log('✅ Added story_eye to businesses');
    } catch (e) {
        if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
            console.log('ℹ️  story_eye already exists in businesses');
        } else {
            console.log('⚠️  businesses alter:', e.message.split('\n')[0]);
        }
    }

    try {
        await db.execute(`
            ALTER TABLE businesses 
            ADD COLUMN story_love TEXT DEFAULT ''
        `);
        console.log('✅ Added story_love to businesses');
    } catch (e) {
        if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
            console.log('ℹ️  story_love already exists in businesses');
        } else {
            console.log('⚠️  businesses alter:', e.message.split('\n')[0]);
        }
    }

    try {
        await db.execute(`
            ALTER TABLE businesses 
            ADD COLUMN story_start TEXT DEFAULT ''
        `);
        console.log('✅ Added story_start to businesses');
    } catch (e) {
        if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
            console.log('ℹ️  story_start already exists in businesses');
        } else {
            console.log('⚠️  businesses alter:', e.message.split('\n')[0]);
        }
    }

    console.log('\n✅ Migration complete!');
}

migrate().catch(console.error);
