import { updateSession } from "@/lib/supabase/middleware";
import { locales, defaultLocale } from "./lib/i18n/settings";
import Negotiator from "negotiator";
import { NextRequest } from "next/server";

function getLocale(req: NextRequest) {
  // ưu tiên cookie, sau đó header
  const cookieLocale = req.cookies.get("LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) return cookieLocale;

  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => (headers[k] = v));

  const lang = new Negotiator({ headers }).language(locales as unknown as string[]);
  return lang || defaultLocale;
}

export async function middleware(request: NextRequest) {
  // get locale
  const locale = getLocale(request);

  // Gắn locale vào request headers để app đọc lại ở server component
  request.headers.set("x-locale", locale);
  request.headers.set("x-pathname", request.nextUrl.pathname);

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
