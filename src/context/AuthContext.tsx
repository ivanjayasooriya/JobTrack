'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '@/src/lib/firebase.ts';

export interface UserProfile {
  id?: number;
  uid: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
  location?: string | null;
  university?: string | null;
  graduationYear?: number | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  skills?: string | null;
  bio?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (customName?: string) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  signInWithGoogle: async () => {},
  signInAsGuest: () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync token and load user profile from server
  const syncServerProfile = async (authToken?: string | null, guestUid?: string | null) => {
    try {
      const headers: Record<string, string> = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else if (guestUid) {
        headers['x-jobtrack-uid'] = guestUid;
      }

      const res = await fetch('/api/auth/me', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.warn('Failed to sync profile from server:', err);
    }
  };

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          localStorage.removeItem('jobtrack_guest_session');

          const profileObj: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || `${fbUser.uid}@applicant.jobtrack`,
            name: fbUser.displayName || 'Applicant',
            avatarUrl: fbUser.photoURL || null,
          };
          setUser(profileObj);
          await syncServerProfile(idToken, null);
        } catch (e) {
          console.error('Error fetching Firebase token:', e);
        }
      } else {
        // Check if guest/demo mode is active in localStorage
        const storedGuest = localStorage.getItem('jobtrack_guest_session');
        if (storedGuest) {
          try {
            const guest = JSON.parse(storedGuest);
            setUser(guest);
            setToken(null);
            await syncServerProfile(null, guest.uid);
          } catch {
            localStorage.removeItem('jobtrack_guest_session');
            setUser(null);
            setToken(null);
          }
        } else {
          // Initialize automatic demo session so user can explore immediately
          const initialGuestId = 'demo-candidate-' + Math.random().toString(36).substring(2, 9);
          const defaultGuest: UserProfile = {
            uid: initialGuestId,
            email: 'candidate@student.edu',
            name: 'Alex Chen (Candidate)',
            university: 'Computer Science, B.S.',
            location: 'San Francisco, CA',
            skills: 'TypeScript, React, Next.js, Node.js, PostgreSQL, Go, Docker',
            bio: 'Junior studying CS. Seeking Summer 2026 SWE internships in distributed systems and cloud platforms.',
          };
          localStorage.setItem('jobtrack_guest_session', JSON.stringify(defaultGuest));
          setUser(defaultGuest);
          await syncServerProfile(null, initialGuestId);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      localStorage.removeItem('jobtrack_guest_session');
      await syncServerProfile(idToken, null);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = (customName?: string) => {
    const guestUid = 'guest-' + Math.random().toString(36).substring(2, 9);
    const guest: UserProfile = {
      uid: guestUid,
      email: `${guestUid}@student.edu`,
      name: customName || 'Alex Chen (Student)',
      university: 'Computer Science, B.S.',
      location: 'San Francisco, CA',
      skills: 'TypeScript, React, Next.js, PostgreSQL, Python, Git',
      bio: 'Junior studying CS. Seeking Summer 2026 SWE internships.',
    };
    localStorage.setItem('jobtrack_guest_session', JSON.stringify(guest));
    setUser(guest);
    setToken(null);
    syncServerProfile(null, guestUid);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignored if not signed in via Firebase
    }
    localStorage.removeItem('jobtrack_guest_session');
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    if (token) {
      await syncServerProfile(token, null);
    } else if (user?.uid) {
      await syncServerProfile(null, user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
