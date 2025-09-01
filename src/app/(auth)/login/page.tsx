'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setLoading(false); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr('No user in session'); setLoading(false); return; }

    const { data: profile, error: perr } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (perr) { setErr(perr.message); setLoading(false); return; }

    if (profile?.role === 'influencer') {
      if (profile.status === 'approved') router.replace('/my-campaigns');
      else router.replace('/pending-approval');
    } else {
      router.replace('/campaigns');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg border bg-white p-6">
      <h2 className="text-xl font-semibold">Log in</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-md border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-md border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-md bg-black py-2 text-white" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
