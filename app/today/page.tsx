export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageShell } from "@/components/layout/page-shell"
import { TodayPageView } from "@/components/today-page-view"

export default function TodayPage() {
  return (
    <DashboardShell>
      <PageShell>
        <TodayPageView />
      </PageShell>
    </DashboardShell>
  )
}
