// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Bell, Trash2 } from "lucide-react";
// import { TYPE_CONFIG } from "@/src/constants/mockNotifications";
// import { timeAgo } from "@/src/lib/timeFormater";
// import {
//   useDeleteNotification,
//   useGetAllNotifications,
//   useMarkedNotification,
// } from "@/src/hooks/notificationHooks";
// import { useSession } from "next-auth/react";
// import { NotificationTypes } from "@/src/db/schema";
// import { toast } from "react-toastify";
// import {
//   deleteNotification,
//   markedNotification,
// } from "@/src/lib/server actions/notifications.server";
// type NotificationPanelProps = {
//   isOpen: boolean;
//   onClose: () => void;
// };
// const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
//   const [notifis, setNotifis] = useState<NotificationTypes[]>([]);
//   const [isAllMarked, setIsAllMarked] = useState<boolean>(false);
//   const [isSticky, setIsSticky] = useState<boolean>(false);
//   const panelRef = useRef<HTMLDivElement>(null);

//   const { data } = useSession();

//   const markAllRead = () => {
//     setNotifis((prev) => prev.map((n) => ({ ...n, isMarked: true })));
//     setIsAllMarked(true);
//   };

//   const handleDelete = (id: string) => {
//     if (!id) return;
//     setNotifis((prevs) => prevs.filter((p) => p.id !== id));
//   };

//   const handleClick = (n: NotificationTypes) => {
//     if (!n.isMarked) {
//       setNotifis((prev) =>
//         prev.map((item) =>
//           item.id === n.id ? { ...item, isMarked: true } : item,
//         ),
//       );
//     }
//   };

//   const {
//     data: notifications,
//     isLoading,
//     error,
//   } = useGetAllNotifications(data?.user.id);

//   const { mutate: markedNotifications, isPending: marking } =
//     useMarkedNotification();
//   const { mutate: deletedNotifications, isPending: deleting } =
//     useDeleteNotification();

//   const handleNotificationsMarked = () => {
//     try {
//       if (!data?.user.id) return;
//       markedNotifications(data?.user.id);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//         return;
//       }
//       toast.error("Failed to Marked Notifications!");
//     }
//   };

//   const handleNotificatinsDeleted = () => {
//     try {
//       if (!data?.user.id) return;
//       deletedNotifications(data?.user.id);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//         return;
//       }
//       toast.error("Failed to Marked Notifications!");
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY >= 30);
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         panelRef.current &&
//         !panelRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

 

//   useEffect(() => {
//     if (notifications && notifications?.notifications?.length > 0) {
//       setNotifis(notifications.notifications);
//     }
//   }, [notifications?.notifications.length, notifications]);

//   useEffect(() => {
//     if (notifis.some((p) => p.isMarked === false)) {
//       setIsAllMarked(false);
//     } else {
//       setIsAllMarked(true);
//     }
//   }, [notifis]);

//   if (!isOpen) return;

//   if (isLoading) {
//     return (
//       <div className="w-full min-h-screen">
//         <p className="text-gray-500">Its loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full min-h-screen">
//         <p className="text-red-500">{error.message}</p>
//       </div>
//     );
//   }

//   return (
//     <aside
//       ref={panelRef}
//       className={`
//         w-100 h-screen bg-[#f7f7f7] border-l  z-10
//         fixed right-0 flex flex-col  transition-transform duration-300 ease-in-out
//         ${isSticky ? "top-0" : "top-20"}
//           ${isOpen ? "translate-x-0" : "translate-x-full"}
//        `}
//     >
//       {/* header */}
//       <div className="flex items-center justify-end px-5 py-4  gap-3 border-[#262626] ">
//         {notifications && notifications?.totalNotifications > 0 && (
//           <>
//             {!isAllMarked && (
//               <button
//                 onClick={() => {
//                   markAllRead();
//                   handleNotificationsMarked();
//                 }}
//                 disabled={marking}
//                 className="text-[13px] text-[#ffffff] rounded-[5px] px-2 py-1 bg-green-600 hover:bg-green-800 transition-colors duration-200"
//               >
//                 {marking ? "marking..." : " Mark all read"}
//               </button>
//             )}

