CREATE TYPE "public"."activity_level" AS ENUM('sedentario', '2x_semana', '4x_semana');--> statement-breakpoint
CREATE TYPE "public"."genre" AS ENUM('masculino', 'feminino', 'outro');--> statement-breakpoint
CREATE TYPE "public"."goal" AS ENUM('perda_de_peso', 'hipertrofia', 'manter_massa_muscular');--> statement-breakpoint
CREATE TABLE "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"weight" numeric,
	"height" numeric,
	"age" integer,
	"activity_level" "activity_level",
	"genre" "genre",
	"goal" "goal",
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meal_plans_user_id_unique" ON "plans" USING btree ("user_id");