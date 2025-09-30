import { NextResponse } from "next/server";
import { getById } from "@/services/shops/shop.service";

export async function GET(_req: Request, ctx: RouteContext<'/api/shops/[id]'>) {
    try {

        // log userId
        const { id } = await ctx.params;
        const shop = await getById(id);
        if (!shop) {
            return NextResponse.json({ error: "Shop not found" }, { status: 404 });
        }
        return NextResponse.json({ data: shop });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
