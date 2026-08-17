import { db } from "@/src/db/config";
import { orderItems, orders, products, users, vendors } from "@/src/db/schema";
import { manageApiResponse, manageError } from "@/src/utils/response";
import { and, count, desc, eq, sql } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "UserId is required",
        },
        {
          status: 400,
        },
      );
    }

    const [isExist] = await db
      .select({ userId: users.id })
      .from(users)
      .where(eq(users.id, userId));

    if (!isExist || !isExist.userId) {
      return Response.json(
        {
          success: false,
          message: "User not exist !",
        },
        {
          status: 400,
        },
      );
    }

    // const session = await getServerSession(authOptions);

    // if (!session || session?.user.id !== userId) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "User is not authorized !",
    //     },
    //     {
    //       status: 401,
    //     },
    //   );
    // }

    const ordersInfo1 = await db
      .select({
        type: orders.type,
        orderId: orders.id,
        updatedTime: orders.updatedAt,
        totalCost: orders.totalPriceAfterDiscount,
        totalItems: count(orderItems.id),
        // displayOrderStatus: orders.displayOrderStatus,
        productNames: sql<string>`group_concat(${products.name}, ', ')`,
        orderStatus: orders.orderStatus,
        // farmName: vendors.farmName,
        // location: vendors.addressLocation,
        // phone: vendors.phoneNumber,
        // email: vendors.email,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(products.id, orderItems.productId))
      // .innerJoin(vendors, eq(vendors.id, orders.vendorId))
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.isOrdered, true),
          eq(orders.isPayment, true),
          eq(orders.isPaymentProcess, false),
          eq(orders.type, "inventory"),
        ),
      )
      .groupBy(orders.id)
      .orderBy(desc(orders.updatedAt));

    const ordersInfo = await db
      .select({
        type: orders.type,
        orderId: orders.id,
        updatedTime: orders.updatedAt,
        // totalCost: orders.totalPriceAfterDiscount,
        totalItems: count(orderItems.id),
        displayOrderStatus: orders.displayOrderStatus,
        productNames: sql<string>`group_concat(${products.name}, ', ')`,
        // orderStatus: orders.orderStatus,
        farmName: vendors.farmName,
        location: vendors.addressLocation,
        phone: vendors.phoneNumber,
        email: vendors.email,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(products.id, orderItems.productId))
      .innerJoin(vendors, eq(vendors.id, orders.vendorId))
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.isOrdered, true),
          eq(orders.isPayment, false),
          eq(orders.isPaymentProcess, false),
          eq(orders.type, "display"),
        ),
      )
      .groupBy(orders.id)
      .orderBy(desc(orders.updatedAt));

    const allOrders = [...ordersInfo1, ...ordersInfo];

    if (allOrders.length === 0) {
      return Response.json(
        {
          success: true,
          data: {
            orders: allOrders,
            totalItems: allOrders.length,
          },
        },
        {
          status: 200,
        },
      );
    }

    const responseObj = manageApiResponse("orders", allOrders);

    return Response.json(
      {
        success: true,
        data: {
          ...responseObj,
        },
      },
      {
        status: 200,
      },
    );
  } catch (err: unknown) {
    const errRes = manageError(err);
    return Response.json(
      {
        success: false,
        message: errRes ? errRes : "Failed to get orders !",
      },
      {
        status: 500,
      },
    );
  }
}
