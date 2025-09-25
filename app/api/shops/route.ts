import { NextResponse, NextRequest } from "next/server";
import { listShops, createShop } from "@/services/shops/shop.service";
import { withAuth } from "@/lib/api/with-auth";


export const GET = withAuth(async (_req: NextRequest) => {
    try {
        const shops = await listShops();
        return NextResponse.json({ data: shops }, { status: 200 });
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