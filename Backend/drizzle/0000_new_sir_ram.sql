CREATE TABLE "ip_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip" "inet" NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'success' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "ip_rules_ip_unique" UNIQUE("ip")
);
--> statement-breakpoint
CREATE TABLE "port_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"port" numeric NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'success' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "port_rules_port_unique" UNIQUE("port")
);
--> statement-breakpoint
CREATE TABLE "url_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'success' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "url_rules_url_unique" UNIQUE("url")
);
