import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { router, protectedProcedure } from '../init';
import { influencers } from '@/server/db/schema/influencers';

const baseFields = z.object({
    platform: z.enum(['youtube', 'instagram', 'tiktok', 'x']),
    handle: z.string().min(1),
    url: z.string().url(),
    externalId: z.string().optional(),
    followerCount: z.number().int().min(0).default(0),
    engagementRate: z.number().min(0).max(1).optional(),
    avatarUrl: z.string().url().optional(),
});

export const influencerRouter = router({
    create: protectedProcedure
        .input(baseFields)
        .mutation(async ({ ctx, input }) => {
            const [row] = await ctx.db
                .insert(influencers)
                .values({
                    ownerUserId: ctx.userId,
                    platform: input.platform,
                    handle: input.handle,
                    url: input.url,
                    externalId: input.externalId ?? null,
                    followerCount: input.followerCount,
                    engagementRate: input.engagementRate?.toString() ?? null,
                    avatarUrl: input.avatarUrl ?? null,
                })
                .returning();
            return row;
        }),

    list: protectedProcedure
        .input(z.object({ platform: z.enum(['youtube', 'instagram', 'tiktok', 'x']).optional(), limit: z.number().min(1).max(100).default(20), offset: z.number().min(0).default(0) }).optional())
        .query(async ({ ctx, input }) => {
            const conditions = [eq(influencers.ownerUserId, ctx.userId)];
            if (input?.platform) conditions.push(eq(influencers.platform, input.platform));
            const rows = await ctx.db
                .select()
                .from(influencers)
                .where(and(...conditions))
                .orderBy(desc(influencers.createdAt))
                .limit(input?.limit ?? 20)
                .offset(input?.offset ?? 0);
            return rows;
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const [row] = await ctx.db
                .select()
                .from(influencers)
                .where(and(eq(influencers.id, input.id), eq(influencers.ownerUserId, ctx.userId)));
            return row ?? null;
        }),

    update: protectedProcedure
        .input(baseFields.extend({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id, ...rest } = input;
            const [row] = await ctx.db
                .update(influencers)
                .set({
                    platform: rest.platform,
                    handle: rest.handle,
                    url: rest.url,
                    externalId: rest.externalId ?? null,
                    followerCount: rest.followerCount,
                    engagementRate: rest.engagementRate?.toString() ?? null,
                    avatarUrl: rest.avatarUrl ?? null,
                })
                .where(and(eq(influencers.id, id), eq(influencers.ownerUserId, ctx.userId)))
                .returning();
            return row ?? null;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const [row] = await ctx.db
                .delete(influencers)
                .where(and(eq(influencers.id, input.id), eq(influencers.ownerUserId, ctx.userId)))
                .returning();
            return row ?? null;
        }),

    addFromUrl: protectedProcedure
        .input(z.object({ url: z.string().url() }))
        .mutation(async ({ ctx, input }) => {
            const [row] = await ctx.db.insert(influencers).values({
                ownerUserId: ctx.userId,
                platform: 'youtube',
                handle: input.url,
                url: input.url,
            }).returning();
            return row;
        }),

    refresh: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async () => {
            return { ok: true };
        }),

    importCsv: protectedProcedure
        .input(z.object({ fileId: z.string() }))
        .mutation(async () => {
            return { status: 'queued' as const };
        }),
});
