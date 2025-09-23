import './globals.css'

export const metadata = {
  title: 'CMS Forty Five Shop',
  description: 'Content Management System for Forty Five Shop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}