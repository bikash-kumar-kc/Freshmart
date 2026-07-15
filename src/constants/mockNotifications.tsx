import { NotificationType } from "../types/notificationTypes";

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
  actionUrl?: string;
  userId: {
    userName: string;
    avatar?: string;
  };
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    _id: "1",
    type: "auth_success",
    title: "Welcome back!",
    message: "You have successfully logged in.",
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    readAt: null,
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "2",
    type: "cart_created",
    title: "Your cart is ready",
    message: "We've prepared a restock cart based on your purchase history.",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    readAt: null,
    actionUrl: "/checkout?cart=cart_u1_2026-06-13",
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "3",
    type: "payment_success",
    title: "Payment successful",
    message: "Your payment of $24.50 was processed successfully.",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    readAt: null,
    actionUrl: "/orders/ord_123",
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "4",
    type: "order_placed",
    title: "Order confirmed",
    message: "Your order has been placed successfully.",
    createdAt: new Date(Date.now() - 62 * 60000).toISOString(),
    readAt: new Date(Date.now() - 30 * 60000).toISOString(),
    actionUrl: "/orders/ord_123",
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "5",
    type: "special_offer",
    title: "Special offer for you",
    message: "20% off on all dairy products today only.",
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    readAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "6",
    type: "order_processing",
    title: "Order is processing",
    message: "We've received your order and are processing it now.",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    readAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    actionUrl: "/orders/ord_120",
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "7",
    type: "payment_failed",
    title: "Payment failed",
    message: "Something went wrong with your payment. Please try again.",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    readAt: new Date(Date.now() - 23 * 3600000).toISOString(),
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "8",
    type: "cart_failed",
    title: "Cart creation failed",
    message: "We couldn't prepare your suggested cart. Please try again.",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    readAt: new Date(Date.now() - 47 * 3600000).toISOString(),
    userId: { userName: "bikash_dev" },
  },
  {
    _id: "9",
    type: "order_failed",
    title: "Order failed",
    message: "We couldn't place your order. Please contact support.",
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    readAt: new Date(Date.now() - 71 * 3600000).toISOString(),
    userId: { userName: "bikash_dev" },
  },
];

export const TYPE_CONFIG: Record<
  NotificationType,
  { iconBg: string; iconColor: string; dot: string; icon: React.ReactNode }
> = {
  auth_success: {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    dot: "bg-green-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  suggestion: {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    dot: "bg-green-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  cart_created: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    dot: "bg-blue-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  cart_failed: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    dot: "bg-red-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  special_offer: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    dot: "bg-amber-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
  },
  payment_success: {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    dot: "bg-green-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  payment_failed: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    dot: "bg-red-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  order_processing: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    dot: "bg-blue-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  order_placed: {
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    dot: "bg-green-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  order_failed: {
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    dot: "bg-red-400",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};
