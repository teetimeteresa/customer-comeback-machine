import { NextRequest, NextResponse } from 'next/server';
import { generateId, timestamp, teamDb } from '@/lib/db';
import { sendEmail, generateUnsubscribeUrl, generateEmailFooter } from '@/lib/email';
import { wrapPremiumTemplate } from '@/lib/email-templates';

// Email sequence timing (in days after opt-in)
const EMAIL_SEQUENCE = [
  { day: 0, type: 'welcome', subject: 'Thank you for stopping in' },
  { day: 2, type: 'review_request', subject: 'Could you do us a quick favor?' },
  { day: 7, type: 'comeback_offer', subject: 'A little thank-you for next time' },
  { day: 21, type: 'referral_request', subject: 'Know someone who would love us?' },
  { day: 45, type: 'win_back', subject: 'We miss your face' },
];

function generateEmailBody(
  type: string,
  business: any,
  customer: any
): { subject: string; html: string } {
  const firstName = customer.first_name || 'there';
  const unsubscribeUrl = generateUnsubscribeUrl(customer.email, business.id);

  const templates: Record<string, { subject: string; body: string }> = {
    welcome: {
      subject: 'Thank you for stopping in',
      body: `
        <h2 style="color: #1e293b; margin-top: 0;">Hey ${firstName}!</h2>
        <p>It was so great seeing you today. Thanks for supporting our small business—it really means a lot to us!</p>
        <p>We hope to see you again soon. In the meantime, here are a few things you might find helpful:</p>
        <ul style="padding-left: 20px;">
          <li>Follow us on social media for updates</li>
          <li>Keep an eye on your inbox for exclusive offers</li>
          <li>If you had a great experience, we'd love a quick review!</li>
        </ul>
        <p>Thanks again, ${firstName}. You rock!</p>
        <p>— The <strong>${business.name}</strong> Team</p>
      `,
    },
    birthday: {
      subject: `Happy Birthday from ${business.name}! 🎉`,
      body: `
        <h2 style="color: #1e293b; margin-top: 0;">Happy Birthday, ${firstName}!</h2>
        <p>We hope your day is as amazing as you are!</p>
        <p>To celebrate YOU, here's a special birthday gift from us:</p>
        <div style="background-color: #fef3c7; border: 2px dashed #f59e0b; padding: 20px; text-align: center; border-radius: 12px; margin: 25px 0;">
          <span style="font-size: 24px;">🎁</span>
          <h3 style="margin: 10px 0; color: #1e293b;">${business.current_offer || '10% off your next visit'}</h3>
          <p style="margin: 0; color: #92400e; font-size: 14px;">Mention this email or use code <strong>BDAY</strong></p>
        </div>
        <p>We'd love to help you celebrate! Stop by and let us spoil you a little.</p>
        <p>— The <strong>${business.name}</strong> Team</p>
      `,
    },
    review_request: {
      subject: 'Could you do us a quick favor?',
      body: `
        <h2 style="color: #1e293b; margin-top: 0;">Hey ${firstName},</h2>
        <p>We were so glad you stopped by! If you have 30 seconds, would you mind sharing the love with a quick Google review?</p>
        <p>It really helps neighbors find us and keeps small businesses like ours going.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${business.google_review_link || '#'}" style="background-color: #1e293b; color: #f59e0b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Leave a Review</a>
        </div>
        <p>Thanks so much!</p>
        <p>— The <strong>${business.name}</strong> Team</p>
      `,
    },
    comeback_offer: {
      subject: 'A little thank-you for next time',
      body: `
        <h2 style="color: #1e293b; margin-top: 0;">Hey ${firstName},</h2>
        <p>Already thinking about your next visit? We know the feeling!</p>
        <p>Here's a little something for next time:</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; text-align: center; border-radius: 12px; margin: 25px 0;">
          <h3 style="margin: 0; color: #1e293b;">${business.current_offer || '10% off your next visit'}</h3>
          <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">Use code <strong>COMEBACK</strong></p>
        </div>
        <p>Can't wait to see you again!</p>
        <p>— The <strong>${business.name}</strong> Team</p>
      `,
    },
    referral_request: {
      subject: 'Know someone who would love us?',
      body: `
        <h2 style="color: #1e293b; margin-top: 0;">Hey ${firstName},</h2>
        <p>Friends don't let friends miss out on the good stuff!</p>
        <p>If you know someone who'd love ${business.name}, we'd be so grateful if you shared the word.</p>
        <p>As a thank you, we'll send you a little treat for every friend who becomes a customer!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/optin/${business.id}" style="background-color: #f59e0b; color: #1e293b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Share the Love</a>
        </div>
        <p>Thanks for being part of the ${business.name} family!</p>
        <p>— The <strong>${business.name}</strong> Team</p>
      `,
    },
    win_back: {
      subject: 'We miss your face',
      body: `
        <h2 style="color: #1e293b; margin-top: 0;">Hey ${firstName},</h2>
        <p>It's been a while since we've seen you, and we just wanted to say—we miss you!</p>
        <p>Life gets busy, we get it. But if you're ever in the area, we'd love to catch up.</p>
        <div style="background-color: #f1f5f9; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">To welcome you back:</p>
          <h3 style="margin: 0; color: #1e293b; font-size: 24px;">${business.current_offer || '15% off your next visit'}</h3>
          <p style="margin: 10px 0 0 0; color: #1e293b; font-weight: bold;">Code: WELCOMEBACK</p>
        </div>
        <p>Hope to see you soon, ${firstName}!</p>
        <p>— The <strong>${business.name}</strong> Team</p>
      `,
    },
  };

  const selected = templates[type] || templates.welcome;
  const premiumHtml = wrapPremiumTemplate(selected.body, selected.subject);
  return { subject: selected.subject, html: premiumHtml.replace(/{unsubscribe_url}/g, unsubscribeUrl) };
}


