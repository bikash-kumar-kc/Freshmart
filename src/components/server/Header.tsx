"use client";

import SearchBar from "../client/SearchBar";
import Image from "next/image";
import { Heart, ShoppingCart, Truck } from "lucide-react";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { countUnreadNotifications } from "@/src/app/api/server action/notifications.server";

interface IStateHandler {
  handleNotificationPanelOpen: () => void;
}

const Header = ({ handleNotificationPanelOpen }: IStateHandler) => {
  const { data } = useSession();
  const [count, setCount] = useState<number>(0);

  const handleUnreadNotification = useCallback(async () => {
    try {
      console.log("hejasef");
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

  useEffect(() => {
    handleUnreadNotification();
  }, [handleUnreadNotification]);

  return (
    <div
      className="w-full px-4 py-3 flex items-center justify-between gap-8
             bg-green-400 backdrop-blur-xl shadow-sm
             border-b border-white/20"
    >
      <div className="">
        <Image
          src="/fasto_logo.png"
          alt={"logo"}
          width={100}
          height={10}
          priority
        />
      </div>

      <div className="flex-1">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group">
          <button className="p-2 rounded-full bg-white/80 transition-all hover:bg-transparent hover:scale-110">
            <IoIosNotifications
              size={24}
              className="text-black group-hover:text-white transition-colors"
              onClick={() => handleNotificationPanelOpen()}
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

        <div className="relative group">
          <button className="p-2 rounded-full bg-white/80 transition-all hover:bg-transparent hover:scale-110">
            <Heart className="text-black group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="relative group">
          <button className="p-2 rounded-full bg-white/80 transition-all hover:bg-transparent hover:scale-110">
            <Truck className="text-black group-hover:text-white transition-colors" />
          </button>
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
