// src/server/db/schema/profiles.ts
import { pgTable, uuid, text, timestamp, integer, numeric } from 'drizzle-orm/pg-core';
import { platformEnum } from './_shared';

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  role: text('role', { enum: ['manager', 'influencer'] }).notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
  fullName: text('full_name'),

  platform: platformEnum('platform'),
  handle: text('handle'),
  url: text('url'),
  followerCount: integer('follower_count'),

  // ⬇️ make the TS type number|null instead of string|null
  engagementRate: numeric('engagement_rate', { precision: 6, scale: 3 }).$type<number | null>(),

  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
