import { success } from 'zod';
"use client";

import { useCallback, useEffect, useState } from "react";
import { subscriptionNotify } from "../lib/serverAction";
import { unsubscriptionNotify } from "../lib/serverAction";

type PERMISSIONSTATE = "default" | "granted" | "denied";
type SUBSCRIPATIONSTATE =
  | "loading"
  | "subscribed"
  | "unsubscribed"
  | "idle"
  | "failed";

interface IERRORTYPES {
  success: false;
  message: string;
}

export const usePushNotification = () => {
  const [permission, setPermission] = useState<PERMISSIONSTATE>("default");
  const [subscription, setSubscription] = useState<SUBSCRIPATIONSTATE>("idle");
  const [error, setError] = useState<IERRORTYPES>({
    success: false,
    message: "",
  });
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission as PERMISSIONSTATE);

      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setSubscription("subscribed");
        });
      });
    }
  }, []);

  const subscriptionHandler = useCallback(async () => {
    setError({ success: false, message: "" });
    setSubscription("loading");

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const result = await Notification.requestPermission();
      setPermission(result as PERMISSIONSTATE);

      if (result !== "granted") {
        throw new Error("Notification permission is denied");
      }

      const vapidKey = process.env.NEXT_VAPID_PUBLIC_KEY!;

      if (!vapidKey) throw new Error("VAPID public key is not configured !");

      const subscriptionNotify:PushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const res = await subscriptionNotify({sub:subscriptionNotify,userId})


      if (!res.success) throw new Error("Failed to registered subscription !");
      setSubscription("subscribed");
    } catch (err: unknown) {
      const error = err as Error;
      setError({ success: false, message: error.message });
      setSubscription("failed");
    }
  }, []);

  const unsubscribeHandler = useCallback(async () => {
    setError({ success: false, message: "" });
    setSubscription("loading");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscriptionNotify =
        await registration.pushManager.getSubscription();

      if (subscription) {
        await subscriptionNotify?.unsubscribe();
      await unsubscriptionNotify({userId});
      }

      setSubscription("unsubscribed");
    } catch (err: unknow) {
      const error = err as Error;
      setError({ success: false, message: error.message });
    }
  },[]);


  return {
    error,
    subscription,
    permission,
    subscriptionHandler,
    unsubscribeHandler,
    isSupported
  }
};

export default usePushNotification;
