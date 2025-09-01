import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/routers/_app';
import { httpBatchLink, loggerLink } from '@trpc/client';
import superjson from 'superjson';

export const api = createTRPCReact<AppRouter>();

export function trpcClient(getAccessToken: () => Promise<string | null>) {
  return api.createClient({
    links: [
      loggerLink(),
      httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
        async headers() {
          const token = await getAccessToken();
          return token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}
