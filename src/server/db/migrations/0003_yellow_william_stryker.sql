ALTER TABLE "influencers" ADD COLUMN "linked_user_id" uuid;--> statement-breakpoint
ALTER TABLE "influencers" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "full_name" text;--> statement-breakpoint
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_linked_user_id_profiles_user_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "public"."profiles"("user_id") ON DELETE set null ON UPDATE no action;