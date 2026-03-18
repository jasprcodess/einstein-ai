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
    <Card className="transition-all duration-200 ease-out hover:-translate-y-0.5">
      <CardContent className="flex items-start justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${accent ? "text-primary" : ""}`}>
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="rounded-lg bg-muted p-2.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
