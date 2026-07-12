CREATE TABLE "area" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"hook" text,
	"short_description" text,
	"code" varchar(20),
	"keywords" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "area_slug_unique" UNIQUE("slug"),
	CONSTRAINT "area_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "professional" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"photo_url" text,
	"bio" text,
	"phone" varchar(50),
	"email" varchar(255),
	"website_url" text,
	"social_links" jsonb,
	"is_founder" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "professional_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "professional_area" (
	"professional_id" integer NOT NULL,
	"area_id" integer NOT NULL,
	CONSTRAINT "professional_area_professional_id_area_id_pk" PRIMARY KEY("professional_id","area_id")
);
--> statement-breakpoint
ALTER TABLE "area" ADD CONSTRAINT "area_parent_id_area_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."area"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_area" ADD CONSTRAINT "professional_area_professional_id_professional_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."professional"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_area" ADD CONSTRAINT "professional_area_area_id_area_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."area"("id") ON DELETE no action ON UPDATE no action;