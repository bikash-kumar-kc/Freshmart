import {
  getAllOrders,
  IOrderType,
} from "@/src/lib/api calls/server/getAllOrders";
import { authOptions } from "@/src/lib/auth/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { TABS } from "./constant/constant";
import { OrderCard } from "./components/OrderCard";
import { manageError } from "@/src/utils/response";

interface PageProps {
  searchParams: Promise<{
    type?: string;
  }>;
}

const OrderStatusPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const type = params.type ?? "all";

  let session;

  let orderData;
  let orders: IOrderType[] = [];

  try {
    session = await getServerSession(authOptions);
    if (!session?.user.id) {
      throw new Error("User is not logged in !");
    }
    orderData = await getAllOrders({ userId: session.user.id });
    orders = orderData.data;
  } catch (error) {
    const errRes = manageError(error);

    if (errRes) {
      return (
        <div className="w-full max-w-7xl m-auto">
          <div className="min-h-screen w-full flex justify-center items-center flex-col gap-2">
            <p className="text-gray-500">{errRes}</p>
            <Link
              href={
                errRes === "User Id is required !" ||
                errRes === "User is not logged in !"
                  ? "/auth/login"
                  : "/"
              }
            >
              <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
                {errRes === "User is not logged in !" ? "Login" : "Visit Home"}
              </button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-7xl m-auto">
        <div className="min-h-screen w-full flex justify-center items-center flex-col gap-2">
          <p className="text-red-500">Got an error !</p>
          <Link href="/">
            <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
              Visit Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-7xl m-auto">
        <div className="min-h-screen w-full flex justify-center items-center flex-col gap-2">
          <p className="text-gray-500">no orders yet.</p>
          <Link href="/">
            <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
              Visit Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const filtered =
    type === "all" ? orders : orders.filter((o) => o.orderStatus === type);

  const countByStatus = (status: string) =>
    status === "all"
      ? orders.length
      : orders.filter((o) => o.orderStatus === status).length;

  return (
    <div className="w-full min-h-screen bg-amber-50">
      <div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                My Orders
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Track and manage your recent orders
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-sm p-1 w-fit mb-8">
          {TABS.map((tab) => {
            const isActive = type === tab.key;
            const count = countByStatus(tab.key);
            return (
              <Link key={tab.key} href={`/orderstatus?type=${tab.key}`}>
                <button
                  className={`
                  inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-150
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }
                `}
                >
                  {tab.label}
                  <span
                    className={`
                    text-[11px] font-semibold px-1.5 py-0.5 rounded-sm min-w-5 text-center
                    ${
                      isActive
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                  >
                    {count}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusPage;
