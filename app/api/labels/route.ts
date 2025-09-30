import { NextResponse, NextRequest } from "next/server";
import { list, create } from "@/services/labels/label.service";
import { withAuth } from "@/lib/api/with-auth";
import { LabelSearchParams, LabelType } from "@/services/labels/label.type";
import { getSearchParamsFromUrl } from "@/types/pagination";

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const searchParams = getSearchParamsFromUrl<LabelSearchParams>(req.url, (sp) => {
            return {
                type: sp.get("type") as LabelType,
            };
        });
    
        const labels = await list({
            q: searchParams.q,
            sort: searchParams.sort,
            filters: searchParams.filters,
            limit: searchParams.limit,
            page: searchParams.page,
            type: searchParams.type
        });
        return NextResponse.json({ ...labels }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const POST = withAuth(async (request: Request,  _ctx, { user }) => {
    try {
        const data = await request.json();
        const newLabel = await create({ ...data, user_id: user.id });
        return NextResponse.json({ data: newLabel }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

