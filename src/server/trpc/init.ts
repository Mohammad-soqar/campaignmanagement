import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx } });
});

export const requireManager = t.middleware(({ ctx, next }) => {
  if (ctx.role !== 'manager') throw new TRPCError({ code: 'Access Denied', message: 'Manager role required' });
  return next();
});

export const requireApprovedInfluencer = t.middleware(({ ctx, next }) => {
  if (ctx.role !== 'influencer') throw new TRPCError({ code: 'Access Denied', message: 'Influencer role required' });
  if (ctx.status !== 'approved') throw new TRPCError({ code: 'Access Denied', message: 'Influencer not approved yet' });
  return next();
});
