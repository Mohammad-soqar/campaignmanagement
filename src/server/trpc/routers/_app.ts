import { router } from '../init';
import { campaignRouter } from './campaign';
import { influencerRouter } from './influencer';
import { campaignInfluencerRouter } from './campaignInfluencer';
import { authRouter } from './auth';
import { adminRouter } from './admin';
import { onboardingRouter } from './onboarding';

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  onboarding: onboardingRouter,
  campaign: campaignRouter,
  influencer: influencerRouter,
  campaignInfluencer: campaignInfluencerRouter,

});

export type AppRouter = typeof appRouter;
