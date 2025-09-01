import { z } from "zod";
import { router, protectedProcedure, requireManager } from "../init";
import { influencers } from "@/server/db/schema/influencers";
import { eq, and, desc } from "drizzle-orm";

const influencerInput = z.object({
  platform: z.enum(["youtube", "instagram", "tiktok", "x"]),
  handle: z.string().min(1),
  url: z.string().url(),
  followerCount: z.number().min(0).default(0),
  engagementRate: z.number().min(0).max(1).optional(),
  avatarUrl: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
});

export const influencerRouter = router({
  create: protectedProcedure
    .use(requireManager)
    .input(influencerInput)
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .insert(influencers)
        .values({
          ownerUserId: ctx.userId!,
          platform: input.platform,
          handle: input.handle,
          url: input.url,
          followerCount: input.followerCount ?? 0,
          engagementRate: input.engagementRate ?? null,
          avatarUrl: input.avatarUrl ?? null,
          contactEmail:
            "contactEmail" in input
              ? (input as { contactEmail?: string | null }).contactEmail ?? null
              : null,
        })
        .returning();

      return row;
    }),
  listMine: protectedProcedure
    .use(requireManager)
    .query(async ({ ctx }) => {
      return ctx.db
        .select()
        .from(influencers)
        .where(eq(influencers.ownerUserId, ctx.userId!))
        .orderBy(desc(influencers.createdAt));
    }),

  listAll: protectedProcedure
    .use(requireManager)
    .query(async ({ ctx }) => {
      return ctx.db
        .select()
        .from(influencers)
        .orderBy(desc(influencers.createdAt));
    }),

  getById: protectedProcedure
    .use(requireManager)
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select()
        .from(influencers)
        .where(and(eq(influencers.id, input.id), eq(influencers.ownerUserId, ctx.userId!)));
      return row ?? null;
    }),

  update: protectedProcedure
    .use(requireManager)
    .input(influencerInput.extend({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;

      const [row] = await ctx.db
        .update(influencers)
        .set({
          platform: rest.platform,
          handle: rest.handle,
          url: rest.url,
          followerCount: rest.followerCount ?? 0,
          engagementRate: rest.engagementRate ?? null,
          avatarUrl: rest.avatarUrl ?? null,
          contactEmail: "contactEmail" in rest ? (rest as { contactEmail?: string | null }).contactEmail ?? null : null,
        })
        .where(and(eq(influencers.id, id), eq(influencers.ownerUserId, ctx.userId!)))
        .returning();


      return row ?? null;
    }),

  delete: protectedProcedure
    .use(requireManager)
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .delete(influencers)
        .where(and(eq(influencers.id, input.id), eq(influencers.ownerUserId, ctx.userId!)))
        .returning();
      return row ?? null;
    }),
});
