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

function sanitizeSql(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
}

function runQuery(query, retries = 5) {
    let lastError = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
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
                if (lastError.includes('Locking error') || lastError.includes('database is locked')) {
                    const delay = attempt * 3000 + Math.random() * 2000;
                    console.warn('DB Locked (attempt ' + attempt + '/' + retries + '), retrying in ' + Math.round(delay) + 'ms...');
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
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' + (title || 'Customer Comeback Machine') + '</title></head><body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f8fafc; color: #1e293b;"><div style="padding: 40px; max-width: 600px; margin: auto;">' + content + '</div></body></html>';
}

function detectNiche(businessType) {
    const bt = (businessType || '').toLowerCase().trim();
    if (bt.includes('barber') || bt.includes('hair') || bt.includes('salon') || bt.includes('barbershop')) return 'Barbershop';
    if (bt.includes('pet') || bt.includes('groom') || bt.includes('vet') || bt.includes('dog')) return 'Pet Groomer';
    if (bt.includes('med_spa') || bt.includes('medspa') || bt.includes('aesthetic') || bt.includes('med spa') || bt.includes('medispa') || bt.includes('medical spa')) return 'Med Spa';
    if (bt.includes('chiropractor') || bt.includes('chiro') || bt.includes('spinal') || bt.includes('adjustment') || bt.includes('chiropractic')) return 'Chiropractor';
    if (bt.includes('yoga') || bt.includes('pilates') || bt.includes('barre')) return 'Yoga & Pilates';
    if (bt.includes('florist') || bt.includes('flower') || bt.includes('floral') || bt.includes('floristry')) return 'Florist';
    if (bt.includes('coffee') || bt.includes('cafe') || bt.includes('bakery') || bt.includes('deli')) return 'Coffee Shop';
    if (bt.includes('restaurant') || bt.includes('pizza') || bt.includes('food') || bt.includes('diner')) return 'Restaurant';
    if (bt.includes('nail') || bt.includes('spa') || bt.includes('massage') || bt.includes('lash') || bt.includes('esthetic')) return 'Beauty & Spa';
    if (bt.includes('optometrist') || bt.includes('optical') || bt.includes('optician') || bt.includes('eye doctor') || bt.includes('optometry') || bt.includes('glasses') || bt.includes('ophthalmic')) return 'Optical';
    if (bt.includes('dentist') || bt.includes('dental') || bt.includes('ortho') || bt.includes('hygienist') || bt.includes('family dentistry')) return 'Dental';
    if (bt.includes('fitness') || bt.includes('gym')) return 'Fitness';
    if (bt.includes('auto') || bt.includes('mechanic') || bt.includes('repair') || bt.includes('garage') || bt.includes('tire')) return 'Auto Shop';
    if (bt.includes('laundry') || bt.includes('dry clean') || bt.includes('cleaners')) return 'Laundry';
    return 'default';
}

const nicheStrategies = {
    'Barbershop': {
        subject: (biz, city) => `✂️ Stop losing ${biz} visits to "The Shaggy Week"`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Did you know that if a client waits 6 weeks instead of 4 to come back, you lose 4 visits a year? That's real revenue walking out the door. We nudge them at the 5-week mark — right when they're thinking about a haircut but haven't booked yet — so your chair stays full.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to automate the re-booking nudge with text &amp; email follow-ups triggered by a simple QR code scan.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See how it works for Barbers →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Stay sharp,<br>The CCM Team</p>
        `
    },
    'Pet Groomer': {
        subject: (biz, city) => `🐩 Automated re-booking for ${biz} clients`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Owners often wait until their pup is matted before booking — by then it's painful for the pet and takes twice as long to fix. We send friendly "Your pup misses us" reminders based on their grooming cycle so you catch them <em>before</em> they get scruffy, not after.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to automate reminders, follow-ups, and review requests — all triggered by a simple QR code scan.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lifetime rate of <strong>$49/mo</strong> and we waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Med Spa': {
        subject: (biz, city) => `💉 Retain your ${biz} Botox clients automatically`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Don't let your $600 clients shop around. Botox and fillers wear off predictably, but customers forget to re-book. We automate the 3-month "Refresh Reminder" so they stay loyal to you — a single retained client pays for the whole system.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to automate the 3-month retention loop with text &amp; email reminders triggered by a simple QR code scan.</p>
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
        subject: (biz, city) => `🦴 Keep ${biz} patients aligned — and coming back`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Patients drop off after the initial relief. 40% of LTV is lost in the first 3 months of non-follow-up. Automated "Alignment Check" reminders bring them back before the pain returns — so your adjustment schedule stays full.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to automate the re-booking loop with text &amp; email reminders triggered by a simple QR code scan at their first visit.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See how it works for Chiropractors →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">To your growth,<br>The CCM Team</p>
        `
    },
    'Yoga & Pilates': {
        subject: (biz, city) => `🧘 Turn ${biz} first-timers into members`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Introductory offers have a high churn rate. Convert "First-Timers" into "Members" with automated success stories and loyalty rewards triggered by their first scan — so they keep coming back to the mat.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to automate student re-engagement with personalized follow-ups, class reminders, and loyalty rewards — all triggered by a simple QR code scan.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Namaste,<br>The CCM Team</p>
        `
    },
    'Florist': {
        subject: (biz, city) => `💐 Don't let ${biz} customers forget anniversaries`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Don't let your customers be the ones who forgot! Our "Hero Status" club sends them a reminder 7 days before their anniversary so they never miss an occasion — and you never miss a sale.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated reminders &amp; follow-ups triggered by a simple QR code scan.</p>
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
        subject: (biz, city) => `☕ Bring ${biz} customers back for another cup`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Most cafes lose 80% of new customers after their first visit. A simple "We miss you" email with a free drink offer brings 30% of them back. We automate the whole thing so you don't have to remember names.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated follow-ups triggered by a simple QR code scan.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Restaurant': {
        subject: (biz, city) => `🍽️ Bring ${biz} diners back through the door`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>The average restaurant spends $300+ acquiring a new customer. Then they never come back. We send automated "It's been a while — come taste what's new" messages that cost pennies and bring them through the door.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated follow-ups triggered by a simple QR code scan.</p>
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
        subject: (biz, city) => `💅 Reduce no-shows at ${biz}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Missed appointments cost the beauty industry billions. Our system automatically reminds clients when they're due for their next appointment — and sends a personalized offer if they haven't booked in 6 weeks.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated reminders &amp; follow-ups triggered by a simple QR code scan.</p>
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
        subject: (biz, city) => `🏋️ Re-engage ${biz} March drop-offs`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>January is your busiest month. By March, 60% of those new members have stopped coming. We help you re-engage them with automated check-ins and class reminders before they even think about cancelling.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated follow-ups and re-engagement campaigns triggered by a simple QR code scan.</p>
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
        subject: (biz, city) => `🦷 Stop losing ${biz} patients to "The Cavity Cycle"`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Every patient who skips their 6-month cleaning is a ticking time bomb — a small cavity today becomes a root canal in 18 months. Meanwhile, you've lost thousands in hygiene revenue and they're one Google search away from switching to a closer dentist. Our automated recall system sends personalized reminders so your schedule stays full.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to automate recall reminders, review requests, and loyalty campaigns — all triggered by a simple QR code scan at checkout.</p>
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
        subject: (biz, city) => `👓 Keep ${biz} patients seeing clearly — and coming back yearly`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Patients forget their annual eye exams — and when they skip a year, they often don't come back at all. That's lost frame sales, lost contact lens refills, and lost LTV. We automate "It's time for your checkup" reminders that bring them back year after year.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to automate recall reminders, review requests, and loyalty campaigns — all triggered by a simple QR code scan at their visit.</p>
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
        subject: (biz, city) => `🔧 Keep ${biz} customers on a maintenance cycle`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Most customers only visit when something breaks. We help you build a maintenance schedule — oil changes, tire rotations, inspections — so they come back on a cycle instead of only in an emergency.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated service reminders triggered by a simple QR code scan.</p>
            <p>We're looking for <strong>Founding Members</strong> in ${city}. Lock in a lifetime rate of <strong>$49/mo</strong> and we'll waive the $497 setup fee.</p>
            <p align="center">
                <a href="${url}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                See the machine in action →
                </a>
            </p>
            <p style="color: #94a3b8; font-size: 12px;">Rooting for you,<br>The CCM Team</p>
        `
    },
    'Laundry': {
        subject: (biz, city) => `👔 Time to freshen up — ${biz} reminder`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>The average dry cleaning customer visits every 2 weeks — until they forget and go somewhere closer. We send a gentle "Time to freshen up" reminder that keeps you top of mind.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated follow-ups triggered by a simple QR code scan.</p>
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
        subject: (biz, city) => `🎁 A gift for ${biz} in ${city}`,
        body: (biz, city, url) => `
            <p>Hi ${biz} Team,</p>
            <p>Most local businesses lose about 70% of their customers after the first visit. Life is loud and people forget. We fix that with automated follow-ups that run on autopilot.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that with automated text &amp; email follow-ups, review requests, and loyalty campaigns — all triggered by a simple QR code scan.</p>
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

    console.log('Starting CONSOLIDATED Outreach Blitz v7.3 — Open Tracking Pixel + ALL Niches (PID: ' + process.pid + ', Limit: ' + limit + ', Base Throttle: ' + baseThrottleMs + 'ms)...');

    while (true) {
        const strategicNiches = ["'Barbershop'", "'Pet Groomer'", "'Med Spa'", "'Chiropractor'", "'Yoga & Pilates'", "'Optical'", "'Dental'", "'Family Dentistry'", "'Optical Shop'"].join(',');
        const query = `
            SELECT * FROM leads 
            WHERE sales_email_sent = 0 
            AND high_intent = 1 
            AND (id LIKE 'blitz-%' OR id LIKE 'exp-%' OR business_type IN (${strategicNiches}))
            ORDER BY CASE WHEN business_type IN (${strategicNiches}) THEN 0 ELSE 1 END, id DESC
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

        const batchUpdateSize = 5;
        let currentBatchIds = [];

        for (let i = 0; i < leads.length; i++) {
            let load = getLoadAverage();
            while (load > 4.0) {
                console.log('System load is ' + load + ', pausing outreach for 60 seconds...');
                await sleep(60000);
                load = getLoadAverage();
            }

            const lead = leads[i];
            
            if (!lead.email || !lead.email.includes('@')) {
                currentBatchIds.push(lead.id); 
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
                console.log('[' + niche + '] Sent: ' + lead.email + ' (' + result.id + ')');
                currentBatchIds.push(lead.id);
                const logContent = 'Niche: ' + niche + ' | Subject: ' + subject;
                runQuery("INSERT INTO outreach_log (lead_id, method, content, tracking_id, niche) VALUES ('" + sanitizeSql(lead.id) + "', 'email', '" + sanitizeSql(logContent) + "', '" + sanitizeSql(trackingId) + "', '" + sanitizeSql(niche) + "')");
            } else {
                console.error('[' + niche + '] Failed: ' + lead.email + ' - ' + JSON.stringify(result.error));
                if (result.error && result.error.message && (result.error.message.includes('valid') || result.error.message.includes('parameter'))) {
                     currentBatchIds.push(lead.id);
                }
            }

            if (currentBatchIds.length >= batchUpdateSize || i === leads.length - 1) {
                if (currentBatchIds.length > 0) {
                    const idsSql = currentBatchIds.map(id => "'" + sanitizeSql(id) + "'").join(',');
                    runQuery('UPDATE leads SET sales_email_sent = 1 WHERE id IN (' + idsSql + ')');
                    console.log('Marked ' + currentBatchIds.length + ' leads as processed in DB.');
                    currentBatchIds = [];
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