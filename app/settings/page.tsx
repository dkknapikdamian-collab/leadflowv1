export const dynamic = "force-dynamic"

import { DashboardShell } from "@/components/dashboard-shell"
import { AccountSettingsPanel } from "@/components/account-settings-panel"
import { SkinSettingsPanel } from "@/components/skin-settings-panel"
import { PageShell } from "@/components/layout/page-shell"
import { SettingsPageView } from "@/components/views"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <PageShell>
        <AccountSettingsPanel />
        <SkinSettingsPanel />
        <SettingsPageView />
      </PageShell>
    </DashboardShell>
  )
}
