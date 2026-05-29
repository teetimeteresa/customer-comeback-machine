import React from 'react';
import OnboardingForm from './OnboardingForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { teamDb } from '@/lib/team-db';
import { stripe } from '@/lib/stripe';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (!session?.user) {
    redirect('/login');
  }

  // If there's a Stripe checkout session ID, verify payment and create subscription if needed
  if (params.session_id) {
    try {
      // Get business
      const businesses = await teamDb({
        sql: 'SELECT id FROM businesses WHERE owner_id = ? LIMIT 1',
        args: [session.user.id]
      });

      if (businesses && businesses.length > 0) {
        const business = businesses[0];

        // Check if subscription already exists
        const existingSub = await teamDb({
          sql: `SELECT id FROM subscriptions WHERE business_id = ? LIMIT 1`,
          args: [business.id]
        });

        if (!existingSub || existingSub.length === 0) {
          // Verify the checkout session was successful
          const checkoutSession = await stripe.checkout.sessions.retrieve(params.session_id);

          if (checkoutSession.payment_status === 'paid' || checkoutSession.status === 'complete') {
            // Create subscription record directly (webhook might not have fired yet)
            const { generateId, timestamp } = await import('@/lib/db');
            const subId = generateId();
            const now = timestamp();
            const planType = checkoutSession.metadata?.planType || 'starter';

            await teamDb({
              sql: `INSERT INTO subscriptions (id, business_id, stripe_customer_id, stripe_subscription_id, plan, status, period_start, period_end, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [subId, business.id, checkoutSession.customer as string, checkoutSession.subscription as string || '', planType, 'active', now, now, now, now]
            });
          }
        }
      }
    } catch (error) {
      console.error('Error verifying checkout session:', error);
    }
  }

  // Check if user has a subscription after potential creation
  const businesses = await teamDb({
    sql: 'SELECT id FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [session.user.id]
  });

  if (businesses && businesses.length > 0) {
    const business = businesses[0];

    const subscriptions = await teamDb({
      sql: `SELECT id FROM subscriptions WHERE business_id = ? AND status = 'active' LIMIT 1`,
      args: [business.id]
    });

    // If no subscription, redirect to pricing
    if (!subscriptions || subscriptions.length === 0) {
      redirect('/pricing?error=payment_required');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Comeback Machine</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Welcome, {session.user.name}
          </div>
        </div>
      </header>

      <main>
        <OnboardingForm />
      </main>

      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Customer Comeback Machine. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
