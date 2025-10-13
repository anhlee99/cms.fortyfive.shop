// lib/auth/require-auth.ts
import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User as SupaUser } from "@supabase/supabase-js";
import type { User as AppUser, UserClaims } from "@/services/auth/auth.type";
import { AgentRole } from "@/services/agent-users/agent-user.type";

type Options = {
  redirectTo?: string;
  requireClaims?: string[] | string;
  unauthorizedTo?: string;
};

export type RequireAuthResult = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: AppUser;
  claims?: UserClaims;
};

export function toAppUser(u: SupaUser): AppUser {
  const meta = u.user_metadata ?? {};
  const name =
    typeof (meta as Record<string, unknown>).name === "string"
      ? ((meta as Record<string, unknown>).name as string)
      : "";

  const avatarUrl =
    typeof (meta as Record<string, unknown>).avatar_url === "string"
      ? ((meta as Record<string, unknown>).avatar_url as string)
      : "";

  const appMeta = u.app_metadata ?? {};
  const agentId =
    typeof (appMeta as Record<string, unknown>).agent_id === "string"
      ? ((appMeta as Record<string, unknown>).agent_id as string)
      : "";

  const role =
    typeof (appMeta as Record<string, unknown>).role === "string"
      ? ((appMeta as Record<string, unknown>).role as AgentRole)
      : "owner"; // default to owner

  return {
    id: u.id,
    role: role,
    agentId: agentId,
    email: u.email ?? "",
    name,
    avatarUrl,
  };
}

function toAppUserFromClaims(claims: UserClaims): AppUser {
  const appMeta =
    claims.app_metadata && !Array.isArray(claims.app_metadata)
      ? claims.app_metadata
      : {};

  return {
    id: claims.sub,
    role: (appMeta as { role?: AgentRole }).role ?? "owner",
    agentId: (appMeta as { agent_id?: string }).agent_id ?? "",
    name: claims.name ?? "",
    email: claims.email ?? "",
  };
}

/** Call inside any Server Component/page/layout */
export async function requireAuth(
  opts: Options = {}
): Promise<RequireAuthResult> {
  const redirectTo = opts.redirectTo ?? "/auth/login";
  const unauthorizedTo = opts.unauthorizedTo ?? "/auth/error";

  const supabase = await createClient();

  // Require a logged-in user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) redirect(redirectTo); // never returns

  // Optionally require specific JWT claims
  if (opts.requireClaims) {
    const needed = Array.isArray(opts.requireClaims)
      ? opts.requireClaims
      : [opts.requireClaims];
    const { data: claimsData, error: claimsErr } =
      await supabase.auth.getClaims();
    const claims = claimsData?.claims as UserClaims | undefined;

    const ok = !claimsErr && needed.every((k) => Boolean(claims?.[k]));
    if (!ok) redirect(unauthorizedTo); // never returns

    return { supabase, user: toAppUser(user), claims };
  }

  return { supabase, user: toAppUser(user) };
}

export async function requireSession(opts: Options = {}) {
  const redirectTo = opts.redirectTo ?? "/auth/login";
  const unauthorizedTo = opts.unauthorizedTo ?? "/auth/error";

  const supabase = await createClient();

  // Fast path: decode JWT locally (no network)
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims as UserClaims | undefined;

  // No valid token → redirect
  if (!claims) redirect(redirectTo);

  // Optional claims gating
  if (opts.requireClaims) {
    const needed = Array.isArray(opts.requireClaims)
      ? opts.requireClaims
      : [opts.requireClaims];
    const ok = needed.every((k) => Boolean(claims?.[k]));
    if (!ok) redirect(unauthorizedTo);
  }

  return { supabase, user: toAppUserFromClaims(claims), claims };
}
