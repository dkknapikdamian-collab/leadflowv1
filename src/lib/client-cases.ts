export const CLOSEFLOW_CLIENT_PRIMARY_CASE_ETAP7 = 'CLOSEFLOW_CLIENT_PRIMARY_CASE_ETAP7';

export type ClientPrimaryCaseInput = {
  client?: Record<string, unknown> | null;
  cases?: Array<Record<string, unknown>> | null;
};

export type ClientPrimaryCaseState = {
  primaryCaseId: string;
  explicitPrimaryCase: Record<string, unknown> | null;
  displayPrimaryCase: Record<string, unknown> | null;
  isFallback: boolean;
  primaryCaseMissing: boolean;
  sortedCases: Array<Record<string, unknown>>;
};

export function getClientPrimaryCaseId(client?: Record<string, unknown> | null): string {
  const raw = client?.primaryCaseId ?? client?.primary_case_id ?? '';
  return typeof raw === 'string' ? raw.trim() : String(raw || '').trim();
}

function getCaseId(caseRecord: Record<string, unknown> | null | undefined): string {
  const raw = caseRecord?.id ?? caseRecord?.caseId ?? caseRecord?.case_id ?? '';
  return typeof raw === 'string' ? raw.trim() : String(raw || '').trim();
}

function getCaseTime(caseRecord: Record<string, unknown>): number {
  const raw = caseRecord.updatedAt ?? caseRecord.updated_at ?? caseRecord.createdAt ?? caseRecord.created_at ?? '';
  const parsed = Date.parse(String(raw || ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isActiveClientCase(caseRecord: Record<string, unknown> | null | undefined): boolean {
  const status = String(caseRecord?.status || '').toLowerCase();
  return !['completed', 'done', 'canceled', 'cancelled', 'archived', 'lost'].includes(status);
}

export function sortClientCasesWithPrimary(
  cases: Array<Record<string, unknown>> | null | undefined,
  primaryCaseId?: string | null,
): Array<Record<string, unknown>> {
  const normalizedPrimaryId = String(primaryCaseId || '').trim();
  return [...(Array.isArray(cases) ? cases : [])].sort((left, right) => {
    const leftId = getCaseId(left);
    const rightId = getCaseId(right);
    if (normalizedPrimaryId && leftId === normalizedPrimaryId && rightId !== normalizedPrimaryId) return -1;
    if (normalizedPrimaryId && rightId === normalizedPrimaryId && leftId !== normalizedPrimaryId) return 1;
    const leftActive = isActiveClientCase(left);
    const rightActive = isActiveClientCase(right);
    if (leftActive !== rightActive) return leftActive ? -1 : 1;
    return getCaseTime(right) - getCaseTime(left);
  });
}

export const sortClientCasesWithPrimaryFirst = sortClientCasesWithPrimary;

export function getClientPrimaryCase(
  client: Record<string, unknown> | null | undefined,
  cases: Array<Record<string, unknown>> | null | undefined,
): Record<string, unknown> | null {
  const primaryCaseId = getClientPrimaryCaseId(client);
  if (!primaryCaseId || !Array.isArray(cases)) return null;
  return cases.find((caseRecord) => getCaseId(caseRecord) === primaryCaseId) || null;
}

export function resolveClientPrimaryCase(input: ClientPrimaryCaseInput): ClientPrimaryCaseState {
  const cases = Array.isArray(input.cases) ? input.cases : [];
  const primaryCaseId = getClientPrimaryCaseId(input.client);
  const explicitPrimaryCase = getClientPrimaryCase(input.client, cases);
  const fallbackCase = cases
    .filter(isActiveClientCase)
    .sort((left, right) => getCaseTime(right) - getCaseTime(left))[0] || null;
  return {
    primaryCaseId,
    explicitPrimaryCase,
    displayPrimaryCase: explicitPrimaryCase || fallbackCase,
    isFallback: Boolean(!explicitPrimaryCase && fallbackCase),
    primaryCaseMissing: Boolean(primaryCaseId && !explicitPrimaryCase),
    sortedCases: sortClientCasesWithPrimary(cases, primaryCaseId),
  };
}

export function getClientPrimaryCaseDisplay(
  client: Record<string, unknown> | null | undefined,
  cases: Array<Record<string, unknown>> | null | undefined,
): Record<string, unknown> | null {
  return resolveClientPrimaryCase({ client, cases }).displayPrimaryCase;
}

export function buildClientPrimaryCasePatch(clientId: string, caseId: string | null) {
  return { id: clientId, primaryCaseId: caseId };
}

export function shouldConfirmPrimaryCaseReplacement(currentPrimaryCaseId: string | null | undefined, nextCaseId: string): boolean {
  const current = String(currentPrimaryCaseId || '').trim();
  const next = String(nextCaseId || '').trim();
  return Boolean(current && next && current !== next);
}
