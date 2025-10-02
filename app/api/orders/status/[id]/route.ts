import { NextRequest, NextResponse } from "next/server";
import { deleteOrderStatus, createOrUpdateOrderStatus } from "@/services/orders/orders.service";
import { withAuth } from "@/lib/api/with-auth";


export const PUT = withAuth(async (request: NextRequest, ctx) => {
    try {
        const { id } = ctx.params;
        const data = await request.json();
        const updatedOrderStatus = await createOrUpdateOrderStatus({ id, ...data });
        return NextResponse.json({ data: updatedOrderStatus }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const DELETE = withAuth<{id: string}>(async (_req: NextRequest, ctx) => {
    try {
        const { id } = ctx.params;
        await deleteOrderStatus(id);
        return NextResponse.json({ message: "Order status deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});


