import type { Timestamp } from 'firebase/firestore';
import { parseISO, differenceInCalendarDays, isValid } from 'date-fns';

export type ClientRecord = {
  id: string;
  ownerId?: string;
  workspaceId?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  sourceLeadId?: string;
  linkedLeadIds?: string[];
  linkedCaseIds?: string[];
  primaryCaseId?: string | null;
  primaryLeadId?: string | null;
  portalReady?: boolean;
  notes?: string;
  createdAt?: Timestamp | string | null;
  updatedAt?: Timestamp | string | null;
};

export type ClientLeadLike = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
  linkedClientId?: string;
  linkedCaseId?: string;
  updatedAt?: Timestamp | string | null;
};

export type ClientCaseLike = {
  id: string;
  title?: string;
  clientName?: string;
  clientId?: string;
  clientEmail?: string;
  clientPhone?: string;
  company?: string;
  leadId?: string;
  status?: string;
  portalReady?: boolean;
  updatedAt?: Timestamp | string | null;
};

export type ClientViewModel = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedLeadIds: string[];
  linkedCaseIds: string[];
  primaryLeadId?: string | null;
  primaryCaseId?: string | null;
  portalReady: boolean;
  source: 'client' | 'case' | 'lead';
  updatedAt?: Timestamp | string | null;
  notes?: string;
};

export function safeSlug(value?: string | null) {
  return (value || 'klient')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || 'klient';
}

export function buildClientIdFromLead(params: {
  leadId: string;
  email?: string;
  phone?: string;
  name?: string;
}) {
  const key = params.email?.trim().toLowerCase() || params.phone?.replace(/\s+/g, '') || params.name || params.leadId;
  return `client-${safeSlug(key)}-${safeSlug(params.leadId).slice(0, 12)}`;
}

export function toJsDate(value?: Timestamp | string | null) {
  if (!value) return null;
  if (typeof value === 'string') {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}

export function portalStatusLabel(portalReady?: boolean) {
  return portalReady ? 'Portal gotowy' : 'Portal jeszcze niegotowy';
}

export function clientHealthLabel(input: {
  daysSinceTouch: number;
  linkedCaseCount: number;
  linkedLeadCount: number;
  portalReady: boolean;
}) {
  if (input.linkedCaseCount > 0 && input.portalReady) return 'W realizacji';
  if (input.linkedCaseCount > 0) return 'Onboarding';
  if (input.daysSinceTouch >= 7) return 'Wymaga ruchu';
  if (input.linkedLeadCount > 0) return 'W sprzedaży';
  return 'Do spięcia';
}

export function clientHealthTone(label: string) {
  switch (label) {
    case 'W realizacji':
      return 'bg-emerald-500/12 text-emerald-500 border-emerald-500/20';
    case 'Onboarding':
      return 'bg-sky-500/12 text-sky-500 border-sky-500/20';
    case 'W sprzedaży':
      return 'bg-indigo-500/12 text-indigo-500 border-indigo-500/20';
    case 'Wymaga ruchu':
      return 'bg-amber-500/12 text-amber-500 border-amber-500/20';
    default:
      return 'bg-slate-500/12 text-slate-500 border-slate-500/20';
  }
}

export function getDaysSinceTouch(updatedAt?: Timestamp | string | null) {
  const updated = toJsDate(updatedAt);
  if (!updated) return 0;
  return Math.max(0, differenceInCalendarDays(new Date(), updated));
}

function unique(values: (string | undefined | null)[]) {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

export function buildClientDirectory(
  clients: ClientRecord[],
  leads: ClientLeadLike[],
  cases: ClientCaseLike[]
): ClientViewModel[] {
  const map = new Map<string, ClientViewModel>();

  const upsert = (id: string, patch: Partial<ClientViewModel>) => {
    const current = map.get(id) || {
      id,
      name: patch.name || 'Klient bez nazwy',
      linkedLeadIds: [],
      linkedCaseIds: [],
      portalReady: false,
      source: 'client' as const,
    };

    map.set(id, {
      ...current,
      ...patch,
      linkedLeadIds: unique([...(current.linkedLeadIds || []), ...((patch.linkedLeadIds || []) as string[])]),
      linkedCaseIds: unique([...(current.linkedCaseIds || []), ...((patch.linkedCaseIds || []) as string[])]),
      portalReady: Boolean(current.portalReady || patch.portalReady),
    });
  };

  clients.forEach((client) => {
    upsert(client.id, {
      source: 'client',
      name: client.name || client.company || 'Klient bez nazwy',
      company: client.company,
      email: client.email,
      phone: client.phone,
      linkedLeadIds: client.linkedLeadIds || (client.primaryLeadId ? [client.primaryLeadId] : []),
      linkedCaseIds: client.linkedCaseIds || (client.primaryCaseId ? [client.primaryCaseId] : []),
      primaryLeadId: client.primaryLeadId || client.sourceLeadId || null,
      primaryCaseId: client.primaryCaseId || null,
      portalReady: Boolean(client.portalReady),
      updatedAt: client.updatedAt,
      notes: client.notes,
    });
  });

  leads.forEach((lead) => {
    const clientId = lead.linkedClientId || buildClientIdFromLead({ leadId: lead.id, email: lead.email, phone: lead.phone, name: lead.name });
    const current = map.get(clientId);
    const shouldCreateFallback = Boolean(lead.linkedClientId || lead.linkedCaseId || ['negotiation', 'proposal_sent', 'follow_up', 'won'].includes(lead.status || ''));

    if (current || shouldCreateFallback) {
      upsert(clientId, {
        source: current?.source || 'lead',
        name: current?.name || lead.name || lead.company || 'Lead bez nazwy',
        company: current?.company || lead.company,
        email: current?.email || lead.email,
        phone: current?.phone || lead.phone,
        linkedLeadIds: [lead.id],
        primaryLeadId: current?.primaryLeadId || lead.id,
        primaryCaseId: current?.primaryCaseId || lead.linkedCaseId || null,
        updatedAt: current?.updatedAt || lead.updatedAt,
      });
    }
  });

  cases.forEach((caseRecord) => {
    const fallbackLead = caseRecord.leadId ? leads.find((lead) => lead.id === caseRecord.leadId) : undefined;
    const clientId = caseRecord.clientId || fallbackLead?.linkedClientId || buildClientIdFromLead({
      leadId: fallbackLead?.id || caseRecord.id,
      email: caseRecord.clientEmail || fallbackLead?.email,
      phone: caseRecord.clientPhone || fallbackLead?.phone,
      name: caseRecord.clientName || fallbackLead?.name || caseRecord.title,
    });
    const current = map.get(clientId);
    upsert(clientId, {
      source: current?.source || 'case',
      name: current?.name || caseRecord.clientName || fallbackLead?.name || caseRecord.title || 'Klient ze sprawy',
      company: current?.company || caseRecord.company || fallbackLead?.company,
      email: current?.email || caseRecord.clientEmail || fallbackLead?.email,
      phone: current?.phone || caseRecord.clientPhone || fallbackLead?.phone,
      linkedCaseIds: [caseRecord.id],
      linkedLeadIds: caseRecord.leadId ? [caseRecord.leadId] : current?.linkedLeadIds || [],
      primaryCaseId: current?.primaryCaseId || caseRecord.id,
      primaryLeadId: current?.primaryLeadId || caseRecord.leadId || null,
      portalReady: Boolean(caseRecord.portalReady),
      updatedAt: current?.updatedAt || caseRecord.updatedAt,
    });
  });

  return Array.from(map.values());
}
