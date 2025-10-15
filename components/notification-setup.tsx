"use client";

import { useEffect } from "react";

export default function NotificationSetup() {
  useEffect(() => {
    async function registerSW() {
      if (!("serviceWorker" in navigator)) return;
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered:", reg);
      } catch (err) {
        console.error("Service Worker registration failed:", err);
      }
    }

    registerSW();
  }, []);

  return null;
}
