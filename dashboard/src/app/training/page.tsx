import { PageHeader } from "@/components/page-header";
import { TrainingPanel } from "@/components/training-panel";

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Training"
        description="Train from scratch on pre-1905 physics data."
      />
      <TrainingPanel />
    </div>
  );
}
