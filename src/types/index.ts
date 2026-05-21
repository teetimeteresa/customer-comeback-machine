// User types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'business_owner';
  createdAt: string;
  updatedAt: string;
}

// Business types
export interface Business {
  id: string;
  ownerId: string;
  name: string;
  type: BusinessType;
  website: string;
  slug: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  googleReviewLink: string;
  facebookPage: string;
  instagramPage: string;
  mainProducts: string;
  idealCustomer: string;
  brandTone: BrandTone;
  specialThing: string;
  currentOffer: string;
  mailingAddress: string;
  logoUrl: string;
  colorScheme: string;
  wordsLiked: string;
  wordsDisliked: string;
  referralOffer: string;
  birthdayClubEnabled: boolean;
  referralEnabled: boolean;
  reviewEnabled: boolean;
  comebackEnabled: boolean;
  smsEnabled: boolean;
  preferredCTA: string;
  createdAt: string;
  updatedAt: string;
}

export type BusinessType = 
  | 'boutique'
  | 'optical_shop'
  | 'salon'
  | 'coffee_shop'
  | 'florist'
  | 'gift_shop'
  | 'bakery'
  | 'med_spa'
  | 'photographer'
  | 'fitness_studio'
  | 'local_service'
  | 'downtown_retailer';

export type BrandTone = 'friendly' | 'funny' | 'professional' | 'luxury' | 'heartfelt' | 'simple';

// Customer types
export interface Customer {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  favoriteProduct: string;
  tags: string[];
  emailConsent: boolean;
  smsConsent: boolean;
  emailConsentTimestamp: string;
  smsConsentTimestamp: string;
  source: string;
  lastEmailSent: string;
  lastEmailType: string;
  createdAt: string;
  updatedAt: string;
}

// Lead types (free tool users)
export interface Lead {
  id: string;
  email: string;
  businessType: BusinessType;
  customerType: string;
  whatCustomerBought: string;
  tone: BrandTone;
  goal: LeadGoal;
  generatedContent: string;
  salesEmailSent: boolean;
  createdAt: string;
}

export type LeadGoal = 
  | 'review'
  | 'repeat_visit'
  | 'referral'
  | 'birthday_list'
  | 'appointment_booking'
  | 'thank_you';

// Subscription types
export interface Subscription {
  id: string;
  businessId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt: string;
  createdAt: string;
  updatedAt: string;
}

export type PlanType = 'starter' | 'growth' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

// Onboarding types
export interface Onboarding {
  id: string;
  businessId: string;
  status: 'pending' | 'in_progress' | 'completed';
  step: number;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Campaign types
export interface Campaign {
  id: string;
  businessId: string;
  customerId: string;
  type: CampaignType;
  status: 'scheduled' | 'sent' | 'failed';
  scheduledFor: string;
  sentAt: string;
  emailSubject: string;
  emailBody: string;
  createdAt: string;
}

export type CampaignType = 
  | 'welcome'
  | 'review_request'
  | 'comeback_offer'
  | 'referral_request'
  | 'win_back'
  | 'birthday'
  | 'monthly';

// Email types
export interface Email {
  id: string;
  businessId: string;
  customerId: string;
  type: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed' | 'opened' | 'clicked';
  sentAt: string;
  openedAt: string;
  clickedAt: string;
  createdAt: string;
}

// Dashboard stats
export interface DashboardStats {
  totalOptins: number;
  newOptinsThisMonth: number;
  emailsSent: number;
  reviewClicks: number;
  comebackOfferClicks: number;
  referralRequests: number;
  upcomingBirthdays: number;
  activeCampaigns: number;
}

// AI Generation types
export interface AIGenerationContext {
  businessType: BusinessType;
  brandTone: BrandTone;
  customerAction: string;
  productService: string;
  goal: string;
  offer: string;
  season: string;
  businessName: string;
  customerName: string;
}

// Free tool input
export interface FreeToolInput {
  businessType: BusinessType;
  customerType: string;
  whatCustomerBought: string;
  tone: BrandTone;
  goal: LeadGoal;
}

// Free tool output
export interface FreeToolOutput {
  thankYouMessage: string;
  reviewRequest: string;
  comebackOffer: string;
  referralMessage: string;
  socialMediaCaption: string;
}