export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { SettingsPageView } from "@/components/views"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <SettingsPageView />
    </DashboardShell>
  )
}
