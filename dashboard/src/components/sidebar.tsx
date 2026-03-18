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
    <aside
      className="relative flex h-screen shrink-0 flex-col"
      style={{ width: 240, overflow: "visible" }}
    >
      {/* Progressive blur - extends well past sidebar into content */}
      <ProgressiveBlur
        direction="right"
        blurLayers={14}
        blurIntensity={5}
        className="pointer-events-none absolute inset-y-0 left-0 z-0"
        style={{ width: 360 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col" style={{ width: 240 }}>
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
                  "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors duration-150",
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
