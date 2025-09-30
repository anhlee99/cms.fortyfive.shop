import { NextRequest, NextResponse } from "next/server";
import { getById, update, del } from "@/services/labels/label.service";
import { withAuth } from "@/lib/api/with-auth";

export const GET = withAuth<{id:string}>(async (req: NextRequest, {params}) => {
    try {
        const label = await getById(params.id);
         if (!label) {
            return NextResponse.json({ error: "Label not found" }, { status: 404 });
        }
        return NextResponse.json({ data: label }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const PUT = withAuth(async (request: NextRequest, {params}, auth) => {
    try {
        const { id } = params;
        const data = await request.json();
        const updatedLabel = await update(id, { ...data, user_id: auth.user.id });
        return NextResponse.json({ data: updatedLabel }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const DELETE = withAuth(async (_req: NextRequest, {params}) => {
    try {
        const { id } = params;
        await del(id);
        return NextResponse.json({ message: "Label deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});


