import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function ImpactClientPulsePage() {
   return (
      <DashboardLayout>
         <Heading
            title="Client Pulse"
            description="Client-level scorecards spotlighting momentum and risk signals."
         />
      </DashboardLayout>
   );
}
