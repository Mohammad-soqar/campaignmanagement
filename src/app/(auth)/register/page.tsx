'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { trpc } from '@/utils/trpc';

export default function RegisterManagerPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const router = useRouter();
  const register = trpc.auth.registerManager.useMutation();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setOk(null);
    try {
      await register.mutateAsync({ email, password, fullName });
      setOk('Check your inbox to confirm your email, then log in.');
      setTimeout(() => router.replace('/login'), 1200);
    } catch (e: any) {
      setErr(e?.message ?? 'Registration failed');
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg border bg-white p-6">
      <h2 className="text-xl font-semibold">Create a Manager Account</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          className="w-full rounded-md border p-2"
          placeholder="Full name"
          value={fullName}
          onChange={e=>setFullName(e.target.value)}
          required
        />
        <input
          className="w-full rounded-md border p-2"
          type="email"
          placeholder="Work email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-md border p-2"
          type="password"
          placeholder="Password (min 6)"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {ok && <p className="text-sm text-green-600">{ok}</p>}
        <button className="w-full rounded-md bg-black py-2 text-white" disabled={register.isPending}>
          {register.isPending ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
