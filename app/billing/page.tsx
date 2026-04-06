export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { BillingPageView } from "@/components/views"

export default function BillingPage() {
  return (
    <DashboardShell>
      <BillingPageView />
    </DashboardShell>
  )
}
