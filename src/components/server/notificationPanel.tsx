"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import {
  MOCK_NOTIFICATIONS,
  Notification,
  TYPE_CONFIG,
} from "@/src/constants/mockNotifications";
import { timeAgo } from "@/src/lib/timeFormater";
import { useGetAllNotifications } from "@/src/hooks/useGetAllNotifications";
import { useSession } from "next-auth/react";
import { NotificationTypes } from "@/src/db/schema";

const NotificationPanel = ({ isOpen }: { isOpen: boolean }) => {
  const [notifis, setNotifis] = useState<NotificationTypes[]>([]);
  const { data } = useSession();

  // const unreadCount = notifis.filter((n) => !n.readAt).length;

  const markAllRead = () => {
    const now = new Date().toISOString();
    setNotifis((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
  };

  const handleClick = (n: NotificationTypes) => {
    if (!n.isMarked) {
      setNotifis((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, isMarked: true } : item,
        ),
      );
    }
  };

  const {
    data: notifications,
    isLoading,
    error,
  } = useGetAllNotifications(data?.user.id);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <p className="text-gray-500">Its loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }
  return (
    <aside
      className={`
        w-100 h-screen bg-[#f7f7f7] border-l  z-10
        fixed right-0 top-19 flex flex-col  transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
       `}
    >
      {/* header */}
      <div className="flex items-center justify-end px-5 py-4 border-b border-[#262626]">
        {notifications && notifications?.totalNotifications > 0 && (
          <button
            onClick={markAllRead}
            className="text-[13px] text-[#5227ee] hover:text-[#a3a3a3] transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#262626]">
        {notifications?.notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 pb-10">
            <Bell size={28} className="text-[#404040]" />
            <p className="text-sm text-[#525252]">No notifications yet</p>
          </div>
        )}

        {notifications?.notifications.map((n) => {
          const config = TYPE_CONFIG[n.type];
          const isUnread = !n.isMarked;

          return (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`
                flex gap-3 px-4 py-3 cursor-pointer transition-colors
                hover:bg-[#97f979]
                ${isUnread ? "bg-[#cdcaca]" : "bg-transparent"}
              `}
            >
              {/* icon circle */}
              <div
                className={`
                  shrink-0 w-8 h-8 rounded-full flex items-center
                  justify-center mt-0.5
                  ${config.iconBg} ${config.iconColor}
                `}
              >
                {config.icon}
              </div>

              {/* content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p
                    className={`text-sm leading-snug ${
                      isUnread
                        ? "font-medium text-[#f5f5f5]"
                        : "font-normal text-[#a3a3a3]"
                    }`}
                  >
                    {n.title}
                  </p>
                  {/* unread dot */}
                  {isUnread && (
                    <span
                      className={`shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${config.dot}`}
                    />
                  )}
                </div>
                <p className="text-xs text-[#737373] mt-0.5 leading-snug line-clamp-2">
                  {n.content}
                </p>
                <p className="text-[10px] text-[#525252] mt-1">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default React.memo(NotificationPanel);
