export const dynamic = "force-dynamic"

import { AdminAccessDiagnostics } from "@/components/admin-access-diagnostics"
import { DashboardShell } from "@/components/dashboard-shell"
import { SettingsPageView } from "@/components/views"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <SettingsPageView />
      <AdminAccessDiagnostics />
    </DashboardShell>
  )
}
