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
// Updated to iterate localStorage safely without Object.keys to avoid TS issues.
export const getSupabaseUserFromLocalStorage = (): { user: User | null } => {
  let user: User | null = null;
  
  if (typeof localStorage === 'undefined') return { user: null };

  // Iterate over localStorage keys safely
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          user = data.user || null;
        }
      } catch (e) {
        // ignore invalid JSON
      }
      // Assuming only one Supabase project per domain for this app, we can break.
      if (user) break; 
    }
  }
  
  return { user };
}