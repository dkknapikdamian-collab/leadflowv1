export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { CasesPageView } from "@/components/views"

export default function CasesPage() {
  return (
    <DashboardShell>
      <CasesPageView />
    </DashboardShell>
  )
}
