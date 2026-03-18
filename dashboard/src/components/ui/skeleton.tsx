import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-skeleton rounded bg-muted", className)}
      style={{
        backgroundSize: "200% 100%",
        backgroundImage: "linear-gradient(90deg, #2a2a2a 25%, #353535 50%, #2a2a2a 75%)",
      }}
      {...props}
    />
  );
}

function BarChartSkeleton() {
  return (
    <div className="flex items-end gap-2 h-24 pt-2">
      {[65, 40, 80, 55, 90, 45, 70].map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
          <Skeleton className="w-full rounded-sm" style={{ height: `${h}%` }} />
          <Skeleton className="h-2.5 w-6" />
        </div>
      ))}
    </div>
  );
}

function ListRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md bg-muted px-3 py-2.5">
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, BarChartSkeleton, ListRowsSkeleton };
