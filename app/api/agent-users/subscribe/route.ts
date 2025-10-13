import { NextResponse } from "next/server";
import { subscribe } from "@/services/notifications/notification.service";
import { withAuth } from "@/lib/api/with-auth";

export const POST = withAuth(async (request: Request, _ctx, { user }) => {
  try {
    const data = await request.json();
    const newAgent = await subscribe({ ...data, user_id: user.id });
    return NextResponse.json({ data: newAgent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
