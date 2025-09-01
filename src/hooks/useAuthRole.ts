'use client';
import { trpc } from '@/utils/trpc';

export function useAuthRole() {
    const { data, isLoading, error } =
        trpc.auth.me.useQuery(undefined, { retry: false, });

    return {
        role: data?.role as
            ('manager' | 'influencer' | undefined),
        userId: data?.userId as string | undefined, isLoading, error,
    };
}