// CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_V1
export const CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY = 'FIN-9_FINANCE_DUPLICATE_SAFETY_WARNING_ONLY_V1' as const;

export const FINANCE_DUPLICATE_PAYMENT_WARNING_COPY =
  'Ten klient może mieć duplikat. Upewnij się, że dodajesz wpłatę do właściwego rekordu.';

export type FinanceDuplicateEntityType = 'lead' | 'client' | 'case';

export type FinanceDuplicateCandidate = {
  id: string;
  entityType: FinanceDuplicateEntityType;
  label: string;
  name?: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  statusLabel?: string;
  matchFields?: string[];
  url?: string;
};

type AnyRow = Record<string, unknown>;

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function pickText(row: AnyRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return '';
}

function normalizeComparable(value: unknown) {
  return asText(value).toLowerCase().replace(/\s+/g, ' ').trim();
}

function normalizePhone(value: unknown) {
  return asText(value).replace(/[^0-9+]/g, '').replace(/^00/, '+');
}

function guessEntityType(row: AnyRow): FinanceDuplicateEntityType {
  const explicit = asText(row.entityType || row.entity_type || row.type);
  if (explicit === 'case' || explicit === 'lead' || explicit === 'client') return explicit;
  if (row.caseId || row.case_id || row.completenessPercent || row.completeness_percent) return 'case';
  if (row.leadId || row.lead_id || row.source || row.pipelineStatus || row.pipeline_status) return 'lead';
  return 'client';
}

function getUrl(entityType: FinanceDuplicateEntityType, id: string) {
  if (!id) return undefined;
  if (entityType === 'case') return `/cases/${id}`;
  if (entityType === 'lead') return `/leads/${id}`;
  return `/clients/${id}`;
}

function buildLabel(row: AnyRow, entityType: FinanceDuplicateEntityType) {
  const explicit = pickText(row, ['label', 'title', 'name', 'clientName', 'client_name', 'company']);
  if (explicit) return explicit;
  if (entityType === 'case') return 'Podobna sprawa';
  if (entityType === 'lead') return 'Podobny lead';
  return 'Podobny klient';
}

export function normalizeFinanceDuplicateCandidate(row: unknown): FinanceDuplicateCandidate | null {
  if (!row || typeof row !== 'object') return null;
  const source = row as AnyRow;
  const id = pickText(source, ['id', 'recordId', 'record_id', 'caseId', 'case_id', 'clientId', 'client_id', 'leadId', 'lead_id']);
  if (!id) return null;
  const entityType = guessEntityType(source);
  const label = buildLabel(source, entityType);
  return {
    id,
    entityType,
    label,
    name: pickText(source, ['name', 'clientName', 'client_name']) || undefined,
    company: pickText(source, ['company', 'companyName', 'company_name']) || null,
    email: pickText(source, ['email', 'clientEmail', 'client_email']) || null,
    phone: pickText(source, ['phone', 'clientPhone', 'client_phone']) || null,
    status: pickText(source, ['status']) || null,
    statusLabel: pickText(source, ['statusLabel', 'status_label']) || undefined,
    matchFields: Array.isArray(source.matchFields) ? source.matchFields.map(String) : [],
    url: asText(source.url) || getUrl(entityType, id),
  };
}

export function normalizeFinanceDuplicateCandidates(value: unknown): FinanceDuplicateCandidate[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: FinanceDuplicateCandidate[] = [];
  for (const row of value) {
    const candidate = normalizeFinanceDuplicateCandidate(row);
    if (!candidate) continue;
    const key = `${candidate.entityType}:${candidate.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
  }
  return out;
}

export function buildFinanceDuplicateCandidatesFromRecord(record: unknown): FinanceDuplicateCandidate[] {
  if (!record || typeof record !== 'object') return [];
  const row = record as AnyRow;
  const candidateSources = [
    row.duplicateCandidates,
    row.duplicate_candidates,
    row.financeDuplicateCandidates,
    row.finance_duplicate_candidates,
    row.possibleDuplicates,
    row.possible_duplicates,
    row.similarRecords,
    row.similar_records,
    row.conflictCandidates,
    row.conflict_candidates,
    row.conflicts,
    row.duplicates,
  ];
  for (const source of candidateSources) {
    const candidates = normalizeFinanceDuplicateCandidates(source);
    if (candidates.length) return candidates;
  }
  return [];
}

export function buildFinanceDuplicateCandidatesFromRows(target: unknown, rows: unknown[]): FinanceDuplicateCandidate[] {
  if (!target || typeof target !== 'object' || !Array.isArray(rows)) return [];
  const current = target as AnyRow;
  const currentId = pickText(current, ['id', 'caseId', 'case_id', 'clientId', 'client_id', 'leadId', 'lead_id']);
  const currentEmail = normalizeComparable(pickText(current, ['email', 'clientEmail', 'client_email']));
  const currentPhone = normalizePhone(pickText(current, ['phone', 'clientPhone', 'client_phone']));
  const currentName = normalizeComparable(pickText(current, ['name', 'clientName', 'client_name', 'title']));
  const currentCompany = normalizeComparable(pickText(current, ['company', 'companyName', 'company_name']));
  const candidates: FinanceDuplicateCandidate[] = [];

  for (const item of rows) {
    if (!item || typeof item !== 'object') continue;
    const row = item as AnyRow;
    const id = pickText(row, ['id', 'caseId', 'case_id', 'clientId', 'client_id', 'leadId', 'lead_id']);
    if (!id || id === currentId) continue;
    const matchFields: string[] = [];
    const email = normalizeComparable(pickText(row, ['email', 'clientEmail', 'client_email']));
    const phone = normalizePhone(pickText(row, ['phone', 'clientPhone', 'client_phone']));
    const name = normalizeComparable(pickText(row, ['name', 'clientName', 'client_name', 'title']));
    const company = normalizeComparable(pickText(row, ['company', 'companyName', 'company_name']));
    if (currentEmail && email && currentEmail === email) matchFields.push('email');
    if (currentPhone && phone && currentPhone === phone) matchFields.push('phone');
    if (currentName && name && currentName === name) matchFields.push('name');
    if (currentCompany && company && currentCompany === company) matchFields.push('company');
    if (!matchFields.length) continue;
    const candidate = normalizeFinanceDuplicateCandidate({ ...row, matchFields });
    if (candidate) candidates.push(candidate);
  }

  return normalizeFinanceDuplicateCandidates(candidates).slice(0, 5);
}

export function hasFinanceDuplicateWarning(candidates: unknown) {
  return normalizeFinanceDuplicateCandidates(candidates).length > 0;
}
