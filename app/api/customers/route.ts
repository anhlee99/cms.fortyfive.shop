import { NextResponse, NextRequest } from "next/server";
import { list, create } from "@/services/customers/customer.service";
import { withAuth } from "@/lib/api/with-auth";
import { CustomerSearchParams } from "@/services/customers/customer.type";
import { getSearchParamsFromUrl } from "@/types/pagination";

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const searchParams = getSearchParamsFromUrl<CustomerSearchParams>(req.url);
        const customers = await list({
            q: searchParams.q,
            sort: searchParams.sort,
            filters: searchParams.filters,
            limit: searchParams.limit,
            page: searchParams.page
        });
        return NextResponse.json({ ...customers }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});

export const POST = withAuth(async (request: Request, _ctx, { user }) => {
    try {
        const data = await request.json();
        const newCustomer = await create({ ...data, user_id: user.id });
        return NextResponse.json({ data: newCustomer }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});