export const dynamic = "force-dynamic"

import { ClientPortalPage } from "@/components/client-portal-page"

export default async function ClientPortalTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <ClientPortalPage token={decodeURIComponent(token)} />
}
