import { PageHeader } from "@/components/page-header";
import { ModelConfig } from "@/components/model-config";
import { TrainingPanel } from "@/components/training-panel";

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Training"
        description="Train the model from random initialization on pre-1905 data only."
      />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 items-stretch">
        <ModelConfig />
        <TrainingPanel />
      </div>
    </div>
  );
}
