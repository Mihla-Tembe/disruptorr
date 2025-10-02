import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function ImpactChannelFlowPage() {
  return (
    <DashboardLayout>
      <Heading
        title="Channel Flow"
        description="Deep diagnostics on channel allocation, pacing, and effectiveness."
      />
    </DashboardLayout>
  );
}
