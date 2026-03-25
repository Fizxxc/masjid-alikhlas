import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { Profile } from '@/src/types/db';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data as Profile | null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user?.id) await loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    refreshProfile: async () => {
      if (session?.user?.id) await loadProfile(session.user.id);
    },
  };
}
