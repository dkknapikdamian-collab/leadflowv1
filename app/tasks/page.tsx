export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageShell } from "@/components/layout/page-shell"
import { TasksPageView } from "@/components/views"

export default function TasksPage() {
  return (
    <DashboardShell>
      <PageShell>
        <TasksPageView />
      </PageShell>
    </DashboardShell>
  )
}
