import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { execSync } from 'child_process';

async function dbQuery(query: string) {
  try {
    const result = execSync(`team-db "${query.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return JSON.parse(result);
  } catch (error) {
    console.error('DB error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'No customer ID provided' }, { status: 400 });
    }

    // Find the Stripe customer ID from our database
    const subscriptions = await dbQuery(
      `SELECT stripe_customer_id FROM subscriptions WHERE stripe_customer_id IS NOT NULL AND stripe_customer_id != '' LIMIT 1`
    );

    // For now, create portal session with the provided customer ID
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}