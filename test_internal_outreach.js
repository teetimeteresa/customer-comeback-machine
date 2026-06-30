const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Mock lead data for testing
const testLeads = [
    { id: 'test-1-me', email: 'customer-comeback-machine-7e50ee2f@ctomail.io', business_name: 'Test Business Me', city: 'Austin', business_type: 'Med Spa' },
    { id: 'test-2-lead', email: 'teetimeteresa@gmail.com', business_name: 'Test Business Lead', city: 'Scottsdale', business_type: 'Dental' },
    { id: 'test-3-placeholder', email: 'agent-marketer@ctomail.io', business_name: 'Test Business Placeholder', city: 'Charlotte', business_type: 'Pet Groomer' }
];

function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^#\s=]+)=(.*)$/);
            if (match) {
                const key = match[1];
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
}

loadEnv();
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function sanitizeSql(str) {
    if (typeof str !== 'string') return str;
    const clean = str.replace(/[\x00-\x1F\x7F]/g, "").trim();
    return clean.replace(/'/g, "''");
}

function runQuery(query) {
    console.log('Running Query: ' + query);
    const res = spawnSync('/home/team/shared/scripts/team-db-locked.sh', [query], { maxBuffer: 50 * 1024 * 1024 });
    if (res.status === 0) {
        console.log('Query Success.');
        return true;
    } else {
        console.error('Query Failed: ' + res.stderr.toString());
        return false;
    }
}

async function sendEmail({ to, subject, html }) {
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY not set');
        return { success: false };
    }
    console.log('Sending email to: ' + to);
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + RESEND_API_KEY
            },
            body: JSON.stringify({
                from: 'CCM <noreply@customercomebackmachine.com>',
                to: [to],
                subject: '[TEST] ' + subject,
                html: html
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Email sent successfully: ' + data.id);
            return { success: true, id: data.id };
        } else {
            console.error('Email failed: ' + JSON.stringify(data));
            return { success: false, error: data };
        }
    } catch (error) {
        console.error('Fetch Error: ' + error.message);
        return { success: false, error: error.message };
    }
}

// Logic borrowed from v8.0 for consistency
function detectNiche(businessType) {
    const bt = (businessType || '').toLowerCase().trim();
    if (bt.includes('barber') || bt.includes('hair') || bt.includes('salon') || bt.includes('barbershop')) return 'Barbershop';
    if (bt.includes('pet') || bt.includes('groom') || bt.includes('vet') || bt.includes('dog')) return 'Pet Groomer';
    if (bt.includes('med_spa') || bt.includes('medspa') || bt.includes('aesthetic') || bt.includes('med spa') || bt.includes('medispa') || bt.includes('medical spa')) return 'Med Spa';
    if (bt.includes('dentist') || bt.includes('dental')) return 'Dental';
    return 'default';
}

const nicheStrategies = {
    'Med Spa': {
        subject: (biz, city) => `💉 Retain your ${biz} Botox clients automatically`,
        body: (biz, city, url) => `<p>Hi ${biz} Team,</p><p>This is a test of the CCM Outreach System.</p><p><a href="${url}">Test Link</a></p>`
    },
    'Dental': {
        subject: (biz, city) => `🦷 Stop losing ${biz} patients to "The Cavity Cycle"`,
        body: (biz, city, url) => `<p>Hi ${biz} Team,</p><p>This is a test of the CCM Outreach System.</p><p><a href="${url}">Test Link</a></p>`
    },
    'Pet Groomer': {
        subject: (biz, city) => `🐩 Automated re-booking for ${biz} clients`,
        body: (biz, city, url) => `<p>Hi ${biz} Team,</p><p>This is a test of the CCM Outreach System.</p><p><a href="${url}">Test Link</a></p>`
    },
    'default': {
        subject: (biz, city) => `🎁 A gift for ${biz} in ${city}`,
        body: (biz, city, url) => `<p>Hi ${biz} Team,</p><p>This is a test of the CCM Outreach System.</p><p><a href="${url}">Test Link</a></p>`
    }
};

async function runTest() {
    console.log('Starting Internal Outreach Test...');
    for (const lead of testLeads) {
        const niche = detectNiche(lead.business_type);
        const strategy = nicheStrategies[niche] || nicheStrategies['default'];
        const trackingUrl = 'https://customercomebackmachine.com/test?lid=' + lead.id;
        const subject = strategy.subject(lead.business_name, lead.city);
        const html = '<html><body>' + strategy.body(lead.business_name, lead.city, trackingUrl) + '</body></html>';
        
        const result = await sendEmail({ to: lead.email, subject, html });
        if (result.success) {
            const logContent = 'TEST Niche: ' + niche + ' | Subject: ' + subject;
            runQuery("INSERT INTO outreach_log (lead_id, method, content, niche) VALUES ('" + sanitizeSql(lead.id) + "', 'test_email', '" + sanitizeSql(logContent) + "', '" + sanitizeSql(niche) + "')");
        }
        console.log('---');
    }
    console.log('Test Complete.');
}

runTest().catch(console.error);
