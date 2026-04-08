export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageShell } from "@/components/layout/page-shell"
import { LeadsPageView } from "@/components/views"

export default function LeadsPage() {
  return (
    <DashboardShell>
      <PageShell>
        <LeadsPageView />
      </PageShell>
    </DashboardShell>
  )
}
