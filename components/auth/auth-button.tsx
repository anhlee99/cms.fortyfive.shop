import Link from "next/link";
import { Button } from "../ui/button";
import { LogoutButton } from "./logout-button";
import { requireSession } from "@/lib/auth";

export async function AuthButton() {
  // You can also use getUser() which will be slower.
  const { claims } = await requireSession();

  return claims ? (
    <div className="flex items-center gap-4">
      Hey, {claims.email}!
      <Button asChild variant={"outline"}>
        <Link href="/dashboards">Dashboard</Link>
      </Button>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
