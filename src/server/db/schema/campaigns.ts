import {
  pgTable, uuid, text, numeric, date, timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { campaignInfluencers } from './campaignInfluencers';



export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(), 
  title: text('title').notNull(),
  description: text('description'),
  budget: numeric('budget', { precision: 12, scale: 2 }).default('0'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  assignments: many(campaignInfluencers),
}));

