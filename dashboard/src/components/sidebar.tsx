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
    <aside className="relative flex h-screen w-[240px] shrink-0 flex-col">
      {/* Solid background that fades to transparent on right edge */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to right, #1f1f1f 0%, #1f1f1f 65%, transparent 100%)",
        }}
      />
      {/* Blur layer that also fades right */}
      <div
        className="absolute inset-0 z-0 backdrop-blur-2xl"
        style={{
          maskImage: "linear-gradient(to right, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, black 0%, black 50%, transparent 100%)",
        }}
      />
      {/* Subtle right border fade */}
      <div
        className="absolute inset-y-0 right-0 z-0 w-px"
        style={{
          background: "linear-gradient(to bottom, transparent, #353535 30%, #353535 70%, transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
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
        </div>

        <nav className="flex-1 space-y-0.5 px-3 pt-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200",
                  active
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
