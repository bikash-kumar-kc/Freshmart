"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Leaf,
  Tag,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface CartItem {
  id: string; // cart line id
  productId: string;
  variantId: string;
  name: string;
  thumbnail: string;
  category: string;
  weightValue: number;
  weightUnit: string;
  price: number; // price per unit (after discount)
  originalPrice: number; // before discount
  isOffered: boolean;
  discount: number;
  quantity: number;
  stock: number;
}

// ─────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────
const MOCK_CART: CartItem[] = [
  {
    id: "line_1",
    productId: "prod_vegetables_01",
    variantId: "prod_vegetables_01_v2",
    name: "Organic Potato",
    thumbnail: "https://loremflickr.com/120/120/potato,vegetable",
    category: "Vegetables",
    weightValue: 1000,
    weightUnit: "g",
    price: 1.79,
    originalPrice: 2.1,
    isOffered: true,
    discount: 15,
    quantity: 2,
    stock: 30,
  },
  {
    id: "line_2",
    productId: "prod_vegetables_03",
    variantId: "prod_vegetables_03_v1",
    name: "Organic Spinach",
    thumbnail: "https://loremflickr.com/120/120/spinach,vegetable",
    category: "Vegetables",
    weightValue: 500,
    weightUnit: "g",
    price: 1.8,
    originalPrice: 1.8,
    isOffered: false,
    discount: 0,
    quantity: 1,
    stock: 45,
  },
  {
    id: "line_3",
    productId: "prod_fruits_02",
    variantId: "prod_fruits_02_v1",
    name: "Organic Banana",
    thumbnail: "https://loremflickr.com/120/120/banana,fruit",
    category: "Fruits",
    weightValue: 500,
    weightUnit: "g",
    price: 1.2,
    originalPrice: 1.2,
    isOffered: false,
    discount: 0,
    quantity: 3,
    stock: 20,
  },
  {
    id: "line_4",
    productId: "prod_nuts_01",
    variantId: "prod_nuts_01_v1",
    name: "Organic Almonds",
    thumbnail: "https://loremflickr.com/120/120/almonds,nuts",
    category: "Nuts & Seeds",
    weightValue: 250,
    weightUnit: "g",
    price: 6.8,
    originalPrice: 8.0,
    isOffered: true,
    discount: 15,
    quantity: 1,
    stock: 15,
  },
];

const FREE_DELIVERY_THRESHOLD = 30;

// ─────────────────────────────────────────────
// Quantity control
// ─────────────────────────────────────────────
function QuantityControl({
  value,
  onIncrease,
  onDecrease,
  quantityChange,
  max,
  id,
}: {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  quantityChange: (value: number, id: string) => void;
  max: number;
  id: string;
}) {
  const [amount, setAmount] = useState(value);

  return (
    <div className="flex items-center gap-0 h-8">
      <button
        onClick={() => {
          onDecrease();
          setAmount((prevs) => (prevs === 0 ? 0 : prevs - 1));
        }}
        className="w-8 h-8 flex items-center justify-center rounded-l-lg
          border border-gray-200 bg-white text-gray-500 hover:bg-green-50
          hover:border-green-300 hover:text-green-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={value <= 1}
      >
        <Minus size={12} />
      </button>
      <div
        className="w-10 h-8 flex items-center justify-center border-y
        border-gray-200 bg-white text-sm font-semibold text-gray-900"
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            if (Number(e.target.value) < 1) return;
            setAmount(Number(e.target.value));
            quantityChange(Number(e.target.value), id);
          }}
          className=" w-9 py-1.5 text-center"
        />
      </div>
      <button
        onClick={()=>{
          onIncrease();
          setAmount((prevs)=>prevs+1)
        }}
        className="w-8 h-8 flex items-center justify-center rounded-r-lg
          border border-gray-200 bg-white text-gray-500 hover:bg-green-50
          hover:border-green-300 hover:text-green-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={value >= max}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Cart row — desktop
