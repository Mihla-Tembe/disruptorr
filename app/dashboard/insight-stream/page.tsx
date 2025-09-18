import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LatestArticles } from "@/components/media/latest-articles";

export default function InsightStreamPage() {
   return (
      <DashboardLayout fullWidth contentClassName="w-full pb-24 pt-0">
         <LatestArticles headingTitle="Articles" />
      </DashboardLayout>
   );
}
