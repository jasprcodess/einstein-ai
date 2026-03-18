import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function EvalGates() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-5">
          <div className="rounded-lg bg-muted p-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Evaluation is not connected yet</p>
            <p className="text-sm text-muted-foreground">
              Real evaluation results will appear here after we wire a local
              evaluation runner.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