// ─────────────────────────────────────────────
function CartRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  onChange,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onChange: (value: number, id: string) => void;
}) {
  const lineTotal = item.price * item.quantity;
  const originalTotal = item.originalPrice * item.quantity;

  return (
    <div
      className="flex items-start gap-4 py-5 border-b border-gray-100
      last:border-0"
    >
      {/* thumbnail */}
      <Link
        href={`/products/${item.productId}`}
        className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24
          rounded-2xl overflow-hidden bg-green-50 border border-gray-100
          hover:border-green-300 transition-colors"
      >
        <Image
          src={item.thumbnail}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
        {item.isOffered && (
          <span
            className="absolute top-1.5 left-1.5 bg-orange-500 text-white
            text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none"
          >
            -{item.discount}%
          </span>
        )}
      </Link>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-1 text-[10px]
              font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-md
              mb-1"
            >
              <Leaf size={8} />
              {item.category}
            </span>
            <Link
              href={`/products/${item.productId}`}
              className="block text-sm font-semibold text-gray-900
                hover:text-green-700 transition-colors truncate pr-2"
            >
              {item.name}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">
              {item.weightValue}
              {item.weightUnit} per unit
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <h3>Quantity</h3>
            <QuantityControl
              value={item.quantity}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              quantityChange={(value: number, id: string) =>
                onChange(value, id)
              }
              max={item.stock}
              id={item.id}
            />
          </div>

          {/* remove */}
          <button
            onClick={onRemove}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-300
              hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* price + quantity row */}
        <div className="flex items-center justify-end mt-3 flex-wrap gap-2">
          <div className="text-right">
            <p className="text-base font-bold text-gray-900">
              ${lineTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-20 px-4">
      <div
        className="w-20 h-20 rounded-full bg-green-100 flex items-center
        justify-center mb-5"
      >
        <ShoppingBag size={32} className="text-green-600" />
      </div>
      <h2 className="font-serif text-xl font-semibold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-7">
        Looks like you haven't added anything yet. Browse our organic products
        and fill your cart with freshness.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800
          text-white text-sm font-semibold px-6 py-3 rounded-2xl
          transition-colors"
      >
        <Leaf size={16} />
        Start shopping
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────
// Free delivery progress bar
// ─────────────────────────────────────────────
function DeliveryProgress({ subtotal }: { subtotal: number }) {
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const achieved = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <div
      className={`rounded-[4px] p-3.5 mb-4 border ${
        achieved
          ? "bg-green-50 border-green-200"
          : "bg-amber-50 border-amber-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Truck
          size={14}
          className={achieved ? "text-green-600" : "text-amber-600"}
        />
        <p className="text-xs font-medium text-gray-700">
          {achieved
            ? "🎉 You've unlocked free delivery!"
            : `Add $${remaining.toFixed(2)} more for free delivery`}
        </p>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            achieved ? "bg-green-500" : "bg-amber-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Cart Page
// ─────────────────────────────────────────────
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // ── calculations ───────────────────────────
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const originalSubtotal = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0,
  );
  const totalSavings = originalSubtotal - subtotal;
  const couponDiscount = couponApplied ? subtotal * 0.1 : 0; // 10% mock
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 3.99;
  const total = subtotal - couponDiscount + deliveryFee;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // ── handlers ──────────────────────────────
  const increase = (id: string) => {
    console.log("increased !");
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const changeQuantity = (amount: number, id: string) => {
    console.log("here");
    setItems((prevs) => {
      return prevs.map((item) =>
        item.id === id ? { ...item, quantity: amount } : item,
      );
    });
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    setCouponError("");
    if (coupon.trim().toUpperCase() === "ORGANIC10") {
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code. Try ORGANIC10");
    }
  };

  // ── checkout ──────────────────────────────
  const handleCheckout = async () => {
    // wire to your create-session route
    // const checkoutItems = items.map(i => ({
    //   productId: i.productId,
    //   variantId: i.variantId,
    //   quantity: i.quantity,
    // }));
    // await redirectToCheckout(checkoutItems);
    alert("Wire to /api/checkout/create-session");
  };

  if (items.length === 0) {
    return (
      <main className="bg-[#F5F9F0] min-h-screen">
        <div className="max-w-7xl  min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyCart />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F5F9F0] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── page header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="font-serif text-2xl sm:text-3xl font-semibold
              text-gray-900"
            >
              Your cart
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm font-medium
              text-green-700 hover:text-green-900 transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>

        {/* ── two column layout ── */}
        <div className="flex flex-col relative lg:flex-row gap-6 items-start">
          {/* ── LEFT: cart items ── */}
          <div className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-[8px] border border-gray-100 px-5">
              {items.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onIncrease={() => increase(item.id)}
                  onDecrease={() => decrease(item.id)}
                  onRemove={() => remove(item.id)}
                  onChange={(value: number, id: string) =>
                    changeQuantity(value, id)
                  }
                />
              ))}
            </div>

            {/* ── trust strip ── */}
            <div className="grid lg:grid-cols-3 gap-3 mt-4">
              {[
                {
                  icon: <Truck size={15} className="text-gray-900" />,
                  label: "Free delivery",
                  sub: "On orders over $30",
                },
                {
                  icon: <RotateCcw size={15} className="text-gray-900" />,
                  label: "Easy returns",
                  sub: "Within 24 hours",
                },
                {
                  icon: <Shield size={15} className="text-gray-900" />,
                  label: "100% organic",
                  sub: "Certified farms",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center text-center
                    bg-green-200 rounded-[8px] p-3 border border-gray-100 hover:shadow-sm duration-200"
                >
                  <div className="mb-1.5">{b.icon}</div>
                  <p
                    className="text-xs font-semibold text-gray-700
                    leading-none"
                  >
                    {b.label}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: order summary ── */}
          <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-25 ">
            {/* delivery progress */}
            {/* <DeliveryProgress subtotal={subtotal} /> */}

            {/* summary card */}
            <div className="bg-white rounded-sm border hover:shadow-sm border-gray-100 p-5">
              <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">
                Order summary
              </h2>

              {/* line items summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Product savings</span>
                    <span className="font-medium text-green-600">
                      -${totalSavings.toFixed(2)}
                    </span>
                  </div>
                )}

                {couponApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <Tag size={11} /> Coupon ORGANIC10
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span
                    className={`font-medium ${
                      deliveryFee === 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* divider */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Taxes included
                    </p>
                  </div>
                </div>
              </div>

              {/* coupon input */}
              {/* {!couponApplied ? (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        setCouponError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="Coupon code"
                      className="flex-1 text-sm px-3 py-2.5 rounded-xl border
                        border-gray-200 bg-gray-50 focus:outline-none
                        focus:ring-2 focus:ring-green-400 focus:border-transparent
                        placeholder:text-gray-300"
                    />
                    <button
                      onClick={applyCoupon}
                      className="flex-shrink-0 text-xs font-semibold px-4
                        py-2.5 rounded-xl bg-green-700 hover:bg-green-800
                        text-white transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 mt-1.5">{couponError}</p>
                  )}
                </div>
              ) : (
                <div
                  className="flex items-center justify-between mb-4 bg-green-50
                  border border-green-200 rounded-xl px-3 py-2"
                >
                  <span
                    className="text-xs font-medium text-green-700 flex
                    items-center gap-1.5"
                  >
                    <Tag size={11} /> ORGANIC10 applied
                  </span>
                  <button
                    onClick={() => {
                      setCouponApplied(false);
                      setCoupon("");
                    }}
                    className="text-[10px] text-green-600 hover:text-green-800
                      underline"
                  >
                    Remove
                  </button>
                </div>
              )} */}

              {/* checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2
                  bg-[#C8742A] hover:bg-[#A85E1C] text-white font-bold
                  text-sm py-4 rounded-2xl transition-all duration-200
                  shadow-md hover:shadow-lg"
              >
                Proceed to checkout
                <ArrowRight size={16} />
              </button>

              {/* payment icons */}
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {["Visa", "MC", "Stripe", "GPay"].map((p) => (
                  <div
                    key={p}
                    className={`px-2 py-1 rounded-md border border-gray-100
                      bg-gray-50 text-[9px] font-bold text-gray-400 ${p === "Stripe" ? "text-white bg-green-600" : ""}`}
                  >
                    {p}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">
                Secure checkout powered by Stripe
              </p>
            </div>

            {/* savings callout */}
            {/* {(totalSavings > 0 || couponApplied) && (
              <div
                className="mt-3 bg-green-700 rounded-2xl px-4 py-3
                flex items-center gap-3"
              >
                <div className="text-2xl">🎉</div>
                <div>
                  <p className="text-xs font-bold text-white">
                    You're saving ${(totalSavings + couponDiscount).toFixed(2)}
                    on this order!
                  </p>
                  <p className="text-[10px] text-green-200 mt-0.5">
                    Great choices — keep it up.
                  </p>
                </div>
              </div>
            )} */}

            {/* continue shopping link */}
            <Link
              href="/products"
              className="mt-4 flex items-center justify-center gap-1.5
                text-sm text-green-700 hover:text-green-900 font-medium
                transition-colors"
            >
              <Leaf size={13} />
              Continue shopping
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
