import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function ClientPulsePage() {
   return (
      <DashboardLayout>
         <Heading
            title="Client Pulse"
            description="Spot health signals, growth opportunities, and retention risks fast."
         />
      </DashboardLayout>
   );
}
