import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function BudgetBeaconPage() {
   return (
      <DashboardLayout>
         <Heading
            title="Budget Beacon"
            description="Guide future spend with forward-looking budget signals and guardrails."
         />
      </DashboardLayout>
   );
}
