import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function ClientPulsePage() {
   return (
      <DashboardLayout>
         <Heading
            title="Client Pulse"
            description="Spot health signals, growth opportunities, and retention risks fast."
         />
         <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
               className="absolute top-0 left-0 w-full h-full"
               src="https://lookerstudio.google.com/embed/reporting/45c4136a-d522-44a8-9b67-b09c17554aad/page/p_yg4w2dg3vd"
               allowFullScreen
               sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
            <div className="absolute bottom-0 left-0 w-full h-[32px] bg-white pointer-events-none"></div>
         </div>
      </DashboardLayout>
   );
}
