'use server';

import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { generateId } from '@/lib/db';

export async function saveOnboardingAction(formData: any) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in to complete onboarding' };
  }

  const userId = session.user.id;
  const businessId = generateId();
  
  // Generate a unique slug from the business name
  let slug = formData.name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
  
  // Check if slug exists, if so append random string
  const existingBusinesses = await teamDb(`SELECT id FROM businesses WHERE slug = '${slug}'`);
  if (existingBusinesses.length > 0) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  try {
    // Insert into businesses table
    await teamDb(`
      INSERT INTO businesses (
        id, owner_id, name, type, website, slug, city, state, phone, email,
        google_review_link, facebook_page, instagram_page, main_products, 
        ideal_customer, brand_tone, special_thing, current_offer, mailing_address,
        birthday_club_enabled, referral_enabled, review_enabled, comeback_enabled,
        sms_enabled, referral_offer, preferred_cta, words_liked, words_disliked
      ) VALUES (
        '${businessId}',
        '${userId}',
        '${formData.name.replace(/'/g, "''")}',
        '${formData.type}',
        '${formData.website.replace(/'/g, "''")}',
        '${slug}',
        '${formData.city.replace(/'/g, "''")}',
        '${formData.state.replace(/'/g, "''")}',
        '${formData.phone.replace(/'/g, "''")}',
        '${formData.email.replace(/'/g, "''")}',
        '${formData.googleReviewLink.replace(/'/g, "''")}',
        '${formData.facebookPage.replace(/'/g, "''")}',
        '${formData.instagramPage.replace(/'/g, "''")}',
        '${formData.mainProducts.replace(/'/g, "''")}',
        '${formData.idealCustomer.replace(/'/g, "''")}',
        '${formData.brandTone}',
        '${formData.specialThing.replace(/'/g, "''")}',
        '${formData.currentOffer.replace(/'/g, "''")}',
        '${formData.mailingAddress.replace(/'/g, "''")}',
        ${formData.birthdayClubEnabled ? 1 : 0},
        ${formData.referralEnabled ? 1 : 0},
        ${formData.reviewEnabled ? 1 : 0},
        ${formData.comebackEnabled ? 1 : 0},
        ${formData.smsEnabled ? 1 : 0},
        '${formData.referralOffer.replace(/'/g, "''")}',
        '${formData.preferredCTA.replace(/'/g, "''")}',
        '${formData.wordsLiked.replace(/'/g, "''")}',
        '${formData.wordsDisliked.replace(/'/g, "''")}'
      )
    `);

    // Update onboarding status
    // Check if onboarding record exists
    const existingOnboarding = await teamDb(`SELECT id FROM onboarding WHERE business_id = '${businessId}'`);
    if (existingOnboarding.length === 0) {
      await teamDb(`
        INSERT INTO onboarding (id, business_id, status, step)
        VALUES ('${generateId()}', '${businessId}', 'completed', 4)
      `);
    } else {
      await teamDb(`
        UPDATE onboarding SET status = 'completed', step = 4 WHERE business_id = '${businessId}'
      `);
    }

    return { success: true };
  } catch (error) {
    console.error('Onboarding save error:', error);
    return { success: false, error: 'Failed to save business profile. Please try again.' };
  }
}
