DO $$ BEGIN
 CREATE TYPE "public"."serving_method" AS ENUM('Warm', 'Chilled', 'Bakery Temp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cookies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_without_partner" text,
	"featured_partner" text,
	"description" text,
	"calories" integer,
	"allergies" text,
	"average_rating" decimal NOT NULL,
	"total_reviews" integer NOT NULL,
	"total_votes" integer NOT NULL,
	"featured_partner_logo" text,
	"aerial_image" text NOT NULL,
	"mini_aerial_image" text,
	"nutrition_label_image" text,
	"mini_nutrition_label_image" text,
	"serving_method" "serving_method",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "week_cookies" (
	"id" serial PRIMARY KEY NOT NULL,
	"week_id" integer NOT NULL,
	"cookie_id" text,
	"name" text NOT NULL,
	"is_new" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "week_cookies_week_id_cookie_id_name_unique" UNIQUE NULLS NOT DISTINCT("week_id","cookie_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weeks" (
	"id" serial PRIMARY KEY NOT NULL,
	"start" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "weeks_start_unique" UNIQUE("start")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "week_cookies" ADD CONSTRAINT "week_cookies_week_id_weeks_id_fk" FOREIGN KEY ("week_id") REFERENCES "public"."weeks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "week_cookies" ADD CONSTRAINT "week_cookies_cookie_id_cookies_id_fk" FOREIGN KEY ("cookie_id") REFERENCES "public"."cookies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
