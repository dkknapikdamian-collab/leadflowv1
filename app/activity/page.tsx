export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { ActivityPageView } from "@/components/activity-page-view"

export default function ActivityPage() {
  return (
    <DashboardShell>
      <ActivityPageView />
    </DashboardShell>
  )
}
