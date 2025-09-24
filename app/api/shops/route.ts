import { NextResponse, NextRequest } from "next/server";
import { listShops, createShop } from "@/services/shops/shop.service";
import { withAuth } from "@/lib/api/with-auth";


export const GET = withAuth(async (_req: NextRequest, { user }) => {
    try {
        const shops = await listShops();
        return NextResponse.json({ data: shops, user });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newShop = await createShop(data);
        return NextResponse.json({ data: newShop }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}