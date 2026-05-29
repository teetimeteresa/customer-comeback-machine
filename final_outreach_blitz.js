const { execSync } = require('child_process');
const { batchDb } = require('./scripts/batch-db-helper');

// Configuration
const RESEND_API_KEY = 're_TxeCHp1e_8k9fnpAQFTyYceUScYKZHhzf';
const EMAIL_FROM = 'Customer Comeback Team <onboarding@resend.dev>'; // NEEDS DOMAIN VERIFICATION TO WORK EXTERNALLY

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
            if (err.stderr && (err.stderr.toString().includes("Locking error") || err.stderr.toString().includes("GenericFailure"))) {
                console.log(`Database busy/locked, retrying attempt ${attempts}...`);
                execSync(`sleep ${attempts}`);
                continue;
            }
            console.error("DB Error:", err.stderr ? err.stderr.toString() : err.message);
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
    console.log("Starting Final Outreach Sprint (Remaining Leads) with Batched Writes...");
    
    // Select uncontacted leads
    const leads = db("SELECT * FROM leads WHERE sales_email_sent = 0 AND id NOT IN (SELECT lead_id FROM outreach_log) LIMIT 350");
    
    if (!Array.isArray(leads) || leads.length === 0) {
        console.log("No new uncontacted leads found.");
        return;
    }

    console.log(`Found ${leads.length} leads. Starting outreach...`);

    const batchQueries = [];
    const BATCH_SIZE = 25;

    for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        const businessName = lead.customer_type || "your business";
        
        console.log(`[${i+1}/${leads.length}] Processing ${lead.email} (${businessName})...`);

        const subject = `A simple gift for ${businessName} 🎁`;
        const trackingUrl = `https://customercomebackmachine.com/?utm_source=ccm_outreach&utm_medium=email&utm_campaign=final_sprint&lid=${lead.id}`;

        const bodyContent = `
            <p>Hi ${businessName} Team,</p>
            <p>I was looking at ${businessName} again today and I had a thought.</p>
            <p>Most local businesses lose about 70% of their customers after the first visit. Not because they did anything wrong, but because life is loud and people forget.</p>
            <p>I built <strong>Customer Comeback Machine</strong> to solve exactly that.</p>
            <p>It’s not another complex software tool. It’s a simple "loop" that brings people back automatically. You set it up once, and it works while you're serving coffee, cutting hair, or helping clients.</p>
            <p>I’d love for you to try it. No pressure, just a simple way to keep your community coming back.</p>
            <p align="center">
                <a href="${trackingUrl}" style="background-color: #f59e0b; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px;">
                    See the machine in action
                </a>
            </p>
            <p>Rooting for you,<br>The Customer Comeback Team</p>
        `;

        const html = wrapPremiumTemplate(bodyContent, subject);
        
        // Add queries to batch
        batchQueries.push(`INSERT INTO outreach_log (lead_id, method, content, timestamp) VALUES ('${lead.id}', 'Email', '${html.replace(/'/g, "''")}', datetime('now'))`);
        
        // TRY TO SEND
        const success = await sendEmail({ to: lead.email, subject, html });
        
        if (success) {
            batchQueries.push(`UPDATE leads SET sales_email_sent = 1, last_sequence_step = 1, last_sequence_at = datetime('now') WHERE id = '${lead.id}'`);
        }

        // Execute batch if it's time
        if (batchQueries.length >= BATCH_SIZE * 2 || i === leads.length - 1) {
            console.log(`Executing batch of queries for processed leads...`);
            try {
                batchDb(batchQueries);
                batchQueries.length = 0; // Clear batch
            } catch (e) {
                console.error("Critical: Batch execution failed. Queries will be lost for this batch.");
                batchQueries.length = 0;
            }
        }
    }

    console.log("Final Outreach Sprint attempt completed.");
}

run().catch(console.error);
