// app/components/NotificationControls.tsx
"use client";

import { unsubscribe } from "@/hooks/notification";

interface Props {
  userId: string;
}

export default function NotificationControls({ userId }: Props) {
  const handleUnsubscribe = async () => {
    await unsubscribe(userId);
    alert("Unsubscribed from notifications");
  };

  return (
    <button onClick={handleUnsubscribe}>Unsubscribe from Notifications</button>
  );
}

// <button onClick={handleUnsubscribe}>Unsubscribe from Notifications</button>
