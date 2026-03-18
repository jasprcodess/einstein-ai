import { PageHeader } from "@/components/page-header";
import { TrainingPanel } from "@/components/training-panel";
import { ModelConfig } from "@/components/model-config";
import { StatCard } from "@/components/stat-card";
import { Cpu, Timer, Zap, HardDrive } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Training"
        description="Train the model from random initialization on pre-1905 data only."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Parameters" value="~112M" sub="12 layers, 768 dim" icon={Cpu} />
        <StatCard label="Target Runtime" value="~8h" sub="RTX 5070 12GB" icon={Timer} />
        <StatCard label="Throughput" value="--" sub="tokens/sec" icon={Zap} />
        <StatCard label="Checkpoints" value="0" sub="Saved" icon={HardDrive} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ModelConfig />
        <TrainingPanel />
      </div>
    </div>
  );
}
