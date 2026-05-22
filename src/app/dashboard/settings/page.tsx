import { Sidebar } from '@/components/Sidebar';
import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch current business data
  const businesses = await teamDb({
    sql: 'SELECT * FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [session.user.id]
  });

  const business = businesses[0];

  if (!business) {
    // If somehow they don't have a business yet, redirect to onboarding
    redirect('/onboarding');
  }

  // Map database fields to form fields
  const initialData = {
    name: business.name || '',
    type: business.type || 'Boutique',
    website: business.website || '',
    city: business.city || '',
    state: business.state || '',
    phone: business.phone || '',
    email: business.email || '',
    mailingAddress: business.mailing_address || '',
    googleReviewLink: business.google_review_link || '',
    facebookPage: business.facebook_page || '',
    instagramPage: business.instagram_page || '',
    mainProducts: business.main_products || '',
    idealCustomer: business.ideal_customer || '',
    brandTone: business.brand_tone || 'Friendly',
    specialThing: business.special_thing || '',
    currentOffer: business.current_offer || '',
    referralOffer: business.referral_offer || '',
    birthdayClubEnabled: Boolean(business.birthday_club_enabled),
    referralEnabled: Boolean(business.referral_enabled),
    reviewEnabled: Boolean(business.review_enabled),
    comebackEnabled: Boolean(business.comeback_enabled),
    smsEnabled: Boolean(business.sms_enabled),
    preferredCTA: business.preferred_cta || 'Visit us again',
    wordsLiked: business.words_liked || '',
    wordsDisliked: business.words_disliked || '',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-xl font-bold">Settings</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">{business.name}</span>
            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          </div>
        </header>

        <div className="p-8 pb-24">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold tracking-tight">Business Profile</h2>
              <p className="text-slate-500 mt-1">Manage your business information and automation preferences.</p>
            </div>
            
            <SettingsForm initialData={initialData} />
          </div>
        </div>
      </main>
    </div>
  );
}
