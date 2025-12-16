import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null);

  const checkPurchaseStatus = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', 'unlock_activity_jar')
        .maybeSingle();

      if (error) {
        console.error('Error checking purchase status:', error);
        setHasPurchased(false);
        return;
      }

      setHasPurchased(!!data);
    } catch (error) {
      console.error('Error checking purchase status:', error);
      setHasPurchased(false);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer purchase check
        if (session?.user) {
          setTimeout(() => {
            checkPurchaseStatus(session.user.id);
          }, 0);
        } else {
          setHasPurchased(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        checkPurchaseStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkPurchaseStatus]);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const refreshPurchaseStatus = useCallback(() => {
    if (user) {
      checkPurchaseStatus(user.id);
    }
  }, [user, checkPurchaseStatus]);

  return {
    user,
    session,
    loading,
    hasPurchased,
    signUp,
    signIn,
    signOut,
    refreshPurchaseStatus,
  };
};
