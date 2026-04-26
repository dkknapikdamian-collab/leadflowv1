export type RelationValueEntry = {
  key: string;
  id: string;
  kind: 'lead' | 'client' | 'case';
  kindLabel: string;
  label: string;
  value: number;
  href: string;
};

const VALUE_KEYS = [
  'dealValue',
  'deal_value',
  'value',
  'estimatedValue',
  'estimated_value',
  'potentialValue',
  'potential_value',
  'projectValue',
  'project_value',
  'contractValue',
  'contract_value',
  'budget',
  'amount',
  'totalValue',
  'total_value',
  'price',
];

function parseMoneyValue(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;

  const normalized = value
    .replace(/\s+/g, '')
    .replace(/pln/gi, '')
    .replace(/zł/gi, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getRelationValue(record: Record<string, unknown> | null | undefined) {
  if (!record) return 0;

  for (const key of VALUE_KEYS) {
    const value = parseMoneyValue(record[key]);
    if (value > 0) return value;
  }

  return 0;
}

function getRecordId(record: Record<string, unknown>, fallback: string) {
  return String(record.id || record.uid || record.clientId || record.caseId || record.leadId || fallback);
}

function getLeadLabel(lead: Record<string, unknown>) {
  return String(lead.name || lead.company || lead.email || lead.phone || 'Lead');
}

function getClientLabel(client: Record<string, unknown>) {
  return String(client.name || client.company || client.clientName || client.email || 'Klient');
}

function getCaseLabel(caseRecord: Record<string, unknown>) {
  return String(caseRecord.title || caseRecord.clientName || caseRecord.name || 'Sprawa');
}

function relationKey(kind: 'lead' | 'client' | 'case', record: Record<string, unknown>, index: number) {
  const leadId = String(record.leadId || record.lead_id || record.sourceLeadId || '').trim();
  const clientId = String(record.clientId || record.client_id || '').trim();

  if (leadId) return `lead:${leadId}`;
  if (clientId) return `client:${clientId}`;

  return `${kind}:${getRecordId(record, String(index))}`;
}

function upsertEntry(map: Map<string, RelationValueEntry>, entry: RelationValueEntry) {
  if (entry.value <= 0) return;

  const current = map.get(entry.key);
  if (!current || entry.value >= current.value || current.kind === 'lead') {
    map.set(entry.key, entry);
  }
}

export function buildRelationValueEntries({
  leads = [],
  clients = [],
  cases = [],
}: {
  leads?: Record<string, unknown>[];
  clients?: Record<string, unknown>[];
  cases?: Record<string, unknown>[];
}) {
  const map = new Map<string, RelationValueEntry>();

  leads.forEach((lead, index) => {
    const id = getRecordId(lead, String(index));
    upsertEntry(map, {
      key: relationKey('lead', lead, index),
      id,
      kind: 'lead',
      kindLabel: 'Lead',
      label: getLeadLabel(lead),
      value: getRelationValue(lead),
      href: id ? `/leads/${id}` : '/leads',
    });
  });

  clients.forEach((client, index) => {
    const id = getRecordId(client, String(index));
    upsertEntry(map, {
      key: relationKey('client', client, index),
      id,
      kind: 'client',
      kindLabel: 'Klient',
      label: getClientLabel(client),
      value: getRelationValue(client),
      href: id ? `/clients/${id}` : '/clients',
    });
  });

  cases.forEach((caseRecord, index) => {
    const id = getRecordId(caseRecord, String(index));
    upsertEntry(map, {
      key: relationKey('case', caseRecord, index),
      id,
      kind: 'case',
      kindLabel: 'Sprawa',
      label: getCaseLabel(caseRecord),
      value: getRelationValue(caseRecord),
      href: id ? `/cases/${id}` : '/cases',
    });
  });

  return [...map.values()].sort((a, b) => b.value - a.value);
}

export function formatRelationValue(value: number) {
  return `${Math.round(Number(value) || 0).toLocaleString('pl-PL')} PLN`;
}
