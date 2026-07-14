ALTER TABLE `order_insights` ADD `weight_unit` text;--> statement-breakpoint
ALTER TABLE `order_insights` ADD `weight_value` integer;--> statement-breakpoint
ALTER TABLE `order_insights` ADD `next_expected_date` text;--> statement-breakpoint
ALTER TABLE `order_insights` ADD `is_notification_send` integer DEFAULT false NOT NULL;