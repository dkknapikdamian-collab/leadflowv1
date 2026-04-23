import { isActiveSalesLead } from './lead-health';
import { matchesNormalizedQuery } from './search-normalization';

type UnknownRecord = Record<string, unknown>;

export type TopicContactOption = {
  id: string;
  type: 'lead' | 'case' | 'client';
  label: string;
  subLabel: string;
  metaLabel: string;
  clientId?: string | null;
  leadId?: string | null;
  caseId?: string | null;
  resolvedTarget: 'lead' | 'case' | 'needs_disambiguation';
  resolutionLabel: string;
  disabled?: boolean;
  keywords: string[];
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getClientDisplayName(client: UnknownRecord) {
  return asText(client.name) || asText(client.company) || 'Klient';
}

function getLeadDisplayName(lead: UnknownRecord) {
  return asText(lead.name) || 'Lead';
}

function getCaseDisplayName(caseRecord: UnknownRecord) {
  return asText(caseRecord.title) || asText(caseRecord.clientName) || 'Sprawa';
}

function isActiveCase(caseRecord: UnknownRecord) {
  return asText(caseRecord.status).toLowerCase() !== 'completed';
}

function getLeadStatusLabel(lead: UnknownRecord) {
  const status = asText(lead.status).toLowerCase();
  const labels: Record<string, string> = {
    new: 'Nowy lead',
    contacted: 'Kontakt podjęty',
    qualification: 'Weryfikacja',
    proposal_sent: 'Oferta wysłana',
    waiting_response: 'Czeka na odpowiedź',
    negotiation: 'Negocjacje',
    accepted: 'Klient wszedł',
    lost: 'Przegrany',
    moved_to_service: 'Temat przeniesiony do obsługi',
  };
  return labels[status] || 'Lead';
}

function getCaseStatusLabel(caseRecord: UnknownRecord) {
  const status = asText(caseRecord.status).toLowerCase();
  const labels: Record<string, string> = {
    waiting_on_client: 'Czeka na klienta',
    blocked: 'Zablokowana',
    ready_to_start: 'Gotowa do startu',
    in_progress: 'W toku',
    to_approve: 'Do akceptacji',
    completed: 'Zakończona',
  };
  return labels[status] || 'Sprawa';
}

export function buildTopicContactOptions({
  leads,
  cases,
  clients,
}: {
  leads: UnknownRecord[];
  cases: UnknownRecord[];
  clients: UnknownRecord[];
}) {
  const activeLeads = leads.filter((lead) => isActiveSalesLead(lead));
  const activeCases = cases.filter((caseRecord) => isActiveCase(caseRecord));

  const activeLeadsByClientId = new Map<string, UnknownRecord[]>();
  const activeCasesByClientId = new Map<string, UnknownRecord[]>();

  for (const lead of activeLeads) {
    const clientId = asText(lead.clientId);
    if (!clientId) continue;
    const bucket = activeLeadsByClientId.get(clientId) || [];
    bucket.push(lead);
    activeLeadsByClientId.set(clientId, bucket);
  }

  for (const caseRecord of activeCases) {
    const clientId = asText(caseRecord.clientId);
    if (!clientId) continue;
    const bucket = activeCasesByClientId.get(clientId) || [];
    bucket.push(caseRecord);
    activeCasesByClientId.set(clientId, bucket);
  }

  const leadOptions: TopicContactOption[] = activeLeads.map((lead) => ({
    id: `lead:${asText(lead.id)}`,
    type: 'lead',
    label: getLeadDisplayName(lead),
    subLabel: [asText(lead.company), asText(lead.email), asText(lead.phone)].filter(Boolean).join(' • ') || getLeadStatusLabel(lead),
    metaLabel: 'Lead',
    clientId: asText(lead.clientId) || null,
    leadId: asText(lead.id) || null,
    caseId: null,
    resolvedTarget: 'lead',
    resolutionLabel: `Powiązanie: lead "${getLeadDisplayName(lead)}"`,
    keywords: [
      getLeadDisplayName(lead),
      asText(lead.company),
      asText(lead.email),
      asText(lead.phone),
      asText(lead.source),
      asText(lead.nextStep),
    ],
  }));

  const caseOptions: TopicContactOption[] = cases.map((caseRecord) => ({
    id: `case:${asText(caseRecord.id)}`,
    type: 'case',
    label: getCaseDisplayName(caseRecord),
    subLabel: [asText(caseRecord.clientName), getCaseStatusLabel(caseRecord)].filter(Boolean).join(' • '),
    metaLabel: 'Sprawa',
    clientId: asText(caseRecord.clientId) || null,
    leadId: asText(caseRecord.leadId) || null,
    caseId: asText(caseRecord.id) || null,
    resolvedTarget: 'case',
    resolutionLabel: `Powiązanie: sprawa "${getCaseDisplayName(caseRecord)}"`,
    keywords: [
      getCaseDisplayName(caseRecord),
      asText(caseRecord.clientName),
      asText(caseRecord.clientEmail),
      asText(caseRecord.clientPhone),
      getCaseStatusLabel(caseRecord),
    ],
  }));

  const clientOptions: TopicContactOption[] = clients.map((client) => {
    const clientId = asText(client.id);
    const clientLabel = getClientDisplayName(client);
    const linkedCases = activeCasesByClientId.get(clientId) || [];
    const linkedLeads = activeLeadsByClientId.get(clientId) || [];

    if (linkedCases.length === 1) {
      const onlyCase = linkedCases[0];
      return {
        id: `client:${clientId}`,
        type: 'client',
        label: clientLabel,
        subLabel: `Klient • aktywna sprawa: ${getCaseDisplayName(onlyCase)}`,
        metaLabel: 'Klient',
        clientId,
        leadId: asText(onlyCase.leadId) || null,
        caseId: asText(onlyCase.id) || null,
        resolvedTarget: 'case',
        resolutionLabel: `Powiązanie: sprawa "${getCaseDisplayName(onlyCase)}"`,
        keywords: [clientLabel, asText(client.company), asText(client.email), asText(client.phone), getCaseDisplayName(onlyCase)],
      };
    }

    if (linkedCases.length === 0 && linkedLeads.length === 1) {
      const onlyLead = linkedLeads[0];
      return {
        id: `client:${clientId}`,
        type: 'client',
        label: clientLabel,
        subLabel: `Klient • aktywny lead: ${getLeadDisplayName(onlyLead)}`,
        metaLabel: 'Klient',
        clientId,
        leadId: asText(onlyLead.id) || null,
        caseId: null,
        resolvedTarget: 'lead',
        resolutionLabel: `Powiązanie: lead "${getLeadDisplayName(onlyLead)}"`,
        keywords: [clientLabel, asText(client.company), asText(client.email), asText(client.phone), getLeadDisplayName(onlyLead)],
      };
    }

    const hasManyTopics = linkedCases.length + linkedLeads.length > 1;
    return {
      id: `client:${clientId}`,
      type: 'client',
      label: clientLabel,
      subLabel: hasManyTopics
        ? 'Klient • ma kilka tematów, wybierz konkretny lead albo sprawę'
        : 'Klient • brak aktywnego tematu do powiązania',
      metaLabel: 'Klient',
      clientId,
      leadId: null,
      caseId: null,
      resolvedTarget: 'needs_disambiguation',
      resolutionLabel: 'Powiązanie wymaga wyboru konkretnego tematu',
      disabled: true,
      keywords: [clientLabel, asText(client.company), asText(client.email), asText(client.phone)],
    };
  });

  return [...caseOptions, ...leadOptions, ...clientOptions];
}

export function filterTopicContactOptions(options: TopicContactOption[], query: string) {
  return options
    .filter((option) => matchesNormalizedQuery(option.keywords, query))
    .slice(0, 10);
}

export function resolveTopicContactLink(option: TopicContactOption | null) {
  if (!option || option.resolvedTarget === 'needs_disambiguation') {
    return {
      leadId: null,
      caseId: null,
      resolutionLabel: '',
    };
  }

  return {
    leadId: option.resolvedTarget === 'lead' ? option.leadId || null : null,
    caseId: option.resolvedTarget === 'case' ? option.caseId || null : null,
    resolutionLabel: option.resolutionLabel,
  };
}

export function findTopicContactOption(
  options: TopicContactOption[],
  params: { leadId?: string | null; caseId?: string | null }
) {
  if (params.caseId) {
    return options.find((option) => option.resolvedTarget === 'case' && option.caseId === params.caseId) || null;
  }
  if (params.leadId) {
    return options.find((option) => option.resolvedTarget === 'lead' && option.leadId === params.leadId) || null;
  }
  return null;
}
