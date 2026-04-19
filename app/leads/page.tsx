export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { LeadsPageView } from "@/components/views"

export default function LeadsPage() {
  return (
    <DashboardShell>
      <LeadsPageView />
    </DashboardShell>
  )
}
