import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getPlanFromPriceId } from '@/lib/stripe';
import { generateId, timestamp, teamDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const now = timestamp();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType;
        const businessName = session.metadata?.businessName;

        if (session.mode === 'subscription' && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Create subscription record
          const subId = generateId();
          const planName = getPlanFromPriceId(subscription.items.data[0].price.id) || 'starter';
          
          await teamDb(`INSERT INTO subscriptions (id, business_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_start, current_period_end, created_at, updated_at)
                  VALUES ('${subId}', '${userId}', '${session.customer}', '${subscription.id}', '${planName}', 'active', '${new Date(subscription.current_period_start * 1000).toISOString()}', '${new Date(subscription.current_period_end * 1000).toISOString()}', '${now}', '${now}')`);

          // Trigger post-purchase fulfillment
          triggerWelcomeEmail(session.customer, userId, planType || planName);
          
        } else if (session.mode === 'payment') {
          // One-time payment (Done-for-You Setup)
          const subId = generateId();
          await teamDb(`INSERT INTO subscriptions (id, business_id, stripe_customer_id, plan, status, created_at, updated_at)
                  VALUES ('${subId}', '${userId}', '${session.customer}', 'doneForYou', 'active', '${now}', '${now}')`);

          // Trigger post-purchase fulfillment
          triggerWelcomeEmail(session.customer, userId, 'doneForYou');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        
        // Update subscription status
        await teamDb(`UPDATE subscriptions 
                SET status = '${subscription.status}',
                current_period_start = '${new Date(subscription.current_period_start * 1000).toISOString()}',
                current_period_end = '${new Date(subscription.current_period_end * 1000).toISOString()}',
                updated_at = '${now}'
                WHERE stripe_customer_id = '${customerId}'`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        
        await teamDb(`UPDATE subscriptions SET status = 'canceled', canceled_at = '${now}', updated_at = '${now}' WHERE stripe_customer_id = '${customerId}'`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        
        await teamDb(`UPDATE subscriptions SET status = 'past_due', updated_at = '${now}' WHERE stripe_customer_id = '${customerId}'`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Post-purchase fulfillment functions
async function triggerWelcomeEmail(stripeCustomerId: string, userId: string, planType: string) {
  try {
    // Get user email from Stripe customer
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    
    if (customer.deleted) {
      console.error('Customer was deleted');
      return;
    }

    const email = customer.email;
    if (!email) {
      console.error('No email found for customer');
      return;
    }

    // Get business info from userId
    const businesses = await teamDb(`SELECT * FROM businesses WHERE owner_id = '${userId}' LIMIT 1`);

    const business = businesses && businesses.length > 0 ? businesses[0] : null;

    // Send welcome email
    const planDisplayName = {
      starter: 'Starter Plan',
      growth: 'Growth Plan', 
      pro: 'Pro Plan',
      doneForYou: 'Done-for-You Setup'
    }[planType] || 'Your Plan';

    const welcomeHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h1 style="color: #6366f1;">🎉 Welcome to Customer Comeback Machine!</h1>
  
  <p style="font-size: 18px;">Hi there,</p>
  
  <p style="font-size: 16px; line-height: 1.6;">
    Your <strong>${planDisplayName}</strong> is now active! You're officially part of the team helping local businesses bring customers back on autopilot.
  </p>
  
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #333; margin-top: 0;">Here's what happens next:</h3>
    <ol style="line-height: 1.8;">
      <li><strong>Complete your profile</strong> - Set up your business info and preferences</li>
      <li><strong>Get your QR code</strong> - Download and print your custom QR code</li>
      <li><strong>Start capturing customers</strong> - Place your QR code where customers can scan it</li>
      <li><strong>Watch the magic happen</strong> - Automated follow-ups run while you focus on your business</li>
    </ol>
  </div>
  
  <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
    Complete Your Setup →
  </a>
  
  <p style="font-size: 14px; color: #666; margin-top: 30px;">
    Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/faq" style="color: #6366f1;">FAQ</a>.
  </p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  
  <p style="font-size: 12px; color: #888;">
    Customer Comeback Machine<br/>
    Your follow-up automation partner
  </p>
</body>
</html>
`;

    // Use resend to send welcome email
    const { sendEmail } = await import('@/lib/email');
    await sendEmail({
      to: email,
      subject: `🎉 Your Customer Comeback Machine is ready!`,
      html: welcomeHtml,
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - we don't want to fail the webhook for email issues
  }
}
