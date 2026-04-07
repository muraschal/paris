import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rendez-vous à Paris",
  description: "Paris · 1.–3. Mai 2026",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Rendez-vous à Paris",
    description: "Paris · 1.–3. Mai 2026",
    siteName: "Rendez-vous à Paris",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rendez-vous à Paris",
    description: "Paris · 1.–3. Mai 2026",
  },
  other: {
    "apple-mobile-web-app-title": "Paris",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-[100svh] bg-navy" suppressHydrationWarning>{children}</body>
    </html>
  );
}
