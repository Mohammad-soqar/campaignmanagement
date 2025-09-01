ALTER TABLE "profiles" ADD COLUMN "platform" "platform";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "handle" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "follower_count" integer;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "engagement_rate" numeric(6, 3);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "avatar_url" text;