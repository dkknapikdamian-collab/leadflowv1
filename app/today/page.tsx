export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { TodayPageView } from "@/components/today-page-view"

export default function TodayPage() {
  return (
    <DashboardShell>
      <TodayPageView />
    </DashboardShell>
  )
}
