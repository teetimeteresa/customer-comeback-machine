import { NextRequest, NextResponse } from 'next/server';
import { generateId, timestamp, teamDb } from '@/lib/db';
import { sendEmail, generateUnsubscribeUrl } from '@/lib/email';

// Sales email sequence templates
const SALES_EMAIL_SEQUENCE = [
  {
    day: 0,
    subject: '[Action Needed] Your custom follow-up templates are inside',
    templateId: 'email1_delivery',
  },
  {
    day: 2,
    subject: 'Why 70% of customers never come back',
    templateId: 'email2_problem',
  },
  {
    day: 5,
    subject: 'How to clone yourself (sort of)',
    templateId: 'email3_solution',
  },
  {
    day: 7,
    subject: 'The easiest way to get more Google reviews',
    templateId: 'email4_reviews',
  },
  {
    day: 10,
    subject: 'Your customers are waiting to come back',
    templateId: 'email5_referral',
  },
  {
    day: 14,
    subject: "Here's everything you get with Customer Comeback Machine",
    templateId: 'email6_pricing',
  },
  {
    day: 18,
    subject: 'Last chance: Your follow-up templates are about to expire',
    templateId: 'email7_urgency',
  },
];

function generateEmail1Body(lead: any, generatedContent: any): string {
  const content = typeof generatedContent === 'string' ? JSON.parse(generatedContent) : generatedContent;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Hi ${lead.customer_type || 'there'},</h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Thanks for using our follow-up generator!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        You've already taken the first step toward building a more loyal customer base. As promised, here are the custom messages we generated for your ${lead.business_type}:
      </p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #6366f1; margin-top: 0;">1. Thank-You Message:</h3>
        <p style="font-style: italic; color: #555;">"${content.thankYouMessage || 'Thanks for stopping by!'}"</p>
        
        <h3 style="color: #6366f1;">2. Review Request:</h3>
        <p style="font-style: italic; color: #555;">"${content.reviewRequest || 'Could you leave us a review?'}"</p>
        
        <h3 style="color: #6366f1;">3. Comeback Offer:</h3>
        <p style="font-style: italic; color: #555;">"${content.comebackOffer || 'Come back and get 10% off!'}"</p>
        
        <h3 style="color: #6366f1;">4. Referral Message:</h3>
        <p style="font-style: italic; color: #555;">"${content.referralMessage || 'Know someone who would love us?'}"</p>
        
        <h3 style="color: #6366f1;">5. Social Media Caption:</h3>
        <p style="font-style: italic; color: #555;">"${content.socialCaption || 'Thanks for being amazing!'}"</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Most local business owners know they should be sending these, but they never get around to it because they're busy actually running the shop.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444; font-weight: bold;">
        Don't let these templates sit in your inbox. Use them today!
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        To your success,<br/>
        The Customer Comeback Team
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;"/>
      
      <p style="font-size: 12px; color: #888;">
        You are receiving this email because you signed up for our free follow-up generator.
        <br/>
        Customer Comeback Machine | Your follow-up automation partner
        <br/><br/>
        <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function generateEmail2Body(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Hi there,</h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Did you know that <strong>70% of customers</strong> who have a good experience at a local business never return?
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        It's not because they're unhappy. It's not because your prices are too high.
      </p>
      
      <p style="font-size: 18px; line-height: 1.6; color: #333; font-weight: bold;">
        It's because they simply forgot.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        We live in a world of endless distractions. If you aren't staying top-of-mind, your customers will eventually drift away to the competitor who is.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Customer Comeback Machine was built to solve this "forgetfulness gap" by automating your follow-up so you never have to think about it again.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Ready to see how we can bring them back?
      </p>
      
      <p style="font-size: 12px; color: #888;">
        Customer Comeback Machine | Your follow-up automation partner
        <br/><br/>
        <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function generateEmail3Body(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Hi there,</h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        If you're like most local business owners, you're the CEO, the janitor, the accountant, and the marketing director all at once.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        You don't need "more work." You need a system that works <em>for</em> you.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Imagine if every customer who walked through your door automatically received:
      </p>
      
      <ul style="font-size: 16px; line-height: 1.8; color: #444;">
        <li>A warm thank-you message ✓</li>
        <li>A polite request for a Google review ✓</li>
        <li>A targeted comeback offer a few weeks later ✓</li>
      </ul>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        ...all without you lifting a finger.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        That's what Customer Comeback Machine does. We handle the follow-up so you can handle the business.
      </p>
      
      <p style="font-size: 12px; color: #888;">
        Customer Comeback Machine | Your follow-up automation partner
        <br/><br/>
        <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function generateEmail4Body(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Hi there,</h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        When was the last time you visited a new business without checking their reviews first?
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        If you're like <strong>93% of consumers</strong>, the answer is probably "never."
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Reviews are the lifeblood of local business growth. But asking for them in person can feel awkward, and remembering to send an email later is impossible when you're busy.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Our automated "Review Nudge" hits your customers' inboxes 2 days after their visit—the "Golden Window" when they're most likely to leave a glowing 5-star review.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444; font-weight: bold;">
        Stop hoping for reviews. Start automating them.
      </p>
      
      <p style="font-size: 12px; color: #888;">
        Customer Comeback Machine | Your follow-up automation partner
        <br/><br/>
        <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function generateEmail5Body(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Hi there,</h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Your existing customers are your best marketing team.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Think about it: They've already had a great experience. They trust you. And they probably have friends, family members, or colleagues who would love what you do too.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Our automated referral requests go out 3 weeks after a customer's first visit—exactly when they're most likely to think of you when someone asks for a recommendation.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Turn your happy customers into your personal referral network. Automatically.
      </p>
      
      <p style="font-size: 12px; color: #888;">
        Customer Comeback Machine | Your follow-up automation partner
        <br/><br/>
        <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function generateEmail6Body(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Here's everything you get with Customer Comeback Machine:</h1>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #6366f1;">✓ Automated Follow-Up Emails</h3>
        <p style="color: #555;">Thank-you, review requests, comeback offers, and more—all sent automatically.</p>
        
        <h3 style="color: #6366f1;">✓ QR Code Customer Capture</h3>
        <p style="color: #555;">Build your customer list effortlessly with a custom QR code that links to your opt-in page.</p>
        
        <h3 style="color: #6366f1;">✓ Birthday Club</h3>
        <p style="color: #555;">Automated birthday emails with special offers keep you top-of-mind.</p>
        
        <h3 style="color: #6366f1;">✓ Win-Back Campaigns</h3>
        <p style="color: #555;">Automatically reach out to customers who haven't been back in 45 days.</p>
        
        <h3 style="color: #6366f1;">✓ Referral Request System</h3>
        <p style="color: #555;">Turn happy customers into your personal marketing team.</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Plans start at just <strong>$49/month</strong>—less than the cost of one new customer.
      </p>
      
      <p style="font-size: 12px; color: #888;">
        Customer Comeback Machine | Your follow-up automation partner
        <br/><br/>
        <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function generateEmail7Body(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Last chance to get your free follow-up templates...</h1>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Hi there,
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        We've noticed you haven't activated the follow-up templates we created for you yet.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        These templates are <strong>free</strong> to use, but they'll only be available for a limited time.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Or, if you're ready to automate your follow-up entirely, you can start your 14-day free trial today.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        Either way, don't let your customers slip through the cracks.
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #444;">
        To your success,<br/>
        The Customer Comeback Team
      </p>
      
      <p style="font-size: 12px; color: #888;">
        Customer Comeback Machine | Your follow-up automation partner
        <br/><br/>
        <a href="{unsubscribe_url}" style="color: #888;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function generateSalesEmailBody(templateId: string, lead?: any, generatedContent?: any): string {
  const templates: Record<string, string> = {
    email1_delivery: generateEmail1Body(lead, generatedContent),
    email2_problem: generateEmail2Body(),
    email3_solution: generateEmail3Body(),
    email4_reviews: generateEmail4Body(),
    email5_referral: generateEmail5Body(),
    email6_pricing: generateEmail6Body(),
    email7_urgency: generateEmail7Body(),
  };
  
  return templates[templateId] || generateEmail2Body();
}

// POST - Send first sales email to a lead immediately
export async function POST(request: NextRequest) {
  try {
    const { leadId } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // Get the lead
    const leads = await teamDb({
      sql: 'SELECT * FROM leads WHERE id = ?',
      args: [leadId]
    });
    
    if (!leads || leads.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    const lead = leads[0];

    // Generate and send the first sales email
    const emailBody = generateSalesEmailBody('email1_delivery', lead, lead.generated_content);
    const unsubscribeUrl = generateUnsubscribeUrl(lead.email, 'ccm');
    const finalEmailBody = emailBody.replace(/{unsubscribe_url}/g, unsubscribeUrl);

    await sendEmail({
      to: lead.email,
      subject: '[Action Needed] Your custom follow-up templates are inside',
      html: finalEmailBody,
    });

    // Mark sales email as sent
    await teamDb({
      sql: 'UPDATE leads SET sales_email_sent = 1 WHERE id = ?',
      args: [leadId]
    });

    return NextResponse.json({
      success: true,
      message: 'Sales email sent successfully'
    });
  } catch (error) {
    console.error('Send sales email error:', error);
    return NextResponse.json(
      { error: 'Failed to send sales email' },
      { status: 500 }
    );
  }
}

// GET - Process scheduled sales emails (for cron job)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get('key');

    if (apiKey !== process.env.CRON_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Get leads that haven't completed the sales sequence
    const leads = await teamDb('SELECT * FROM leads WHERE sales_email_sent = 1 AND created_at IS NOT NULL');

    let sentCount = 0;

    for (const lead of leads || []) {
      const optInDate = new Date(lead.created_at);
      const daysSinceOptIn = Math.floor((now.getTime() - optInDate.getTime()) / (1000 * 60 * 60 * 24));

      for (const email of SALES_EMAIL_SEQUENCE) {
        if (daysSinceOptIn >= email.day) {
          // Check if this email was already sent
          const existingEmail = await teamDb({
            sql: "SELECT id FROM emails WHERE customer_id = ? AND type = ? AND status = 'sent'",
            args: [lead.id, `sales_${email.templateId}`]
          });

          if (!existingEmail || existingEmail.length === 0) {
            const emailBody = generateSalesEmailBody(email.templateId, lead, lead.generated_content);
            const unsubscribeUrl = generateUnsubscribeUrl(lead.email, 'ccm');
            const finalEmailBody = emailBody.replace(/{unsubscribe_url}/g, unsubscribeUrl);

            // Create email record
            const emailId = generateId();
            await teamDb({
              sql: `INSERT INTO emails (id, business_id, customer_id, type, subject, body, status, sent_at, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'sent', ?, ?)`,
              args: [emailId, 'system', lead.id, `sales_${email.templateId}`, email.subject, finalEmailBody, now.toISOString(), now.toISOString()]
            });

            // Send email
            await sendEmail({
              to: lead.email,
              subject: email.subject,
              html: finalEmailBody,
            });

            sentCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: leads?.length || 0,
      sent: sentCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Process sales emails error:', error);
    return NextResponse.json(
      { error: 'Failed to process sales emails' },
      { status: 500 }
    );
  }
}
