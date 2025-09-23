// lib/auth/require-auth.ts
import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { User as SupaUser } from '@supabase/supabase-js'
import type { User as AppUser } from '@/types/user'

type Options = {
  redirectTo?: string
  requireClaims?: string[] | string
  unauthorizedTo?: string
}

type Claims = Record<string, unknown>

export type RequireAuthResult = {
  supabase: Awaited<ReturnType<typeof createClient>>
  user: AppUser
  claims?: Claims
}

function toAppUser(u: SupaUser): AppUser {
  const meta = u.user_metadata ?? {}
  const name = typeof (meta as Record<string, unknown>).name === 'string'
    ? (meta as Record<string, unknown>).name as string
    : ''

  const avatarUrl = typeof (meta as Record<string, unknown>).avatar_url === 'string'
    ? (meta as Record<string, unknown>).avatar_url as string
    : ''

  return {
    id: u.id,
    email: u.email ?? '',
    name,
    avatarUrl,
  }
}

/** Call inside any Server Component/page/layout */
export async function requireAuth(opts: Options = {}): Promise<RequireAuthResult> {
  const redirectTo = opts.redirectTo ?? '/auth/login'
  const unauthorizedTo = opts.unauthorizedTo ?? '/auth/error'

  const supabase = await createClient()

  // Require a logged-in user
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) redirect(redirectTo) // never returns

  // Optionally require specific JWT claims
  if (opts.requireClaims) {
    const needed = Array.isArray(opts.requireClaims) ? opts.requireClaims : [opts.requireClaims]
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims()
    const claims = claimsData?.claims as Claims | undefined

    const ok = !claimsErr && needed.every((k) => Boolean(claims?.[k]))
    if (!ok) redirect(unauthorizedTo) // never returns

    return { supabase, user: toAppUser(user), claims }
  }

  return { supabase, user: toAppUser(user) }
}
