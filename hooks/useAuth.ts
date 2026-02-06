import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // 1. Safety Check: If Supabase isn't configured, stop immediately.
    // This ensures local-only mode works instantly.
    if (!isSupabaseConfigured || !supabase) {
      setAuthChecking(false);
      return;
    }

    let mounted = true;

    // 2. Get Initial Session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Supabase Auth Error:", error.message);
        }
        if (mounted) {
          setUser(session?.user ?? null);
          setAuthChecking(false);
        }
      } catch (err) {
        console.error("Unexpected Auth Error:", err);
        if (mounted) setAuthChecking(false);
      }
    };

    getSession();

    // 3. Listen for changes (Sign In, Sign Out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        // Ensure loading stops on state change
        setAuthChecking(false); 
      }
    });

    // 4. Cleanup to prevent memory leaks
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, authChecking };
};

// FIX: Created a standalone synchronous function to get the user from local storage.
// This is a workaround to avoid violating hook rules inside a timeout.
export const getSupabaseUserFromLocalStorage = (): { user: User | null } => {
  let user: User | null = null;
  // Supabase stores the session in localStorage with a key like `sb-PROJECT_REF-auth-token`
  const key = Object.keys(localStorage).find(i => i.startsWith('sb-') && i.endsWith('-auth-token'));
  if (key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      user = data.user || null;
    } catch (e) {
      // ignore
    }
  }
  return { user };
}
