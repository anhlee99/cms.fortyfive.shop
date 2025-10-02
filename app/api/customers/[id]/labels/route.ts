import { NextRequest, NextResponse } from "next/server";
import { addLabel, removeLabel } from "@/services/customers/customer.service";
import { withAuth } from "@/lib/api/with-auth";

export const POST = withAuth(async (request: Request, ctx) => {
    const customerId = ctx.params.id;

    try {
        const data = await request.json();
        await addLabel(customerId, data.label_id);
        return NextResponse.json({ data: "Success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const DELETE = withAuth(async (req: NextRequest, ctx) => {
    const customerId = ctx.params.id;
    const labelId = req.nextUrl.searchParams.get("label_id");
    if (!labelId) {
        return NextResponse.json({ error: "label_id is required" }, { status: 400 });
    }
    try {
        await removeLabel(customerId, labelId);
        return NextResponse.json({ data: "Success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});
