import {
  pgTable, uuid, text, integer, numeric, timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { platformEnum } from "./_shared";
import { campaignInfluencers } from "./campaignInfluencers";
import { profiles } from "./profiles";

export const influencers = pgTable("influencers", {
  id: uuid("id").defaultRandom().primaryKey(),

  // manager who owns this roster entry
  ownerUserId: uuid("owner_user_id")
    .notNull()
    .references(() => profiles.userId, { onDelete: "cascade" }),

  // optional: link this roster row to an actual auth user (so "My Campaigns" works)
  linkedUserId: uuid("linked_user_id")
    .references(() => profiles.userId, { onDelete: "set null" }),

  contactEmail: text("contact_email"), // for invitations / linking

  platform: platformEnum("platform").notNull(),
  handle: text("handle").notNull(),
  url: text("url").notNull(),
  externalId: text("external_id"),
  followerCount: integer("follower_count").default(0).notNull(),
  engagementRate: numeric("engagement_rate", { precision: 6, scale: 3 }).$type<number | null>(),
  avatarUrl: text("avatar_url"),
  lastRefreshedAt: timestamp("last_refreshed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const influencersRelations = relations(influencers, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [influencers.ownerUserId],
    references: [profiles.userId],
  }),
  linkedProfile: one(profiles, {
    fields: [influencers.linkedUserId],
    references: [profiles.userId],
  }),
  assignments: many(campaignInfluencers),
}));
