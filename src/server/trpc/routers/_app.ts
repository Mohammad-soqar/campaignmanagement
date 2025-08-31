import { router } from '../init';
import { campaignRouter } from './campaign';
import { influencerRouter } from './influencer';
import { campaignInfluencerRouter } from './campaignInfluencer';

export const appRouter = router({
  campaign: campaignRouter,
  influencer: influencerRouter,
  campaignInfluencer: campaignInfluencerRouter,
});

export type AppRouter = typeof appRouter;
