// src/server/trpc/routers/onboarding.ts
import { z } from 'zod';
import { router, publicProcedure } from '../init';
import { influencerInvites } from '@/server/db/schema/inviteTokens';
import { influencers } from '@/server/db/schema/influencers';
import { profiles } from '@/server/db/schema/profiles';
import { eq, and, gt } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

export const onboardingRouter = router({
  // validate token and surface the email it was issued for
  verify: publicProcedure
    .input(z.object({ token: z.string().min(10) }))
    .query(async ({ ctx, input }) => {
      const [invite] = await ctx.db
        .select()
        .from(influencerInvites)
        .where(
          and(
            eq(influencerInvites.token, input.token),
            gt(influencerInvites.expiresAt, new Date()),
          ),
        );
      if (!invite) return { valid: false };
      return { valid: true, email: invite.email };
    }),

  // complete onboarding by creating an auth user and linking to the existing roster row
  complete: publicProcedure
    .input(z.object({
      token: z.string().min(10),
      email: z.string().email(),
      password: z.string().min(6),
      fullName: z.string().optional(), // optional: will fall back to roster.handle
    }))
    .mutation(async ({ ctx, input }) => {
      // 1) validate token
      const [invite] = await ctx.db
        .select()
        .from(influencerInvites)
        .where(
          and(
            eq(influencerInvites.token, input.token),
            gt(influencerInvites.expiresAt, new Date()),
          ),
        );
      if (!invite) throw new Error('Invite expired/invalid');
      if (invite.email.toLowerCase() !== input.email.toLowerCase()) {
        throw new Error('Email mismatch');
      }

      // 2) fetch the roster (authoritative source of creator fields)
      const [roster] = await ctx.db
        .select()
        .from(influencers)
        .where(eq(influencers.id, invite.influencerId));
      if (!roster) throw new Error('Roster row missing');

      // 3) create auth user via service-role (no public signup needed)
      const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: { persistSession: false, detectSessionInUrl: false },
      });

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true, // let them log in immediately
        user_metadata: { fullName: input.fullName ?? roster.handle ?? 'Creator' },
      });
      if (createErr) throw createErr;

      const userId = created.user?.id;
      if (!userId) throw new Error('Failed to create user');

      // 4) create/overwrite profile with APPROVED status immediately
      const baseProfile = {
        userId,
        role: 'influencer' as const,
        status: 'approved' as const, // <- immediate access
        fullName: input.fullName ?? roster.handle ?? null,
        // Copy selected public fields from roster to profile (optional; profile can be minimal)
        platform: roster.platform,
        handle: roster.handle,
        url: roster.url,
        followerCount: roster.followerCount,
        engagementRate: roster.engagementRate,
        avatarUrl: (roster as any).avatarUrl ?? null,
      };

      const existing = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, userId));

      if (existing.length) {
        await ctx.db.update(profiles).set(baseProfile).where(eq(profiles.userId, userId));
      } else {
        await ctx.db.insert(profiles).values(baseProfile);
      }

      // 5) link the roster row to this auth user, and store contact email
      await ctx.db.update(influencers)
        .set({
          linkedUserId: userId,
          contactEmail: input.email,
          // NOTE: do NOT overwrite the roster KPIs here with user input — roster remains authoritative
        })
        .where(eq(influencers.id, roster.id));

      // 6) consume the invite
      await ctx.db.delete(influencerInvites).where(eq(influencerInvites.id, invite.id as any));

      return { ok: true };
    }),
});
