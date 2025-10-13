// import fcm from "fcm-node";
// import apns from "apn";

import {
  CreateDeviceSubscriptionDTO,
  DeviceSubscription,
} from "./notification.type";
import { createClient } from "@/lib/supabase/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

async function sendNotification(
  subscription: DeviceSubscription,
  payload: any
) {
  switch (subscription.device_type) {
    case "web":
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.push_token,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          JSON.stringify(payload)
        );
      } catch (err: any) {
        // Most important: surface status & body if present
        console.error("err.statusCode:", err.statusCode ?? err.status ?? null);
        if (err.body) {
          // err.body can be Buffer, string, or object
          try {
            const bodyStr =
              typeof err.body === "string" ? err.body : err.body.toString();
            console.error("err.body (raw):", bodyStr);
            try {
              console.error("err.body (json):", JSON.parse(bodyStr));
            } catch (_) {}
          } catch (e) {
            console.error("Could not stringify err.body", e);
          }
        }
        console.error(err.stack ?? err);

        const status = err.statusCode ?? err.status ?? null;
        if (status === 410 || status === 404) {
        }
      }

      break;
    case "android":
      //   await fcm.sendToDevice(subscription.push_token, payload);
      break;
    case "ios":
      //   await apns.sendToDevice(subscription.push_token, payload);
      break;
  }
}

export async function subscribe(device: CreateDeviceSubscriptionDTO) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("device_subscriptions")
    .insert(device);
  if (error) {
    console.error("Error saving subscription:", error);
    return;
  }
  return data;
}

export async function unsubscribe(userId: string, push_token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("device_subscriptions")
    .update({ is_enabled: false })
    .eq("user_id", userId)
    .eq("push_token", push_token);
  if (error) {
    console.error("Error unsubscribing:", error);
    return;
  }
  return data;
}

export async function notifyUsers(userId: string, payload: any) {
  const supabase = await createClient();
  const { data: subscriptions, error } = await supabase
    .from("device_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("is_enabled", true);
  if (error) {
    console.error("Error fetching subscriptions:", error);
    return;
  }
  if (subscriptions && subscriptions.length > 0) {
    await Promise.all(
      subscriptions.map((sub) => sendNotification(sub, payload))
    );
  }
}

export async function notifyAgentUsers(agentId: string, payload: any) {
  const supabase = await createClient();
  const { data: subscriptions, error } = await supabase
    .from("device_subscriptions")
    .select(
      `
      *,
      agent_users:user_id(id, agent_id)
    `
    )
    .eq("is_enabled", true)
    .eq("agent_users.agent_id", agentId);
  if (error) {
    console.error("Error fetching subscriptions:", error);
    return;
  }
  if (subscriptions && subscriptions.length > 0) {
    await Promise.all(
      subscriptions.map((sub) => sendNotification(sub, payload))
    );
  }
}
