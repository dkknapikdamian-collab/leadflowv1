/*
LEAD_TO_CASE_FLOW_STAGE24

This file is a small frontend orchestrator for the already existing
/api/leads action=start_service endpoint.

It does not create a second backend flow. The server remains the source of truth:
- creates or reuses the client,
- creates the case,
- links lead -> case,
- links lead -> client,
- archives the lead from active sales work.
*/

type StartLeadServiceFn = (input: {
  id: string;
  title: string;
  caseStatus?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  workspaceId?: string;
}) => Promise<Record<string, unknown>>;

type PatchRecordFn = (input: Record<string, unknown> & { id: string }) => Promise<unknown>;

export type LeadToCaseHandoffInput = {
  leadId: string;
  lead: Record<string, unknown>;
  draft?: {
    title?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    status?: string;
  };
  workspaceId: string;
  tasks?: Record<string, unknown>[];
  events?: Record<string, unknown>[];
  startLeadService: StartLeadServiceFn;
  updateTask?: PatchRecordFn;
  updateEvent?: PatchRecordFn;
};

export type LeadToCaseHandoffResult = {
  caseId: string;
  caseTitle: string;
  clientId: string;
  movedToServiceAt: string;
  lead: Record<string, unknown>;
  case: Record<string, unknown>;
  client: Record<string, unknown>;
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const text = asText(value);
    if (text) return text;
  }
  return '';
}

function isDoneLike(value: unknown) {
  const status = String(value || '').trim().toLowerCase();
  return ['done', 'completed', 'cancelled', 'canceled', 'archived'].includes(status);
}

function pickObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function getNestedObject(row: Record<string, unknown>, key: string) {
  return pickObject(row[key]);
}

async function linkOpenOperationalItems(input: {
  caseId: string;
  clientId: string;
  leadId: string;
  tasks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  updateTask?: PatchRecordFn;
  updateEvent?: PatchRecordFn;
}) {
  const activeTasks = input.tasks.filter((task) => {
    const id = asText(task.id);
    const leadId = asText(task.leadId || task.lead_id);
    const caseId = asText(task.caseId || task.case_id);
    return id && leadId === input.leadId && !caseId && !isDoneLike(task.status);
  });

  const activeEvents = input.events.filter((event) => {
    const id = asText(event.id);
    const leadId = asText(event.leadId || event.lead_id);
    const caseId = asText(event.caseId || event.case_id);
    return id && leadId === input.leadId && !caseId && !isDoneLike(event.status);
  });

  await Promise.allSettled([
    ...activeTasks.map((task) => input.updateTask?.({
      id: asText(task.id),
      leadId: input.leadId,
      caseId: input.caseId,
      clientId: input.clientId || null,
    })),
    ...activeEvents.map((event) => input.updateEvent?.({
      id: asText(event.id),
      leadId: input.leadId,
      caseId: input.caseId,
      clientId: input.clientId || null,
    })),
  ]);
}

export async function startLeadToCaseHandoff(input: LeadToCaseHandoffInput): Promise<LeadToCaseHandoffResult> {
  const leadId = asText(input.leadId);
  if (!leadId) throw new Error('LEAD_ID_REQUIRED');

  const title = firstText(
    input.draft?.title,
    input.lead.name ? `${String(input.lead.name).trim()} - obsługa` : '',
    input.lead.company ? `${String(input.lead.company).trim()} - obsługa` : '',
    'Nowa sprawa',
  );

  const result = await input.startLeadService({
    id: leadId,
    title,
    caseStatus: firstText(input.draft?.status, 'in_progress'),
    clientName: firstText(input.draft?.clientName, input.lead.name, input.lead.company),
    clientEmail: firstText(input.draft?.clientEmail, input.lead.email),
    clientPhone: firstText(input.draft?.clientPhone, input.lead.phone),
    workspaceId: input.workspaceId,
  });

  const leadRow = getNestedObject(result, 'lead');
  const caseRow = getNestedObject(result, 'case');
  const clientRow = getNestedObject(result, 'client');

  const caseId = firstText(caseRow.id, result.caseId, result.linkedCaseId, leadRow.linkedCaseId, leadRow.caseId);
  if (!caseId) throw new Error('CASE_CREATE_FAILED');

  const clientId = firstText(clientRow.id, result.clientId, leadRow.clientId, caseRow.clientId);
  const movedToServiceAt = firstText(leadRow.movedToServiceAt, leadRow.caseStartedAt, caseRow.serviceStartedAt, new Date().toISOString());
  const caseTitle = firstText(caseRow.title, title);

  await linkOpenOperationalItems({
    caseId,
    clientId,
    leadId,
    tasks: input.tasks || [],
    events: input.events || [],
    updateTask: input.updateTask,
    updateEvent: input.updateEvent,
  });

  return {
    caseId,
    caseTitle,
    clientId,
    movedToServiceAt,
    lead: {
      ...leadRow,
      id: leadId,
      linkedCaseId: caseId,
      clientId,
      status: 'moved_to_service',
      leadVisibility: 'archived',
      salesOutcome: 'moved_to_service',
      movedToService: true,
      movedToServiceAt,
    },
    case: {
      ...caseRow,
      id: caseId,
      title: caseTitle,
      leadId,
      clientId,
      createdFromLead: true,
      serviceStartedAt: movedToServiceAt,
    },
    client: {
      ...clientRow,
      id: clientId,
    },
  };
}
