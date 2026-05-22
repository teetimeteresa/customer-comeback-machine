'use server';

import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { generateId, timestamp } from '@/lib/db';

export async function saveOnboardingAction(formData: any) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in to complete onboarding' };
  }

  const userId = session.user.id;
  
  // Try to find if user already has a business (created during signup)
  const existingBusinesses = await teamDb({
    sql: 'SELECT id FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [userId]
  });

  const businessId = existingBusinesses && existingBusinesses.length > 0 
    ? existingBusinesses[0].id 
    : generateId();

  // Generate a unique slug from the business name
  let slug = formData.name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');

  // Check if slug exists (for a DIFFERENT business)
  const slugCheck = await teamDb({
    sql: 'SELECT id FROM businesses WHERE slug = ? AND id != ?',
    args: [slug, businessId]
  });

  if (slugCheck && slugCheck.length > 0) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  const now = timestamp();

  try {
    if (existingBusinesses && existingBusinesses.length > 0) {
      // Update existing business
      await teamDb({
        sql: `UPDATE businesses SET 
          name = ?, type = ?, website = ?, slug = ?, city = ?, state = ?, 
          phone = ?, email = ?, google_review_link = ?, facebook_page = ?, 
          instagram_page = ?, main_products = ?, ideal_customer = ?, 
          brand_tone = ?, special_thing = ?, current_offer = ?, 
          mailing_address = ?, birthday_club_enabled = ?, referral_enabled = ?, 
          review_enabled = ?, comeback_enabled = ?, sms_enabled = ?, 
          referral_offer = ?, preferred_cta = ?, words_liked = ?, 
          words_disliked = ?, updated_at = ?
          WHERE id = ?`,
        args: [
          formData.name, formData.type, formData.website, slug, formData.city, formData.state,
          formData.phone, formData.email, formData.googleReviewLink, formData.facebookPage,
          formData.instagramPage, formData.mainProducts, formData.idealCustomer,
          formData.brandTone, formData.specialThing, formData.currentOffer,
          formData.mailingAddress, formData.birthdayClubEnabled ? 1 : 0, 
          formData.referralEnabled ? 1 : 0, formData.reviewEnabled ? 1 : 0, 
          formData.comebackEnabled ? 1 : 0, formData.smsEnabled ? 1 : 0,
          formData.referralOffer, formData.preferredCTA, formData.wordsLiked,
          formData.wordsDisliked, now, businessId
        ]
      });
    } else {
      // Insert new business
      await teamDb({
        sql: `INSERT INTO businesses (
          id, owner_id, name, type, website, slug, city, state, phone, email,
          google_review_link, facebook_page, instagram_page, main_products,
          ideal_customer, brand_tone, special_thing, current_offer, mailing_address,
          birthday_club_enabled, referral_enabled, review_enabled, comeback_enabled,
          sms_enabled, referral_offer, preferred_cta, words_liked, words_disliked,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`,
        args: [
          businessId, userId, formData.name, formData.type, formData.website, slug,
          formData.city, formData.state, formData.phone, formData.email,
          formData.googleReviewLink, formData.facebookPage, formData.instagramPage,
          formData.mainProducts, formData.idealCustomer, formData.brandTone,
          formData.specialThing, formData.currentOffer, formData.mailingAddress,
          formData.birthdayClubEnabled ? 1 : 0, formData.referralEnabled ? 1 : 0,
          formData.reviewEnabled ? 1 : 0, formData.comebackEnabled ? 1 : 0,
          formData.smsEnabled ? 1 : 0, formData.referralOffer, formData.preferredCTA,
          formData.wordsLiked, formData.wordsDisliked, now, now
        ]
      });
    }

    // Update onboarding status
    const existingOnboarding = await teamDb({
      sql: 'SELECT id FROM onboarding WHERE business_id = ?',
      args: [businessId]
    });

    if (!existingOnboarding || existingOnboarding.length === 0) {
      await teamDb({
        sql: 'INSERT INTO onboarding (id, business_id, status, step, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        args: [generateId(), businessId, 'completed', 4, now, now]
      });
    } else {
      await teamDb({
        sql: "UPDATE onboarding SET status = 'completed', step = 4, updated_at = ? WHERE business_id = ?",
        args: [now, businessId]
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Onboarding save error:', error);
    return { success: false, error: 'Failed to save business profile. Please try again.' };
  }
}
