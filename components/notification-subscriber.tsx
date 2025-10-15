"use client";

import { useEffect } from "react";
import { subscribe } from "@/services/notifications/notification.api";
interface NotificationSubscriberProps {
  userId: string;
}

export default function NotificationSubscriber({
  userId,
}: NotificationSubscriberProps) {
  useEffect(() => {
    if (!userId) return;
    requestNotificationPermission(userId);
  }, [userId]);

  return null; // this component renders nothing
}

// -------------------------
async function requestNotificationPermission(userId: string) {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const registration = await navigator.serviceWorker.register("/sw.js");

    // Check if already subscribed
    const existing = await registration.pushManager.getSubscription();
    if (existing) return;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    // await fetch("/api/agent-users/subscribe", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ user_id: userId, subscription }),
    // });
    subscribe({
      user_id: userId,
      device_type: "web",
      push_token: subscription.endpoint,
      p256dh: subscription.toJSON().keys?.p256dh || "",
      auth: subscription.toJSON().keys?.auth || "",
    });
  }
}

// Helper
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}
