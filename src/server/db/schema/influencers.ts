// src/server/db/schema/influencers.ts
import {
  pgTable, uuid, text, integer, numeric, timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { platformEnum } from './_shared';
import { campaignInfluencers } from './campaignInfluencers';

export const influencers = pgTable('influencers', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerUserId: uuid('owner_user_id').notNull(), 
  platform: platformEnum('platform').notNull(),
  handle: text('handle').notNull(),           
  url: text('url').notNull(),                 
  externalId: text('external_id'),           
  followerCount: integer('follower_count').default(0).notNull(),
  engagementRate: numeric('engagement_rate', { precision: 6, scale: 3 }), 
  avatarUrl: text('avatar_url'),
  lastRefreshedAt: timestamp('last_refreshed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const influencersRelations = relations(influencers, ({ many }) => ({
  assignments: many(campaignInfluencers),
}));

