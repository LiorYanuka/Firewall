ALTER TABLE "ip_rules" DROP CONSTRAINT "ip_rules_ip_mode_unique";--> statement-breakpoint
ALTER TABLE "port_rules" DROP CONSTRAINT "port_rules_port_mode_unique";--> statement-breakpoint
ALTER TABLE "url_rules" DROP CONSTRAINT "url_rules_url_mode_unique";--> statement-breakpoint
ALTER TABLE "ip_rules" ADD CONSTRAINT "ip_rules_ip_unique" UNIQUE("ip");--> statement-breakpoint
ALTER TABLE "port_rules" ADD CONSTRAINT "port_rules_port_unique" UNIQUE("port");--> statement-breakpoint
ALTER TABLE "url_rules" ADD CONSTRAINT "url_rules_url_unique" UNIQUE("url");