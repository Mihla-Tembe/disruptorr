import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Hero } from "@/components/dashboard/hero"
import { FeatureGrid } from "@/components/dashboard/feature-grid"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Hero />
      <FeatureGrid />
    </DashboardLayout>
  )
}
