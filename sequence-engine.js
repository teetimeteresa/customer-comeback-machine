const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const RESEND_API_KEY = 're_TxeCHp1e_8k9fnpAQFTyYceUScYKZHhzf';
const EMAIL_FROM = 'Customer Comeback Machine <onboarding@resend.dev>';
const APP_URL = 'http://localhost:3000';

function db(query) {
    const output = execSync(`team-db "${query.replace(/"/g, '\\"')}"`).toString();
    try {
        return JSON.parse(output);
    } catch (e) {
        console.error("DB Error:", output);
        return [];
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
            console.error(`Failed to send email:`, data);
            return false;
        }
    } catch (error) {
        console.error(`Error sending email:`, error);
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

const LEAD_SEQUENCE = [
    { step: 1, delay: 0, subject: "❤️ Your custom follow-up templates (and a big high-five!)" },
    { step: 2, delay: 2, subject: "Why good customers sometimes drift away..." },
    { step: 3, delay: 5, subject: "How to have a 'Loyalty Department' on a solo budget" },
    { step: 4, delay: 10, subject: "The easiest way to get more Google reviews" },
    { step: 5, delay: 15, subject: "Helping your customers find their way back home" },
    { step: 6, delay: 20, subject: "Which plan fits your business?" },
    { step: 7, delay: 25, subject: "Ready to bring them back?" }
];

const ONBOARDING_SEQUENCE = [
    { step: 1, delay: 0, subject: "Welcome to the family! We’re so glad you’re here. ❤️" },
    { step: 2, delay: 1, subject: "A little something for your front counter 📱✨" },
    { step: 3, delay: 3, subject: "Your first customers are waiting to hear from you! 💌" }
];

async function processLeads() {
    console.log("--- Processing Leads Sequence ---");
    const leads = db("SELECT * FROM leads");
    const now = new Date();

    for (const lead of leads) {
        const nextStep = LEAD_SEQUENCE.find(s => s.step === (lead.last_sequence_step || 0) + 1);
        if (!nextStep) continue;

        const createdDate = new Date(lead.created_at);
        const daysSinceCreated = (now - createdDate) / (1000 * 60 * 60 * 24);

        if (daysSinceCreated >= nextStep.delay) {
            let content = "";
            const firstName = lead.email.split('@')[0]; // Fallback for name

            if (nextStep.step === 1) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>First of all, I wanted to say a huge thank you for trying out our follow-up generator.</p>
                    <p>As a small business owner, you are doing something brave and important. You’re building a community, and we want to help you make sure that community feels loved.</p>
                    <p>As promised, here are the custom messages we generated for your business:</p>
                    <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        ${lead.generated_content || "Templates available in your dashboard."}
                    </div>
                    <p>We know you're busy running the shop, so it’s easy to let these small touches slip. But these are the "digital handshakes" that turn a one-time visitor into a regular.</p>
                    <p>Don’t let these sit in your inbox. Use them today—your customers will love hearing from you!</p>
                    <p>With love and support,<br>The Customer Comeback Team</p>
                `;
            } else if (nextStep.step === 2) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>It’s a heartbreaking statistic: nearly 70% of customers who have a *great* experience at a local business never come back.</p>
                    <p>It’s almost never because they were unhappy. Usually, it’s just because life got busy and they simply forgot.</p>
                    <p>We call this <strong>"The Forgetfulness Gap."</strong></p>
                    <p>You worked so hard to get them in the door the first time. We built Customer Comeback Machine to make sure you never have to worry about them forgetting you again. We handle the "thinking about you" part so you can handle the "taking care of them" part.</p>
                    <p><a href="${APP_URL}">Let’s bridge that gap together. See how it works.</a></p>
                `;
            } else if (nextStep.step === 3) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>If you’re like most owners we talk to, you’re currently the CEO, the lead barista/stylist/maker, the janitor, and the accountant.</p>
                    <p>The last thing you need is a complicated new marketing project.</p>
                    <p>Think of Customer Comeback Machine as your <strong>"Quiet Partner."</strong> We sit in the background and handle the essential relationship-building tasks:</p>
                    <ul>
                      <li>Sending that warm "Thank You" right after they leave.</li>
                      <li>Asking for a Google review while the excitement is still fresh.</li>
                      <li>Remembering their birthday when you have a million other things on your mind.</li>
                    </ul>
                    <p>You don't need to do everything. You just need a system that does the right things for you.</p>
                    <p><a href="${APP_URL}/pricing">Start your 14-day free trial</a></p>
                `;
            } else if (nextStep.step === 4) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>Reviews are the lifeblood of local business growth. But asking for them in person can feel awkward.</p>
                    <p>Our automated "Review Nudge" hits your customers’ inboxes 2 days after their visit—the "Golden Window" when they’re most likely to leave a 5-star review.</p>
                    <p>Plus, we help you handle those reviews with grace. We even have a guide on <a href="${APP_URL}/blog">how to ask for reviews without feeling awkward</a>.</p>
                    <p><a href="${APP_URL}">See our review system in action</a></p>
                `;
            } else if (nextStep.step === 5) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>Every customer who walks through your door is a neighbor. And in a world of giant corporations, those neighborly connections are your superpower.</p>
                    <p>Customer Comeback Machine was built specifically for local businesses like yours. We don't believe in robotic, "corporate" marketing. We believe in automated, human connection.</p>
                    <p>From our heart-centered email templates to our easy-to-use QR codes, everything is designed to make your customers feel seen and valued.</p>
                    <p>You already got them in the door once. Let’s help them come back.</p>
                    <p><a href="${APP_URL}/pricing">View Plans & Pricing</a></p>
                    <p>Warmly,<br>The Customer Comeback Team</p>
                `;
            } else if (nextStep.step === 6) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>Growing your repeat business shouldn't cost a fortune. We’ve designed three simple plans to help you stop letting customers disappear, starting at just $49/mo.</p>
                    <p>Whether you're just starting out or ready to scale your loyalty program, we have a partner-led solution for you.</p>
                    <p><a href="${APP_URL}/pricing">Compare Plans & Find Your Fit</a></p>
                `;
            } else if (nextStep.step === 7) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>Every day you wait is another day that great customers are walking out your door and potentially forgetting about your business.</p>
                    <p>We’re so confident that Customer Comeback Machine will pay for itself in just a few return visits that we offer a 14-day trial.</p>
                    <p>If you don't love it, you don't pay a cent. No strings, just support.</p>
                    <p><a href="${APP_URL}/pricing">Start My Trial Now</a></p>
                `;
            }

            const success = await sendEmail({
                to: lead.email,
                subject: nextStep.subject,
                html: wrapPremiumTemplate(content, nextStep.subject)
            });

            if (success) {
                db(`UPDATE leads SET last_sequence_step = ${nextStep.step}, last_sequence_at = datetime('now') WHERE id = '${lead.id}'`);
            }
        }
    }
}

async function processOnboarding() {
    console.log("--- Processing Onboarding Sequence ---");
    // Get business owners and their onboarding status
    const users = db("SELECT u.email, u.name, b.id as business_id, o.step, o.updated_at, b.name as business_name FROM users u JOIN businesses b ON u.id = b.owner_id JOIN onboarding o ON b.id = o.business_id WHERE u.role = 'business_owner'");
    const now = new Date();

    for (const user of users) {
        const nextStep = ONBOARDING_SEQUENCE.find(s => s.step === user.step + 1);
        if (!nextStep) continue;

        const lastAt = new Date(user.updated_at);
        const hoursDiff = (now - lastAt) / (1000 * 60 * 60);
        const daysDiff = hoursDiff / 24;

        if (daysDiff >= nextStep.delay) {
            let content = "";
            const firstName = user.name.split(' ')[0];

            if (nextStep.step === 1) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>I’m so personally glad to welcome you to the Customer Comeback Machine family.</p>
                    <p>Starting and running a local business is a brave thing to do. You aren't just selling a product; you're building a community. We want to be your "quiet partner" in the background.</p>
                    <p>To get the machine running, let’s set up your business profile. It only takes about 2 minutes:</p>
                    <p><a href="${APP_URL}/onboarding">Complete My Onboarding</a></p>
                    <p>With love and support,<br>The CCM Team</p>
                `;
            } else if (nextStep.step === 2) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>In the hustle of a busy day, it’s easy for a new face to walk out the door and be forgotten. But it doesn't have to be that way!</p>
                    <p>Your unique QR code is your new "digital handshake." When a customer scans it, they’re starting a relationship with you. And the best part? The machine handles all the follow-ups while you focus on the person in front of you.</p>
                    <p><strong>Your Mini-Mission:</strong> Download and print your QR sign today. Put it where your customers can easily see it—at the register or on your tables.</p>
                    <p><a href="${APP_URL}/dashboard">Download My QR Sign</a></p>
                    <p>If you need a hand with printing or placement, just reply to this email. We’re here for you!</p>
                    <p>Warmly,<br>The CCM Team</p>
                `;
            } else if (nextStep.step === 3) {
                content = `
                    <p>Hi ${firstName},</p>
                    <p>It’s been a few days, and you likely have some new friends on your digital list. That’s wonderful!</p>
                    <p>We’ve already drafted a "Comeback Offer" for you that sounds human, warm, and inviting. It’s waiting for your final nod in the dashboard.</p>
                    <p><a href="${APP_URL}/dashboard/campaigns">Review My First Campaign</a></p>
                    <p>Remember: You already did the hard work of getting them in the door. Let’s just give them a little reason to come back home.</p>
                    <p>Rooting for you,<br>The CCM Team</p>
                `;
            }

            const success = await sendEmail({
                to: user.email,
                subject: nextStep.subject,
                html: wrapPremiumTemplate(content, nextStep.subject)
            });

            if (success) {
                db(`UPDATE onboarding SET step = ${nextStep.step}, updated_at = datetime('now') WHERE business_id = '${user.business_id}'`);
            }
        }
    }
}

async function main() {
    await processLeads();
    await processOnboarding();
}

main().catch(console.error);
