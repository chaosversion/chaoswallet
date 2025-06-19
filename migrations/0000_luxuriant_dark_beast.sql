CREATE TABLE `wallets` (
	`user_id` text(24) PRIMARY KEY NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_user_id` ON `wallets` (`user_id`);