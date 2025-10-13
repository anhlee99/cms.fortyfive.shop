import { createHttp } from "@/lib/http/http";
import { User, UserSignUpData } from "./auth.type";
const http = createHttp({});

export async function signUp(data: UserSignUpData): Promise<User> {
  try {
    const res = await http.post<{ data: User }>("/api/auth/sign-up", data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
}
