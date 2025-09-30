import { NextRequest, NextResponse } from "next/server";
import { getById, update, del } from "@/services/orders/orders.service";
import { withAuth } from "@/lib/api/with-auth";

export const GET = withAuth(async (_req: NextRequest, ctx) => {
    try {
        const { id } = ctx.params;
        const order = await getById(id);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ data: order }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const PUT = withAuth(async (request: NextRequest, ctx) => {
    try {
        const { id } = ctx.params;
        const data = await request.json();
        const updatedOrder = await update({ id, ...data });
        return NextResponse.json({ data: updatedOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const DELETE = withAuth<{id: string}>(async (_req: NextRequest, ctx) => {
    try {
        const { id } = ctx.params;
        await del(id);
        return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});


