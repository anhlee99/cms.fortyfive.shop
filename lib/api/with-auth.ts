import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as Supabase } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { User as AppUser } from "@/services/auth/auth.type";
import { toAppUser } from "@/lib/auth";

export type AuthContext = {
  user: AppUser;
  accessToken: string;
  supabase: ReturnType<typeof Supabase<Database>>;
};

function getAccessToken(req: NextRequest) {
  const h = req.headers.get("authorization");
  if (h?.startsWith("Bearer ")) return h.slice(7);
  return req.cookies.get("sb-access-token")?.value ?? null;
}

export async function getAuthFromRequest(
  req: NextRequest
): Promise<AuthContext | null> {
  const accessToken = getAccessToken(req);
  if (!accessToken) return null;

  // Create a user-scoped client (RLS on)
  const supabase = await createClient(accessToken);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  // Convert to app user type
  return { user: toAppUser(data.user), accessToken, supabase };
}

// A helper to model "maybe a promise"
export type DynamicRouteCtx<P extends Record<string, string>> = {
  params: Promise<P>;
};

export function withAuth<P extends Record<string, string>>(
  handler: (
    req: NextRequest,
    ctx: { params: P },
    auth: AuthContext
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    ctx: DynamicRouteCtx<P>
  ): Promise<NextResponse> => {
    const auth = await getAuthFromRequest(req);

    if (!auth) {
      const url = new URL("/auth/login", req.nextUrl);
      url.searchParams.set("next", req.nextUrl.toString());
      return NextResponse.redirect(url);
    }

    try {
      const resolved = { params: await ctx.params };

      // const resolved: ResolvedCtx<P> = { params: await ctx.params };
      return await handler(req, resolved, auth);
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message ?? "Server error" },
        { status: 500 }
      );
    }
  };
}
