export const dynamic = "force-dynamic"

import { BillingStatusPageView } from "@/components/account-status-panel"
import { DashboardShell } from "@/components/dashboard-shell"
import { PageShell } from "@/components/layout/page-shell"

export default function BillingPage() {
  return (
    <DashboardShell>
      <PageShell>
        <BillingStatusPageView />
      </PageShell>
    </DashboardShell>
  )
}
