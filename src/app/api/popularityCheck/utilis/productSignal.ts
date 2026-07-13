import { db } from "@/src/db/config";
import { orders } from "@/src/db/schema";
import { and, eq, gte, isNotNull, ne } from "drizzle-orm";

// seven days window frams...
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// product signal types...
export interface IProductSignal {
  productId: string;
  category: string;
  quantityOrdered: number;
  uniqueBuyers: number;
}

// product signal modules...

const collectProductSignals = async (): Promise<IProductSignal[]> => {
  // seven days before date...
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();

  // getting all successful orders from the last 7 days...
  const recentOrders = await db.query.orders.findMany({
    where: and(
      gte(orders.createdAt, sevenDaysAgo),
      eq(orders.isPayment, true),
      eq(orders.isPaymentProcess, false),
      eq(orders.isOrdered, true),
      isNotNull(orders.orderStatus),
      ne(orders.orderStatus, "failed"),
    ),
    with: {
      items: {
        with: {
          product: {
            columns: {
              id: true,
              category: true,
            },
          },
        },
      },
    },
  });

  // map for storing the signal of products...
  const signalMap = new Map<
    string,
    {
      category: string;
      quantityOrdered: number;
      uniqueBuyers: Set<string>;
    }
  >();

  // creating signal for each products...
  for (const order of recentOrders) {
    for (const item of order.items) {
      const existing = signalMap.get(item.productId) ?? {
        category: item.product.category,
        quantityOrdered: 0,
        uniqueBuyers: new Set<string>(),
      };

      // adding purchased quantity...
      existing.quantityOrdered += item.quantity;

      // tracking the unique buyers...
      existing.uniqueBuyers.add(order.userId);

      // storing the signal...
      signalMap.set(item.productId, existing);
    }
  }

  // converting aggregated map into response...
  return Array.from(signalMap.entries()).map(([productId, data]) => {
    return {
      productId,
      category: data.category,
      quantityOrdered: data.quantityOrdered,
      uniqueBuyers: data.uniqueBuyers.size,
    };
  });
};

export default collectProductSignals;
