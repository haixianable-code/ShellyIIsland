import { createClient } from '@supabase/supabase-js';

// Read environment variables safely
// We use a fallback object {} because import.meta.env might be undefined in some contexts
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Check if configuration exists
export const isSupabaseConfigured = 
  typeof supabaseUrl === 'string' && 
  supabaseUrl.length > 0 && 
  typeof supabaseAnonKey === 'string' && 
  supabaseAnonKey.length > 0;

// Export client or null (Safe Fallback)
// This prevents the app from crashing if .env.local is missing
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;