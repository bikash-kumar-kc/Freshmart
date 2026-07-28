CREATE TABLE `quotation_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quotation_id` integer NOT NULL,
	`product_listing_variant_id` integer NOT NULL,
	`original_price_per_unit` integer NOT NULL,
	`admin_suggested_price_per_unit` integer NOT NULL,
	`vendor_counter_price_per_unit` integer,
	`quantity` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_listing_variant_id`) REFERENCES `product_listing_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vendor_id` text NOT NULL,
	`admin_id` text NOT NULL,
	`product_listing_id` integer NOT NULL,
	`is_vendor_updated` integer DEFAULT false NOT NULL,
	`is_approved_by_vendor` integer DEFAULT false NOT NULL,
	`is_approved_by_admin` integer DEFAULT false NOT NULL,
	`is_reapproved_by_admin` integer DEFAULT false NOT NULL,
	`is_delivered` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_listing_id`) REFERENCES `product_listing`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `quotations_vendor_idx` ON `quotations` (`vendor_id`);