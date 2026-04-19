export type LeadPartialPayment = {
  id: string;
  amount: number;
  paidAt?: string;
  createdAt: string;
};

export type LeadFinanceSource = {
  status?: string | null;
  dealValue?: number | null;
  partialPayments?: LeadPartialPayment[] | null;
};

export type LeadFinanceSummary = {
  partialPayments: LeadPartialPayment[];
  paidAmount: number;
  remainingAmount: number;
  earnedAmount: number;
  funnelAmount: number;
};

export const ACTIVE_LEAD_STATUSES = ['new', 'contacted', 'qualification', 'proposal_sent', 'follow_up', 'negotiation'] as const;

export function normalizePartialPayment(input: unknown, fallbackIndex = 0): LeadPartialPayment | null {
  if (!input || typeof input !== 'object') return null;
  const entry = input as Record<string, unknown>;
  const rawAmount = Number(entry.amount ?? 0);
  if (!Number.isFinite(rawAmount) || rawAmount < 0) return null;

  return {
    id: String(entry.id || `payment-${fallbackIndex}`),
    amount: rawAmount,
    paidAt: typeof entry.paidAt === 'string' && entry.paidAt.trim() ? entry.paidAt : undefined,
    createdAt: typeof entry.createdAt === 'string' && entry.createdAt.trim() ? entry.createdAt : new Date(0).toISOString(),
  };
}

export function normalizePartialPayments(input: unknown): LeadPartialPayment[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((entry, index) => normalizePartialPayment(entry, index))
    .filter((entry): entry is LeadPartialPayment => Boolean(entry))
    .sort((a, b) => {
      const aKey = a.paidAt || a.createdAt;
      const bKey = b.paidAt || b.createdAt;
      return aKey.localeCompare(bKey);
    });
}

export function getLeadFinance(source: LeadFinanceSource): LeadFinanceSummary {
  const partialPayments = normalizePartialPayments(source.partialPayments);
  const dealValue = Math.max(0, Number(source.dealValue) || 0);
  const paidAmount = partialPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = Math.max(0, dealValue - paidAmount);
  const isWon = source.status === 'won';
  const isLost = source.status === 'lost';
  const earnedAmount = isWon ? paidAmount + remainingAmount : paidAmount;
  const funnelAmount = isWon || isLost ? 0 : remainingAmount;

  return {
    partialPayments,
    paidAmount,
    remainingAmount,
    earnedAmount,
    funnelAmount,
  };
}

export function isActiveLeadStatus(status?: string | null) {
  return ACTIVE_LEAD_STATUSES.includes((status || 'new') as (typeof ACTIVE_LEAD_STATUSES)[number]);
}
