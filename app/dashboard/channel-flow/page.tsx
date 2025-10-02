import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function ChannelFlowPage() {
  return (
    <DashboardLayout>
      <Heading
        title="Channel Flow"
        description="Follow pacing, velocity, and investment shifts across every channel."
      />
    </DashboardLayout>
  );
}
