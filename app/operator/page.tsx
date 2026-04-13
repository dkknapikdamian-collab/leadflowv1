export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageShell } from "@/components/layout/page-shell"
import { OperatorCenterPageView } from "@/components/operator-center-page-view"

export default function OperatorCenterPage() {
  return (
    <DashboardShell>
      <PageShell>
        <OperatorCenterPageView />
      </PageShell>
    </DashboardShell>
  )
}
