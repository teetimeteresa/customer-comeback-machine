const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Robust SQL sanitization for string literals.
 * Handles single quotes and removes control characters.
 */
function sanitizeSql(str) {
    if (typeof str !== 'string') return str;
    // Remove control characters (0-31 and 127) to prevent breaking JSON/CLI output
    const clean = str.replace(/[\x00-\x1F\x7F]/g, "").trim();
    // Escape single quotes
    return clean.replace(/'/g, "''");
}

function runQuery(query, retries = 5) {
    let lastError = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Using the locked wrapper to prevent database busy errors
            const res = spawnSync('/home/team/shared/scripts/team-db-locked.sh', [query], { maxBuffer: 50 * 1024 * 1024 });
            if (res.status === 0) {
                const output = res.stdout.toString();
                try {
                    return JSON.parse(output);
                } catch (e) {
                    return output;
                }
            } else {
                lastError = res.stderr.toString();
                if (lastError.includes('Locking error') || lastError.includes('database is locked') || lastError.includes('GenericFailure')) {
                    const delay = attempt * 3000 + Math.random() * 2000;
                    console.warn('DB Busy/Locked (attempt ' + attempt + '/' + retries + '), retrying in ' + Math.round(delay) + 'ms...');
                    spawnSync('sleep', [delay / 1000]);
                } else {
                    console.error('DB Error (status ' + res.status + '): ' + lastError);
                    return null;
                }
            }
        } catch (err) {
            console.error('Execution Error: ' + err.message);
            return null;
        }
    }
    console.error('DB Error after ' + retries + ' attempts: ' + lastError);
    return null;
}

function getLoadAverage() {
    try {
        const uptime = spawnSync('uptime').stdout.toString();
        const match = uptime.match(/load average:\s+([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    } catch (e) {
        return 0;
    }
}

async function sendEmail({ to, subject, html }) {
    if (!RESEND_API_KEY) {
        return { success: false, error: "RESEND_API_KEY not set" };
    }
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
                subject: subject,
                html: html
            })
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, id: data.id };
        } else {
            return { success: false, error: data };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function wrapPremiumTemplate(content, title) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + (title || 'Customer Comeback Machine') + '</title></head><body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f8fafc; color: #1e293b;"><div style="padding: 40px; max-width: 600px; margin: auto;">' + content + '</div><div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8;">&copy; 2026 Customer Comeback Machine. <a href="https://customercomebackmachine.com/unsubscribe" style="color: #94a3b8;">Unsubscribe</a></div></body></html>';
}

function detectNiche(businessType) {
    const bt = (businessType || '').toLowerCase().trim();
    if (bt.includes('barber') || bt.includes('hair') || bt.includes('salon') || bt.includes('barbershop')) return 'Barbershop';
    if (bt.includes('pet') || bt.includes('groom') || bt.includes('vet') || bt.includes('dog')) return 'Pet Groomer';
    if (bt.includes('med_spa') || bt.includes('medspa') || bt.includes('aesthetic') || bt.includes('med spa') || bt.includes('medispa') || bt.includes('medical spa')) return 'Med Spa';
    if (bt.includes('chiropractor') || bt.includes('chiro') || bt.includes('spinal') || bt.includes('adjustment') || bt.includes('chiropractic')) return 'Chiropractor';
    if (bt.includes('yoga') || bt.includes('pilates') || bt.includes('barre')) return 'Yoga & Pilates';
    if (bt.includes('florist') || bt.includes('flower') || bt.includes('floral') || bt.includes('floristry')) return 'Florist';
    if (bt.includes('bakery') || bt.includes('artisan bakery')) return 'Artisan Bakery';
    if (bt.includes('coffee') || bt.includes('cafe') || bt.includes('deli')) return 'Coffee Shop';
    if (bt.includes('restaurant') || bt.includes('pizza') || bt.includes('food') || bt.includes('diner')) return 'Restaurant';
    if (bt.includes('nail') || bt.includes('spa') || bt.includes('massage') || bt.includes('lash') || bt.includes('esthetic')) return 'Beauty & Spa';
    if (bt.includes('optometrist') || bt.includes('optical') || bt.includes('optician') || bt.includes('eye doctor') || bt.includes('optometry') || bt.includes('glasses') || bt.includes('ophthalmic')) return 'Optical';
    if (bt.includes('dentist') || bt.includes('dental') || bt.includes('ortho') || bt.includes('hygienist') || bt.includes('family dentistry')) return 'Dental';
    if (bt.includes('fitness') || bt.includes('gym')) return 'Fitness';
    if (bt.includes('auto') || bt.includes('mechanic') || bt.includes('repair') || bt.includes('garage') || bt.includes('tire') || bt.includes('detail')) return 'Auto Shop';
    if (bt.includes('laundry') || bt.includes('dry clean') || bt.includes('cleaners')) return 'Laundry';
    return 'default';
}

