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
