import { createClient } from "@/lib/supabase/client";

export const browserTokenProvider = async () => {
  const { data: { session } } = await createClient().auth.getSession();
  return session?.access_token ?? null;
};
