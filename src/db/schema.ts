import { sql } from "drizzle-orm";
import { real, integer, index } from "drizzle-orm/sqlite-core";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

// user table...
// root table every other tables links...
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  pushSubscription: text("push_subscription"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

// product table...

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  stockQty: integer("stock_qty").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

// order_history...
export const orderHistory = sqliteTable(
  "order_history",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    items: text("items", { mode: "json" })
      .notNull()
      .$type<
        Array<{ productId: string; quantity: number; priceAtTime: number }>
      >(),
    total: real("total").notNull(),
    status: text("status").notNull().default("pending"),
    stripePaymentId: text("stripe_payment_id"),
    placedAt: text("placed_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (table) => [
    index("order_history_user_idx").on(table.userId),
    index("order_history_placed_at_idx").on(table.placedAt),
  ],
);

// orderInsights...

export const orderInsights = sqliteTable(
  "order_insights",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    avgIntervalDays: real("avg_interval_days"),
    buyCount: integer("buy_count").notNull().default(0),
    avgQuantity: real("avg_quantity").notNull().default(1),
    lastComputedAt: text("last_computed_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (table) => [
    index("order_insights_user_product_idx").on(table.userId, table.productId),
  ],
);

// frequency products...

export const freqProducts = sqliteTable(
  "freqproducts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    lastBoughtAt: text("last_bought_at").notNull(),
    nextExpectedAt: text("next_expected_at").notNull(),
    status: text("status").notNull().default("active"), // "active" , "inactive"=> remove this product from freqproducts and order insights
  },
  (table) => [
    index("freq_product_user_idx").on(table.userId),
    index("freq_products_next_expected_idx").on(table.nextExpectedAt),
  ],
);

// suggestedCarts...

export const suggestedCarts = sqliteTable(
  "suggested_carts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    items: text("items", { mode: "json" })
      .notNull()
      .$type<Array<{ productId: string; quantity: number; reason: string }>>(),
    status: text("status").notNull().default("pending"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
    expiresAt: text("expires_at").notNull(),
  },
  (table) => [
    index("suggested_carts_user_idx").on(table.userId),
    index("suggested_carts_status_idx").on(table.status),
  ],
);
