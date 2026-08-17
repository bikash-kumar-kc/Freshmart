import { IOrderType } from "@/src/lib/api calls/server/getAllOrders";
import { STATUS_CONFIG } from "../constant/constant";
import { formatCurrency, formatDate, formatTime } from "../helperFun/helperFun";
import Link from "next/link";

export const OrderCard = ({ order }: { order: IOrderType }) => {
  // const
  // const

  let config: {
    label: string;
    dot: string;
    badge: string;
    text: string;
  };

  if (order.type === "inventory") {
    config =
      STATUS_CONFIG[
        order?.orderStatus as "pending" | "delivered" | "shipped" | "packaging"
      ];
  } else {
    config =
      order.orderStatus === "packaging"
        ? STATUS_CONFIG["shipped"]
        : STATUS_CONFIG[
            order?.displayOrderStatus as "pending" | "processing" | "delivered"
          ];
  }

  const isDisplayed = order.type === "display";

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-green-500 hover:shadow-sm animate-fade-up transition-all duration-200">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-800">
            {order.orderId}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-sm border ${config.badge} ${config.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-sm border ${order.type === "inventory" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-amber-200"} ${order.type === "inventory" ? "text-green-700" : "text-amber-700"}`}
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

      {/* Card body */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Order placed */}
        {/* <div className="flex flex-col gap-0.5">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Order placed</p>
          <p className="text-sm text-gray-800">{formatDate(order.placedAt)}</p>
          <p className="text-xs text-gray-400">{formatTime(order.placedAt)}</p>
        </div> */}

        {/* Store */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] uppercase tracking-wider text-gray-800 font-medium">
            {order.type === "display" ? "Farm Name" : "Store"}
          </p>
          <p className="text-sm text-gray-600">
            {order.type === "display" ? order.farmName : "Organic Hub"}
          </p>
          <p className="text-xs text-gray-600 truncate">
            {" "}
            {order.type === "display" ? order.location : "Imadol,lalitpur"}
          </p>

          {/* <p className="text-xs text-gray-600 truncate">
            {" "}
            {order.type === "display" ? order.email : "Imadol,lalitpur"}
          </p> */}

          {isDisplayed && (
            <>
              <p className="text-xs text-gray-600 truncate">{order.email}</p>
              <p className="text-xs text-gray-600 truncate">{order.phone}</p>
            </>
          )}
        </div>

        {/* Est. delivery */}
        {!isDisplayed && (
          <>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px]  tracking-wider text-gray-700 font-medium">
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
                {order.productNames.split(",").length} item
                {order.productNames.split(",").length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Cost */}
            <div className="flex flex-col gap-0.5">
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
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end">
        {/* <p className="text-xs text-gray-600">
          {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
          {order.items.map((i) => `${i.name} ×${i.qty}`).join(" · ")}
        </p> */}
        <Link
          href={`/orders/${order.orderId}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
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
