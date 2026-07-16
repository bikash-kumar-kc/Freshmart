import { toast } from "react-toastify";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  try {
    console.log("1")
    if (typeof window === "undefined") {
      console.log("This is not window");
      return null;
    }
    console.log("2")
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("Push notifications are not supported in this browser");
    }

    console.log("3")

    // 1. Register the service worker
    let registration = await navigator.serviceWorker.getRegistration();

if (!registration) {
  registration = await navigator.serviceWorker.register("/sw.js");
}
console.log("4")
    // 2. Ask permission
    const permission = await Notification.requestPermission();
    console.log(permission)
    if (permission !== "granted") {
      toast.error("Permission not granted.")
      return null;
    }

    console.log("5")

    // 3. Check for an existing subscription first
    let subscription = await registration.pushManager.getSubscription();
    if (subscription) return subscription;
console.log("6")

    const applicationServerKey = urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    );

    console.log("applicationServerKey");
    console.log(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
    console.log(applicationServerKey)
    console.log(new Uint8Array(applicationServerKey))

    // 4. Subscribe
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: new Uint8Array(applicationServerKey),
    });

    console.log("7")

    return subscription;
  } catch (error) {
    console.log("error from web push notification");
    console.log(error);
    return null;
  }
}
