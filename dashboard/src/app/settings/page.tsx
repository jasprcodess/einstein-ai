import { PageHeader } from "@/components/page-header";
import { SettingsPanel } from "@/components/settings-panel";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <PageHeader title="Settings" description="Manage training runs, archives, and project configuration." />
      <SettingsPanel />
    </div>
  );
}
