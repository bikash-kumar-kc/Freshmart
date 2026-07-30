DROP INDEX "category_category_name_unique";--> statement-breakpoint
DROP INDEX "freq_product_user_idx";--> statement-breakpoint
DROP INDEX "freq_products_next_expected_idx";--> statement-breakpoint
DROP INDEX "measurement_type_name_unique";--> statement-breakpoint
DROP INDEX "notifications_vendor_idx";--> statement-breakpoint
DROP INDEX "notifications_type_idx";--> statement-breakpoint
DROP INDEX "order_history_user_idx";--> statement-breakpoint
DROP INDEX "order_history_placed_at_idx";--> statement-breakpoint
DROP INDEX "order_insights_user_product_idx";--> statement-breakpoint
DROP INDEX "order_items_order_idx";--> statement-breakpoint
DROP INDEX "order_items_product_idx";--> statement-breakpoint
DROP INDEX "orders_user_idx";--> statement-breakpoint
DROP INDEX "orders_order_idx";--> statement-breakpoint
DROP INDEX "packaging_type_name_unique";--> statement-breakpoint
DROP INDEX "vendor_idx";--> statement-breakpoint
DROP INDEX "product_idx";--> statement-breakpoint
DROP INDEX "product_listing_idx";--> statement-breakpoint
DROP INDEX "product_name_name_unique";--> statement-breakpoint
DROP INDEX "product_variants_product_idx";--> statement-breakpoint
DROP INDEX "products_slug_unique";--> statement-breakpoint
DROP INDEX "products_slug_idx";--> statement-breakpoint
DROP INDEX "products_category_idx";--> statement-breakpoint
DROP INDEX "products_status_idx";--> statement-breakpoint
DROP INDEX "quotations_vendor_idx";--> statement-breakpoint
DROP INDEX "suggested_carts_user_idx";--> statement-breakpoint
DROP INDEX "suggested_carts_status_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "users_vendor_idx";--> statement-breakpoint
DROP INDEX "users_admin_idx";--> statement-breakpoint
ALTER TABLE `orders` ALTER COLUMN "type" TO "type" text NOT NULL DEFAULT 'inventory';--> statement-breakpoint
CREATE UNIQUE INDEX `category_category_name_unique` ON `category` (`category_name`);--> statement-breakpoint
CREATE INDEX `freq_product_user_idx` ON `freqproducts` (`user_id`);--> statement-breakpoint
CREATE INDEX `freq_products_next_expected_idx` ON `freqproducts` (`next_expected_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `measurement_type_name_unique` ON `measurement_type` (`name`);--> statement-breakpoint
CREATE INDEX `notifications_vendor_idx` ON `notifications_vendor_admin` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `notifications_type_idx` ON `notifications_vendor_admin` (`type`);--> statement-breakpoint
CREATE INDEX `order_history_user_idx` ON `order_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `order_history_placed_at_idx` ON `order_history` (`placed_at`);--> statement-breakpoint
CREATE INDEX `order_insights_user_product_idx` ON `order_insights` (`user_id`,`product_id`);--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_items_product_idx` ON `order_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `orders_user_idx` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `orders_order_idx` ON `orders` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `packaging_type_name_unique` ON `packaging_type` (`name`);--> statement-breakpoint
CREATE INDEX `vendor_idx` ON `product_listing` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `product_idx` ON `product_listing` (`product_id`);--> statement-breakpoint
CREATE INDEX `product_listing_idx` ON `product_listing_variants` (`product_listing_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `product_name_name_unique` ON `product_name` (`name`);--> statement-breakpoint
CREATE INDEX `product_variants_product_idx` ON `product_variants` (`product_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_slug_idx` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `products_status_idx` ON `products` (`status`);--> statement-breakpoint
CREATE INDEX `quotations_vendor_idx` ON `quotations` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `suggested_carts_user_idx` ON `suggested_carts` (`user_id`);--> statement-breakpoint
CREATE INDEX `suggested_carts_status_idx` ON `suggested_carts` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_vendor_idx` ON `users` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `users_admin_idx` ON `users` (`admin_id`);--> statement-breakpoint
ALTER TABLE `orders` ADD `vendor_id` text REFERENCES vendors(id);--> statement-breakpoint
ALTER TABLE `orders` ADD `display_order_status` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `vendor_confirmation_deadline` text;