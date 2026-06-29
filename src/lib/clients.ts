import { parseISO, differenceInCalendarDays, isValid } from 'date-fns';
import {
  getClientHealthLabel,
  getClientHealthTone,
  getPortalStatusLabel,
  type ClientSourceValue,
} from './source-of-truth/client-options';

type DateLikeValue =
  | string
  | null
  | undefined
  | {
      toDate?: () => Date;
    };

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
  createdAt?: DateLikeValue;
  updatedAt?: DateLikeValue;
};

export type ClientLeadLike = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
  clientId?: string;
  linkedCaseId?: string;
  updatedAt?: DateLikeValue;
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
  updatedAt?: DateLikeValue;
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
  source: ClientSourceValue;
  updatedAt?: DateLikeValue;
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

export function toJsDate(value?: DateLikeValue) {
  if (!value) return null;
  if (typeof value === 'string') {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }
  return null;
}

export function portalStatusLabel(portalReady?: boolean) {
  return getPortalStatusLabel(portalReady);
}

export function clientHealthLabel(input: {
  daysSinceTouch: number;
  linkedCaseCount: number;
  linkedLeadCount: number;
  portalReady: boolean;
}) {
  return getClientHealthLabel(input);
}

export function clientHealthTone(label: string) {
  return getClientHealthTone(label);
}

export function getDaysSinceTouch(updatedAt?: DateLikeValue) {
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
    const clientId = lead.clientId || buildClientIdFromLead({ leadId: lead.id, email: lead.email, phone: lead.phone, name: lead.name });
    const current = map.get(clientId);
    const shouldCreateFallback = Boolean(lead.clientId || lead.linkedCaseId || ['negotiation', 'proposal_sent', 'waiting_response', 'accepted', 'moved_to_service'].includes(lead.status || ''));

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
    const clientId = caseRecord.clientId || fallbackLead?.clientId || buildClientIdFromLead({
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
