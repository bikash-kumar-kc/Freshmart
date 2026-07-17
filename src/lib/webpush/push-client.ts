import { toast } from "react-toastify";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  try {
    if (typeof window === "undefined") {
      console.log("This is not window");
      return null;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push notifications are not supported in this browser");
    }

    // 1. Register the service worker
    let registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      registration = await navigator.serviceWorker.register("/sw.js");
    }
    // 2. Ask permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast.error("Permission not granted.");
      return null;
    }

    // 3. Check for an existing subscription first
    const isExist = await registration.pushManager.getSubscription();
    console.log("already subscribed : ", !!isExist);

    if (isExist) {
      await isExist.unsubscribe();
    }

    const applicationServerKey = urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    );

    // 4. Subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: new Uint8Array(applicationServerKey),
    });

    return subscription;
  } catch (err) {
    console.error(err);

    if (err instanceof DOMException) {
      console.log("DOMException");
      console.log("Name:", err.name);
      console.log("Message:", err.message);
      console.log("Code:", err.code);
    }

    throw err;
  }
}
