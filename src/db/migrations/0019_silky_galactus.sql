PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text,
	`type` text,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` integer,
	`product_name_id` integer,
	`category` text NOT NULL,
	`packaging_type_id` integer,
	`local_name` text,
	`keywords` text DEFAULT '' NOT NULL,
	`description` text NOT NULL,
	`thumbnail` text NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`icon` text,
	`is_most_popular` integer DEFAULT false NOT NULL,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_offered` integer DEFAULT false NOT NULL,
	`discount` real DEFAULT 0,
	`offer_start_date` text,
	`offer_end_date` text,
	`origin_country` text NOT NULL,
	`farm_name` text NOT NULL,
	`freshness_tags` text DEFAULT '[]' NOT NULL,
	`featured_banner` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`expire_at` text NOT NULL,
	`popularity_score` real DEFAULT 0 NOT NULL,
	`product_listing_id` integer,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_name_id`) REFERENCES `product_name`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`packaging_type_id`) REFERENCES `packaging_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_listing_id`) REFERENCES `product_listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "vendor_id", "type", "name", "slug", "category_id", "product_name_id", "category", "packaging_type_id", "local_name", "keywords", "description", "thumbnail", "images", "icon", "is_most_popular", "is_featured", "is_offered", "discount", "offer_start_date", "offer_end_date", "origin_country", "farm_name", "freshness_tags", "featured_banner", "status", "expire_at", "popularity_score", "product_listing_id", "created_at", "updated_at") SELECT "id", "vendor_id", "type", "name", "slug", "category_id", "product_name_id", "category", "packaging_type_id", "local_name", "keywords", "description", "thumbnail", "images", "icon", "is_most_popular", "is_featured", "is_offered", "discount", "offer_start_date", "offer_end_date", "origin_country", "farm_name", "freshness_tags", "featured_banner", "status", "expire_at", "popularity_score", "product_listing_id", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `products_status_idx` ON `products` (`status`);--> statement-breakpoint
CREATE TABLE `__new_quotations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vendor_id` text NOT NULL,
	`admin_id` text NOT NULL,
	`product_listing_id` integer NOT NULL,
	`is_vendor_updated` integer DEFAULT false NOT NULL,
	`is_approved_by_vendor` integer DEFAULT false NOT NULL,
	`is_approved_by_admin` integer DEFAULT false NOT NULL,
	`is_reapproved_by_admin` integer DEFAULT false NOT NULL,
	`is_delivered` integer DEFAULT false NOT NULL,
	`is_lived` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_listing_id`) REFERENCES `product_listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_quotations`("id", "vendor_id", "admin_id", "product_listing_id", "is_vendor_updated", "is_approved_by_vendor", "is_approved_by_admin", "is_reapproved_by_admin", "is_delivered", "is_lived", "created_at", "updated_at") SELECT "id", "vendor_id", "admin_id", "product_listing_id", "is_vendor_updated", "is_approved_by_vendor", "is_approved_by_admin", "is_reapproved_by_admin", "is_delivered", "is_lived", "created_at", "updated_at" FROM `quotations`;--> statement-breakpoint
DROP TABLE `quotations`;--> statement-breakpoint
ALTER TABLE `__new_quotations` RENAME TO `quotations`;--> statement-breakpoint
CREATE INDEX `quotations_vendor_idx` ON `quotations` (`vendor_id`);