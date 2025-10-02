import { NextResponse } from "next/server";
import { createOrUpdateOrderStatus, listOrderStatuses } from "@/services/orders/orders.service";
import { withAuth } from "@/lib/api/with-auth";

export const GET = withAuth(async () => {
    try {
        const orderStatuses = await listOrderStatuses();
        return NextResponse.json({ data: orderStatuses }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const POST = withAuth(async (request: Request, _ctx, { user }) => {
    try {
        const data = await request.json();
        const newOrderStatus = await createOrUpdateOrderStatus({ ...data, user_id: user.id });
        return NextResponse.json({ data: newOrderStatus }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});
