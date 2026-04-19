export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { TasksPageView } from "@/components/views"

export default function TasksPage() {
  return (
    <DashboardShell>
      <TasksPageView />
    </DashboardShell>
  )
}
