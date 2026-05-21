import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS } from '@/lib/stripe';
import { generateId, timestamp } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { planType, userId, email, businessName } = await request.json();

    if (!planType || !PLANS[planType as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    const plan = PLANS[planType as keyof typeof PLANS];
    
    // Create or retrieve Stripe customer
    let customers = await stripe.customers.list({ email, limit: 1 });
    let customer;
    
    if (customers.data.length === 0) {
      customer = await stripe.customers.create({
        email,
        metadata: { userId, businessName },
      });
    } else {
      customer = customers.data[0];
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: planType === 'doneForYou' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: planType === 'doneForYou' ? {
            currency: 'usd',
            unit_amount: plan.price,
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
            },
          } : {
            currency: 'usd',
            unit_amount: plan.price,
            recurring: { interval: 'month' },
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planType,
        businessName: businessName || '',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}