// src/lib/auth/sessionService.ts
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { AuthUser } from './types';
import { logger } from '../api/core/logger';

const auth = getAuth();
const firestore = getFirestore();

// Get the current authenticated session
export async function getCurrentSession(): Promise<AuthUser | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    // Fetch user profile from Firestore
    const userDoc = doc(firestore, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return {
        uid: user.uid,
        email: user.email,
        ...userSnapshot.data(),
      } as AuthUser;
    }

    // If no profile exists, return basic user info
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      role: 'user', // Default role if not found
    } as AuthUser;
  } catch (error) {
    logger.error('Error getting current session:', error);
    return null;
  }
}

// Initialize the authentication state
export async function initializeAuthState(): Promise<AuthUser | null> {
  try {
    const session = await getCurrentSession();
    if (!session) return null;
    return session;
  } catch (error) {
    logger.error('Error initializing auth state:', error);
    return null;
  }
}

// Set up authentication state listener
export function setupAuthStateListener(
  onSignIn: (user: AuthUser) => void,
  onSignOut: () => void
) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const profile = await getCurrentSession();
        if (profile) {
          onSignIn(profile);
        } else {
          logger.error('User profile not found');
          onSignOut();
        }
      } catch (error) {
        logger.error('Error loading user profile:', error);
        onSignOut();
      }
    } else {
      onSignOut();
    }
  });
}
