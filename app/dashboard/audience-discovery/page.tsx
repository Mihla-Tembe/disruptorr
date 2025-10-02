import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function AudienceDiscoveryPage() {
   return (
      <DashboardLayout>
         <Heading
            title="Audience Discovery"
            description="Discover, size, and activate emerging audience segments quickly."
         />
         <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
               className="absolute top-0 left-0 w-full h-full"
               src="https://lookerstudio.google.com/embed/reporting/45c4136a-d522-44a8-9b67-b09c17554aad/page/p_narq70hewd"
               allowFullScreen
               sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
         </div>
         
      </DashboardLayout>
   );
}
