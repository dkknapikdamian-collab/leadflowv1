function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildLeadMovedToServicePayload(input: {
  caseId?: unknown;
  clientId?: unknown;
  occurredAt?: unknown;
  updatedAt?: unknown;
}) {
  const updatedAt = asText(input.updatedAt) || new Date().toISOString();
  const occurredAt = asText(input.occurredAt) || updatedAt;
  const linkedCaseId = asText(input.caseId) || null;
  const clientId = asText(input.clientId) || null;

  const payload: Record<string, unknown> = {
    linked_case_id: linkedCaseId,
    status: 'moved_to_service',
    moved_to_service_at: occurredAt,
    case_started_at: occurredAt,
    lead_visibility: 'archived',
    sales_outcome: 'moved_to_service',
    closed_at: occurredAt,
    next_action_title: '',
    next_action_at: null,
    next_action_item_id: null,
    updated_at: updatedAt,
  };

  if (clientId) {
    payload.client_id = clientId;
  }

  return payload;
}
