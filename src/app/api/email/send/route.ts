import { NextRequest, NextResponse } from 'next/server';
import { generateId, timestamp, teamDb } from '@/lib/db';
import { sendEmail, generateUnsubscribeUrl, generateEmailFooter } from '@/lib/email';

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
  const footer = generateEmailFooter(business.name, business.mailing_address);

  const templates: Record<string, { subject: string; body: string }> = {
    welcome: {
      subject: 'Thank you for stopping in',
      body: `
        <h1>Hey ${firstName}!</h1>
        <p>It was so great seeing you today. Thanks for supporting our small business—it really means a lot to us!</p>
        <p>We hope to see you again soon. In the meantime, here are a few things you might find helpful:</p>
        <ul>
          <li>Follow us on social media for updates and behind-the-scenes peeks</li>
          <li>Keep an eye on your inbox for exclusive offers</li>
          <li>If you had a great experience, we'd love a quick Google review!</li>
        </ul>
        <p>Thanks again, ${firstName}. You rock!</p>
        <p>— The ${business.name} Team</p>
        ${footer.replace('{unsubscribe_url}', unsubscribeUrl)}
      `,
    },
    birthday: {
      subject: `Happy Birthday from ${business.name}! 🎉`,
      body: `
        <h1>Happy Birthday, ${firstName}!</h1>
        <p>We hope your day is as amazing as you are!</p>
        <p>To celebrate YOU, here's a special birthday gift from us:</p>
        <p><strong>🎁 ${business.current_offer || '10% off your next visit'}</strong></p>
        <p>Valid all week long—just mention this email or use code <strong>BDAY</strong>.</p>
        <p>We'd love to help you celebrate! Stop by and let us spoil you a little.</p>
        <p>— The ${business.name} Team</p>
        ${footer.replace('{unsubscribe_url}', unsubscribeUrl)}
      `,
    },
    review_request: {
      subject: 'Could you do us a quick favor?',
      body: `
        <h1>Hey ${firstName},</h1>
        <p>We were so glad you stopped by! If you have 30 seconds, would you mind sharing the love with a quick Google review?</p>
        <p>It really helps neighbors find us and keeps small businesses like ours going.</p>
        ${business.google_review_link ? `<p><a href="${business.google_review_link}" style="background-color: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Leave a Review</a></p>` : ''}
        <p>Thanks so much!</p>
        <p>— The ${business.name} Team</p>
        ${footer.replace('{unsubscribe_url}', unsubscribeUrl)}
      `,
    },
    comeback_offer: {
      subject: 'A little thank-you for next time',
      body: `
        <h1>Hey ${firstName},</h1>
        <p>Already thinking about your next visit? We know the feeling!</p>
        <p>Here's a little something for next time: <strong>${business.current_offer || '10% off your next visit'}</strong></p>
        <p>Just mention this email or use code <strong>COMEBACK</strong> at your next visit.</p>
        <p>Can't wait to see you again!</p>
        <p>— The ${business.name} Team</p>
        ${footer.replace('{unsubscribe_url}', unsubscribeUrl)}
      `,
    },
    referral_request: {
      subject: 'Know someone who would love us?',
      body: `
        <h1>Hey ${firstName},</h1>
        <p>Friends don't let friends miss out on the good stuff!</p>
        <p>If you know someone who'd love ${business.name}, we'd be so grateful if you shared the word.</p>
        <p>As a thank you, we'll send you a little treat for every friend who becomes a customer!</p>
        <p>Just have them mention your name or share this with them:</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/optin/${business.id}">${process.env.NEXT_PUBLIC_APP_URL}/optin/${business.id}</a></p>
        <p>Thanks for being part of the ${business.name} family!</p>
        <p>— The ${business.name} Team</p>
        ${footer.replace('{unsubscribe_url}', unsubscribeUrl)}
      `,
    },
    win_back: {
      subject: 'We miss your face',
      body: `
        <h1>Hey ${firstName},</h1>
        <p>It's been a while since we've seen you, and we just wanted to say—we miss you!</p>
        <p>Life gets busy, we get it. But if you're ever in the area, we'd love to catch up.</p>
        <p>Here's a little something to make it worth your while: <strong>${business.current_offer || '15% off your next visit'}</strong></p>
        <p>Use code <strong>WELCOMEBACK</strong> at your next visit.</p>
        <p>Hope to see you soon, ${firstName}!</p>
        <p>— The ${business.name} Team</p>
        ${footer.replace('{unsubscribe_url}', unsubscribeUrl)}
      `,
    },
  };

  const selected = templates[type] || templates.welcome;
  return { subject: selected.subject, html: selected.body };
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
