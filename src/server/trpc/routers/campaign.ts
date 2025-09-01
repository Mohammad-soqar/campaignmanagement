import { z } from 'zod';
import { desc, eq, and, ilike, or } from 'drizzle-orm';
import { router, protectedProcedure, requireManager } from '../init';
import { campaigns } from '@/server/db/schema/campaigns';
import { campaignInfluencers } from '@/server/db/schema/campaignInfluencers';
import { influencers } from '@/server/db/schema/influencers';

const campaignInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  budget: z.coerce.number().min(0).default(0),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export const campaignRouter = router({
  // === MANAGER CRUD ===
  create: protectedProcedure
    .use(requireManager)
    .input(campaignInput)
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .insert(campaigns)
        .values({
        userId: ctx.userId!,
          title: input.title,
          description: input.description ?? null,
          budget: input.budget.toString(),
          startDate: input.startDate,
          endDate: input.endDate,
        })
        .returning();
      return row;
    }),

  listMine: protectedProcedure
    .use(requireManager)
    .input(z.object({
      q: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const q = input?.q?.trim();
      const base = ctx.db
        .select()
        .from(campaigns)
        .where(eq(campaigns.userId, ctx.userId!))
        .orderBy(desc(campaigns.createdAt))
        .limit(input?.limit ?? 20)
        .offset(input?.offset ?? 0);

      if (!q) return base;

      return ctx.db
        .select()
        .from(campaigns)
        .where(
          and(
            eq(campaigns.userId, ctx.userId!),
            ilike(campaigns.title, `%${q}%`)
          )
        )
        .orderBy(desc(campaigns.createdAt))
        .limit(input?.limit ?? 20)
        .offset(input?.offset ?? 0);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Managers: only their own campaigns
      if (ctx.role === 'manager') {
        const [row] = await ctx.db
          .select()
          .from(campaigns)
          .where(and(eq(campaigns.id, input.id), eq(campaigns.userId, ctx.userId!)));
        return row ?? null;
      }

      // Influencers: campaigns they are assigned to.
      // Prefer influencers.linkedUserId when present; otherwise fall back to ownerUserId (compat).
      const rows = await ctx.db
        .select({ campaign: campaigns })
        .from(campaignInfluencers)
        .leftJoin(campaigns, eq(campaignInfluencers.campaignId, campaigns.id))
        .leftJoin(influencers, eq(campaignInfluencers.influencerId, influencers.id))
        .where(
          and(
            eq(campaignInfluencers.campaignId, input.id),
            or(
              // if your schema has linkedUserId, this will match; otherwise it just won't filter anything on that col
              eq((influencers as any).linkedUserId ?? influencers.ownerUserId, ctx.userId!),
              eq(influencers.ownerUserId, ctx.userId!)
            )
          )
        );

      return rows[0]?.campaign ?? null;
    }),

  update: protectedProcedure
    .use(requireManager)
    .input(campaignInput.extend({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const [row] = await ctx.db
        .update(campaigns)
        .set({
          title: rest.title,
          description: rest.description ?? null,
          budget: rest.budget.toString(),
          startDate: rest.startDate,
          endDate: rest.endDate,
        })
        .where(and(eq(campaigns.id, id), eq(campaigns.userId, ctx.userId!)))
        .returning();
      return row ?? null;
    }),

  delete: protectedProcedure
    .use(requireManager)
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .delete(campaigns)
        .where(
          and(
            eq(campaigns.id, input.id),
            eq(campaigns.userId, ctx.userId!)
          )
        )
        .returning();
      return row ?? null;
    }),

  // === Influencer dashboard — campaigns assigned to me ===
  listAssignedToMe: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.role !== 'influencer') return []; // managers won't see anything here

      const rows = await ctx.db
        .select({ campaign: campaigns })
        .from(campaignInfluencers)
        .leftJoin(campaigns, eq(campaignInfluencers.campaignId, campaigns.id))
        .leftJoin(influencers, eq(campaignInfluencers.influencerId, influencers.id))
        .where(
          or(
            // prefer linkedUserId if you add it to schema
            eq((influencers as any).linkedUserId ?? influencers.ownerUserId, ctx.userId!),
            eq(influencers.ownerUserId, ctx.userId!)
          )
        )
        .orderBy(desc(campaigns.createdAt));

      return rows.map(r => r.campaign).filter(Boolean);
    }),
});
