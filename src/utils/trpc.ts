'use client';

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/routers/_app'; // keep this type import
export const trpc = createTRPCReact<AppRouter>();