export async function POST(request: NextRequest) {
  try {
    const { businessId, customerId, type } = await request.json();

    // Get customer and business data
    const customers = await teamDb({
      sql: 'SELECT * FROM customers WHERE id = ? AND business_id = ?',
      args: [customerId, businessId]
    });
    
    if (!customers || customers.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    const customer = customers[0];

    const businesses = await teamDb({
      sql: 'SELECT * FROM businesses WHERE id = ?',
      args: [businessId]
    });
    
    if (!businesses || businesses.length === 0) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    
    const business = businesses[0];

    // Generate email content
    const emailContent = generateEmailBody(type, business, customer);

    // Create email record
    const emailId = generateId();
    const now = timestamp();

    await teamDb({
      sql: `INSERT INTO emails (id, business_id, customer_id, type, subject, body, status, sent_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'sent', ?, ?)`,
      args: [emailId, businessId, customerId, type, emailContent.subject, emailContent.html, now, now]
    });

    // Update customer's last email sent
    await teamDb({
      sql: 'UPDATE customers SET last_email_sent = ?, last_email_type = ?, updated_at = ? WHERE id = ?',
      args: [now, type, now, customerId]
    });

    // Send email via Resend
    await sendEmail({
      to: customer.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return NextResponse.json({
      success: true,
      emailId,
      message: `Email sent successfully`
    });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// ─── Milestone Detection ────────────────────────────────────────────────────────
async function checkMilestone50(now: Date) {
    try {
        // Find businesses that crossed 50 customers and haven't been alerted yet
        const milestoneBusinesses = await teamDb(`
            SELECT b.id, b.name, b.owner_id, COUNT(c.id) as customer_count
            FROM businesses b
            JOIN customers c ON c.business_id = b.id
            WHERE b.milestone_50_sent = 0
            GROUP BY b.id
            HAVING customer_count >= 50
        `);

        for (const biz of (milestoneBusinesses || [])) {
            // Get owner email
            const owners = await teamDb({
                sql: 'SELECT email, name FROM users WHERE id = ?',
                args: [biz.owner_id]
            });

            if (owners && owners.length > 0) {
                const owner = owners[0];
                const nowTs = timestamp();

                // Send internal alert email to Customer Success team
                const alertSubject = `🎉 MILESTONE: ${biz.name} just hit ${biz.customer_count} customers!`;
                const alertBody = `
                    <h2>50-Customer Milestone Alert!</h2>
                    <p><strong>${biz.name}</strong> just captured their <strong>${biz.customer_count}th customer</strong>!</p>
                    <p>This business has crossed the 50-customer milestone.</p>
                    <p><strong>Action required:</strong> Send a physical congratulations card within 48 hours.</p>
                    <p>Card template: "50 Neighbors. 50 Reasons to Smile."</p>
                    <p>Log in outreach_log: type="physical_card", milestone="50_customers", business_id="${biz.id}"</p>
                `;

                await sendEmail({
                    to: process.env.ALERT_EMAIL || 'cto@customercomebackmachine.com',
                    subject: alertSubject,
                    html: alertBody,
                });

                // Mark milestone as sent
                await teamDb({
                    sql: 'UPDATE businesses SET milestone_50_sent = 1, milestone_50_date = ? WHERE id = ?',
                    args: [nowTs, biz.id]
                });

                console.log(`[Milestone] ✅ Alert sent for ${biz.name} (${biz.customer_count} customers)`);
            }
        }
    } catch (err) {
        console.error('[Milestone] Error:', err);
    }
}

// GET - Process scheduled emails (to be called by cron job)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get('key');

    // Simple API key authentication for cron
    if (apiKey !== process.env.CRON_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // ─── Milestone Detection ─────────────────────────────────────────────────
    await checkMilestone50(now);
    // ─────────────────────────────────────────────────────────────────────────

    // Get customers whose next scheduled email is due
    const customers = await teamDb(`
      SELECT c.*, b.name as business_name, b.mailing_address, b.google_review_link, b.current_offer
      FROM customers c
      JOIN businesses b ON c.business_id = b.id
      WHERE c.email_consent = 1
    `);

    let sentCount = 0;

    for (const customer of customers || []) {
      const optInDate = new Date(customer.created_at);
      const daysSinceOptIn = Math.floor((now.getTime() - optInDate.getTime()) / (1000 * 60 * 60 * 24));

      // Check which email in the sequence is due
      for (const email of EMAIL_SEQUENCE) {
        if (daysSinceOptIn >= email.day) {
          // Check if this email was already sent
          const existingEmail = await teamDb({
            sql: "SELECT id FROM emails WHERE customer_id = ? AND type = ? AND status = 'sent'",
            args: [customer.id, email.type]
          });

          if (!existingEmail || existingEmail.length === 0) {
            // Get business details
            const businesses = await teamDb({
              sql: 'SELECT * FROM businesses WHERE id = ?',
              args: [customer.business_id]
            });

            if (businesses && businesses.length > 0) {
              const business = businesses[0];
              const emailContent = generateEmailBody(email.type, business, customer);

              // Create email record
              const emailId = generateId();
              await teamDb({
                sql: `INSERT INTO emails (id, business_id, customer_id, type, subject, body, status, sent_at, created_at)
                      VALUES (?, ?, ?, ?, ?, ?, 'sent', ?, ?)`,
                args: [emailId, customer.business_id, customer.id, email.type, emailContent.subject, emailContent.html, now.toISOString(), now.toISOString()]
              });

              // Send email
              await sendEmail({
                to: customer.email,
                subject: emailContent.subject,
                html: emailContent.html,
              });

              // Update customer
              await teamDb({
                sql: 'UPDATE customers SET last_email_sent = ?, last_email_type = ? WHERE id = ?',
                args: [now.toISOString(), email.type, customer.id]
              });

              sentCount++;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: customers?.length || 0,
      sent: sentCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Process emails error:', error);
    return NextResponse.json(
      { error: 'Failed to process emails' },
      { status: 500 }
    );
  }
}
