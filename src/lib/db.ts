// Database utilities for team-db (Turso)
import { v4 as uuidv4 } from 'uuid';
import { turso } from './turso';

export type { DbUser, DbBusiness, DbCustomer, DbLead, DbSubscription, DbOnboarding };

// Helper to execute team-db queries using Turso client
export async function teamDb(statement: any): Promise<any[] | null> {
  try {
    const result = await turso.execute(statement);
    // Convert Rows to plain objects
    return result.rows.map(row => {
      const obj: any = {};
      result.columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  } catch (error) {
    console.error('Turso error:', error);
    return null;
  }
}

// Database table names
const TABLE_NAMES = {
  USERS: 'users',
  BUSINESSES: 'businesses',
  CUSTOMERS: 'customers',
  LEADS: 'leads',
  SUBSCRIPTIONS: 'subscriptions',
  ONBOARDING: 'onboarding',
  CAMPAIGNS: 'campaigns',
  EMAILS: 'emails',
} as const;

// Helper to generate UUIDs
export function generateId(): string {
  return uuidv4();
}

// Helper to get current timestamp
export function timestamp(): string {
  return new Date().toISOString();
}

// Database row types
export interface DbUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'business_owner';
  created_at: string;
  updated_at: string;
}

export interface DbBusiness {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  website: string;
  slug: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  google_review_link: string;
  facebook_page: string;
  instagram_page: string;
  main_products: string;
  ideal_customer: string;
  brand_tone: string;
  special_thing: string;
  current_offer: string;
  mailing_address: string;
  logo_url: string;
  color_scheme: string;
  words_liked: string;
  words_disliked: string;
  referral_offer: string;
  birthday_club_enabled: number;
  referral_enabled: number;
  review_enabled: number;
  comeback_enabled: number;
  sms_enabled: number;
  preferred_cta: string;
  created_at: string;
  updated_at: string;
}

export interface DbCustomer {
  id: string;
  business_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string;
  favorite_product: string;
  tags: string;
  email_consent: number;
  sms_consent: number;
  email_consent_timestamp: string;
  sms_consent_timestamp: string;
  source: string;
  last_email_sent: string;
  last_email_type: string;
  created_at: string;
  updated_at: string;
}

export interface DbLead {
  id: string;
  email: string;
  business_type: string;
  customer_type: string;
  what_customer_bought: string;
  tone: string;
  goal: string;
  generated_content: string;
  sales_email_sent: number;
  created_at: string;
}

export interface DbSubscription {
  id: string;
  business_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbOnboarding {
  id: string;
  business_id: string;
  status: string;
  step: number;
  data: string;
  created_at: string;
  updated_at: string;
}

// Transform database row to TypeScript object
export function businessFromDb(row: DbBusiness) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    type: row.type,
    website: row.website,
    slug: row.slug,
    city: row.city,
    state: row.state,
    phone: row.phone,
    email: row.email,
    googleReviewLink: row.google_review_link,
    facebookPage: row.facebook_page,
    instagramPage: row.instagram_page,
    mainProducts: row.main_products,
    idealCustomer: row.ideal_customer,
    brandTone: row.brand_tone,
    specialThing: row.special_thing,
    currentOffer: row.current_offer,
    mailingAddress: row.mailing_address,
    logoUrl: row.logo_url,
    colorScheme: row.color_scheme,
    wordsLiked: row.words_liked,
    wordsDisliked: row.words_disliked,
    referralOffer: row.referral_offer,
    birthdayClubEnabled: row.birthday_club_enabled === 1,
    referralEnabled: row.referral_enabled === 1,
    reviewEnabled: row.review_enabled === 1,
    comebackEnabled: row.comeback_enabled === 1,
    smsEnabled: row.sms_enabled === 1,
    preferredCTA: row.preferred_cta,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function customerFromDb(row: DbCustomer) {
  return {
    id: row.id,
    businessId: row.business_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    birthday: row.birthday,
    favoriteProduct: row.favorite_product,
    tags: row.tags ? JSON.parse(row.tags) : [],
    emailConsent: row.email_consent === 1,
    smsConsent: row.sms_consent === 1,
    emailConsentTimestamp: row.email_consent_timestamp,
    smsConsentTimestamp: row.sms_consent_timestamp,
    source: row.source,
    lastEmailSent: row.last_email_sent,
    lastEmailType: row.last_email_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function subscriptionFromDb(row: DbSubscription) {
  return {
    id: row.id,
    businessId: row.business_id,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    plan: row.plan,
    status: row.status,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    canceledAt: row.canceled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function leadFromDb(row: DbLead) {
  return {
    id: row.id,
    email: row.email,
    businessType: row.business_type,
    customerType: row.customer_type,
    whatCustomerBought: row.what_customer_bought,
    tone: row.tone,
    goal: row.goal,
    generatedContent: row.generated_content,
    salesEmailSent: row.sales_email_sent === 1,
    createdAt: row.created_at,
  };
}
