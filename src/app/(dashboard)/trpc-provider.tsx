'use client';

import { ReactNode, useMemo } from 'react';
import { api, trpcClient } from '@/lib/trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useMemo(() => [new QueryClient()], []);
  const client = useMemo(
    () => trpcClient(async () => (await supabase.auth.getSession()).data.session?.access_token ?? null),
    []
  );
  return (
    <api.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
