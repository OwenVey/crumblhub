CREATE TABLE IF NOT EXISTS "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"address" text NOT NULL,
	"state" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"latitude" text NOT NULL,
	"longitude" text NOT NULL,
	"started" date NOT NULL,
	"hours" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
