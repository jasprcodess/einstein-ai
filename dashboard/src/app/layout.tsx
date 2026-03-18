import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { ShaderBackground } from "@/components/shader-bg";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Einstein AI",
  description: "An AI model trained from scratch on pre-1905 data only",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider>
          <ShaderBackground />
          <MobileNav />
          <div className="relative z-10 flex h-dvh">
            <div className="hidden lg:block" style={{ overflow: "visible" }}>
              <Sidebar />
            </div>
            <main className="relative z-20 flex-1 overflow-y-auto pt-12 lg:pt-0">{children}</main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
