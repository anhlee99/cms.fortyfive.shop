import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as Supabase } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { User as AppUser } from '@/types/user'
import {toAppUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

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

export async function getAuthFromRequest(req: NextRequest): Promise<AuthContext | null> {
  const accessToken = getAccessToken(req);
  if (!accessToken) return null;

  // Create a user-scoped client (RLS on)
  const supabase = await createClient(accessToken);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  
  // Convert to app user type
  return { user: toAppUser(data.user), accessToken, supabase };

}

export function withAuth(
  handler: (req: NextRequest, auth: AuthContext) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const auth = await getAuthFromRequest(req);
    // if (!auth) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    if (!auth) {
      return redirect('/auth/login?next=' + encodeURIComponent(req.url));
    }

    try {
      return await handler(req, auth);
    } catch (e: any) {
      return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
    }
  };
}
