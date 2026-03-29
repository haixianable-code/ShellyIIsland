-- Add trial_ends_at column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT NULL;

-- Add ai_lifetime_used column to profiles table if it doesn't exist (mentioned in code)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS ai_lifetime_used INTEGER DEFAULT 0;