const nicheStrategies = {
    'Barbershop': {
        subject: (biz, city) => `✂️ Giving your favorite regulars at ${biz} a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>We’re on a mission to ensure no customer feels like a stranger. We help barbershops like yours set up <strong>'The Connection Guard'</strong> — giving every customer a reason to come home to your chair. Right when they're thinking about a haircut but haven't booked yet, we send a gentle nudge so your schedule stays full.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the Connection Guard in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Stay sharp,<br>The CCM Team</p>
        `
    },
    'Pet Groomer': {
        subject: (biz, city) => `🐾 The Connection Guard: Keeping your favorite regulars at ${biz}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>I love the way you care for the pups at ${biz}. Have you found a way to keep your favorite regulars coming back automatically without the phone tag? We call it <strong>'The Connection Guard'</strong> — giving every customer a reason to come home to your shop.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Calculate Your ROI →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Med Spa': {
        subject: (biz, city) => `💉 Giving your ${biz} clients a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Don't let your $600 clients shop around. We help aesthetic practices set up <strong>'The Connection Guard'</strong> — giving every customer a reason to come home to you. We automate the 3-month "Refresh Reminder" so they stay loyal, and you stay top of mind.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lifetime rate of <strong>$49/mo</strong> and we waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the retention ROI →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">To your growth,<br>The CCM Team</p>
        `
    },
    'Chiropractor': {
        subject: (biz, city) => `🦴 Ensuring ${biz} patients always feel at home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Patients drop off after the initial relief. We help clinics set up <strong>'The Connection Guard'</strong> — giving every customer a reason to come home before the pain returns. Automated check-ins ensure your adjustment schedule stays full and your patients stay healthy.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the Connection Guard →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">To your growth,<br>The CCM Team</p>
        `
    },
    'Yoga & Pilates': {
        subject: (biz, city) => `🧘 The Connection Guard for ${biz}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Your studio has such a great energy. We help studio owners automate the <strong>'Warm Hug'</strong> (check-ins and wellness nudges) that keeps members coming back to the mat. We call it <strong>'The Connection Guard'</strong> — giving every member a reason to come home to their practice at ${biz}.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                Stop the membership bleed →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Namaste,<br>The CCM Team</p>
        `
    },
    'Florist': {
        subject: (biz, city) => `💐 Giving every ${biz} customer a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Don't let your customers be the ones who forgot! Our <strong>'Connection Guard'</strong> sends them a reminder 7 days before their anniversary so they never miss an occasion — and you never miss a sale. We’re on a mission to ensure no customer feels like a stranger.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Coffee Shop': {
        subject: (biz, city) => `☕ Ensuring no one-time guests at ${biz}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>We’re on a mission to make sure no first-time guest is a one-time guest at ${biz}. Want to see how we help cafes turn today's visitors into tomorrow's regulars? We call it <strong>'The Connection Guard'</strong> — giving every customer a reason to come home.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See Your ROI →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Artisan Bakery': {
        subject: (biz, city) => ` 🥐 The Connection Guard for ${biz}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>The smell of fresh bread brings them in, but life keeps them away. We help bakeries protect their craft by giving every customer a reason to come home. We call it <strong>'The Connection Guard'</strong> — automating the gentle nudges that keep your regulars coming back for that fresh loaf.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See how many regulars you could welcome home →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Stay fresh,<br>The CCM Team</p>
        `
    },
    'Restaurant': {
        subject: (biz, city) => `🍽️ Giving every ${biz} diner a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>The average restaurant spends $300+ acquiring a new customer. Then they never come back. We help you set up <strong>'The Connection Guard'</strong> — automated "It's been a while — come taste what's new" messages that give every diner a reason to come home.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Beauty & Spa': {
        subject: (biz, city) => `💅 Giving every ${biz} client a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Missed appointments are missed opportunities for connection. We help beauty businesses set up <strong>'The Connection Guard'</strong> — automated reminders and personalized nudges that give every client a reason to come home to your spa.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Fitness': {
        subject: (biz, city) => `🏋️ Giving every ${biz} member a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>January is your busiest month. By March, many new members stop coming. We help you set up <strong>'The Connection Guard'</strong> — automated check-ins and re-engagement campaigns that give every member a reason to come home to their fitness goals.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Dental': {
        subject: (biz, city) => `🦷 Helping patients keep their smiles for life at ${biz}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Help your patients keep their smiles for life and ensure they always feel at home at ${biz}. We call our partnership <strong>'The Connection Guard'</strong> — automating the care and recall reminders that show patients they are valued. It's about giving every patient a reason to come home to your practice.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See how it works for Dentists →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Optical': {
        subject: (biz, city) => `👓 Giving every ${biz} patient a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Patients forget their annual exams — and when they skip a year, the connection fades. We help practices set up <strong>'The Connection Guard'</strong> — automated reminders that bring them back year after year, ensuring they always have a reason to come home to your care.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Auto Shop': {
        subject: (biz, city) => `🔧 The Connection Guard: Protecting your craft at ${biz}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Your detailing work is incredible. We help shops protect their craft by ensuring the clients who love your work never forget to book their next refresh. We call it <strong>'The Connection Guard'</strong> — it's about giving every customer a reason to come home for their next service.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See your potential recovery →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">To your growth,<br>The CCM Team</p>
        `
    },
    'Laundry': {
        subject: (biz, city) => `👔 Giving every ${biz} customer a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>The average dry cleaning customer visits every 2 weeks — until they forget. We help you set up <strong>'The Connection Guard'</strong> — gentle reminders that keep you top of mind and give every customer a reason to come home to your service.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'default': {
        subject: (biz, city) => `🎁 Giving every customer at ${biz} a reason to come home`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>We’re on a mission to ensure no customer feels like a stranger. We help local businesses like yours set up <strong>'The Connection Guard'</strong> — a way to automate the 'Warm Hug' and follow-ups that give every customer a reason to come home.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    }
};

async function main() {
    const limit = 50;
    const baseThrottleMs = 10000; 
    const processedInRun = new Set(); // Local memory protection

    console.log('Starting CONSOLIDATED Outreach Blitz v8.1 — FIXED Race Condition (PID: ' + process.pid + ', Limit: ' + limit + ', Base Throttle: ' + baseThrottleMs + 'ms)...');

    while (true) {
        const expansionNiches = [
            "'Pet Groomer'", 
            "'Pet'",
            "'Yoga & Pilates'", 
            "'Yoga'",
            "'Yoga Studio'",
            "'Coffee Shop'",
            "'Coffee'",
            "'COFFEE'",
            "'coffee_shop'",
            "'Artisan Bakery'",
            "'Bakery'",
            "'BAKERY'",
            "'bakery'",
            "'Auto Shop'",
            "'Auto'"
        ].join(',');

        const otherStrategicNiches = [
            "'Barbershop'", 
            "'Med Spa'", 
            "'Chiropractor'", 
            "'Optical'", 
            "'Dental'", 
            "'Family Dentistry'", 
            "'Optical Shop'"
        ].join(',');
        
        const priorityCities = [
            "'Austin'",
            "'Scottsdale'",
            "'Nashville'",
            "'Denver'",
            "'Charlotte'"
        ].join(',');
        
        const query = `
            SELECT * FROM leads 
            WHERE sales_email_sent = 0 
            AND high_intent = 1 
            AND (id LIKE 'blitz-%' OR id LIKE 'exp-%' OR business_type IN (${expansionNiches}) OR business_type IN (${otherStrategicNiches}))
            ORDER BY 
                CASE WHEN business_type IN (${expansionNiches}) THEN 0 
                     WHEN business_type IN (${otherStrategicNiches}) THEN 1
                     ELSE 2 END,
                CASE WHEN city IN (${priorityCities}) THEN 0 ELSE 1 END,
                id DESC
            LIMIT ${limit}
        `;
        const leads = runQuery(query);

        if (!leads || leads.length === 0) {
            console.log("No more uncontacted leads found. Waiting 5 minutes...");
            const waitTime = 300000 + (Math.random() * 60000);
            await sleep(waitTime);
            continue;
        }

        console.log('Processing batch of ' + leads.length + ' leads.');

        for (let i = 0; i < leads.length; i++) {
            const lead = leads[i];

            // Local tracking check
            if (processedInRun.has(lead.id)) {
                console.log('Skipping ' + lead.id + ' (already processed in this run)');
                continue;
            }

            let load = getLoadAverage();
            while (load > 4.0) {
                console.log('System load is ' + load + ', pausing outreach for 60 seconds...');
                await sleep(60000);
                load = getLoadAverage();
            }
            
            if (!lead.email || !lead.email.includes('@')) {
                processedInRun.add(lead.id);
                runQuery("UPDATE leads SET sales_email_sent = 1 WHERE id = '" + sanitizeSql(lead.id) + "'");
                continue;
            }

            const businessName = lead.business_name || "your business";
            const city = lead.city || "your city";
            const businessType = lead.business_type || "";
            
            const niche = detectNiche(businessType);
            const strategy = nicheStrategies[niche] || nicheStrategies['default'];
            
            const trackingUrl = 'https://customercomebackmachine.com/?utm_source=ccm_blitz&utm_medium=email&city=' + encodeURIComponent(city.toLowerCase()) + '&lid=' + encodeURIComponent(lead.id);
            
            // Generate unique tracking ID for open tracking pixel
            const trackingId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const pixelUrl = 'https://customercomebackmachine.com/api/track?id=' + trackingId;
            const pixelHtml = '<img src="' + pixelUrl + '" width="1" height="1" alt="" style="display:none;" />';
            
            const subject = strategy.subject(businessName, city);
            const bodyContent = strategy.body(businessName, city, trackingUrl);

            const html = wrapPremiumTemplate(bodyContent, subject) + pixelHtml;
            const result = await sendEmail({ to: lead.email, subject, html });

            if (result.success) {
                processedInRun.add(lead.id);
                console.log('[' + niche + '] Sent: ' + lead.email + ' (' + result.id + ')');
                
                // PRIORITIZED: Update leads table immediately
                runQuery("UPDATE leads SET sales_email_sent = 1 WHERE id = '" + sanitizeSql(lead.id) + "'");
                
                const logContent = 'Niche: ' + niche + ' | Subject: ' + subject;
                const insertQuery = "INSERT INTO outreach_log (lead_id, method, content, tracking_id, niche) VALUES ('" + 
                    sanitizeSql(lead.id) + "', 'email', '" + 
                    sanitizeSql(logContent) + "', '" + 
                    sanitizeSql(trackingId) + "', '" + 
                    sanitizeSql(niche) + "')";
                runQuery(insertQuery);
            } else {
                console.error('[' + niche + '] Failed: ' + lead.email + ' - ' + JSON.stringify(result.error));
                // If it's a permanent failure (invalid email), mark as processed to stop retrying
                if (result.error && result.error.message && (result.error.message.includes('valid') || result.error.message.includes('parameter'))) {
                    processedInRun.add(lead.id);
                    runQuery("UPDATE leads SET sales_email_sent = 1 WHERE id = '" + sanitizeSql(lead.id) + "'");
                }
            }

            const jitter = Math.random() * 5000;
            await sleep(baseThrottleMs + jitter);
        }
        
        console.log("Batch completed. Waiting with jitter...");
        const postBatchWait = 60000 + (Math.random() * 60000);
        await sleep(postBatchWait);
    }
}

main().catch(console.error);
