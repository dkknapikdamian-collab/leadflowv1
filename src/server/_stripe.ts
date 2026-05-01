import crypto from 'node:crypto';

export function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export function asNullableText(value: unknown) {
  const normalized = asText(value);
  return normalized || null;
}

export function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch {
      return {};
    }
  }
  return req.body;
}

export function normalizeAppUrl(value: unknown, fallback = 'https://closeflowapp.vercel.app') {
  const raw = asNullableText(value);

  if (!raw) {
    return fallback;
  }

  const cleaned = raw.replace(/\/+$/, '');

  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned;
  }

  if (
    cleaned.includes('localhost')
    || cleaned.startsWith('127.0.0.1')
    || cleaned.startsWith('0.0.0.0')
  ) {
    return `http://${cleaned}`;
  }

  return `https://${cleaned}`;
}

export function getAppUrl(req: any) {
  const configured = asNullableText(process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL);

  if (configured) {
    return normalizeAppUrl(configured);
  }

  const host = asNullableText(req?.headers?.host);

  if (!host) {
    return normalizeAppUrl(null);
  }

  return normalizeAppUrl(host);
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

type BillingPeriod = 'monthly' | 'yearly';

type StripeBillingPlan = {
  planId: string;
  planKey: string;
  period: BillingPeriod;
  label: string;
  amountPln: number;
  accessDays: number;
};

type StripeSubscriptionRecord = {
  id: string;
  status?: string;
  cancel_at_period_end?: boolean;
  current_period_end?: number;
  customer?: string | null;
};

const STRIPE_BLIK_BILLING_PLANS: Record<string, StripeBillingPlan> = {
  basic_monthly: {
    planId: 'closeflow_basic',
    planKey: 'basic',
    period: 'monthly',
    label: 'CloseFlow Basic - dostep 30 dni',
    amountPln: toNumber(process.env.STRIPE_PRICE_BASIC_MONTHLY_PLN, 19),
    accessDays: 30,
  },
  basic_yearly: {
    planId: 'closeflow_basic_yearly',
    planKey: 'basic',
    period: 'yearly',
    label: 'CloseFlow Basic - dostep 365 dni',
    amountPln: toNumber(process.env.STRIPE_PRICE_BASIC_YEARLY_PLN, 190),
    accessDays: 365,
  },
  pro_monthly: {
    planId: 'closeflow_pro',
    planKey: 'pro',
    period: 'monthly',
    label: 'CloseFlow Pro - dostep 30 dni',
    amountPln: toNumber(process.env.STRIPE_PRICE_PRO_MONTHLY_PLN, 39),
    accessDays: 30,
  },
  pro_yearly: {
    planId: 'closeflow_pro_yearly',
    planKey: 'pro',
    period: 'yearly',
    label: 'CloseFlow Pro - dostep 365 dni',
    amountPln: toNumber(process.env.STRIPE_PRICE_PRO_YEARLY_PLN, 390),
    accessDays: 365,
  },
  business_monthly: {
    planId: 'closeflow_business',
    planKey: 'business',
    period: 'monthly',
    label: 'CloseFlow Business - dostep 30 dni',
    amountPln: toNumber(process.env.STRIPE_PRICE_BUSINESS_MONTHLY_PLN, 69),
    accessDays: 30,
  },
  business_yearly: {
    planId: 'closeflow_business_yearly',
    planKey: 'business',
    period: 'yearly',
    label: 'CloseFlow Business - dostep 365 dni',
    amountPln: toNumber(process.env.STRIPE_PRICE_BUSINESS_YEARLY_PLN, 690),
    accessDays: 365,
  },
};

export function normalizeStripeBillingPeriod(value: unknown): BillingPeriod {
  return String(value || '').toLowerCase() === 'yearly' ? 'yearly' : 'monthly';
}

export function normalizeStripePlanKey(value: unknown) {
  const normalized = String(value || '').toLowerCase();

  if (normalized === 'basic' || normalized === 'pro' || normalized === 'business') {
    return normalized;
  }

  return 'basic';
}

export function resolveStripeBillingPlan(planKeyInput: unknown, periodInput: unknown) {
  const planKey = normalizeStripePlanKey(planKeyInput);
  const period = normalizeStripeBillingPeriod(periodInput);
  const mapKey = `${planKey}_${period}`;

  return STRIPE_BLIK_BILLING_PLANS[mapKey] || STRIPE_BLIK_BILLING_PLANS.basic_monthly;
}

export function getStripeConfig() {
  const secretKey = asNullableText(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = asNullableText(process.env.STRIPE_WEBHOOK_SECRET);

  return {
    secretKey,
    webhookSecret,
    currency: 'pln',
  };
}

export function assertStripeCheckoutConfigured() {
  const config = getStripeConfig();

  const missing = {
    STRIPE_SECRET_KEY: !config.secretKey,
  };

  const ok = !Object.values(missing).some(Boolean);

  if (!ok) {
    return {
      ok: false as const,
      error: 'STRIPE_PROVIDER_NOT_CONFIGURED',
      missing,
    };
  }

  return {
    ok: true as const,
    ...config,
    secretKey: config.secretKey as string,
  };
}

function basicAuth(secretKey: string) {
  return Buffer.from(`${secretKey}:`).toString('base64');
}

async function stripePost<T>(endpoint: string, secretKey: string, params: URLSearchParams): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1/${endpoint.replace(/^\/+/, '')}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth(secretKey)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.raw || text || `STRIPE_REQUEST_FAILED:${response.status}`;
    throw new Error(String(message));
  }

  return data as T;
}