//             <button
//               onClick={() => {
//                 handleNotificatinsDeleted();
//                 setNotifis([]);
//               }}
//               disabled={deleting}
//               className="text-[13px] text-[#ffffff] rounded-[5px] px-2 py-1 bg-red-600 hover:bg-red-800 transition-colors duration-200"
//             >
//               {marking ? "deleting..." : "Delete All"}
//             </button>
//           </>
//         )}
//       </div>

//       {/* list */}
//       <div className="flex-1 overflow-y-auto ">
//         {notifis?.length === 0 && (
//           <div className="flex flex-col items-center justify-center h-full gap-2 pb-10 ">
//             <Bell size={28} className="text-[#404040]" />
//             <p className="text-sm text-[#525252]">No notifications yet</p>
//           </div>
//         )}

//         {notifis?.map((n) => {
//           const config = TYPE_CONFIG[n.type];
//           const isUnread = !n.isMarked;

//           return (
//             <div
//               key={n.id}
//               onClick={() => {
//                 handleClick(n);
//                 markedNotification(data?.user.id as string, n.id);
//               }}
//               className={`
//                 flex gap-3 px-4 py-3 cursor-pointer border transition-colors shadow-sm
//                 hover:bg-[#005700] group rounded-sm
//                 ${isUnread ? "bg-[#cdcaca]" : "bg-transparent"}
//               `}
//             >
//               {/* icon circle */}
//               <div
//                 className={`
//                   shrink-0 w-8 h-8 rounded-full flex items-center
//                   justify-center mt-0.5
//                   ${config.iconBg} ${config.iconColor}
//                 `}
//               >
//                 {config.icon}
//               </div>

//               {/* content */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-1">
//                   <p
//                     className={`text-sm leading-snug ${
//                       isUnread
//                         ? "font-medium text-[#2c2a2a]"
//                         : "font-normal text-[#171717]"
//                     } group-hover:text-gray-50`}
//                   >
//                     {n.title}
//                   </p>
//                   {/* unread dot */}

//                   <Trash2
//                     size={"15px"}
//                     color="red"
//                     onClick={() => {
//                       deleteNotification(data?.user.id as string, n.id);
//                       handleDelete(n.id);
//                     }}
//                   />
//                 </div>
//                 <p className="text-xs text-[#737373] mt-0.5 leading-snug line-clamp-2 group-hover:text-gray-300">
//                   {n.content}
//                 </p>
//                 <p className="text-[10px] text-[#525252] mt-1 group-hover:text-gray-300">
//                   {timeAgo(n.createdAt)}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </aside>
//   );
// };

// export default React.memo(NotificationPanel);


"use client";

