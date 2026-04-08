export const dynamic = "force-dynamic"

import { ClientPortalView } from "@/components/client-portal-view"

export default async function ClientPortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <ClientPortalView token={token} />
}
