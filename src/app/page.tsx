"use client";
import Image from "next/image";
import SearchBar from "../components/client/SearchBar";
import Header from "../components/server/Header";
import { SessionProvider } from "next-auth/react";
import NotificationPanel from "../components/server/notificationPanel";
import { useCallback, useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenNotificationPanel = useCallback(() => {
    setIsOpen((prevs) => !prevs);
  }, []);
  return (
    <div className="flex flex-col flex-1 items-center  bg-amber-50 font-sans">
      <SessionProvider>
        {" "}
        <Header handleNotificationPanelOpen={handleOpenNotificationPanel} />
        <NotificationPanel isOpen={isOpen} />
      </SessionProvider>
    </div>
  );
}
