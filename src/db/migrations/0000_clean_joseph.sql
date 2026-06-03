CREATE TABLE `freqproducts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`last_bought_at` text NOT NULL,
	`next_expected_at` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `freq_product_user_idx` ON `freqproducts` (`user_id`);--> statement-breakpoint
CREATE INDEX `freq_products_next_expected_idx` ON `freqproducts` (`next_expected_at`);--> statement-breakpoint
CREATE TABLE `order_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`items` text NOT NULL,
	`total` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`stripe_payment_id` text,
	`placed_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `order_history_user_idx` ON `order_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `order_history_placed_at_idx` ON `order_history` (`placed_at`);--> statement-breakpoint
CREATE TABLE `order_insights` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`avg_interval_days` real,
	`buy_count` integer DEFAULT 0 NOT NULL,
	`avg_quantity` real DEFAULT 1 NOT NULL,
	`last_computed_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `order_insights_user_product_idx` ON `order_insights` (`user_id`,`product_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`price` real NOT NULL,
	`stock_qty` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `suggested_carts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`items` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `suggested_carts_user_idx` ON `suggested_carts` (`user_id`);--> statement-breakpoint
CREATE INDEX `suggested_carts_status_idx` ON `suggested_carts` (`status`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`push_subscription` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);