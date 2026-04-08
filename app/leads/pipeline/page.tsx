export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { LeadPipelinePageView } from "@/components/lead-pipeline-page-view"

export default function LeadsPipelinePage() {
  return (
    <DashboardShell>
      <LeadPipelinePageView />
    </DashboardShell>
  )
}
