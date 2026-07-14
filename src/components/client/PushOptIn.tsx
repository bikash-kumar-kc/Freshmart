"use client";

import { updateUserSubscriptionStatus } from "@/src/lib/server_actions/update.subscription.status.user";
import { subscribeToPush } from "@/src/lib/webpush/push-client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export function PushOptIn() {
  const [loading, setLoading] = useState(false);
  const { data } = useSession();
  const isInformed = useRef<boolean | null>(null);

  async function handleEnable() {
    if (!data?.user.id) return;
    setLoading(true);
    try {
      const subscription = await subscribeToPush();
      if (!subscription) {
        toast.error("Failed to subscribe for web push ");
        return;
      }

      await updateUserSubscriptionStatus({
        userId: data?.user.id as string,
        subscription: JSON.stringify(subscription),
      });

      toast.success("Subscribe for web push successfully");
    } catch (err) {
      console.error(err);
      const message = err as { message?: string };
      if (!message) {
        toast.error(message);
        return;
      }
      toast.error("Failed to subscribe for web push ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isInformed.current) {
      toast.info("Enable web push notification for suggested cart");
      isInformed.current = true;
    }
  }, []);

  return (
    <button
      onClick={handleEnable}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm font-medium
                text-white hover:text-gray-700 px-3 py-2 rounded-sm
                bg-green-700
                hover:bg-green-500 transition-colors"
    >
      {loading ? "Notifications Enabling..." : "Enable Web Push Notifications"}
    </button>
  );
}
