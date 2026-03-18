import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: boolean;
}

export function StatCard({ label, value, sub, icon: Icon, accent }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
            {label}
          </p>
          <p
            className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${
              accent ? "text-primary" : ""
            }`}
          >
            {value}
          </p>
          {sub && (
            <p className="mt-1 text-[12px] text-muted-foreground">{sub}</p>
          )}
        </div>
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
