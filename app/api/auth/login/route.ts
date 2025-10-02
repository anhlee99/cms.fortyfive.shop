import { NextRequest, NextResponse } from "next/server";
import { login } from "@/services/auth/auth.service";

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();
        const result = await login(data.username, data.password);
        return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}