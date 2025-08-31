import { z } from 'zod';
import { desc, eq, and, ilike } from 'drizzle-orm';
import { router, protectedProcedure } from '../init';
import { campaigns } from '@/server/db/schema/campaigns';

const campaignInput = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    budget: z.coerce.number().min(0).default(0),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
});

export const campaignRouter = router({
    create: protectedProcedure
        .input(campaignInput)
        .mutation(async ({ ctx, input }) => {
            const [row] = await ctx.db
                .insert(campaigns)
                .values({
                    userId: ctx.userId,
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
        .input(z.object({ q: z.string().optional(), limit: z.number().min(1).max(100).default(20), offset: z.number().min(0).default(0) }).optional())
        .query(async ({ ctx, input }) => {
            const q = input?.q?.trim();
            const base = ctx.db
                .select()
                .from(campaigns)
                .where(eq(campaigns.userId, ctx.userId))
                .orderBy(desc(campaigns.createdAt))
                .limit(input?.limit ?? 20)
                .offset(input?.offset ?? 0);
            if (!q) return base;
            return ctx.db
                .select()
                .from(campaigns)
                .where(and(eq(campaigns.userId, ctx.userId), ilike(campaigns.title, `%${q}%`)))
                .orderBy(desc(campaigns.createdAt))
                .limit(input?.limit ?? 20)
                .offset(input?.offset ?? 0);
        }),

    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const [row] = await ctx.db
                .select()
                .from(campaigns)
                .where(and(eq(campaigns.id, input.id), eq(campaigns.userId, ctx.userId)));
            return row ?? null;
        }),

    update: protectedProcedure
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
                .where(and(eq(campaigns.id, id), eq(campaigns.userId, ctx.userId)))
                .returning();
            return row ?? null;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const [row] = await ctx.db
                .delete(campaigns)
                .where(and(eq(campaigns.id, input.id), eq(campaigns.userId, ctx.userId)))
                .returning();
            return row ?? null;
        }),
});
