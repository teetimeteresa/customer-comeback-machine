const { execSync } = require('child_process');

const RESEND_API_KEY = 'process.env.RESEND_API_KEY';
const EMAIL_FROM = 'Customer Comeback Team <team@customercomebackmachine.com>'; // Updated to verified domain (once verified)

function db(query) {
    let attempts = 0;
    while (attempts < 5) {
        try {
            const output = execSync(`team-db "${query.replace(/"/g, '\\"')}"`, { stdio: ['inherit', 'pipe', 'pipe'] }).toString();
            try {
                return JSON.parse(output);
            } catch (e) {
                return output;
            }
        } catch (err) {
            attempts++;
            if (err.stderr && err.stderr.toString().includes("Locking error")) {
                console.log(`Database locked, retrying attempt ${attempts}...`);
                execSync("sleep 1");
                continue;
            }
            throw err;
        }
    }
}

async function sendEmail({ to, subject, html }) {
    console.log(`Sending email to ${to}: ${subject}`);
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: EMAIL_FROM,
                to,
                subject,
                html
            })
        });
        const data = await response.json();
        if (data.id) {
            console.log(`Email sent successfully: ${data.id}`);
            return true;
        } else {
            console.error(`Failed to send email to ${to}:`, data);
            return false;
        }
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return false;
    }
}

function wrapPremiumTemplate(content, title = 'Customer Comeback Machine') {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background-color: #1e293b; padding: 30px; text-align: center;">
                  <h1 style="color: #f59e0b; margin: 0; font-size: 24px; letter-spacing: -0.025em; font-weight: 800;">
                    CUSTOMER COMEBACK MACHINE
                  </h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px; line-height: 1.6; font-size: 16px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0;">
                    &copy; ${new Date().getFullYear()} Customer Comeback Machine. All rights reserved.
                  </p>
                  <p style="margin: 0;">
                    Building loyalty, one follow-up at a time. ❤️
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

async function run() {
    console.log("Starting Master Outreach Repair (Targeting ALL leads with missed delivery)...");
    
    // Select leads that were marked as sent but missed (Step 1, sent in late May)
    // AND leads that were attempted today but blocked by 403 (sales_email_sent = 0 but in outreach_log)
    const leads = db(`
        SELECT * FROM leads 
        WHERE (sales_email_sent = 1 AND last_sequence_step = 1 AND date(last_sequence_at) >= '2026-05-27')
           OR (sales_email_sent = 0 AND id IN (SELECT lead_id FROM outreach_log WHERE date(timestamp) = '2026-05-28'))
        LIMIT 500
    `);
    
    if (!Array.isArray(leads) || leads.length === 0) {
        console.log("No leads found in need of repair.");
        return;
    }

    console.log(`Found ${leads.length} leads to process. Starting blast...`);

    let count = 0;
    for (const lead of leads) {
        const businessName = lead.customer_type || "your business";
        const subject = `A quiet partner for ${businessName} ❤️`;
        
        // Tracking Link
        const trackingUrl = `https://customercomebackmachine.com/?utm_source=ccm_outreach&utm_medium=email&utm_campaign=repair_blast&lid=${lead.id}`;

        const body = `
            <p>Hi ${businessName} Team,</p>
            <p>I've been following what you're doing at ${businessName}, and I love the community you're building.</p>
            <p>As a local business owner, I know you're wearing every hat—CEO, maker, cleaner, and friend to your customers. It's beautiful, but it's also exhausting.</p>
            <p>I built something called <strong>Customer Comeback Machine</strong> to act as your "Invisible Employee." It’s a quiet partner that sits in the background and makes sure no customer is ever forgotten.</p>
            <p>It automatically:</p>
            <ul>
                <li>Sends a warm thank-you after a visit.</li>
                <li>Gently asks for a Google review.</li>
                <li>Remembers birthdays when you're too busy to check the calendar.</li>
              </ul>
            <p>We believe in <em>"Tending to your community, even when you're not there."</em></p>
            <p>I’d love to show you how it can help ${businessName} bring more neighbors back through your doors.</p>
            <p align="center">
                <a href="${trackingUrl}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">
                    See how it works here
                </a>
            </p>
            <p>With love and support,<br>The Customer Comeback Team</p>
        `;

        const success = await sendEmail({
            to: lead.email,
            subject: subject,
            html: wrapPremiumTemplate(body, subject)
        });

        if (success) {
            count++;
            // Update leads table to show it's actually sent now
            db(`UPDATE leads SET sales_email_sent = 1, last_sequence_step = 1, last_sequence_at = datetime('now') WHERE id = '${lead.id}'`);
            
            // Log the successful repair
            db(`INSERT INTO marketing_log (event, details, timestamp) VALUES ('Email Sent (Repair)', 'Successfully delivered pitch to ${lead.email}', datetime('now'))`);
        } else {
            console.error(`Repair failed for ${lead.email}`);
            if (count > 0 && count % 20 === 0) {
                 console.log("Pausing...");
                 await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    console.log(`Outreach Blast completed. ${count} emails successfully delivered.`);
}

run();
