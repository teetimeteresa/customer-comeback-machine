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

        if (session.mode === 'subscription' && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Create subscription record
          const subId = generateId();
          const planName = getPlanFromPriceId(subscription.items.data[0].price.id) || 'starter';
          
          await teamDb({
            sql: `INSERT INTO subscriptions (id, business_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_start, current_period_end, created_at, updated_at)
                  VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
            args: [
              subId, userId, session.customer, subscription.id, planName,
              new Date(subscription.current_period_start * 1000).toISOString(),
              new Date(subscription.current_period_end * 1000).toISOString(),
              now, now
            ]
          });
        } else if (session.mode === 'payment') {
          // One-time payment (Done-for-You Setup)
          const subId = generateId();
          await teamDb({
            sql: `INSERT INTO subscriptions (id, business_id, stripe_customer_id, plan, status, created_at, updated_at)
                  VALUES (?, ?, ?, 'doneForYou', 'active', ?, ?)`,
            args: [subId, userId, session.customer, now, now]
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        
        await teamDb({
          sql: `UPDATE subscriptions 
                SET status = ?, current_period_start = ?, current_period_end = ?, updated_at = ?
                WHERE stripe_customer_id = ?`,
          args: [
            subscription.status,
            new Date(subscription.current_period_start * 1000).toISOString(),
            new Date(subscription.current_period_end * 1000).toISOString(),
            now, customerId
          ]
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        
        await teamDb({
          sql: `UPDATE subscriptions SET status = 'canceled', canceled_at = ?, updated_at = ? WHERE stripe_customer_id = ?`,
          args: [now, now, customerId]
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        
        await teamDb({
          sql: `UPDATE subscriptions SET status = 'past_due', updated_at = ? WHERE stripe_customer_id = ?`,
          args: [now, customerId]
        });
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
