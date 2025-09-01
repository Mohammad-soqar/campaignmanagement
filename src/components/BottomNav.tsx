'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/campaigns', label: 'Campaigns', icon: '📊' },
  { href: '/influencers', label: 'Influencers', icon: '👤' },
  { href: '/my-campaigns', label: 'Mine', icon: '🗂️' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {items.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex flex-col items-center gap-1 py-2 text-xs ${
                active ? 'text-black' : 'text-zinc-500'
              }`}
            >
              <span className="text-base">{i.icon}</span>
              <span>{i.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
