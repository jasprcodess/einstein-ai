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
    <aside className="relative flex h-screen w-[240px] shrink-0 flex-col">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to right, #1f1f1f 0%, #1f1f1f 65%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 backdrop-blur-2xl"
        style={{
          maskImage: "linear-gradient(to right, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 0%, black 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <Link href="/" className="flex items-center gap-3 px-5 pt-5 pb-4 hover:opacity-80 transition-opacity">
          <Image
            src="/einsteinai.svg"
            alt="Einstein AI"
            width={28}
            height={28}
            className="rounded-md"
          />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Einstein AI
            </h1>
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Pre-1905
            </p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 px-3 pt-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-200",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-foreground" />
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
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Github className="h-4 w-4 shrink-0" />
            GitHub
          </a>
        </div>
      </div>
    </aside>
  );
}
