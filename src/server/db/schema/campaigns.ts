import {
  pgTable, uuid, text, numeric, date, timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { campaignInfluencers } from "./campaignInfluencers";
import { profiles } from "./profiles";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.userId, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  budget: numeric("budget", { precision: 12, scale: 2 }).default("0"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [campaigns.userId],
    references: [profiles.userId],
  }),
  assignments: many(campaignInfluencers),
}));
