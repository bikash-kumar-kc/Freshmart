PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
	FOREIGN KEY (`product_listing_id`) REFERENCES `product_listing`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_quotations`("id", "vendor_id", "admin_id", "product_listing_id", "is_vendor_updated", "is_approved_by_vendor", "is_approved_by_admin", "is_reapproved_by_admin", "is_delivered", "is_lived", "created_at", "updated_at") SELECT "id", "vendor_id", "admin_id", "product_listing_id", "is_vendor_updated", "is_approved_by_vendor", "is_approved_by_admin", "is_reapproved_by_admin", "is_delivered", "is_lived", "created_at", "updated_at" FROM `quotations`;--> statement-breakpoint
DROP TABLE `quotations`;--> statement-breakpoint
ALTER TABLE `__new_quotations` RENAME TO `quotations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `quotations_vendor_idx` ON `quotations` (`vendor_id`);