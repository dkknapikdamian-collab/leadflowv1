export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { TemplatesPageView } from "@/components/views"

export default function TemplatesPage() {
  return (
    <DashboardShell>
      <TemplatesPageView />
    </DashboardShell>
  )
}
