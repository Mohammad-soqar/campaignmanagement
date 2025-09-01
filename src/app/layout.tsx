import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Campaign Manager',
  description: 'Run campaigns and manage influencers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
