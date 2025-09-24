import { NextResponse } from "next/server";
import { getShopById } from "@/services/shops/shop.service";

export async function GET(_req: Request, ctx: RouteContext<'/api/shops/[id]'>) {
    try {
        const { id } = await ctx.params;
        const shop = await getShopById(id);
        if (!shop) {
            return NextResponse.json({ error: "Shop not found" }, { status: 404 });
        }
        return NextResponse.json({ data: shop });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