import React, { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { TYPE_CONFIG } from "@/src/constants/mockNotifications";
import { timeAgo } from "@/src/lib/timeFormater";
import {
  useDeleteNotification,
  useGetAllNotifications,
  useMarkedNotification,
} from "@/src/hooks/notificationHooks";
import { useSession } from "next-auth/react";
import { NotificationTypes } from "@/src/db/schema";
import { toast } from "react-toastify";
import {
  deleteNotification,
  markedNotification,
} from "@/src/lib/server actions/notifications.server";

type NotificationPanelProps = {
  isOpen: boolean;
};

const NotificationPanel = ({ isOpen }: NotificationPanelProps) => {
  const [notifis, setNotifis] = useState<NotificationTypes[]>([]);
  const [isAllMarked, setIsAllMarked] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const { data } = useSession();

  const markAllRead = () => {
    setNotifis((prev) =>
      prev.map((n) => ({ ...n, isMarked: true })),
    );
    setIsAllMarked(true);
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    setNotifis((prev) =>
      prev.filter((p) => p.id !== id),
    );
  };

  const handleClick = (n: NotificationTypes) => {
    if (!n.isMarked) {
      setNotifis((prev) =>
        prev.map((item) =>
          item.id === n.id
            ? { ...item, isMarked: true }
            : item,
        ),
      );
    }
  };

  const {
    data: notifications,
    isLoading,
    error,
  } = useGetAllNotifications(data?.user.id);

  const {
    mutate: markedNotifications,
    isPending: marking,
  } = useMarkedNotification();

  const {
    mutate: deletedNotifications,
    isPending: deleting,
  } = useDeleteNotification();

  const handleNotificationsMarked = () => {
    try {
      if (!data?.user.id) return;
      markedNotifications(data.user.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Failed to mark notifications!");
    }
  };

  const handleNotificationsDeleted = () => {
    try {
      if (!data?.user.id) return;
      deletedNotifications(data.user.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      toast.error("Failed to delete notifications!");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY >= 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    if (
      notifications &&
      notifications.notifications?.length > 0
    ) {
      setNotifis(notifications.notifications);
    }
  }, [notifications]);

  useEffect(() => {
    setIsAllMarked(
      !notifis.some((n) => !n.isMarked),
    );
  }, [notifis]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <p className="text-gray-500">
          It's loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen">
        <p className="text-red-500">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <aside
      className={`
        w-100 h-screen bg-[#f7f7f7] border-l z-10
        fixed right-0 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSticky ? "top-0" : "top-20"}
        ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-end px-5 py-4 gap-3 border-[#262626]">
        {notifications &&
          notifications.totalNotifications > 0 && (
            <>
              {!isAllMarked && (
                <button
                  onClick={() => {
                    markAllRead();
                    handleNotificationsMarked();
                  }}
                  disabled={marking}
                  className="text-[13px] text-white rounded-[5px] px-2 py-1 bg-green-600 hover:bg-green-800 transition-colors duration-200"
                >
                  {marking
                    ? "marking..."
                    : "Mark all read"}
                </button>
              )}

              <button
                onClick={() => {
                  handleNotificationsDeleted();
                  setNotifis([]);
                }}
                disabled={deleting}
                className="text-[13px] text-white rounded-[5px] px-2 py-1 bg-red-600 hover:bg-red-800 transition-colors duration-200"
              >
                {deleting
                  ? "deleting..."
                  : "Delete All"}
              </button>
            </>
          )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {notifis.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 pb-10">
            <Bell
              size={28}
              className="text-[#404040]"
            />
            <p className="text-sm text-[#525252]">
              No notifications yet
            </p>
          </div>
        )}

        {notifis.map((n) => {
          const config = TYPE_CONFIG[n.type];
          const isUnread = !n.isMarked;

          return (
            <div
              key={n.id}
              onClick={() => {
                handleClick(n);
                markedNotification(
                  data?.user.id as string,
                  n.id,
                );
              }}
              className={`
                flex gap-3 px-4 py-3 cursor-pointer border transition-colors shadow-sm
                hover:bg-[#005700] group rounded-sm
                ${
                  isUnread
                    ? "bg-[#cdcaca]"
                    : "bg-transparent"
                }
              `}
            >
              <div
                className={`
                  shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5
                  ${config.iconBg}
                  ${config.iconColor}
                `}
              >
                {config.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p
                    className={`text-sm leading-snug ${
                      isUnread
                        ? "font-medium text-[#2c2a2a]"
                        : "font-normal text-[#171717]"
                    } group-hover:text-gray-50`}
                  >
                    {n.title}
                  </p>

                  <Trash2
                    size={15}
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();

                      deleteNotification(
                        data?.user.id as string,
                        n.id,
                      );

                      handleDelete(n.id);
                    }}
                  />
                </div>

                <p className="text-xs text-[#737373] mt-0.5 leading-snug line-clamp-2 group-hover:text-gray-300">
                  {n.content}
                </p>

                <p className="text-[10px] text-[#525252] mt-1 group-hover:text-gray-300">
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