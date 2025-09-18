import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function PerformanceBaselinesPage() {
   return (
      <DashboardLayout>
         <Heading
            title="Performance Baselines"
            description="Anchor every readout against consistently refreshed baselines."
         />
      </DashboardLayout>
   );
}
