import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface UserProfileUpdate {
  name?: string;
  avatarUrl?: string;
  phone?: string;
  location?: string;
  university?: string;
  graduationYear?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills?: string;
  bio?: string;
}

export async function getOrCreateUser(
  uid: string,
  email: string,
  name?: string,
  avatarUrl?: string
) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }

    const defaultName = name || email.split('@')[0] || 'Applicant';
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name: defaultName,
        avatarUrl: avatarUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('getOrCreateUser failed:', error);
    throw new Error('Database operation failed while synchronizing user profile.', {
      cause: error,
    });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('getUserByUid failed:', error);
    throw new Error('Database operation failed while fetching user profile.', {
      cause: error,
    });
  }
}

export async function updateUserProfile(uid: string, data: UserProfileUpdate) {
  try {
    const result = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('updateUserProfile failed:', error);
    throw new Error('Database operation failed while updating profile.', {
      cause: error,
    });
  }
}
