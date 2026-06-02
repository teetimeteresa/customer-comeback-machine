import { NextRequest, NextResponse } from 'next/server';
import { generateId, timestamp, teamDb } from '@/lib/db';
import { sendEmail, generateUnsubscribeUrl } from '@/lib/email';
import { wrapPremiumTemplate } from '@/lib/email-templates';

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
    <h2 style="color: #1e293b; margin-top: 0;">Hi ${lead.customer_type || 'there'},</h2>
    
    <p>Thanks for using our follow-up generator!</p>
    
    <p>You've already taken the first step toward building a more loyal customer base. As promised, here are the custom messages we generated for your <strong>${lead.business_type}</strong>:</p>
    
    <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
      <h3 style="color: #f59e0b; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">1. Thank-You Message:</h3>
      <p style="font-style: italic; color: #334155; background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">"${content.thankYouMessage || 'Thanks for stopping by!'}"</p>
      
      <h3 style="color: #f59e0b; margin-top: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">2. Review Request:</h3>
      <p style="font-style: italic; color: #334155; background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">"${content.reviewRequest || 'Could you leave us a review?'}"</p>
      
      <h3 style="color: #f59e0b; margin-top: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">3. Comeback Offer:</h3>
      <p style="font-style: italic; color: #334155; background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">"${content.comebackOffer || 'Come back and get 10% off!'}"</p>
      
      <h3 style="color: #f59e0b; margin-top: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">4. Referral Message:</h3>
      <p style="font-style: italic; color: #334155; background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">"${content.referralMessage || 'Know someone who would love us?'}"</p>
      
      <h3 style="color: #f59e0b; margin-top: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">5. Social Media Caption:</h3>
      <p style="font-style: italic; color: #334155; background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">"${content.socialCaption || 'Thanks for being amazing!'}"</p>
    </div>
    
    <p>Most local business owners know they should be sending these, but they never get around to it because they're busy actually running the shop.</p>
    
    <p style="font-weight: bold; color: #1e293b;">Don't let these templates sit in your inbox. Use them today!</p>
    
    <p>To your success,<br/><strong>The Customer Comeback Team</strong></p>
  `;
}

function generateEmail2Body(): string {
  return `
    <h2 style="color: #1e293b; margin-top: 0;">The "Silent Killer" of local businesses</h2>
    
    <p>Did you know that <strong>70% of customers</strong> who have a good experience at a local business never return?</p>
    
    <p>It's not because they're unhappy. It's not because your prices are too high.</p>
    
    <p style="font-size: 20px; color: #f59e0b; font-weight: 800; text-align: center; margin: 30px 0;">
      It's because they simply forgot.
    </p>
    
    <p>We live in a world of endless distractions. If you aren't staying top-of-mind, your customers will eventually drift away to the competitor who is.</p>
    
    <p>Customer Comeback Machine was built to solve this "forgetfulness gap" by automating your follow-up so you never have to think about it again.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #1e293b; color: #f59e0b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">See How It Works</a>
    </div>
  `;
}

function generateEmail3Body(): string {
  return `
    <h2 style="color: #1e293b; margin-top: 0;">How to clone yourself (sort of)</h2>
    
    <p>If you're like most local business owners, you're the CEO, the janitor, the accountant, and the marketing director all at once.</p>
    
    <p>You don't need "more work." You need a system that works <em>for</em> you.</p>
    
    <p>Imagine if every customer who walked through your door automatically received:</p>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;"><strong>✓ A warm thank-you message</strong></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;"><strong>✓ A polite request for a Google review</strong></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;"><strong>✓ A targeted comeback offer a few weeks later</strong></td>
      </tr>
    </table>
    
    <p>...all without you lifting a finger.</p>
    
    <p>That's what Customer Comeback Machine does. We handle the follow-up so you can handle the business.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="background-color: #f59e0b; color: #1e293b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Start Your 14-Day Free Trial</a>
    </div>
  `;
}

function generateEmail4Body(): string {
  return `
    <h2 style="color: #1e293b; margin-top: 0;">The easiest way to get more Google reviews</h2>
    
    <p>When was the last time you visited a new business without checking their reviews first?</p>
    
    <p>If you're like <strong>93% of consumers</strong>, the answer is probably "never."</p>
    
    <p>Reviews are the lifeblood of local business growth. But asking for them in person can feel awkward, and remembering to send an email later is impossible when you're busy.</p>
    
    <p>Our automated "Review Nudge" hits your customers' inboxes 2 days after their visit—the "Golden Window" when they're most likely to leave a glowing 5-star review.</p>
    
    <p style="font-weight: bold; color: #1e293b;">Stop hoping for reviews. Start automating them.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #1e293b; color: #f59e0b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">See the Review System</a>
    </div>
  `;
}

function generateEmail5Body(): string {
  return `
    <h2 style="color: #1e293b; margin-top: 0;">Your customers are waiting to come back</h2>
    
    <p>Your existing customers are your best marketing team.</p>
    
    <p>Think about it: They've already had a great experience. They trust you. And they probably have friends, family members, or colleagues who would love what you do too.</p>
    
    <p>Our automated referral requests go out exactly when they're most likely to think of you when someone asks for a recommendation.</p>
    
    <p>Turn your happy customers into your personal referral network. Automatically.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #1e293b; color: #f59e0b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Explore Referral Automation</a>
    </div>
  `;
}

function generateEmail6Body(): string {
  return `
    <h2 style="color: #1e293b; margin-top: 0;">Everything you need to grow:</h2>
    
    <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <div style="margin-bottom: 15px; border-left: 4px solid #f59e0b; padding-left: 15px;">
        <h3 style="margin: 0; color: #1e293b; font-size: 16px;">Automated Follow-Up Emails</h3>
        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Thank-you, reviews, comeback offers, and more.</p>
      </div>
      
      <div style="margin-bottom: 15px; border-left: 4px solid #f59e0b; padding-left: 15px;">
        <h3 style="margin: 0; color: #1e293b; font-size: 16px;">QR Code Customer Capture</h3>
        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Build your list effortlessly at the counter.</p>
      </div>
      
      <div style="margin-bottom: 15px; border-left: 4px solid #f59e0b; padding-left: 15px;">
        <h3 style="margin: 0; color: #1e293b; font-size: 16px;">Birthday Club & Win-Backs</h3>
        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Stay top-of-mind for the big moments.</p>
      </div>
    </div>
    
    <p>Plans start at just <strong>$49/month</strong>—less than the cost of one new customer.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="background-color: #f59e0b; color: #1e293b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Plans & Pricing</a>
    </div>
  `;
}

function generateEmail7Body(): string {
  return `
    <h2 style="color: #1e293b; margin-top: 0;">Last chance to get your free templates...</h2>
    
    <p>We've noticed you haven't activated the follow-up templates we created for you yet.</p>
    
    <p>These templates are <strong>free</strong> to use, but they'll only be available for a limited time.</p>
    
    <p>Or, if you're ready to automate your follow-up entirely, you can start your 14-day free trial today.</p>
    
    <p>Either way, don't let your customers slip through the cracks.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="background-color: #f59e0b; color: #1e293b; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Activate My Account</a>
    </div>
    
    <p style="margin-top: 30px;">To your success,<br/><strong>The Customer Comeback Team</strong></p>
  `;
}

function generateSalesEmailBody(templateId: string, lead?: any, generatedContent?: any): string {
  let content = '';
  let title = 'Customer Comeback Machine';

  switch (templateId) {
    case 'email1_delivery':
      content = generateEmail1Body(lead, generatedContent);
      title = 'Your Follow-Up Templates';
      break;
    case 'email2_problem':
      content = generateEmail2Body();
      title = 'The Silent Killer';
      break;
    case 'email3_solution':
      content = generateEmail3Body();
      title = 'How to Clone Yourself';
      break;
    case 'email4_reviews':
      content = generateEmail4Body();
      title = 'Easiest Review System';
      break;
    case 'email5_referral':
      content = generateEmail5Body();
      title = 'Referral Automation';
      break;
    case 'email6_pricing':
      content = generateEmail6Body();
      title = 'CCM Plans & Pricing';
      break;
    case 'email7_urgency':
      content = generateEmail7Body();
      title = 'Last Chance';
      break;
    default:
      content = generateEmail2Body();
  }
  
  return wrapPremiumTemplate(content, title);
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
    const finalEmailBody = generateSalesEmailBody('email1_delivery', lead, lead.generated_content);
    const unsubscribeUrl = generateUnsubscribeUrl(lead.email, 'ccm');
    const finalHtml = finalEmailBody.replace(/{unsubscribe_url}/g, unsubscribeUrl);

    await sendEmail({
      to: lead.email,
      subject: '[Action Needed] Your custom follow-up templates are inside',
      html: finalHtml,
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
            const finalEmailBody = generateSalesEmailBody(email.templateId, lead, lead.generated_content);
            const unsubscribeUrl = generateUnsubscribeUrl(lead.email, 'ccm');
            const finalHtml = finalEmailBody.replace(/{unsubscribe_url}/g, unsubscribeUrl);

            // Create email record
            const emailId = generateId();
            await teamDb({
              sql: `INSERT INTO emails (id, business_id, customer_id, type, subject, body, status, sent_at, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'sent', ?, ?)`,
              args: [emailId, 'system', lead.id, `sales_${email.templateId}`, email.subject, finalHtml, now.toISOString(), now.toISOString()]
            });

            // Send email
            await sendEmail({
              to: lead.email,
              subject: email.subject,
              html: finalHtml,
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

