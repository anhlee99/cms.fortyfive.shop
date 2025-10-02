import { NextResponse, NextRequest } from "next/server";
import { getTopSaleProducts } from "@/services/dashboards/dashboards.service";
import { withAuth } from "@/lib/api/with-auth";
import { TimeView } from "@/services/dashboards/dashboards.type";

export const GET = withAuth(async (req: NextRequest ) => {
    try {
        const timeview = req.nextUrl.searchParams.get("timeview") as TimeView;
        const limit = req.nextUrl.searchParams.get("limit") ;
        const isNegative = req.nextUrl.searchParams.get("isNegative");
        const labels = req.nextUrl.searchParams.getAll("labels");

        const products = await getTopSaleProducts(timeview, Number(limit), Boolean(isNegative), labels);
        return NextResponse.json({ ...products }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});
