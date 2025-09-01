'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/campaigns', label: 'Campaigns', icon: '📊' },
  { href: '/influencers', label: 'Influencers', icon: '👤' },
  { href: '/my-campaigns', label: 'My Campaigns', icon: '🗂️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-14 hidden h-[calc(100dvh-56px)] w-56 shrink-0 border-r bg-white p-3 md:block">
      <nav className="grid gap-1">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                active ? 'bg-black !text-white' : 'hover:bg-zinc-100'
              }`}
            >
              <span className="text-base">{i.icon}</span>
              <span>{i.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 rounded-lg border p-3">
        <div className="text-xs font-medium text-zinc-600">Tips</div>
        <p className="mt-2 text-xs text-zinc-500">
          Create your campaign first, then assign influencers from the campaign detail page.
        </p>
      </div>
    </aside>
  );
}
