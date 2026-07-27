ALTER TABLE `order_items` ADD `vendor_id` text REFERENCES vendors(id);--> statement-breakpoint
ALTER TABLE `order_items` ADD `product_listing_id` integer REFERENCES product_listing(id);--> statement-breakpoint
ALTER TABLE `products` ADD `vendor_id` text REFERENCES vendors(id);--> statement-breakpoint
ALTER TABLE `products` ADD `product_listing_id` integer REFERENCES product_listing(id);--> statement-breakpoint
ALTER TABLE `vendors` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` ADD `is_email_verified` integer DEFAULT false NOT NULL;