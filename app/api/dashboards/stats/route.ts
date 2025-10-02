import { NextResponse, NextRequest } from "next/server";
import { getStats } from "@/services/dashboards/dashboards.service";
import { withAuth } from "@/lib/api/with-auth";
import { DashboardStatsSearchParams } from "@/services/dashboards/dashboards.type";
import { getSearchParamsFromUrl } from "@/types/pagination";

export const GET = withAuth(async (req: NextRequest) => {
    try {
        const searchParams = getSearchParamsFromUrl<DashboardStatsSearchParams>(req.url, (sp) => {
            return {
                timeView: sp.get("timeView") as DashboardStatsSearchParams["timeView"],
            };
        });
    
        const stats = await getStats({
            ...searchParams,
        });
        return NextResponse.json({ ...stats }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});
