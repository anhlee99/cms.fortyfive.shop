import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { headers } from "next/headers";
import { defaultLocale, Locale } from "../lib/i18n/settings";
import I18nProvider from "@/lib/i18n/I18nProvider";
import { pickNamespaces } from "@/lib/i18n/settings";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://cms.fortyfive.shop";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FortyFive - Nền tảng quản lý bán hàng đa kênh",
  description: "Nền tảng quản lý bán hàng đa kênh",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },   // if using public/favicon.ico
    ],
    shortcut: "/favicon.ico",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

async function loadLocaleResources(locale: string, namespaces: string[]) {
  const entries = await Promise.all(
    namespaces.map(async (ns) => [ns, (await import(`../locales/${locale}/${ns}.json`)).default] as const)
  );
  return { [locale]: Object.fromEntries(entries) };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "/";
  const locale = h.get("x-locale") as Locale || defaultLocale;
  const namespaces = pickNamespaces(pathname);

  const resources = await loadLocaleResources(locale, namespaces);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider locale={locale} namespaces={namespaces} resources={resources}>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
