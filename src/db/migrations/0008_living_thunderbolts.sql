CREATE TABLE `notifications_vendor_admin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`sub_type` text NOT NULL,
	`vendor_id` text,
	`reference_id` text,
	`reference_type` text,
	`message` text NOT NULL,
	`content` text,
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notifications_vendor_idx` ON `notifications_vendor_admin` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `notifications_type_idx` ON `notifications_vendor_admin` (`type`);