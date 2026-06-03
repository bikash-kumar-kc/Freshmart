import { sql } from "drizzle-orm";
import { real, integer } from "drizzle-orm/sqlite-core";
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

export const orderHistory = sqliteTable("order_history",{
    id:text("id").primaryKey(),
    userId:text("user_id").notNull().references(()=> users.id,{onDelete:"cascade"})
})
