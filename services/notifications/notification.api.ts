import { createHttp } from "@/lib/http/http";
import { CreateDeviceSubscriptionDTO } from "./notification.type";
const http = createHttp({});

export async function subscribe(
  data: CreateDeviceSubscriptionDTO
): Promise<any> {
  try {
    const res = await http.post<{ data: any }>(
      "/api/agent-users/subscribe",
      data
    );
    return res.data;
  } catch (error) {
    throw new Error("Failed to create customer");
  }
}
export async function unsubscribe(
  userId: string,
  push_token: string
): Promise<any> {
  try {
    const res = await http.post<{ data: any }>("/api/agent-users/unsubscribe", {
      userId,
      push_token,
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to unsubscribe");
  }
}
