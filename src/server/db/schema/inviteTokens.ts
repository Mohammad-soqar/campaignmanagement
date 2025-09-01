// src/server/db/schema/inviteTokens.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { campaigns } from './campaigns';
import { influencers } from './influencers';

export const influencerInvites = pgTable('influencer_invites', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: text('token').notNull().unique(),              // random string
  influencerId: uuid('influencer_id').notNull().references(() => influencers.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
