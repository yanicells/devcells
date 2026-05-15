import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Header } from "@/components/layout/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "devcells",
    template: "%s · devcells",
  },
  description:
    "Personal reference for the React, Next.js, Tailwind, Drizzle, and AI patterns I use most.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg text-fg antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
