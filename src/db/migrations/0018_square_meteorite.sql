PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`weight_value` integer NOT NULL,
	`weight_unit` text NOT NULL,
	`slug` text NOT NULL,
	`vendor_id` text,
	`product_listing_id` integer,
	`is_rejected_by_admin` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_listing_id`) REFERENCES `product_listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_order_items`("id", "order_id", "product_id", "quantity", "weight_value", "weight_unit", "slug", "vendor_id", "product_listing_id", "is_rejected_by_admin") SELECT "id", "order_id", "product_id", "quantity", "weight_value", "weight_unit", "slug", "vendor_id", "product_listing_id", "is_rejected_by_admin" FROM `order_items`;--> statement-breakpoint
DROP TABLE `order_items`;--> statement-breakpoint
ALTER TABLE `__new_order_items` RENAME TO `order_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_items_product_idx` ON `order_items` (`product_id`);