import { createClient } from '@supabase/supabase-js';
import type { inferAsyncReturnType } from '@trpc/server';
import { db } from '@/server/db';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getBearer(req: Request) {
    const auth = req.headers.get('authorization') || '';
    const [, token] = auth.split(' ');
    return token ?? null;
}

export async function createContext(opts: { req: Request }) {
    const token = getBearer(opts.req);
    let userId: string | null = null;

    if (token) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: { persistSession: false, detectSessionInUrl: false },
        });
        const { data } = await supabase.auth.getUser(token);
        userId = data.user?.id ?? null;
    }

    return { req: opts.req, db, userId };
}

export type Context = inferAsyncReturnType<typeof createContext>;
