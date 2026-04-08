export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { PageShell } from "@/components/layout/page-shell"
import { TemplatesPageView } from "@/components/templates-page-view"

export default function TemplatesPage() {
  return (
    <DashboardShell>
      <PageShell>
        <TemplatesPageView />
      </PageShell>
    </DashboardShell>
  )
}
