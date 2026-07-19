"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../server/Header";
import NotificationPanel from "../server/notificationPanel";
import ReduxProvider from "@/src/app/providers/ReduxProvider";

export default function NotificationLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  const handleNotificationPanelOpen = () => {
    setIsOpen((prev) => !prev);
  };

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

  return (
    <div ref={notificationRef} className="w-full">
      <Header handleNotificationPanelOpen={handleNotificationPanelOpen} />

      <NotificationPanel isOpen={isOpen} />
    </div>
  );
}
