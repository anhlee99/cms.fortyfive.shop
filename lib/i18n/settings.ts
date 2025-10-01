export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function pickNamespaces(pathname: string): string[] {
  if (pathname.startsWith("/shops")) return ["common", "shop"];
  if (pathname.startsWith("/dashboard")) return ["common"];
  if (pathname.startsWith("/auth")) return ["common"];
  return ["common"]; // mặc định
}