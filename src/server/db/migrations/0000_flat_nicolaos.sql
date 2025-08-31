CREATE TYPE "public"."platform" AS ENUM('youtube', 'instagram', 'tiktok', 'x');--> statement-breakpoint
CREATE TABLE "campaign_influencers" (
	"campaign_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	CONSTRAINT "campaign_influencers_campaign_id_influencer_id_pk" PRIMARY KEY("campaign_id","influencer_id")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"budget" numeric(12, 2) DEFAULT '0',
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "influencers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"handle" text NOT NULL,
	"url" text NOT NULL,
	"external_id" text,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"engagement_rate" numeric(6, 3),
	"avatar_url" text,
	"last_refreshed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaign_influencers" ADD CONSTRAINT "campaign_influencers_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_influencers" ADD CONSTRAINT "campaign_influencers_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;