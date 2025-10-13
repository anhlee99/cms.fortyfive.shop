import webpush from "web-push";

export function webpushClient() {
  return webpush.setVapidDetails(
    "mailto:example@yourdomain.org",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
    process.env.VAPID_PRIVATE_KEY || ""
  );
}
