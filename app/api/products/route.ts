import { NextResponse, NextRequest } from "next/server";
import { list, create } from "@/services/products/product.service";
import { withAuth } from "@/lib/api/with-auth";
import { ProductSearchParams } from "@/services/products/product.type";
import { getSearchParamsFromUrl } from "@/types/pagination";
import { notifyUsers } from "@/services/notifications/notification.service";

export const GET = withAuth(async (req: NextRequest, _ctx, { user }) => {
  try {
    const searchParams = getSearchParamsFromUrl<ProductSearchParams>(req.url);
    const products = await list(user, {
      q: searchParams.q,
      sort: searchParams.sort,
      filters: searchParams.filters,
      limit: searchParams.limit,
      page: searchParams.page,
    });
    return NextResponse.json({ ...products }, { status: 200 });
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
    const newProduct = await create({ ...data, agent_id: user.agentId });

    await notifyUsers(user.id, {
      title: "New Product",
      body: "You have a new product.",
      url: "/products",
    });

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
