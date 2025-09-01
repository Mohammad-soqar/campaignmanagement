import { z } from 'zod';
import { router, protectedProcedure, requireManager } from '../init';
import { TRPCError } from '@trpc/server';
import { profiles } from '@/server/db/schema/profiles';
import { influencers } from '@/server/db/schema/influencers';
import { influencerInvites } from '@/server/db/schema/inviteTokens';
import { and, eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export const adminRouter = router({

  createOnboardingInvite: protectedProcedure
    .use(requireManager)
    .input(z.object({
      influencerId: z.string().uuid(),
      email: z.string().email(),
      expiresInHours: z.number().min(1).max(168).default(48),
    }))
    .mutation(async ({ ctx, input }) => {
      const [inf] = await ctx.db.select().from(influencers).where(eq(influencers.id, input.influencerId));
      if (!inf) throw new TRPCError({ code: 'NOT_FOUND', message: 'Influencer not found' });
      if (inf.ownerUserId !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not your influencer' });


      const token = randomBytes(24).toString('hex');
      const expiresAt = new Date(Date.now() + input.expiresInHours * 60 * 60 * 1000);

      await ctx.db.insert(influencerInvites).values({
        token,
        influencerId: input.influencerId,
        email: input.email,
        expiresAt,
      });

      await ctx.db.update(influencers).set({ contactEmail: input.email }).where(eq(influencers.id, input.influencerId));

      return { ok: true, url: `${appUrl()}/onboarding?token=${token}`, expiresAt };
    }),


  listPendingInfluencers: protectedProcedure
    .use(requireManager)
    .query(async ({ ctx }) => {
      const rows = await ctx.db
        .select()
        .from(profiles)
        .where(and(eq(profiles.role, 'influencer'), eq(profiles.status, 'pending')));
      return rows;
    }),


  approveInfluencer: protectedProcedure
    .use(requireManager)
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [p] = await ctx.db.select().from(profiles).where(eq(profiles.userId, input.userId));
      if (!p) throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
      if (p.role !== 'influencer') throw new TRPCError({ code: 'BAD_REQUEST', message: 'User is not an influencer' });

      await ctx.db.update(profiles).set({ status: 'approved' }).where(eq(profiles.userId, input.userId));
      return { ok: true };
    }),


  linkRosterToUser: protectedProcedure
    .use(requireManager)
    .input(z.object({
      influencerId: z.string().uuid(),
      userId: z.string().uuid(),
      contactEmail: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db.select().from(influencers).where(eq(influencers.id, input.influencerId));
      if (!row) throw new TRPCError({ code: 'NOT_FOUND', message: 'Roster row not found' });
      if (row.ownerUserId !== ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not your influencer' });

      await ctx.db.update(influencers).set({
        linkedUserId: input.userId,
        contactEmail: input.contactEmail ?? row.contactEmail ?? null,
      }).where(eq(influencers.id, input.influencerId));

      return { ok: true };
    }),
});
