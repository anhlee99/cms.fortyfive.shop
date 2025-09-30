import { NextRequest, NextResponse } from "next/server";
import { getById, update, del } from "@/services/products/product.service";
import { withAuth } from "@/lib/api/with-auth";

export const GET = withAuth(async (_req: NextRequest, ctx) => {
    try {
        const { id } = ctx.params;
        const product = await getById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ data: product }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const PUT = withAuth(async (request: Request, _ctx, auth) => {
    try {
        const { id } = _ctx.params;
        const data = await request.json();
        const updatedProduct = await update(id, { ...data, user_id: auth.user.id });
        return NextResponse.json({ data: updatedProduct }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});
  
export const DELETE = withAuth(async (_req: NextRequest, _ctx) => {
    try {
        const { id } = _ctx.params;
        await del(id);
        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});


