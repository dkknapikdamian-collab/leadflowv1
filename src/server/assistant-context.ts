import { selectFirstAvailable } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';

type RecordMap = Record<string, unknown>;
type EntityType = 'lead' | 'client' | 'case' | 'task' | 'event' | 'draft';

type RelationBucket = {
  leadIds: string[];
  clientIds: string[];
  caseIds: string[];
  taskIds: string[];
  eventIds: string[];
  draftIds: string[];
};

const AI_OPERATOR_SNAPSHOT_STAGE02 = true;
const SNAPSHOT_LIMITS = {
  leads: 350,
  clients: 350,
  cases: 350,
  tasks: 350,
  events: 350,
  drafts: 150,
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function safeArray(value: unknown) {
  return Array.isArray(value) ? value.filter((row) => row && typeof row === 'object') as RecordMap[] : [];
}

async function safeSelect(query: string) {
  try {
    const result = await selectFirstAvailable([query]);
    return safeArray(result.data);
  } catch {
    return [] as RecordMap[];
  }
}

function firstText(row: RecordMap, keys: string[]) {
  for (const key of keys) {
    const value = asText(row[key]);
    if (value) return value;
  }
  return '';
}

function firstValue(row: RecordMap, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return null;
}

function normalizeText(value: unknown) {
  return asText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s@.+-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMoney(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const normalized = value
    .replace(/\s+/g, '')
    .replace(/zł|pln/gi, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getValue(row: RecordMap) {
  const keys = ['dealValue', 'deal_value', 'value', 'amount', 'estimatedValue', 'estimated_value', 'budget', 'price', 'contractValue', 'contract_value'];
  for (const key of keys) {
    const value = parseMoney(row[key]);
    if (value > 0) return value;
  }
  return 0;
}

function dateValue(row: RecordMap, keys: string[]) {
  const value = firstText(row, keys);
  if (!value) return null;
  const parsed = new Date(value.includes('T') ? value : `${value}T09:00:00`);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : value;
}

function isOpenStatus(statusValue: unknown) {
  const status = asText(statusValue).toLowerCase();
  return !['done', 'completed', 'cancelled', 'canceled', 'archived', 'converted'].includes(status);
}

function isDraftPending(row: RecordMap) {
  const status = asText(row.status || row.status_raw).toLowerCase();
  return !status || status === 'draft';
}

function entitySearchText(parts: unknown[]) {
  return normalizeText(parts.filter((item) => item !== undefined && item !== null).map(String).join(' '));
}

function normalizeLead(row: RecordMap) {
  const id = firstText(row, ['id', 'lead_id', 'leadId']);
  const name = firstText(row, ['name', 'full_name', 'fullName', 'title']);
  const company = firstText(row, ['company', 'company_name', 'companyName']);
  const email = firstText(row, ['email', 'mail', 'contact_email', 'contactEmail']);
  const phone = firstText(row, ['phone', 'telefon', 'mobile', 'contact_phone', 'contactPhone']);
  const status = firstText(row, ['status', 'stage']);
  const source = firstText(row, ['source', 'source_primary', 'sourcePrimary']);
  const clientId = firstText(row, ['client_id', 'clientId']);
  const caseId = firstText(row, ['case_id', 'caseId', 'linked_case_id', 'linkedCaseId']);
  const nextActionAt = dateValue(row, ['next_action_at', 'nextActionAt', 'next_at', 'nextAt']);
  const nextActionTitle = firstText(row, ['next_action_title', 'nextActionTitle', 'next_step', 'nextStep']);
  const value = getValue(row);
  const updatedAt = dateValue(row, ['updated_at', 'updatedAt', 'created_at', 'createdAt']);
  return {
    id, name, company, email, phone, status, source, value, clientId, caseId, nextActionAt, nextActionTitle, updatedAt,
    href: id ? `/leads/${id}` : '/leads',
    searchText: entitySearchText(['lead', name, company, email, phone, status, source, nextActionTitle, value]),
  };
}

function normalizeClient(row: RecordMap) {
  const id = firstText(row, ['id', 'client_id', 'clientId']);
  const name = firstText(row, ['name', 'client_name', 'clientName', 'full_name', 'fullName']);
  const company = firstText(row, ['company', 'company_name', 'companyName']);
  const email = firstText(row, ['email', 'mail', 'contact_email', 'contactEmail']);
  const phone = firstText(row, ['phone', 'telefon', 'mobile', 'contact_phone', 'contactPhone']);
  const source = firstText(row, ['source', 'source_primary', 'sourcePrimary']);
  const value = getValue(row);
  const updatedAt = dateValue(row, ['last_activity_at', 'lastActivityAt', 'updated_at', 'updatedAt', 'created_at', 'createdAt']);
  return {
    id, name, company, email, phone, source, value, updatedAt,
    href: id ? `/clients/${id}` : '/clients',
    searchText: entitySearchText(['client', 'klient', name, company, email, phone, source, value]),
  };
}

function normalizeCase(row: RecordMap) {
  const id = firstText(row, ['id', 'case_id', 'caseId']);
  const title = firstText(row, ['title', 'name', 'client_name', 'clientName']);
  const clientName = firstText(row, ['client_name', 'clientName']);
  const status = firstText(row, ['status', 'stage']);
  const leadId = firstText(row, ['lead_id', 'leadId']);
  const clientId = firstText(row, ['client_id', 'clientId']);
  const value = getValue(row);
  const completenessPercent = Number(firstValue(row, ['completeness_percent', 'completenessPercent']) || 0) || 0;
  const updatedAt = dateValue(row, ['updated_at', 'updatedAt', 'created_at', 'createdAt']);
  return {
    id, title, clientName, status, leadId, clientId, value, completenessPercent, updatedAt,
    href: id ? `/cases/${id}` : '/cases',
    searchText: entitySearchText(['case', 'sprawa', title, clientName, status, value, completenessPercent]),
  };
}

function normalizeWorkItem(row: RecordMap, fallbackType: 'task' | 'event') {
  const id = firstText(row, ['id', 'work_item_id', 'workItemId']);
  const title = firstText(row, ['title', 'name']);
  const recordType = firstText(row, ['record_type', 'recordType']) || fallbackType;
  const status = firstText(row, ['status', 'state']);
  const priority = firstText(row, ['priority']);
  const type = firstText(row, ['type', 'kind']);
  const leadId = firstText(row, ['lead_id', 'leadId']);
  const caseId = firstText(row, ['case_id', 'caseId']);
  const clientId = firstText(row, ['client_id', 'clientId']);
  const startsAt = dateValue(row, ['scheduled_at', 'scheduledAt', 'start_at', 'startAt', 'date', 'due_at', 'dueAt', 'reminder_at', 'reminderAt']);
  const endsAt = dateValue(row, ['end_at', 'endAt']);
  const updatedAt = dateValue(row, ['updated_at', 'updatedAt', 'created_at', 'createdAt']);
  return {
    id, title, recordType, type, status, priority, leadId, caseId, clientId, startsAt, endsAt, updatedAt,
    href: fallbackType === 'event' ? '/calendar' : '/tasks',
    searchText: entitySearchText([fallbackType, fallbackType === 'event' ? 'wydarzenie' : 'zadanie', title, type, status, priority, startsAt]),
  };
}

function normalizeDraft(row: RecordMap) {
  const id = firstText(row, ['id']);
  const type = firstText(row, ['type']) || 'lead';
  const kind = firstText(row, ['kind']) || `${type}_capture`;
  const source = firstText(row, ['source']) || 'manual';
  const provider = firstText(row, ['provider']) || 'local';
  const status = firstText(row, ['status']) || 'draft';
  const rawText = firstText(row, ['raw_text', 'rawText']);
  const parsedData = firstValue(row, ['parsed_data', 'parsedData', 'parsedDraft']) || {};
  const leadId = firstText(row, ['lead_id', 'leadId']) || firstText(parsedData as RecordMap, ['leadId', 'lead_id']);
  const caseId = firstText(row, ['case_id', 'caseId']) || firstText(parsedData as RecordMap, ['caseId', 'case_id']);
  const clientId = firstText(row, ['client_id', 'clientId']) || firstText(parsedData as RecordMap, ['clientId', 'client_id']);
  const createdAt = dateValue(row, ['created_at', 'createdAt']);
  const updatedAt = dateValue(row, ['updated_at', 'updatedAt', 'created_at', 'createdAt']);
  return {
    id, type, kind, source, provider, status, rawText, parsedData, leadId, caseId, clientId, createdAt, updatedAt,
    href: '/ai-drafts',
    searchText: entitySearchText(['szkic', 'szkice', 'ai draft', type, kind, source, provider, status, rawText, JSON.stringify(parsedData || {})]),
  };
}

function emptyBucket(): RelationBucket {
  return { leadIds: [], clientIds: [], caseIds: [], taskIds: [], eventIds: [], draftIds: [] };
}

function pushUnique(target: string[], value: unknown) {
  const text = asText(value);
  if (text && !target.includes(text)) target.push(text);
}

function ensureBucket(map: Record<string, RelationBucket>, id: string) {
  if (!map[id]) map[id] = emptyBucket();
  return map[id];
}

function buildRelations({ leads, clients, cases, tasks, events, drafts }: any) {
  const byLeadId: Record<string, RelationBucket> = {};
  const byClientId: Record<string, RelationBucket> = {};
  const byCaseId: Record<string, RelationBucket> = {};

  for (const lead of leads) {
    if (!lead.id) continue;
    const bucket = ensureBucket(byLeadId, lead.id);
    pushUnique(bucket.leadIds, lead.id);
    if (lead.clientId) {
      pushUnique(bucket.clientIds, lead.clientId);
      pushUnique(ensureBucket(byClientId, lead.clientId).leadIds, lead.id);
    }
    if (lead.caseId) {
      pushUnique(bucket.caseIds, lead.caseId);
      pushUnique(ensureBucket(byCaseId, lead.caseId).leadIds, lead.id);
    }
  }

  for (const client of clients) {
    if (!client.id) continue;
    pushUnique(ensureBucket(byClientId, client.id).clientIds, client.id);
  }

  for (const caseRecord of cases) {
    if (!caseRecord.id) continue;
    const caseBucket = ensureBucket(byCaseId, caseRecord.id);
    pushUnique(caseBucket.caseIds, caseRecord.id);
    if (caseRecord.leadId) {
      pushUnique(caseBucket.leadIds, caseRecord.leadId);
      pushUnique(ensureBucket(byLeadId, caseRecord.leadId).caseIds, caseRecord.id);
    }
    if (caseRecord.clientId) {
      pushUnique(caseBucket.clientIds, caseRecord.clientId);
      pushUnique(ensureBucket(byClientId, caseRecord.clientId).caseIds, caseRecord.id);
    }
  }

  const attachWork = (entry: any, key: 'taskIds' | 'eventIds') => {
    if (entry.leadId) pushUnique(ensureBucket(byLeadId, entry.leadId)[key], entry.id);
    if (entry.clientId) pushUnique(ensureBucket(byClientId, entry.clientId)[key], entry.id);
    if (entry.caseId) pushUnique(ensureBucket(byCaseId, entry.caseId)[key], entry.id);
  };
  tasks.forEach((task: any) => attachWork(task, 'taskIds'));
  events.forEach((event: any) => attachWork(event, 'eventIds'));

  for (const draft of drafts) {
    if (draft.leadId) pushUnique(ensureBucket(byLeadId, draft.leadId).draftIds, draft.id);
    if (draft.clientId) pushUnique(ensureBucket(byClientId, draft.clientId).draftIds, draft.id);
    if (draft.caseId) pushUnique(ensureBucket(byCaseId, draft.caseId).draftIds, draft.id);
  }

  return { byLeadId, byClientId, byCaseId };
}

function buildSearchIndex({ leads, clients, cases, tasks, events, drafts }: any) {
  const mapEntity = (entityType: EntityType, item: any) => ({
    entityType,
    id: item.id,
    label: item.name || item.company || item.title || item.clientName || item.rawText || `${entityType}:${item.id}`,
    subtitle: [item.status, item.email, item.phone, item.nextActionTitle, item.startsAt].filter(Boolean).join(' · '),
    href: item.href,
    status: item.status || null,
    date: item.nextActionAt || item.startsAt || item.updatedAt || item.createdAt || null,
    relationIds: {
      leadId: item.leadId || null,
      clientId: item.clientId || null,
      caseId: item.caseId || null,
    },
    searchText: item.searchText,
  });

  return [
    ...leads.map((item: any) => mapEntity('lead', item)),
    ...clients.map((item: any) => mapEntity('client', item)),
    ...cases.map((item: any) => mapEntity('case', item)),
    ...tasks.map((item: any) => mapEntity('task', item)),
    ...events.map((item: any) => mapEntity('event', item)),
    ...drafts.map((item: any) => mapEntity('draft', item)),
  ].filter((entry) => entry.id || entry.label);
}

function buildSummary({ leads, clients, cases, tasks, events, drafts }: any) {
  const openTasks = tasks.filter((task: any) => isOpenStatus(task.status));
  const openEvents = events.filter((event: any) => isOpenStatus(event.status));
  const pendingDrafts = drafts.filter(isDraftPending);
  const blockedCases = cases.filter((caseRecord: any) => ['blocked', 'waiting_on_client', 'to_approve', 'on_hold'].includes(asText(caseRecord.status).toLowerCase()));
  const totalValue = [...leads, ...clients, ...cases].reduce((sum: number, entry: any) => sum + (Number(entry.value) || 0), 0);
  return {
    leadsCount: leads.length,
    clientsCount: clients.length,
    casesCount: cases.length,
    tasksCount: tasks.length,
    eventsCount: events.length,
    draftsCount: drafts.length,
    openTasksCount: openTasks.length,
    openEventsCount: openEvents.length,
    pendingDraftsCount: pendingDrafts.length,
    blockedCasesCount: blockedCases.length,
    totalPipelineValue: totalValue,
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const workspaceId = await resolveRequestWorkspaceId(req);
    if (!workspaceId) {
      res.status(401).json({ error: 'ASSISTANT_CONTEXT_WORKSPACE_REQUIRED' });
      return;
    }

    const [leadRows, taskRows, eventRows, caseRows, clientRows, draftRows] = await Promise.all([
      safeSelect(withWorkspaceFilter(`leads?select=*&order=updated_at.desc.nullslast&limit=${SNAPSHOT_LIMITS.leads}`, workspaceId)),
      safeSelect(withWorkspaceFilter(`work_items?select=*&record_type=eq.task&order=scheduled_at.asc.nullslast&limit=${SNAPSHOT_LIMITS.tasks}`, workspaceId)),
      safeSelect(withWorkspaceFilter(`work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=${SNAPSHOT_LIMITS.events}`, workspaceId)),
      safeSelect(withWorkspaceFilter(`cases?select=*&order=updated_at.desc.nullslast&limit=${SNAPSHOT_LIMITS.cases}`, workspaceId)),
      safeSelect(withWorkspaceFilter(`clients?select=*&order=updated_at.desc.nullslast&limit=${SNAPSHOT_LIMITS.clients}`, workspaceId)),
      safeSelect(withWorkspaceFilter(`ai_drafts?select=*&order=created_at.desc&limit=${SNAPSHOT_LIMITS.drafts}`, workspaceId)),
    ]);

    const leads = leadRows.map(normalizeLead);
    const tasks = taskRows.map((row) => normalizeWorkItem(row, 'task'));
    const events = eventRows.map((row) => normalizeWorkItem(row, 'event'));
    const cases = caseRows.map(normalizeCase);
    const clients = clientRows.map(normalizeClient);
    const drafts = draftRows.map(normalizeDraft);
    const relations = buildRelations({ leads, clients, cases, tasks, events, drafts });
    const searchIndex = buildSearchIndex({ leads, clients, cases, tasks, events, drafts });
    const summary = buildSummary({ leads, clients, cases, tasks, events, drafts });
    const generatedAt = new Date().toISOString();

    res.status(200).json({
      ok: true,
      scope: 'assistant_application_snapshot_v2',
      noAutoWrite: true,
      stage: 'AI_OPERATOR_SNAPSHOT_STAGE02',
      workspaceId,
      generatedAt,
      now: generatedAt,
      limits: SNAPSHOT_LIMITS,
      summary,
      relations,
      searchIndex,
      operatorSnapshot: {
        scope: 'CloseFlow only',
        rule: 'Bez komendy zapisu asystent tylko czyta dane aplikacji. Z komendą zapisu tworzy szkic do zatwierdzenia.',
        dataSources: ['leads', 'clients', 'cases', 'tasks', 'events', 'ai_drafts'],
        noInternet: true,
        noAutoWrite: true,
        generatedAt,
        summary,
      },
      leads,
      tasks,
      events,
      cases,
      clients,
      drafts,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'ASSISTANT_CONTEXT_FAILED' });
  }
}
