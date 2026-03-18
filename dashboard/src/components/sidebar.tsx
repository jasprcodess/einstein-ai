"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
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
    <aside className="relative flex h-screen w-[240px] shrink-0 flex-col" style={{ overflow: "visible" }}>
      {/* Aggressive progressive blur - extends well past sidebar width */}
      <ProgressiveBlur
        direction="left"
        blurLayers={14}
        blurIntensity={5}
        className="pointer-events-none absolute inset-y-0 -left-8 z-0"
        style={{ width: "340px" }}
      />

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
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors duration-150",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Each nav item gets its own blur bg when active/hovered */}
                {active && (
                  <div className="absolute inset-0 rounded-md overflow-hidden">
                    <ProgressiveBlur
                      direction="left"
                      blurLayers={6}
                      blurIntensity={3}
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-accent" style={{ opacity: 0.5 }} />
                  </div>
                )}
                <item.icon className="relative z-10 h-4 w-4 shrink-0" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
