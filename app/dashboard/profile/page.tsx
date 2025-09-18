import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProfileForm } from "@/components/profile/profile-form"

export default function ProfilePage() {
  return (
    <DashboardLayout
      mainClassName="dark:bg-[#010a07] dark:text-white dark:bg-[radial-gradient(circle_at_top,_rgba(102,255,163,0.12),transparent_65%)]"
      contentClassName="mx-0 flex justify-center px-5 pb-20 pt-10 md:px-14"
    >
      <ProfileForm />
    </DashboardLayout>
  )
}
