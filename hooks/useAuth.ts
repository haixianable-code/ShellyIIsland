
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    console.log("useAuth: Initializing...");
    // 1. Safety Check: If Supabase isn't configured, stop immediately.
    // This ensures local-only mode works instantly.
    if (!isSupabaseConfigured || !supabase) {
      console.log("useAuth: Supabase not configured, skipping auth check.");
      setAuthChecking(false);
      return;
    }

    let mounted = true;

    // 2. Get Initial Session with Timeout
    const getSession = async () => {
      console.log("useAuth: Getting initial session...");
      try {
        // Add a 5-second timeout to prevent hanging
        const sessionPromise = (supabase!.auth as any).getSession();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Supabase getSession timeout')), 5000)
        );
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (error) {
          console.warn("Supabase Auth Error:", error.message);
        }
        if (mounted) {
          console.log("useAuth: Session retrieved", { user: session?.user });
          setUser(session?.user ?? null);
          setAuthChecking(false);
        }
      } catch (err) {
        console.error("Unexpected Auth Error:", err);
        if (mounted) {
            setAuthChecking(false);
        }
      }
    };

    getSession();

    // 3. Listen for changes (Sign In, Sign Out)
    const { data: { subscription } } = (supabase!.auth as any).onAuthStateChange((_event: any, session: any) => {
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
export const getSupabaseUserFromLocalStorage = (): { user: any } => {
  let user: any = null;
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