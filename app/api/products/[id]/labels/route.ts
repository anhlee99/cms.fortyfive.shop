import { NextRequest, NextResponse } from "next/server";
import { addLabel, removeLabel } from "@/services/products/product.service";
import { withAuth } from "@/lib/api/with-auth";

export const POST = withAuth(async (request: Request, ctx) => {
    const productId = ctx.params.id;

    try {
        const data = await request.json();
        await addLabel(productId, data.label_id);
        return NextResponse.json({ data: "Success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const DELETE = withAuth(async (req: NextRequest, ctx) => {
    const productId = ctx.params.id;
    const labelId = req.nextUrl.searchParams.get("label_id");
    if (!labelId) {
        return NextResponse.json({ error: "label_id is required" }, { status: 400 });
    }
    try {
        await removeLabel(productId, labelId);
        return NextResponse.json({ data: "Success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});
