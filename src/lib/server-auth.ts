import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin.ts';
import { getOrCreateUser } from '../db/users.ts';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export async function authenticateRequest(req: NextRequest): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1]?.trim();
    if (token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        const user = await getOrCreateUser(
          decoded.uid,
          decoded.email || `${decoded.uid}@applicant.jobtrack`,
          decoded.name || decoded.email?.split('@')[0] || 'Applicant',
          decoded.picture
        );
        return {
          uid: user.uid,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl || undefined,
        };
      } catch (err) {
        // Log cleanly without crashing
        console.warn('Firebase token verification error:', (err as Error).message);
      }
    }
  }

  // Fallback demo/guest header if explicitly provided
  const guestHeader = req.headers.get('x-jobtrack-uid');
  if (guestHeader) {
    const safeUid = guestHeader.slice(0, 64);
    const email = req.headers.get('x-jobtrack-email') || `${safeUid}@jobtrack.local`;
    const name = req.headers.get('x-jobtrack-name') || 'Guest Applicant';
    const user = await getOrCreateUser(safeUid, email, name);
    return {
      uid: user.uid,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || undefined,
    };
  }

  return null;
}
