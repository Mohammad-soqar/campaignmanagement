'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-black" />
          <span className="text-sm font-semibold tracking-wide">Campaign Manager</span>
        </Link>
        <div className="flex items-center gap-3">
          {email && <span className="hidden text-sm text-zinc-600 sm:inline">{email}</span>}
          <button
            onClick={logout}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
