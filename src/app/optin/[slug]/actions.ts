'use server';

import { teamDb } from '@/lib/team-db';
import { generateId, timestamp } from '@/lib/db';

export async function submitOptIn(formData: FormData) {
  const businessId = formData.get('businessId') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = (formData.get('phone') as string) || '';
  const birthday = (formData.get('birthday') as string) || '';
  const emailConsent = formData.get('emailConsent') === 'yes' ? 1 : 0;
  const smsConsent = formData.get('smsConsent') === 'yes' ? 1 : 0;

  if (!businessId || !firstName || !email) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  try {
    const id = generateId();
    const ts = timestamp();

    await teamDb({
      sql: `INSERT INTO customers (
        id, business_id, first_name, last_name, email, phone, birthday,
        email_consent, sms_consent, email_consent_timestamp, sms_consent_timestamp, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, businessId, firstName, lastName, email, phone, birthday,
        emailConsent, smsConsent, emailConsent ? ts : '', smsConsent ? ts : '', 'qr_code'
      ]
    });

    console.log(`Customer ${email} added for business ${businessId}`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting opt-in:', error);
    return { success: false, error: 'We could not save your information. You might already be on the list!' };
  }
}
