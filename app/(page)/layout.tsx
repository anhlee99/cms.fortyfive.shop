import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import { headers } from "next/headers";
import I18nProvider from "@/lib/i18n/I18nProvider";
import { defaultLocale, Locale, pickNamespaces } from "@/lib/i18n/settings";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { BreadcrumbHeader } from "@/components/breadcrumb-header";
import { requireAuth } from "@/lib/auth";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://cms.fortyfive.shop";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FortyFive - Nền tảng quản lý bán hàng đa kênh",
  description: "Nền tảng quản lý bán hàng đa kênh",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" }, // if using public/favicon.ico
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
    namespaces.map(
      async (ns) =>
        [ns, (await import(`@/locales/${locale}/${ns}.json`)).default] as const
    )
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
  const locale = (h.get("x-locale") as Locale) || defaultLocale;
  const namespaces = pickNamespaces(pathname);
  const { user } = await requireAuth();

  const resources = await loadLocaleResources(locale, namespaces);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar user={user} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <BreadcrumbHeader />
              </div>
            </header>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <I18nProvider
                locale={locale}
                namespaces={namespaces}
                resources={resources}
              >
                {children}
              </I18nProvider>
            </ThemeProvider>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
