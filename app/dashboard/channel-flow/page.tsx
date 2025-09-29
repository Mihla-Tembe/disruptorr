import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function ChannelFlowPage() {
   return (
      <DashboardLayout>
         <Heading
            title="Channel Flow"
            description="Follow pacing, velocity, and investment shifts across every channel."
         />
         <div className="relative w-full" style={{ aspectRatio: "16 / 12.5" }}>
            <iframe
               className="absolute top-0 left-0 w-full h-full"
               src="https://lookerstudio.google.com/embed/reporting/45c4136a-d522-44a8-9b67-b09c17554aad/page/p_1nyry5wxvd"
               allowFullScreen
               sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
         </div>
      </DashboardLayout>
   );
}
