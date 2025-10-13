import NotificationSubscriber from "@/components/notification-subscriber";
import { requireSession } from "@/lib/auth";
import NotificationControls from "@/components/notification-control";
import NotificationSetup from "@/components/notification-setup";

export default async function Page() {
  const { user } = await requireSession();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NotificationSetup />
      <NotificationSubscriber userId={user.id} />
      <NotificationControls userId={user.id} />

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
