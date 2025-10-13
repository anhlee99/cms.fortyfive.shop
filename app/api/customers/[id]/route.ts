import { NextRequest, NextResponse } from "next/server";
import { getById, update, del } from "@/services/customers/customer.service";
import { withAuth } from "@/lib/api/with-auth";

export const GET = withAuth(async (_req: NextRequest, ctx) => {
  try {
    const { id } = ctx.params;
    const customer = await getById(id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: customer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request: Request, _ctx, { user }) => {
  try {
    const { id } = _ctx.params;
    const data = await request.json();
    const updatedCustomer = await update(id, {
      ...data,
      user_id: user.id,
      agent_id: user.agentId,
    });
    return NextResponse.json({ data: updatedCustomer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (_req: NextRequest, _ctx) => {
  try {
    const { id } = _ctx.params;
    await del(id);
    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
});
