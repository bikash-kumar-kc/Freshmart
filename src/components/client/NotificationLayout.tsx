"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../server/Header";
import NotificationPanel from "../server/notificationPanel";
import { SessionProvider } from "next-auth/react";
import ReduxProvider from "@/src/app/providers/ReduxProvider";
import AuthContextProvider from "@/src/context/AuthContext";

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
    <SessionProvider>
        {" "}
        <ReduxProvider>
          <div ref={notificationRef} className="w-full">
            <Header handleNotificationPanelOpen={handleNotificationPanelOpen} />

            <NotificationPanel isOpen={isOpen} />
          </div>
        </ReduxProvider>
    </SessionProvider>
  );
}
