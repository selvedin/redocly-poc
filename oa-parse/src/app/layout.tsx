import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/theme-toggle";

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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex w-full items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-900 px-2 py-1 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                  PGX
                </span>
                <div>
                  <p className="text-sm font-semibold">Payment's Gateway Accelerator</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interactive documentation
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400"></div>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex w-full flex-1 px-6 py-8">{children}</main>
          <footer className="border-t border-slate-200 bg-white/70 px-6 py-4 text-center text-xs text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            Payment's Gateway Accelerator
          </footer>
        </div>
      </body>
    </html>
  );
}
