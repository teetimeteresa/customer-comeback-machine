'use server';

import { generateId, timestamp } from '@/lib/db';
import { teamDb } from '@/lib/team-db';
import bcrypt from 'bcryptjs';
import { signIn } from '@/lib/auth';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

export async function signup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }

  try {
    // Check if user already exists
    const existingUsers = await teamDb({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    });

    if (existingUsers && existingUsers.length > 0) {
      return { error: 'An account with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = generateId();
    const now = timestamp();

    await teamDb({
      sql: `INSERT INTO users (id, email, password, name, role, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [userId, email, hashedPassword, name, 'business_owner', now, now]
    });

    // Create a placeholder business for now
    const businessId = generateId();
    const slug = generateSlug(name.split(' ')[0]);
    const businessName = `${name.split(' ')[0]}'s Business`;

    await teamDb({
      sql: `INSERT INTO businesses (id, owner_id, name, type, slug, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [businessId, userId, businessName, 'local_service', slug, now, now]
    });

    // Create onboarding record
    await teamDb({
      sql: `INSERT INTO onboarding (id, business_id, status, step, data, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [generateId(), businessId, 'pending', 0, '{}', now, now]
    });

    // Automatically sign in the user
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
    } catch (authError) {
      console.error('Auto-login error:', authError);
      // We still created the account, so they can manually login if redirect fails
    }

    return { success: true, userId };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}
