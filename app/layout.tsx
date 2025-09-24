import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
