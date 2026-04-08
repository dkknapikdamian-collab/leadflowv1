export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { ActivityPageView } from "@/components/views"

export default function ActivityPage() {
  return (
    <DashboardShell>
      <ActivityPageView />
    </DashboardShell>
  )
}
