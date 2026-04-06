export type BillingWebhookEvent = {
  provider: "stripe"
  eventId: string
  type: string
  customerId?: string | null
  subscriptionId?: string | null
}

export type BillingWebhookResult = {
  ok: boolean
  action: "ignored" | "updated" | "duplicate"
}

const processedEvents = new Set<string>()

export function handleBillingWebhook(event: BillingWebhookEvent): BillingWebhookResult {
  if (processedEvents.has(event.eventId)) {
    return { ok: true, action: "duplicate" }
  }

  processedEvents.add(event.eventId)

  return {
    ok: true,
    action: "updated",
  }
}
