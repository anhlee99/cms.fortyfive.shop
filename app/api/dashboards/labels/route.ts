import { NextResponse, NextRequest } from "next/server";
import { getLabelSaleCircleData } from "@/services/dashboards/dashboards.service";
import { withAuth } from "@/lib/api/with-auth";
import { TimeView } from "@/services/dashboards/dashboards.type";

export const GET = withAuth(async (req: NextRequest ) => {
    try {
        const timeview = req.nextUrl.searchParams.get("timeview") as TimeView;
        const labels = req.nextUrl.searchParams.getAll("labels");

        const labelsReport = await getLabelSaleCircleData(timeview, labels);
        return NextResponse.json({ ...labelsReport }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});
