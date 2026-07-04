"use client";

import SearchBar from "../client/SearchBar";
import { Heart, ShoppingCart, Truck } from "lucide-react";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  countUnreadNotifications,
  updateNotificationsStatus,
} from "@/src/lib/server actions/notifications.server";
import { useAppSelector } from "@/src/store/faviourites/hook";
import { selectFavoriteCount } from "@/src/store/faviourites/selectors";

interface IStateHandler {
  handleNotificationPanelOpen: () => void;
}

const Header = ({ handleNotificationPanelOpen }: IStateHandler) => {
  const { data } = useSession();
  console.log(data);
  const [count, setCount] = useState<number>(0);
  const changeNotificationRef = useRef<boolean | null>(null);
  const favoriteItems = useAppSelector(selectFavoriteCount);

  const handleUnreadNotification = useCallback(async () => {
    try {
      if (data?.user.id) {
        const { totalCount } = await countUnreadNotifications(data?.user.id);
        setCount(totalCount);
        console.log("Successfully, fetched unread notification !");
      }
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to read unread notification !");
      console.log(error);
    }
  }, [data?.user.id]);

  const handleNotificationStatusUpdate = async () => {
    if (changeNotificationRef.current) return;
    if (!data?.user.id) return;
    try {
      await updateNotificationsStatus(data?.user.id);
      setCount(0);
      changeNotificationRef.current = true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Failed to update notification status!");
    }
  };

  useEffect(() => {
    handleUnreadNotification();
  }, [handleUnreadNotification]);

  return (
    <div
      className="w-full px-4 py-3 flex items-center justify-between gap-8
             bg-green-400 backdrop-blur-xl shadow-sm z-80
             border-b border-white/20"
    >
      <Link href={"/"}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl ">🌿</span>
          <span className="text-lg font-extrabold italic text-white tracking-wider">
            FRESHMART
          </span>
        </div>
      </Link>
      <div className="flex-1">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <button className="p-2 rounded-full bg-white/80 transition-all hover:bg-transparent hover:scale-110">
            <IoIosNotifications
              size={24}
              className="text-black group-hover:text-white transition-colors"
              onClick={() => {
                handleNotificationPanelOpen();
                handleNotificationStatusUpdate();
              }}
            />
          </button>

          {/* Badge */}
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </div>

        <Link href={"/cart"}>
          <div className="relative group">
            <button className="p-2 rounded-full bg-white/80 transition-all hover:bg-transparent hover:scale-110">
              <ShoppingCart className="text-black group-hover:text-white transition-colors" />
            </button>

            {/* Badge */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </div>
        </Link>

        <Link href={"/favorites"}>
          <div className="relative group">
            <button className="p-2 rounded-full bg-white/80 transition-all hover:bg-transparent hover:scale-110">
              <Heart className="text-black group-hover:text-white transition-colors" />
            </button>
            {favoriteItems ? favoriteItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {favoriteItems}
              </span>
            ):""}
          </div>
        </Link>

        <div className="relative group">
          <Link href={"/orderstatus"}>
            <button className="p-2 rounded-full bg-white/80 transition-all hover:bg-transparent hover:scale-110">
              <Truck className="text-black group-hover:text-white transition-colors" />
            </button>
          </Link>
        </div>

        {data?.user.id ? (
          <div>
            <button className="group p-2 rounded-full bg-white/80 text-black shadow-md backdrop-blur-sm transition-all hover:bg-transparent hover:scale-110">
              <MdOutlinePersonRemoveAlt1
                size={24}
                className="text-xl transition-transform group-hover:text-white"
                onClick={() => signOut({ callbackUrl: "/" })}
              />
            </button>
          </div>
        ) : (
          <>
            <Link href={"/auth/register"}>
              <button className="group p-2 rounded-full bg-white/80 text-black shadow-md backdrop-blur-sm transition-all hover:bg-transparent hover:scale-110">
                <IoPersonAddSharp
                  size={24}
                  className="text-xl transition-transform group-hover:text-white"
                />
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
