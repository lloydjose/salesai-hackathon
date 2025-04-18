import { PageHeader } from "@/components/shared/page-header"
import { DashboardOverview } from "@/components/dashboard/overview"

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Overview" />
      <DashboardOverview />
    </>
  )
}
