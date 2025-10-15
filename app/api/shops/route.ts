import { NextResponse, NextRequest } from "next/server";
import { list, create } from "@/services/shops/shop.service";
import { withAuth } from "@/lib/api/with-auth";
import { ShopSearchParams, ShopStatus } from "@/services/shops/shop.type";
import { getSearchParamsFromUrl } from "@/types/pagination";

export const GET = withAuth(async (req: NextRequest, ctx, { user }) => {
  try {
    const searchParams = getSearchParamsFromUrl<ShopSearchParams>(
      req.url,
      (sp) => {
        return {
          status: sp.get("status") as ShopStatus,
        };
      }
    );

    const shops = await list(user, {
      q: searchParams.q,
      sort: searchParams.sort,
      filters: searchParams.filters,
      limit: searchParams.limit,
      page: searchParams.page,
      status: searchParams.status,
    });
    return NextResponse.json({ ...shops }, { status: 200 });
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
    const newShop = await create({ ...data, agent_id: user.agentId });
    return NextResponse.json({ data: newShop }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
