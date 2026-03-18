"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, LayoutDashboard, MessageCircle, Database, Cpu, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/corpus", label: "Corpus", icon: Database },
  { href: "/training", label: "Training", icon: Cpu },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex h-12 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/einsteinai.svg" alt="Einstein AI" width={20} height={20} className="rounded" />
          <span className="text-sm font-semibold">Einstein AI</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="rounded-md p-2 text-foreground hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-background pt-12 lg:hidden">
          <nav className="space-y-1 px-4 pt-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm min-h-[48px] transition-colors",
                    active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
