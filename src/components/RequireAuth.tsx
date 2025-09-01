'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/login'); else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.replace('/login');
    });
    return () => { sub.subscription.unsubscribe(); };
  }, [router]);

  if (!ready) return <div className="p-6">Loading…</div>;
  return <>{children}</>;
}
