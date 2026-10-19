"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../server/Header";
import NotificationPanel from "../server/notificationPanel";
// import { usePathname } from "next/navigation";
import { usePathname } from "next/navigation";

export default function NotificationLayout() {
  const [isOpen, setIsOpen] = useState(false);
  // const pathname = usePathname();
  const pathname = usePathname();

  const HIDDEN_ROUTES = ["/auth"];

  const notificationRef = useRef<HTMLDivElement>(null);

  const handleNotificationPanelOpen = () => {
    setIsOpen((prev) => !prev);
  };

useEffect(() => {
  setIsOpen(false);
}, [pathname]);

useEffect(() => {
  function handleClickOutside(event: PointerEvent) {   // pointerdown works on touch too
    if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }
  document.addEventListener("pointerdown", handleClickOutside);
  return () => document.removeEventListener("pointerdown", handleClickOutside);
}, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   if (pathname) {
  //     setIsOpen(true);
  //   }
  // }, [pathname]);


// after ALL hooks:
if (HIDDEN_ROUTES.some((r) => pathname?.startsWith(r))) return null;

  return (
    <div ref={notificationRef} className="w-full mb-28 lg:mb-15">
      <Header handleNotificationPanelOpen={handleNotificationPanelOpen} />

      <NotificationPanel isOpen={isOpen} />
    </div>
  );
}
