 CREATE TABLE IF NOT EXISTS "ip_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip" "inet" NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'success' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "ip_rules_ip_mode_unique" UNIQUE("ip","mode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "port_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"port" numeric NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'success' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "port_rules_port_mode_unique" UNIQUE("port","mode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "url_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'success' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "url_rules_url_mode_unique" UNIQUE("url","mode")
);
