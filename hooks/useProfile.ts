
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { UserProfile } from '../types';

export const useProfile = (user: any) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user || !isSupabaseConfigured || !supabase) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Record not found, we'll need to create one
        setProfile(null);
      } else if (error) {
        throw error;
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !isSupabaseConfigured || !supabase) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user, fetchProfile]);

  return { profile, loading, updateProfile, refreshProfile: fetchProfile };
};