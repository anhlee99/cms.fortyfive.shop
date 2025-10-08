import { NextResponse, NextRequest } from "next/server";
import { list, create } from "@/services/orders/orders.service";
import { withAuth } from "@/lib/api/with-auth";
import { OrderSearchParams } from "@/services/orders/orders.type";
import { getSearchParamsFromUrl } from "@/types/pagination";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const searchParams = getSearchParamsFromUrl<OrderSearchParams>(
      req.url,
      (sp) => {
        return {
          order_status_id: sp.get("order_status_id") || undefined,
        };
      }
    );

    const orders = await list({
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
    const newOrder = await create({ ...data, user_id: user.id });
    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
