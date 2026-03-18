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
  Github,
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
    <aside className="relative flex h-screen w-[220px] shrink-0 flex-col">
      {/* Single blur layer masked to fade right */}
      <div
        className="absolute inset-0 z-0 backdrop-blur-2xl backdrop-saturate-150"
        style={{
          maskImage: "linear-gradient(to right, black, black 60%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, black, black 60%, transparent)",
        }}
      />
      {/* Dark tint */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to right, rgba(17,17,17,0.7), rgba(17,17,17,0.4) 70%, transparent)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <Link href="/" className="flex items-center gap-2.5 px-4 pt-5 pb-6 transition-opacity hover:opacity-80">
          <Image src="/einsteinai.svg" alt="Einstein AI" width={24} height={24} className="rounded" />
          <span className="text-sm font-semibold tracking-tight text-foreground">Einstein AI</span>
        </Link>

        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-1.5 text-[13px] rounded-lg transition-colors duration-150",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-[2px] rounded-full bg-foreground" />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <a
            href="https://github.com/jasprcodess/einstein-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4 shrink-0" />
            GitHub
          </a>
        </div>
      </div>
    </aside>
  );
}
