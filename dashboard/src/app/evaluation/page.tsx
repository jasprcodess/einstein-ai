import { PageHeader } from "@/components/page-header";
import { EvalGates } from "@/components/eval-gates";

export default function EvaluationPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      <PageHeader
        title="Evaluation"
        description="Verify the model uses only pre-1905 knowledge and blocks post-1905 content."
      />
      <EvalGates />
    </div>
  );
}
