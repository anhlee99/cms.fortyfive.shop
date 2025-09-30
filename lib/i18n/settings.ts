export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function pickNamespaces(pathname: string): string[] {
  if (pathname.startsWith("/shops")) return ["common", "shop"];
  if (pathname.startsWith("/dashboard")) return ["common", "dashboard"];
  if (pathname.startsWith("/auth")) return ["common", "auth"];
  return ["common"]; // mặc định
}