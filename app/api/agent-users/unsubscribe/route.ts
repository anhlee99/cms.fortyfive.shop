import { NextResponse } from "next/server";
import { unsubscribe } from "@/services/notifications/notification.service";
import { withAuth } from "@/lib/api/with-auth";

export const POST = withAuth(async (request: Request, _ctx, { user }) => {
  try {
    const data = await request.json();
    const unsubscribed = await unsubscribe(user.id, data.push_token);
    return NextResponse.json({ data: unsubscribed }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
