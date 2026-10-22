import { IOrderType } from "@/src/lib/api calls/server/getAllOrders";
import { STATUS_CONFIG } from "../constant/constant";
import { formatCurrency, formatDate, formatTime } from "../helperFun/helperFun";
import Link from "next/link";

export const OrderCard = ({ order }: { order: IOrderType }) => {
  let config: {
    label: string;
    dot: string;
    badge: string;
    text: string;
  };

  if (order.type === "inventory") {
    config =
      order?.orderStatus === "ontheway"
        ? STATUS_CONFIG["shipped"]
        : STATUS_CONFIG[
            order?.orderStatus as
              | "pending"
              | "delivered"
              | "shipped"
              | "packaging"
          ];
  } else {
    const status =
      order.orderStatus === "failed" ? "cancelled" : order.orderStatus;
    config =
      status === "packaging"
        ? STATUS_CONFIG["shipped"]
        : STATUS_CONFIG[status as "pending" | "processing" | "delivered"];
  }

  const isDisplayed = order.type === "display";
  const itemCount = order.productNames?.split(",").length ?? 0;

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-green-500 hover:shadow-sm animate-fade-up transition-all duration-200">
      {/* Card header: stacked on mobile, one row from sm */}
      <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3.5 border-b border-gray-100 bg-gray-50/60">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="min-w-0 break-all text-sm font-medium text-gray-800">
            {order.orderId}
          </span>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-sm border ${config?.badge} ${config?.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config?.dot}`} />
            {config?.label ?? "unhandle order"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-sm border ${order.type === "inventory" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-amber-200"} ${order.type === "inventory" ? "text-green-700" : "text-amber-700"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${order.type === "inventory" ? "bg-green-500" : "bg-amber-500 border-amber-200"}`}
            />
            {order.type}
          </span>
          <span className="text-xs text-gray-600">
            {formatDate(order.updatedTime)} · {formatTime(order.updatedTime)}
          </span>
        </div>
      </div>

      {/* Card body: 2 columns on mobile (store spans full width), 4 on desktop */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:grid-cols-4">
        {/* Store / Farm */}
        <div
          className={`flex min-w-0 flex-col gap-0.5 ${
            isDisplayed ? "col-span-2 lg:col-span-1" : "col-span-2 lg:col-span-1"
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider text-gray-800 font-medium">
            {isDisplayed ? "Farm Name" : "Store"}
          </p>
          <p className="text-sm text-gray-600 break-words">
            {isDisplayed ? order.farmName : "Organic Hub"}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {isDisplayed ? order.location : "Imadol,lalitpur"}
          </p>

          {isDisplayed && (
            <>
              <p className="text-xs text-gray-600 truncate">{order.email}</p>
              <p className="text-xs text-gray-600 truncate">{order.phone}</p>
            </>
          )}
        </div>

        {!isDisplayed && (
          <>
            {/* Est. delivery */}
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-[11px] tracking-wider text-gray-700 font-medium">
                {order.orderStatus === "delivered"
                  ? "Delivered on"
                  : "Est. delivery"}
              </p>
              <p
                className={`text-sm font-medium ${order.orderStatus === "delivered" ? "text-green-600" : "text-gray-600"}`}
              >
                {formatDate(String(new Date()))}
              </p>
              <p className="text-xs text-gray-600">
                {itemCount} item{itemCount > 1 ? "s" : ""}
              </p>
            </div>

            {/* Cost */}
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="text-[11px] uppercase tracking-wider text-gray-700 font-medium">
                Total cost
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(order?.totalCost as number)}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {order.productNames}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-end border-t border-gray-100 px-4 py-2.5 sm:px-5 sm:py-3">
        <Link
          href={`/orders/${order.orderId}`}
          className="inline-flex items-center gap-1.5 py-1 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          View details
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};