CREATE TABLE "influencer_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"influencer_id" uuid NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "influencer_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "influencer_invites" ADD CONSTRAINT "influencer_invites_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;