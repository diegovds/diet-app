CREATE TYPE "public"."activity_level" AS ENUM('sedentario', '2x_semana', '4x_semana');--> statement-breakpoint
CREATE TYPE "public"."genre" AS ENUM('masculino', 'feminino', 'outro');--> statement-breakpoint
CREATE TYPE "public"."goal" AS ENUM('perda_de_peso', 'hipertrofia', 'manter_massa_muscular');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "weight" numeric;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "height" numeric;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "activity_level" "activity_level";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "genre" "genre";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "goal" "goal";