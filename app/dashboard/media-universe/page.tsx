import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";

export default function MediaUniversePage() {
   return (
      <DashboardLayout>
         <Heading
            title="Media Universe"
            description="Unified view of cross-channel momentum and market impact."
         />
         <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
         <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://lookerstudio.google.com/embed/reporting/45c4136a-d522-44a8-9b67-b09c17554aad/page/p_1nyry5wxvd?rm=minimal"
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
            <div className="absolute bottom-0 left-0 w-full h-[32px] bg-white pointer-events-none"></div>
         </div>
      </DashboardLayout>
   );
}
