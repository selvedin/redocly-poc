import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenAPI Renderer",
  description: "Custom OpenAPI docs renderer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors`}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex w-full flex-1 px-6 py-8">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
