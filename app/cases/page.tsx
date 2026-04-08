export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { CasesPageView } from "@/components/cases-page-view"
import { PageShell } from "@/components/layout/page-shell"

export default function CasesPage() {
  return (
    <DashboardShell>
      <PageShell>
        <CasesPageView />
      </PageShell>
    </DashboardShell>
  )
}