async function stripeRequestJson<T>(endpoint: string, secretKey: string, init: RequestInit): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1/${endpoint.replace(/^\/+/, '')}`, {
    ...init,
    headers: {
      Authorization: `Basic ${basicAuth(secretKey)}`,
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.raw || text || `STRIPE_REQUEST_FAILED:${response.status}`;
    throw new Error(String(message));
  }

  return data as T;
}

export async function createStripeBlikCheckout({
  workspaceId,
  customerEmail,
  appUrl,
  planKey,
  billingPeriod,
}: {
  workspaceId: string;
  customerEmail?: string | null;
  appUrl: string;
  planKey?: string | null;
  billingPeriod?: BillingPeriod | string | null;
}) {
  const config = assertStripeCheckoutConfigured();
  if (!config.ok) return config;

  const plan = resolveStripeBillingPlan(planKey, billingPeriod);
  const amount = Math.max(100, Math.round(plan.amountPln * 100));
  const description = `${plan.label} - ${plan.amountPln} PLN`;

  const params = new URLSearchParams();
  params.set('mode', 'subscription');
  params.set('success_url', `${appUrl}/billing?checkout=success`);
  params.set('cancel_url', `${appUrl}/billing?checkout=cancelled`);
  params.set('client_reference_id', workspaceId);

  params.set('payment_method_types[0]', 'card');
  params.set('payment_method_types[1]', 'blik');

  params.set('line_items[0][price_data][currency]', config.currency);
  params.set('line_items[0][price_data][unit_amount]', String(amount));
  params.set('line_items[0][price_data][recurring][interval]', plan.period === 'yearly' ? 'year' : 'month');
  params.set('line_items[0][price_data][product_data][name]', plan.label);
  params.set('line_items[0][quantity]', '1');

  params.set('metadata[workspace_id]', workspaceId);
  params.set('metadata[billing_provider]', 'stripe_blik');
  params.set('metadata[plan_id]', plan.planId);
  params.set('metadata[plan_key]', plan.planKey);
  params.set('metadata[billing_period]', plan.period);
  params.set('metadata[access_days]', String(plan.accessDays));
  params.set('subscription_data[metadata][workspace_id]', workspaceId);
  params.set('subscription_data[metadata][billing_provider]', 'stripe_blik');
  params.set('subscription_data[metadata][plan_id]', plan.planId);
  params.set('subscription_data[metadata][plan_key]', plan.planKey);
  params.set('subscription_data[metadata][billing_period]', plan.period);
  params.set('subscription_data[metadata][access_days]', String(plan.accessDays));
  params.set('subscription_data[description]', description);

  if (customerEmail) {
    params.set('customer_email', customerEmail);
  }

  const session = await stripePost<{ id?: string; url?: string }>('checkout/sessions', config.secretKey, params);

  if (!session.url) {
    throw new Error('STRIPE_CHECKOUT_URL_MISSING');
  }

  return {
    ok: true as const,
    provider: 'stripe_blik',
    url: session.url,
    sessionId: session.id || null,
    amount,
    amountPln: plan.amountPln,
    currency: config.currency,
    planId: plan.planId,
    planKey: plan.planKey,
    billingPeriod: plan.period,
    accessDays: plan.accessDays,
  };
}

export function mapStripeSubscriptionStatus(status: unknown) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'active' || normalized === 'trialing') return 'paid_active';
  if (normalized === 'past_due' || normalized === 'unpaid' || normalized === 'incomplete_expired') return 'payment_failed';
  if (normalized === 'canceled') return 'canceled';
  if (normalized === 'incomplete') return 'inactive';
  return 'inactive';
}

export function unixToIso(value: unknown) {
  const asNumber = Number(value);
  if (!Number.isFinite(asNumber) || asNumber <= 0) return null;
  return new Date(asNumber * 1000).toISOString();
}

export async function getStripeSubscription(subscriptionId: string) {
  const config = assertStripeCheckoutConfigured();
  if (!config.ok) {
    throw new Error('STRIPE_PROVIDER_NOT_CONFIGURED');
  }

  const id = asText(subscriptionId);
  if (!id) {
    throw new Error('STRIPE_SUBSCRIPTION_ID_REQUIRED');
  }

  return stripeRequestJson<StripeSubscriptionRecord>(`subscriptions/${encodeURIComponent(id)}`, config.secretKey, {
    method: 'GET',
  });
}

export async function updateStripeSubscription(subscriptionId: string, payload: { cancel_at_period_end: boolean }) {
  const config = assertStripeCheckoutConfigured();
  if (!config.ok) {
    throw new Error('STRIPE_PROVIDER_NOT_CONFIGURED');
  }

  const id = asText(subscriptionId);
  if (!id) {
    throw new Error('STRIPE_SUBSCRIPTION_ID_REQUIRED');
  }

  const params = new URLSearchParams();
  params.set('cancel_at_period_end', payload.cancel_at_period_end ? 'true' : 'false');

  return stripePost<StripeSubscriptionRecord>(`subscriptions/${encodeURIComponent(id)}`, config.secretKey, params);
}

export function verifyStripeSignature(rawBody: string, signatureHeader: string, webhookSecret: string) {
  const parts = signatureHeader.split(',').map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2) || '';
  const signature = parts.find((part) => part.startsWith('v1='))?.slice(3) || '';

  if (!timestamp || !signature) return false;

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  try {
    const left = Buffer.from(expected, 'hex');
    const right = Buffer.from(signature, 'hex');

    if (left.length !== right.length) return false;

    return crypto.timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export async function readRawBody(req: any) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf8');
}

export function buildNextBillingDate(days = 30) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}
