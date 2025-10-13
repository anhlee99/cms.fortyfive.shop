import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { User, UserSignUpData } from "@/services/auth/auth.type";

export async function login(username: string, password: string) {
  const supabase = await createClient();
  // Implement your login logic here, e.g., call an external API or check a database
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });
  if (error) {
    throw new Error("Invalid username or password");
  }

  return { token: data.session.access_token };
}

export async function logout(token: string) {
  const supabase = await createClient(token);
  // Implement your logout logic here, e.g., invalidate a token or clear a session
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Failed to log out");
  }

  return true;
}

export async function signUp(input: UserSignUpData): Promise<User> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: input.option,
  });
  console.log("signUp data", data, error);
  if (error && data.user === null) {
    throw new Error(error.message);
  }

  // handle create extra
  const { data: extraData, error: extraError } = await supabase.rpc(
    "handle_user_sign_up",
    {
      p_input: {
        user_id: data.user?.id,
        email: input.email,
        raw_user_meta_data: input.option?.data,
      },
    }
  );

  if (extraError) {
    throw new Error(extraError.message);
  }

  // update agent id
  if (extraData?.agent_id) {
    try {
      await updateAgentId(data.user?.id || "", extraData.agent_id, "owner");
    } catch (e) {
      throw new Error((e as Error).message || "Failed to update agent id");
    }
  }

  return {
    role: "owner",
    id: data.user?.id || "",
    name: input.email,
    agentId: extraData?.agent_id || "",
  };
}

export async function updateAgentId(
  userId: string,
  agentId: string,
  role: string
) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: {
      agent_id: agentId,
      role: role,
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message || "User not found");
  }
  return data;
}
