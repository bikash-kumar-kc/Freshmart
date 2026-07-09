export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    dot: "bg-gray-400",
    badge: "bg-gray-50 border-gray-200",
    text: "text-gray-700",
  },
  packaging: {
    label: "Packaging",
    dot: "bg-amber-400",
    badge: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
  },
  shipped: {
    label: "Shipped",
    dot: "bg-blue-400",
    badge: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-green-500",
    badge: "bg-green-50 border-green-200",
    text: "text-green-700",
  },
} as const;


export const TABS = [
  { key: "all", label: "All" },
  { key: "packaging", label: "Packaging" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];