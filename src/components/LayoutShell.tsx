'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-6xl px-4">
        <Sidebar />
        <main className="min-h-[calc(100dvh-56px)] w-full pb-20 md:pb-6">{children}</main>
      </div>
      <BottomNav />
    </>
  );
}
