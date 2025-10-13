import { NextResponse, NextRequest } from "next/server";
import { list, create } from "@/services/orders/orders.service";
import { withAuth } from "@/lib/api/with-auth";
import { OrderSearchParams } from "@/services/orders/orders.type";
import { getSearchParamsFromUrl } from "@/types/pagination";
import { notifyUsers } from "@/services/notifications/notification.service";

export const GET = withAuth(async (req: NextRequest, _ctx, { user }) => {
  try {
    const searchParams = getSearchParamsFromUrl<OrderSearchParams>(
      req.url,
      (sp) => {
        return {
          order_status_id: sp.get("order_status_id") || undefined,
        };
      }
    );

    const orders = await list(user, {
      ...searchParams,
    });
    return NextResponse.json({ ...orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: Request, _ctx, { user }) => {
  try {
    const data = await request.json();
    const newOrder = await create({ ...data, agent_id: user.agentId });

    await notifyUsers(user.id, {
      title: "New Order",
      body: "You have a new order.",
      url: "/orders",
    });

    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
