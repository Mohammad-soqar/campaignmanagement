import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { campaigns } from './campaigns';
import { influencers } from './influencers';

export const campaignInfluencers = pgTable(
  'campaign_influencers',
  {
    campaignId: uuid('campaign_id')
      .notNull()
      .references(() => campaigns.id, { onDelete: 'cascade' }),
    influencerId: uuid('influencer_id')
      .notNull()
      .references(() => influencers.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.campaignId, t.influencerId] }),
  }),
);

export const campaignInfluencersRelations = relations(campaignInfluencers, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignInfluencers.campaignId],
    references: [campaigns.id],
  }),
  influencer: one(influencers, {
    fields: [campaignInfluencers.influencerId],
    references: [influencers.id],
  }),
}));
