'use server';

import { NextResponse } from 'next/server';
import { generateId, timestamp } from '@/lib/db';
import { execSync } from 'child_process';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

async function dbQuery(query: string) {
  try {
    const result = execSync(`team-db "${query.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return JSON.parse(result);
  } catch (error) {
    console.error('DB error:', error);
    return null;
  }
}

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
    const existingUsers = await dbQuery(`SELECT id FROM users WHERE email = '${email}'`);
    if (existingUsers && existingUsers.length > 0) {
      return { error: 'An account with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = generateId();
    const now = timestamp();
    
    await dbQuery(`
      INSERT INTO users (id, email, password, name, role, created_at, updated_at)
      VALUES ('${userId}', '${email}', '${hashedPassword}', '${name.replace(/'/g, "''")}', 'business_owner', '${now}', '${now}')
    `);

    // Create a placeholder business for now (will be updated during onboarding)
    const businessId = generateId();
    const slug = generateSlug(name.split(' ')[0]);
    
    await dbQuery(`
      INSERT INTO businesses (id, owner_id, name, type, slug, created_at, updated_at)
      VALUES ('${businessId}', '${userId}', '${name.split(' ')[0]}\'s Business', 'local_service', '${slug}', '${now}', '${now}')
    `);

    // Create onboarding record
    await dbQuery(`
      INSERT INTO onboarding (id, business_id, status, step, data, created_at, updated_at)
      VALUES ('${generateId()}', '${businessId}', 'pending', 0, '{}', '${now}', '${now}')
    `);

    return { success: true, userId, businessId };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Failed to create account' };
  }
}