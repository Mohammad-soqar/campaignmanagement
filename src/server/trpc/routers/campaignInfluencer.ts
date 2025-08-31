import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { router, protectedProcedure } from '../init';
import { campaignInfluencers } from '@/server/db/schema/campaignInfluencers';
import { campaigns } from '@/server/db/schema/campaigns';
import { influencers } from '@/server/db/schema/influencers';

export const campaignInfluencerRouter = router({
    addToCampaign: protectedProcedure
        .input(z.object({ campaignId: z.string().uuid(), influencerId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const [owned] = await ctx.db.select().from(campaigns).where(and(eq(campaigns.id, input.campaignId), eq(campaigns.userId, ctx.userId)));
            if (!owned) throw new Error('Not your campaign');
            const [row] = await ctx.db.insert(campaignInfluencers).values({ campaignId: input.campaignId, influencerId: input.influencerId }).onConflictDoNothing().returning();
            return row ?? { campaignId: input.campaignId, influencerId: input.influencerId };
        }),

    removeFromCampaign: protectedProcedure
        .input(z.object({ campaignId: z.string().uuid(), influencerId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const [owned] = await ctx.db.select().from(campaigns).where(and(eq(campaigns.id, input.campaignId), eq(campaigns.userId, ctx.userId)));
            if (!owned) throw new Error('Not your campaign');
            const [row] = await ctx.db.delete(campaignInfluencers).where(and(eq(campaignInfluencers.campaignId, input.campaignId), eq(campaignInfluencers.influencerId, input.influencerId))).returning();
            return row ?? null;
        }),

    listForCampaign: protectedProcedure
        .input(z.object({ campaignId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const [owned] = await ctx.db.select().from(campaigns).where(and(eq(campaigns.id, input.campaignId), eq(campaigns.userId, ctx.userId)));
            if (!owned) return [];
            const rows = await ctx.db
                .select({ campaignId: campaignInfluencers.campaignId, influencer: influencers })
                .from(campaignInfluencers)
                .leftJoin(influencers, eq(campaignInfluencers.influencerId, influencers.id))
                .where(eq(campaignInfluencers.campaignId, input.campaignId));
            return rows;
        }),
});
