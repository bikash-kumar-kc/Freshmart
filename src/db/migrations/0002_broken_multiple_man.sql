CREATE TABLE `job_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`job_name` text NOT NULL,
	`status` text NOT NULL,
	`summary` text,
	`steps` integer,
	`started_at` text NOT NULL,
	`completed_at` text,
	`error` text
);
--> statement-breakpoint
DROP INDEX "freq_product_user_idx";--> statement-breakpoint
DROP INDEX "freq_products_next_expected_idx";--> statement-breakpoint
DROP INDEX "order_history_user_idx";--> statement-breakpoint
DROP INDEX "order_history_placed_at_idx";--> statement-breakpoint
DROP INDEX "order_insights_user_product_idx";--> statement-breakpoint
DROP INDEX "suggested_carts_user_idx";--> statement-breakpoint
DROP INDEX "suggested_carts_status_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `freqproducts` ALTER COLUMN "notification_sent_at" TO "notification_sent_at" text;--> statement-breakpoint
CREATE INDEX `freq_product_user_idx` ON `freqproducts` (`user_id`);--> statement-breakpoint
CREATE INDEX `freq_products_next_expected_idx` ON `freqproducts` (`next_expected_at`);--> statement-breakpoint
CREATE INDEX `order_history_user_idx` ON `order_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `order_history_placed_at_idx` ON `order_history` (`placed_at`);--> statement-breakpoint
CREATE INDEX `order_insights_user_product_idx` ON `order_insights` (`user_id`,`product_id`);--> statement-breakpoint
CREATE INDEX `suggested_carts_user_idx` ON `suggested_carts` (`user_id`);--> statement-breakpoint
CREATE INDEX `suggested_carts_status_idx` ON `suggested_carts` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "name" TO "name" text;