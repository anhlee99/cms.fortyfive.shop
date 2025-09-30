import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!;

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */


function getAccessToken(headers: Headers) {
  const authHeader = headers.get("authorization") || headers.get("Authorization");
  return (
    authHeader && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7)
      : null
  );
}


export async function createClient(initToken?: string) {
  // 1) Try Bearer token first (API/mobile/watch friendly)
  let accessToken: string | null = initToken || null;
  if (!accessToken) {
    const h = await headers();
    accessToken = getAccessToken(h);
  }
  if (accessToken) {
    return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON, {
        global: {
           headers: { Authorization: `Bearer ${accessToken}` },
          //  fetch: debugFetch("supabase"),
        },
        auth: { persistSession: false, autoRefreshToken: false },

    });
  }

  // 2) Fallback to cookies (SSR/RSC pages)
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}


export function debugFetch(tag = "supabase") {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : (input as Request).url;
    const method = init?.method ?? (typeof input !== "string" && (input as Request).method) ?? "GET";
    const body =
      init?.body && typeof init.body !== "string"
        ? JSON.stringify(init.body)
        : (init?.body as string | undefined);

    console.log(`[${tag}] → ${method} ${url}`);
    if (body) console.log(`[${tag}] body:`, body);

    const res = await fetch(input as any, init as any);

    const clone = res.clone();
    let text = "";
    try { text = await clone.text(); } catch {}
    console.log(
      `[${tag}] ← ${res.status}`,
      res.headers.get("content-range") ? `content-range=${res.headers.get("content-range")}` : "",
      text.slice(0, 800) // keep short
    );

    return res;
  };
}
