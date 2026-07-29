ALTER TABLE `product_variants` ADD `measurement_type_id` integer REFERENCES measurement_type(id);--> statement-breakpoint
ALTER TABLE `products` ADD `category_id` integer REFERENCES category(id);--> statement-breakpoint
ALTER TABLE `products` ADD `product_name_id` integer REFERENCES product_name(id);--> statement-breakpoint
ALTER TABLE `products` ADD `packaging_type_id` integer REFERENCES packaging_type(id);