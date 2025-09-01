import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../init';
import { createClient } from '@supabase/supabase-js';
import { profiles } from '@/server/db/schema/profiles';
import { eq } from 'drizzle-orm';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const authRouter = router({
  registerManager: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      fullName: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false, detectSessionInUrl: false },
      });

      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: { data: { fullName: input.fullName } },
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error('No user id');

      const base = { userId, role: 'manager' as const, status: 'approved' as const, fullName: input.fullName };
      const [existing] = await ctx.db.select().from(profiles).where(eq(profiles.userId, userId));
      if (existing) await ctx.db.update(profiles).set(base).where(eq(profiles.userId, userId));
      else await ctx.db.insert(profiles).values(base);

      return { ok: true };
    }),

  me: protectedProcedure.query(({ ctx }) => ({
    userId: ctx.userId,
    role: ctx.role,
    status: ctx.status,
  })),
});
