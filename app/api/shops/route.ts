import { NextResponse, NextRequest } from "next/server";
import { listShops, createShop } from "@/services/shops/shop.service";
import { withAuth } from "@/lib/api/with-auth";
import { ShopSearchParams } from "@/services/shops/shop.type";
import { getSearchParamsFromUrl } from "@/types/pagination";

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const searchParams = getSearchParamsFromUrl<ShopSearchParams>(req.url);
    
        const shops = await listShops({
            q: searchParams.q,
            sort: searchParams.sort,
            filters: searchParams.filters,
            limit: searchParams.limit,
            page: searchParams.page,
            status: searchParams.status
        });
        return NextResponse.json({ ...shops }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const POST = withAuth(async (request: Request, { user }) => {
    try {
        const data = await request.json();
        const newShop = await createShop({ ...data, user_id: user.id });
        return NextResponse.json({ data: newShop }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});