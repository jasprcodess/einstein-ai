"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageCircle,
  Database,
  Cpu,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/corpus", label: "Corpus", icon: Database },
  { href: "/training", label: "Training", icon: Cpu },
  { href: "/evaluation", label: "Evaluation", icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <Image
          src="/einsteinai.svg"
          alt="Einstein AI"
          width={28}
          height={28}
          className="rounded-md"
        />
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            Einstein AI
          </h1>
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
            Pre-1905
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 pt-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors duration-150",
                active
                  ? "bg-sidebar-accent text-primary font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-medium text-primary">
              Temporal gate active
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
            All sources after April 30, 1905 are blocked.
          </p>
        </div>
      </div>
    </aside>
  );
}
