"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Heart, Home, LogOut, ShoppingCart, Truck, UserPlus } from "lucide-react";

interface MobileBottomNavProps {
  cartCount: number;
  favoriteCount: number;
  orderCount: number;
  isLoggedIn: boolean;
}

const Badge = ({ value }: { value: number }) =>
  value > 0 ? (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
      {value}
    </span>
  ) : null;

const MobileBottomNav = ({
  cartCount,
  favoriteCount,
  orderCount,
  isLoggedIn,
}: MobileBottomNavProps) => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  // Hide on scroll down, show on scroll up (rAF-throttled, with a small threshold to avoid jitter)
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.max(window.scrollY, 0);
        const delta = y - lastY.current;

        if (y < 80) {
          setVisible(true);
          lastY.current = y;
        } else if (Math.abs(delta) > 8) {
          setVisible(delta < 0);
          lastY.current = y;
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setVisible(true);
  }, [pathname]);

  const items = [
    { href: "/", label: "Home", Icon: Home, count: 0 },
    { href: "/cart", label: "Cart", Icon: ShoppingCart, count: cartCount },
    { href: "/favorites", label: "Favorites", Icon: Heart, count: favoriteCount },
    { href: "/orderstatus", label: "Orders", Icon: Truck, count: orderCount },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const itemClass = "flex flex-col items-center gap-1 px-2 py-1";
  const circle = (active: boolean) =>
    `relative p-2 rounded-full text-black shadow-sm transition-all duration-200 active:scale-95 ${
      active ? " bg-white scale-110 shadow-md" : "bg-white/40"
    }`;
  const label = (active: boolean) =>
  `text-[10px] tracking-wide text-green-950 ${active ? "font-bold" : "font-medium"}`;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden
         border-t border-white/20
        shadow-[0_-2px_8px_rgba(0,0,0,0.08)]
        px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]
        transition-transform duration-300 ease-in-out will-change-transform
        ${visible ? "translate-y-0" : "translate-y-full"} bg-green-400/60 backdrop-blur-xl`}
    >
      <div className="flex items-center justify-around">
        {items.map(({ href, label: text, Icon, count }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href} className={itemClass}>
              <div className={circle(active)}>
                <Icon size={20} />
                <Badge value={count} />
              </div>
              <span className={label(active)}>{text}</span>
            </Link>
          );
        })}

        {isLoggedIn ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={itemClass}
          >
            <div className={circle(false)}>
              <LogOut size={20} />
            </div>
            <span className={label(false)}>Logout</span>
          </button>
        ) : (
          <Link href="/auth/register" className={itemClass}>
            <div className={circle(isActive("/auth"))}>
              <UserPlus size={20} />
            </div>
            <span className={label(isActive("/auth"))}>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default MobileBottomNav;