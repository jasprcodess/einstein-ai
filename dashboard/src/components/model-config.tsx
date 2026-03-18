import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModelConfig() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Model Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed border-border px-6 text-center">
          <p className="text-sm text-muted-foreground">No real training configuration yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            This panel stays empty until we connect an actual training config.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
