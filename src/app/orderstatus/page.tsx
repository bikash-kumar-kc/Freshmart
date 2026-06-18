"use client";

import Link from "next/link";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type OrderStatus = "all" | "processing" | "shipped" | "delivered";

interface OrderItem {
  name: string;
  qty: number;
}

interface Order {
  id: string;
  status: Exclude<OrderStatus, "all">;
  placedAt: string;
  estimatedDelivery: string;
  address: string;
  storeName: string;
  cost: number;
  items: OrderItem[];
}

// ── Dummy data ─────────────────────────────────────────────────────────────────
const ORDERS: Order[] = [
  {
    id: "ORD-10021",
    status: "processing",
    placedAt: "2025-06-17T09:30:00",
    estimatedDelivery: "2025-06-17",
    address: "Lazimpat, Kathmandu",
    storeName: "Dhumbarahi DS",
    cost: 1480,
    items: [
      { name: "Organic Spinach", qty: 2 },
      { name: "Tomatoes (500g)", qty: 1 },
      { name: "Free-range Eggs", qty: 1 },
    ],
  },
  {
    id: "ORD-10018",
    status: "processing",
    placedAt: "2025-06-17T07:15:00",
    estimatedDelivery: "2025-06-17",
    address: "Thamel, Kathmandu",
    storeName: "Thamel Central",
    cost: 870,
    items: [
      { name: "Baby Carrots", qty: 1 },
      { name: "Greek Yogurt", qty: 2 },
    ],
  },
  {
    id: "ORD-10015",
    status: "shipped",
    placedAt: "2025-06-16T14:00:00",
    estimatedDelivery: "2025-06-17",
    address: "Baneshwor, Kathmandu",
    storeName: "Baneshwor DS",
    cost: 2350,
    items: [
      { name: "Avocados (x3)", qty: 1 },
      { name: "Almond Milk", qty: 2 },
      { name: "Mixed Salad Leaves", qty: 1 },
      { name: "Whole Wheat Bread", qty: 1 },
    ],
  },
  {
    id: "ORD-10012",
    status: "shipped",
    placedAt: "2025-06-16T10:45:00",
    estimatedDelivery: "2025-06-17",
    address: "Patan, Lalitpur",
    storeName: "Patan Hub",
    cost: 1120,
    items: [
      { name: "Broccoli", qty: 2 },
      { name: "Cottage Cheese", qty: 1 },
    ],
  },
  {
    id: "ORD-10008",
    status: "delivered",
    placedAt: "2025-06-14T11:00:00",
    estimatedDelivery: "2025-06-14",
    address: "Bouddha, Kathmandu",
    storeName: "Bouddha DS",
    cost: 3200,
    items: [
      { name: "Organic Apples (1kg)", qty: 1 },
      { name: "Honey (250ml)", qty: 1 },
      { name: "Oat Milk", qty: 3 },
    ],
  },
  {
    id: "ORD-10005",
    status: "delivered",
    placedAt: "2025-06-12T09:00:00",
    estimatedDelivery: "2025-06-12",
    address: "Balaju, Kathmandu",
    storeName: "Balaju DS",
    cost: 650,
    items: [
      { name: "Cherry Tomatoes", qty: 1 },
      { name: "Mint Leaves", qty: 2 },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const TABS: { key: OrderStatus; label: string }[] = [
  { key: "all",        label: "All" },
  { key: "processing", label: "Processing" },
  { key: "shipped",    label: "Shipped" },
  { key: "delivered",  label: "Delivered" },
];

const STATUS_CONFIG: Record<
  Exclude<OrderStatus, "all">,
  { label: string; dot: string; badge: string; text: string }
> = {
  processing: {
    label: "Processing",
    dot:   "bg-amber-400",
    badge: "bg-amber-50 border-amber-200",
    text:  "text-amber-700",
  },
  shipped: {
    label: "Shipped",
    dot:   "bg-blue-400",
    badge: "bg-blue-50 border-blue-200",
    text:  "text-blue-700",
  },
  delivered: {
    label: "Delivered",
    dot:   "bg-green-500",
    badge: "bg-green-50 border-green-200",
    text:  "text-green-700",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour:   "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

// ── Order card ─────────────────────────────────────────────────────────────────
const OrderCard = ({ order }: { order: Order }) => {
  const config = STATUS_CONFIG[order.status];

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-green-500 hover:shadow-sm transition-all duration-200">

      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-800">{order.id}</span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-sm border ${config.badge} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>
        <span className="text-xs text-gray-600">
          {formatDate(order.placedAt)} · {formatTime(order.placedAt)}
        </span>
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
          <p className="text-[11px] uppercase tracking-wider text-gray-700 font-medium">Store</p>
          <p className="text-sm text-gray-400">{order.storeName}</p>
          <p className="text-xs text-gray-400 truncate">{order.address}</p>
        </div>

        {/* Est. delivery */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px]  tracking-wider text-gray-700 font-medium">
            {order.status === "delivered" ? "Delivered on" : "Est. delivery"}
          </p>
          <p className={`text-sm font-medium ${order.status === "delivered" ? "text-green-600" : "text-gray-400"}`}>
            {formatDate(order.estimatedDelivery)}
          </p>
          <p className="text-xs text-gray-400">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
        </div>

        {/* Cost */}
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] uppercase tracking-wider text-gray-700 font-medium">Total cost</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.cost)}</p>
          <p className="text-xs text-gray-400 truncate">
            {order.items.map((i) => i.name).join(", ")}
          </p>
        </div>

      </div>

      {/* Card footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
          {order.items.map((i) => `${i.name} ×${i.qty}`).join(" · ")}
        </p>
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          View details
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const OrderStatusPage = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");

  const filtered =
    activeTab === "all"
      ? ORDERS
      : ORDERS.filter((o) => o.status === activeTab);

  const countByStatus = (status: OrderStatus) =>
    status === "all"
      ? ORDERS.length
      : ORDERS.filter((o) => o.status === status).length;

  return (
    <div className="w-full min-h-screen bg-amber-50">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">My Orders</h1>
              <p className="text-sm text-gray-400 mt-0.5">Track and manage your recent orders</p>
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

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-sm p-1 w-fit mb-8">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = countByStatus(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-150
                  ${isActive
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }
                `}
              >
                {tab.label}
                <span
                  className={`
                    text-[11px] font-semibold px-1.5 py-0.5 rounded-sm min-w-[20px] text-center
                    ${isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-500"
                    }
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Order list ────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderStatusPage;