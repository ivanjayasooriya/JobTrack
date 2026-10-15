import { auth } from './firebase.ts';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If Firebase user is active
  if (auth.currentUser) {
    // Note: token is passed if available
  }

  // Check localStorage guest session
  if (typeof window !== 'undefined') {
    const storedGuest = localStorage.getItem('jobtrack_guest_session');
    if (storedGuest) {
      try {
        const guest = JSON.parse(storedGuest);
        if (guest.uid) {
          headers['x-jobtrack-uid'] = guest.uid;
          headers['x-jobtrack-email'] = guest.email || `${guest.uid}@jobtrack.local`;
          headers['x-jobtrack-name'] = guest.name || 'Applicant';
        }
      } catch {
        // Ignored
      }
    }
  }

  return headers;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const headers = getAuthHeaders();

    // If Firebase user is signed in, get fresh ID token
    if (auth.currentUser) {
      try {
        const idToken = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${idToken}`;
      } catch (e) {
        console.warn('Failed getting Firebase token for request:', e);
      }
    }

    const mergedHeaders = {
      ...headers,
      ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(endpoint, {
      ...options,
      headers: mergedHeaders,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: data?.error || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (err: any) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    return {
      error: err.message || 'Network error occurred. Please try again.',
      status: 0,
    };
  }
}
