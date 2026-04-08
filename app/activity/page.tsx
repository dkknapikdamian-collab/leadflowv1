export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { ActivityPageView } from "@/components/activity-page-view"
import { PageShell } from "@/components/layout/page-shell"

export default function ActivityPage() {
  return (
    <DashboardShell>
      <PageShell>
        <ActivityPageView />
      </PageShell>
    </DashboardShell>
  )
}
