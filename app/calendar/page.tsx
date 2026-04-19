export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { CalendarPageView } from "@/components/views"

function CalendarPageFallback() {
  return <div className="app-shell-loading">Ładowanie kalendarza…</div>
}

export default function CalendarPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<CalendarPageFallback />}>
        <CalendarPageView />
      </Suspense>
    </DashboardShell>
  )
}
