"use client";
import { IOrderType } from "@/src/lib/api calls/server/getAllOrders";
import { useState } from "react";
import { OrderCard } from "./OrderCard";
import Link from "next/link";
import { TABS } from "../constant/constant";

interface IProps {
  orders: IOrderType[];
}

type IorderStatus =
  | "delivered"
  | "ontheway"
  | "failed"
  | "pending"
  | "packaging"
  | "cancelled";

const OrderRenderPage = ({ orders }: IProps) => {
  const [status, setStatus] = useState<IorderStatus | "all">("all");

  const filtered =
    status === "all"
      ? orders
      : orders.filter((o) => {
          const isDisplayed = o.type === "display";
          return isDisplayed
            ? o.displayOrderStatus === status
            : o.orderStatus === status ;
        });

  const countByStatus = (status: string) =>
    status === "all"
      ? orders.length
      : orders.filter((o) => {
          const isDisplayed = o.type === "display";
          return isDisplayed
            ? o.displayOrderStatus === status
            : o.orderStatus === status;
        }).length;
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
            const isActive = status === tab.key;
            const count = countByStatus(tab.key);
            return (
              //   <Link key={tab.key} href={`/orderstatus?type=${tab.key}`}>
              // <Fragment></Fragment>
              <button
                key={tab.key}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-150
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }
                `}
                onClick={() => setStatus(tab.key as IorderStatus)}
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
              //   </Link>
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

export default OrderRenderPage;
