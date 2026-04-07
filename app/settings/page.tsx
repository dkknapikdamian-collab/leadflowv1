export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { AccountSettingsPanel } from "@/components/account-settings-panel"
import { SettingsPageView } from "@/components/views"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <SettingsPageView />
      <AccountSettingsPanel />
    </DashboardShell>
  )
}
