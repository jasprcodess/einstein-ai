import { PageHeader } from "@/components/page-header";
import { EvalGates } from "@/components/eval-gates";
import { EvalTests } from "@/components/eval-tests";

export default function EvaluationPage() {
  return (
    <div className="mx-auto max-w-[1200px] p-6 lg:p-8">
      <PageHeader
        title="Evaluation"
        description="Verify the model uses only pre-1905 knowledge and blocks post-1905 content."
      />
      <EvalGates />
      <EvalTests />
    </div>
  );
}
