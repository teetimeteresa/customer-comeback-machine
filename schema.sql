-- Customer Comeback Machine Database Schema
-- Run this to initialize the Turso database

-- Users table (business owners and admin)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'business_owner',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  website TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  google_review_link TEXT DEFAULT '',
  facebook_page TEXT DEFAULT '',
  instagram_page TEXT DEFAULT '',
  main_products TEXT DEFAULT '',
  ideal_customer TEXT DEFAULT '',
  brand_tone TEXT DEFAULT 'friendly',
  special_thing TEXT DEFAULT '',
  current_offer TEXT DEFAULT '',
  mailing_address TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  color_scheme TEXT DEFAULT '#6366f1',
  words_liked TEXT DEFAULT '',
  words_disliked TEXT DEFAULT '',
  referral_offer TEXT DEFAULT '',
  birthday_club_enabled INTEGER DEFAULT 0,
  referral_enabled INTEGER DEFAULT 1,
  review_enabled INTEGER DEFAULT 1,
  comeback_enabled INTEGER DEFAULT 1,
  sms_enabled INTEGER DEFAULT 0,
  preferred_cta TEXT DEFAULT 'Visit us again',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id),
  first_name TEXT NOT NULL,
  last_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  birthday TEXT DEFAULT '',
  favorite_product TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  email_consent INTEGER DEFAULT 0,
  sms_consent INTEGER DEFAULT 0,
  email_consent_timestamp TEXT DEFAULT '',
  sms_consent_timestamp TEXT DEFAULT '',
  source TEXT DEFAULT 'qr_code',
  last_email_sent TEXT DEFAULT '',
  last_email_type TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Leads table (free tool users)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  business_type TEXT NOT NULL,
  customer_type TEXT DEFAULT '',
  what_customer_bought TEXT DEFAULT '',
  tone TEXT DEFAULT 'friendly',
  goal TEXT DEFAULT 'repeat_visit',
  generated_content TEXT DEFAULT '',
  sales_email_sent INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id),
  stripe_customer_id TEXT DEFAULT '',
  stripe_subscription_id TEXT DEFAULT '',
  plan TEXT DEFAULT 'starter',
  status TEXT DEFAULT 'active',
  current_period_start TEXT DEFAULT '',
  current_period_end TEXT DEFAULT '',
  canceled_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Onboarding table
CREATE TABLE IF NOT EXISTS onboarding (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id),
  status TEXT DEFAULT 'pending',
  step INTEGER DEFAULT 0,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id),
  customer_id TEXT NOT NULL REFERENCES customers(id),
  type TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  scheduled_for TEXT NOT NULL,
  sent_at TEXT DEFAULT '',
  email_subject TEXT DEFAULT '',
  email_body TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Emails table
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id),
  customer_id TEXT NOT NULL REFERENCES customers(id),
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TEXT DEFAULT '',
  opened_at TEXT DEFAULT '',
  clicked_at TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_business ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_business ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_campaigns_business ON campaigns(business_id);
CREATE INDEX IF NOT EXISTS idx_emails_business ON emails(business_id);