import { NextResponse, NextRequest } from "next/server";
import { list, create } from "@/services/agent-users/agent-user.service";
import { withAuth } from "@/lib/api/with-auth";
import { AgentUserSearchParams } from "@/services/agent-users/agent-user.type";
import { getSearchParamsFromUrl } from "@/types/pagination";

export const GET = withAuth(async (req: NextRequest, ctx, { user }) => {
  try {
    const searchParams = getSearchParamsFromUrl<AgentUserSearchParams>(req.url);

    const agents = await list(user, {
      q: searchParams.q,
      sort: searchParams.sort,
      filters: searchParams.filters,
      limit: searchParams.limit,
      page: searchParams.page,
      status: searchParams.status,
    });
    return NextResponse.json({ ...agents }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: Request, _ctx, { user }) => {
  try {
    const data = await request.json();
    const newAgent = await create({ ...data, agentId: user.agentId });
    return NextResponse.json({ data: newAgent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
