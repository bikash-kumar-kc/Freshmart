CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company_name` text DEFAULT 'FreshMart' NOT NULL,
	`department` text NOT NULL,
	`designation` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_name` text NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `category_category_name_unique` ON `category` (`category_name`);--> statement-breakpoint
CREATE TABLE `measurement_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `measurement_type_name_unique` ON `measurement_type` (`name`);--> statement-breakpoint
CREATE TABLE `packaging_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packaging_type_name_unique` ON `packaging_type` (`name`);--> statement-breakpoint
CREATE TABLE `product_listing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vendor_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`type` text NOT NULL,
	`local_name` text,
	`category_id` integer NOT NULL,
	`keywords` text,
	`description` text,
	`images` text DEFAULT '[]',
	`origin_country` text NOT NULL,
	`farm_name` text,
	`packaging_type_id` integer NOT NULL,
	`is_taxable` integer DEFAULT false NOT NULL,
	`is_accepted_by_admin` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp),
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `product_name`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`packaging_type_id`) REFERENCES `packaging_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `vendor_idx` ON `product_listing` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `product_idx` ON `product_listing` (`product_id`);--> statement-breakpoint
CREATE TABLE `product_listing_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_listing_id` integer NOT NULL,
	`size` integer NOT NULL,
	`measurement_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`price_per_unit` integer NOT NULL,
	`selling_price` integer,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`product_listing_id`) REFERENCES `product_listing`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`measurement_id`) REFERENCES `measurement_type`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `product_listing_idx` ON `product_listing_variants` (`product_listing_id`);--> statement-breakpoint
CREATE TABLE `product_name` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`is_verified` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_name_name_unique` ON `product_name` (`name`);--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`farm_name` text NOT NULL,
	`farm_origin_country` text NOT NULL,
	`farm_description` text,
	`farm_owner` text NOT NULL,
	`phone_number` text NOT NULL,
	`address_location` text NOT NULL,
	`vat_number` text,
	`pan_vat_certificate_url` text NOT NULL,
	`certificates` text DEFAULT '[]',
	`is_vendor_approved` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `role` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `vendor_id` text REFERENCES vendors(id);--> statement-breakpoint
ALTER TABLE `users` ADD `admin_id` text REFERENCES admins(id);--> statement-breakpoint
ALTER TABLE `users` ADD `is_email_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `users_vendor_idx` ON `users` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `users_admin_idx` ON `users` (`admin_id`);