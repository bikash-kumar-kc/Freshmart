import { relations, sql } from "drizzle-orm";
import { real, integer, index } from "drizzle-orm/sqlite-core";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { NotificationType } from "../types/notificationTypes";

// user table...
// root table every other tables links...
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
  pushSubscription: text("push_subscription"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(), // unique — see index below

    category: text("category").notNull(),

    // comma-separated search terms, e.g. "potato,aalu"

    keywords: text("keywords").notNull().default(""),

    description: text("description").notNull(),

    thumbnail: text("thumbnail").notNull(),
    // JSON array of image URLs
    images: text("images", { mode: "json" })
      .notNull()
      .$type<string[]>()
      .default(sql`'[]'`),

    // small category/product icon — separate from thumbnail
    icon: text("icon"),

    // ── curation flags ──
    isMostPopular: integer("is_most_popular", { mode: "boolean" })
      .notNull()
      .default(false),
    isFeatured: integer("is_featured", { mode: "boolean" })
      .notNull()
      .default(false),

    // ── offers ──
    isOffered: integer("is_offered", { mode: "boolean" })
      .notNull()
      .default(false),

    // percentage, e.g. 20 = 20% off
    discount: real("discount").default(0),

    // renamed from isOfferedDateStartDate/EndDate — these are dates, not booleans
    offerStartDate: text("offer_start_date"),
    offerEndDate: text("offer_end_date"),

    // ── organic provenance ──
    originCountry: text("origin_country").notNull(),
    farmName: text("farm_name").notNull(),

    freshnessTags: text("freshness_tags", { mode: "json" })
      .notNull()
      .$type<string[]>()
      .default(sql`'[]'`),

    // always an array now — even a single banner is ["url"]
    featuredBanner: text("featured_banner", { mode: "json" })
      .notNull()
      .$type<string[]>()
      .default(sql`'[]'`),

    // "active" | "draft" | "out_of_stock" | "discontinued"

    status: text("status").notNull().default("active"),
    expireAt: text("expire_at").notNull(),

    // popularity check -------------
    popularityScore: real("popularity_score").notNull().default(0),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (table) => [
    index("products_slug_idx").on(table.slug),
    index("products_category_idx").on(table.category),
    index("products_status_idx").on(table.status),
  ],
);

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: text("id").primaryKey(),

    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    weightValue: real("weight_value").notNull(),
    weightUnit: text("weight_unit").notNull(),

    price: real("price").notNull(),
    stock: integer("stock").notNull().default(0),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (table) => [index("product_variants_product_idx").on(table.productId)],
);

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
    notificationSentAt: text("notification_sent_at"),
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

export const jobRuns = sqliteTable("job_runs", {
  id: text("id").primaryKey(),
  jobName: text("job_name").notNull(),
  status: text("status").notNull(),
  summary: text("summary"),
  steps: integer("steps"),
  startedAt: text("started_at").notNull(),
  completedAt: text("completed_at"),
  error: text("error"),
});

export const notfications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull().$type<NotificationType>(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isShown: integer("is_shown", { mode: "boolean" }).notNull().default(false),
  isDelete: integer("is_delete", { mode: "boolean" }).notNull().default(false),
  isMarked: integer("is_marked", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),

    isOrdered: integer("is_ordered", { mode: "boolean" })
      .notNull()
      .default(false),

    isPayment: integer("is_payment", { mode: "boolean" })
      .notNull()
      .default(false),

    isPaymentProcess: integer("is_payment_process", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

    orderStatus: text("order_status", {
      enum: ["delivered", "ontheway", "failed", "pending", "packaging"],
    }),

    isDeliveredChargeApplied: integer(
      "is_delivered_charge_applied",
      {
        mode: "boolean",
      }
    )
      .notNull()
      .default(false),

    totalPriceAfterDiscount: integer("total_price_after_discount"),

    totalSave: integer("total_save"),

    totalPrice: integer("total_price"),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),

    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  },
  (table) => [
    index("orders_user_idx").on(table.userId),
    index("orders_order_idx").on(table.id),
  ]
);


export const orderItems = sqliteTable(
  "order_items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),

    productId: text("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "restrict",
      }),

    quantity: integer("quantity").notNull(),

    weightValue: integer("weight_value").notNull(),

    weightUnit: text("weight_unit", {
      enum: ["g", "kg","l","ml"],
    }).notNull(),
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_product_idx").on(table.productId),
  ]
);


export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),

  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),

  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
}));


// types...
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type OrderHistory = typeof orderHistory.$inferSelect;
export type NewOrderHistory = typeof orderHistory.$inferInsert;

export type OrderInsight = typeof orderInsights.$inferSelect;
export type NewOrderInsight = typeof orderInsights.$inferInsert;

export type FreqProduct = typeof freqProducts.$inferSelect;
export type NewFreqProduct = typeof freqProducts.$inferInsert;

export type SuggestedCart = typeof suggestedCarts.$inferSelect;
export type NewSuggestedCart = typeof suggestedCarts.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type NotificationTypes = typeof notfications.$inferSelect;

export type OrdersTypes = typeof orders.$inferSelect;
export type IOrderItem = typeof orderItems.$inferSelect;
