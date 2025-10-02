import { createClient } from "@/lib/supabase/server";

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