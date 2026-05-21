import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Plan pricing IDs - replace with actual Stripe price IDs
export const PLANS = {
  starter: {
    name: 'Starter Plan',
    price: 4900, // $49/month in cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    features: [
      'Custom customer opt-in page',
      'QR code',
      'Email follow-up automation',
      'Thank-you email',
      'Review request email',
      'Comeback offer email',
      'Basic dashboard',
    ],
  },
  growth: {
    name: 'Growth Plan',
    price: 9900, // $99/month in cents
    priceId: process.env.STRIPE_GROWTH_PRICE_ID || 'price_growth',
    features: [
      'Everything in Starter',
      'Birthday club',
      'Referral request',
      'Win-back campaign',
      'Monthly campaign suggestions',
      'Customer tags',
      'Downloadable customer list',
    ],
  },
  pro: {
    name: 'Pro Plan',
    price: 19900, // $199/month in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    features: [
      'Everything in Growth',
      'SMS/text message option',
      'Advanced campaign builder',
      'Automated seasonal campaigns',
      'Review reply suggestions',
      'Testimonial repurposing',
      'Priority support',
    ],
  },
  doneForYou: {
    name: 'Done-for-You Setup',
    price: 49700, // $497 one-time in cents
    priceId: process.env.STRIPE_DONE_FOR_YOU_PRICE_ID || 'price_done_for_you',
    features: [
      'Business profile setup',
      'Message customization',
      'QR sign setup',
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

export function getPlanFromPriceId(priceId: string): PlanType | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) {
      return key as PlanType;
    }
  }
  return null;
}