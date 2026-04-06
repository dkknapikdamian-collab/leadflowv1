export const dynamic = "force-dynamic"

import { BillingStatusPageView } from "@/components/account-status-panel"
import { DashboardShell } from "@/components/dashboard-shell"

export default function BillingPage() {
  return (
    <DashboardShell>
      <BillingStatusPageView />
    </DashboardShell>
  )
}
