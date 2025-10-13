"use client";
import { unsubscribe as handleUnsubscribe } from "@/services/notifications/notification.api";

// -------------------------
export async function unsubscribe(userId: string) {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return; // Already unsubscribed

  // Unsubscribe in the browser
  const success = await subscription.unsubscribe();
  if (!success) console.warn("Failed to unsubscribe");

  handleUnsubscribe(userId, subscription.endpoint);
}
