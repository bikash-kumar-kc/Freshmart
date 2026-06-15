CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`is_shown` integer DEFAULT false NOT NULL,
	`is_delete` integer DEFAULT false NOT NULL,
	`is_marked` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`weight_value` real NOT NULL,
	`weight_unit` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `product_variants_product_idx` ON `product_variants` (`product_id`);--> statement-breakpoint
ALTER TABLE `products` ADD `slug` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `keywords` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `thumbnail` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `images` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `icon` text;--> statement-breakpoint
ALTER TABLE `products` ADD `is_most_popular` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `is_featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `is_offered` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `discount` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `offer_start_date` text;--> statement-breakpoint
ALTER TABLE `products` ADD `offer_end_date` text;--> statement-breakpoint
ALTER TABLE `products` ADD `origin_country` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `farm_name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `freshness_tags` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `featured_banner` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `products_status_idx` ON `products` (`status`);--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `price`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `stock_qty`;