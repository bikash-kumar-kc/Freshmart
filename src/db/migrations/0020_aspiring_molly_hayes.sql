PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_quotation_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quotation_id` integer NOT NULL,
	`product_listing_variant_id` integer NOT NULL,
	`original_price_per_unit` integer NOT NULL,
	`admin_suggested_price_per_unit` integer NOT NULL,
	`vendor_counter_price_per_unit` integer,
	`quantity` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`quotation_id`) REFERENCES `quotations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_listing_variant_id`) REFERENCES `product_listing_variants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_quotation_variants`("id", "quotation_id", "product_listing_variant_id", "original_price_per_unit", "admin_suggested_price_per_unit", "vendor_counter_price_per_unit", "quantity", "created_at") SELECT "id", "quotation_id", "product_listing_variant_id", "original_price_per_unit", "admin_suggested_price_per_unit", "vendor_counter_price_per_unit", "quantity", "created_at" FROM `quotation_variants`;--> statement-breakpoint
DROP TABLE `quotation_variants`;--> statement-breakpoint
ALTER TABLE `__new_quotation_variants` RENAME TO `quotation_variants`;--> statement-breakpoint
PRAGMA foreign_keys=ON;