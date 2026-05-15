import { getRelationValue } from './relation-value';

export type ClientValueSummary = {
  totalValue: number;
  currency: 'PLN';
  sources: {
    leadsValue: number;
    casesValue: number;
    paidValue: number;
  };
};

export type TopClientValueEntry = {
  key: string;
  id: string;
  label: string;
  value: number;
  href: string;
  description: string;
  sources: ClientValueSummary['sources'];
};

type Row = Record<string, unknown>;

function asText(value: unknown) {
  return String(value || '').trim();
}

function getRowId(row: Row | null | undefined) {
  if (!row) return '';
  return asText(row.id || row.uid || row.clientId || row.client_id || row.customerId || row.customer_id);
}

function getClientIdFromRelatedRow(row: Row | null | undefined) {
  if (!row) return '';
  return asText(
    row.clientId ||
    row.client_id ||
    row.clientID ||
    row.customerId ||
    row.customer_id ||
    row.relatedClientId ||
    row.related_client_id ||
    row.linkedClientId ||
    row.linked_client_id,
  );
}

function getLeadIdFromRelatedRow(row: Row | null | undefined) {
  if (!row) return '';
  return asText(
    row.leadId ||
    row.lead_id ||
    row.sourceLeadId ||
    row.source_lead_id ||
    row.linkedLeadId ||
    row.linked_lead_id,
  );
}

function isArchivedClient(client: Row) {
  return Boolean(client.archivedAt || client.archived_at || client.deletedAt || client.deleted_at);
}

function formatCompactMoney(value: number) {
  return `${Math.round(Number(value) || 0).toLocaleString('pl-PL')} PLN`;
}

function buildClientLabel(client: Row) {
  return asText(client.name || client.company || client.clientName || client.client_name || client.email || 'Klient');
}

export function getClientValueSummary(
  client: Row,
  { leads = [], cases = [], payments = [] }: { leads?: Row[]; cases?: Row[]; payments?: Row[] },
): ClientValueSummary {
  const clientId = getRowId(client);
  if (!clientId) {
    return { totalValue: 0, currency: 'PLN', sources: { leadsValue: 0, casesValue: 0, paidValue: 0 } };
  }

  const relatedCases = cases.filter((caseRow) => getClientIdFromRelatedRow(caseRow) === clientId);
  const caseLeadIds = new Set(relatedCases.map(getLeadIdFromRelatedRow).filter(Boolean));

  const casesValue = relatedCases.reduce((sum, caseRow) => sum + getRelationValue(caseRow), 0);

  const leadsValue = leads
    .filter((lead) => getClientIdFromRelatedRow(lead) === clientId)
    .filter((lead) => {
      const leadId = getRowId(lead);
      return !leadId || !caseLeadIds.has(leadId);
    })
    .reduce((sum, lead) => sum + getRelationValue(lead), 0);

  const paidValue = payments
    .filter((payment) => getClientIdFromRelatedRow(payment) === clientId)
    .reduce((sum, payment) => sum + getRelationValue(payment), 0);

  const operationalValue = casesValue + leadsValue;
  const totalValue = operationalValue > 0 ? operationalValue : paidValue;

  return {
    totalValue,
    currency: 'PLN',
    sources: { leadsValue, casesValue, paidValue },
  };
}

export function buildTopClientValueEntries(
  clients: Row[],
  context: { leads?: Row[]; cases?: Row[]; payments?: Row[] },
  limit = 5,
): TopClientValueEntry[] {
  return clients
    .filter((client) => !isArchivedClient(client))
    .map((client, index) => {
      const id = getRowId(client) || String(index);
      const summary = getClientValueSummary(client, context);
      const sourceParts = [];
      if (summary.sources.casesValue > 0) sourceParts.push(`Sprawy: ${formatCompactMoney(summary.sources.casesValue)}`);
      if (summary.sources.leadsValue > 0) sourceParts.push(`Leady: ${formatCompactMoney(summary.sources.leadsValue)}`);
      if (!sourceParts.length && summary.sources.paidValue > 0) sourceParts.push(`Wpłaty: ${formatCompactMoney(summary.sources.paidValue)}`);

      return {
        key: `client:${id}`,
        id,
        label: buildClientLabel(client),
        value: summary.totalValue,
        href: id ? `/clients/${id}` : '/clients',
        description: sourceParts.join(' · ') || 'Brak wyliczonej wartości',
        sources: summary.sources,
      };
    })
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, Math.max(0, limit));
}

export function formatClientValue(value: number) {
  return formatCompactMoney(value);
}
