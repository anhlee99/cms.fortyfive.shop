import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/services/auth/auth.service";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const result = await signUp(data);
    //
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
