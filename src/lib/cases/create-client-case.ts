import {
  createCaseInSupabase,
  fetchCaseItemsFromSupabase,
  insertActivityToSupabase,
  insertCaseItemToSupabase,
} from '../supabase-fallback';

type ChecklistItemInput = {
  title: string;
  description?: string;
  type?: string;
  isRequired?: boolean;
};

export type CreateStarterCaseForClientInput = {
  title: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  workspaceId: string;
  primaryForClient: boolean;
  contractValue?: number;
  currency?: string;
  startedAt?: string | null;
  plannedAt?: string | null;
  ownerId?: string | null;
  caseType?: string;
  category?: string;
  priority?: string;
  source?: string;
  note?: string;
  createChecklist?: boolean;
  checklistTemplateId?: string;
  checklistTemplateName?: string;
  checklistItems?: ChecklistItemInput[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

export function readCreatedCaseId(result: unknown) {
  const row = asRecord(result);
  const data = asRecord(row.data);
  const caseRow = asRecord(row.case);
  const dataCase = asRecord(data.case);
  const nestedRow = asRecord(row.row);
  return String(
    row.id
    || row.caseId
    || row.case_id
    || caseRow.id
    || data.id
    || dataCase.id
    || nestedRow.id
    || ''
  ).trim();
}

export async function createStarterCaseForClient(input: CreateStarterCaseForClientInput) {
  const createdCase = await createCaseInSupabase({
    title: input.title.trim(),
    clientId: input.clientId,
    clientName: input.clientName,
    clientEmail: input.clientEmail || '',
    clientPhone: input.clientPhone || '',
    status: 'new',
    contractValue: typeof input.contractValue === 'number' ? input.contractValue : 0,
    expectedRevenue: 0,
    caseValue: 0,
    currency: input.currency || 'PLN',
    remainingAmount: 0,
    commissionMode: 'not_set',
    commissionAmount: 0,
    commissionStatus: 'not_set',
    startedAt: input.startedAt || null,
    primaryForClient: input.primaryForClient,
    workspaceId: input.workspaceId,
    ownerId: input.ownerId,
  });

  const createdCaseId = readCreatedCaseId(createdCase);
  if (!createdCaseId) {
    return {
      createdCase,
      createdCaseId: '',
      checklist: {
        requested: Boolean(input.createChecklist),
        createdCount: 0,
        existingCount: 0,
        templateId: input.checklistTemplateId || '',
        templateName: input.checklistTemplateName || '',
      },
      activityCreated: false,
    };
  }

  const checklistRequested = Boolean(input.createChecklist);
  const hasCreationMetadata = Boolean(
    input.caseType
    || input.category
    || input.priority
    || input.source
    || input.note?.trim()
    || input.plannedAt,
  );
  const checklistItems = Array.isArray(input.checklistItems)
    ? input.checklistItems.filter((item) => item && item.title?.trim())
    : [];

  if (checklistRequested) {
    if (!input.checklistTemplateId || !input.checklistTemplateName || !checklistItems.length) {
      throw new Error('CASE_CHECKLIST_TEMPLATE_REQUIRED');
    }

    let existingItems;
    try {
      existingItems = await fetchCaseItemsFromSupabase(createdCaseId);
    } catch {
      throw new Error('CASE_CHECKLIST_EXISTING_READ_FAILED');
    }

    const createdMarker = 'frt031_client_case_create';
    const existingTemplateItems = new Set(
      existingItems
        .filter((item) => item.payload?.source === createdMarker && item.payload?.templateId === input.checklistTemplateId)
        .map((item) => Number(item.payload?.templateItemIndex))
        .filter((index) => Number.isInteger(index) && index >= 0),
    );
    let createdCount = 0;
    for (const [index, item] of checklistItems.entries()) {
      if (existingTemplateItems.has(index)) continue;
      await insertCaseItemToSupabase({
        caseId: createdCaseId,
        title: item.title.trim(),
        description: item.description?.trim() || '',
        type: item.type || 'file',
        status: 'missing',
        isRequired: item.isRequired !== false,
        order: index,
        payload: {
          source: createdMarker,
          templateId: input.checklistTemplateId,
          templateItemIndex: index,
          requestKey: createdCaseId,
        },
      });
      createdCount += 1;
    }

    const checklist = {
      requested: true,
      createdCount,
      existingCount: existingTemplateItems.size,
      templateId: input.checklistTemplateId,
      templateName: input.checklistTemplateName,
    };

    let activityCreated = false;
    if (hasCreationMetadata || checklistRequested) {
      await insertActivityToSupabase({
        caseId: createdCaseId,
        clientId: input.clientId,
        ownerId: input.ownerId,
        eventType: 'client_case_created',
        workspaceId: input.workspaceId,
        payload: {
          source: 'frt031_client_case_create',
          caseType: input.caseType || null,
          category: input.category || null,
          priority: input.priority || null,
          sourceLabel: input.source || null,
          content: input.note?.trim() || null,
          note: input.note?.trim() || null,
          plannedAt: input.plannedAt || null,
          checklist,
        },
      });
      activityCreated = true;
    }

    return { createdCase, createdCaseId, checklist, activityCreated };
  }

  let activityCreated = false;
  if (hasCreationMetadata) {
    await insertActivityToSupabase({
      caseId: createdCaseId,
      clientId: input.clientId,
      ownerId: input.ownerId,
      eventType: 'client_case_created',
      workspaceId: input.workspaceId,
      payload: {
        source: 'frt031_client_case_create',
        caseType: input.caseType || null,
        category: input.category || null,
        priority: input.priority || null,
        sourceLabel: input.source || null,
        content: input.note?.trim() || null,
        note: input.note?.trim() || null,
        plannedAt: input.plannedAt || null,
        checklist: {
          requested: false,
          createdCount: 0,
          existingCount: 0,
          templateId: '',
          templateName: '',
        },
      },
    });
    activityCreated = true;
  }

  return {
    createdCase,
    createdCaseId,
    checklist: {
      requested: false,
      createdCount: 0,
      existingCount: 0,
      templateId: '',
      templateName: '',
    },
    activityCreated,
  };
}
