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

export function getAppUrl(req: any) {
  const configured = asNullableText(process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL);
  if (configured) return configured.replace(/\/+$/, '');

  const host = asNullableText(req?.headers?.host);
  if (!host) return 'https://closeflowapp.vercel.app';

  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getStripeConfig() {
  const secretKey = asNullableText(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = asNullableText(process.env.STRIPE_WEBHOOK_SECRET);
  const pricePln = toNumber(process.env.STRIPE_PRICE_PLN || process.env.CLOSEFLOW_PRICE_PLN, 49);
  const amount = Math.max(100, Math.round(pricePln * 100));

  return {
    secretKey,
    webhookSecret,
    amount,
    currency: 'pln',
    productName: asText(process.env.STRIPE_PRODUCT_NAME || 'CloseFlow Pro - dostep 30 dni') || 'CloseFlow Pro - dostep 30 dni',
    description: asText(process.env.STRIPE_PAYMENT_DESCRIPTION || 'CloseFlow Pro - dostep do aplikacji na 30 dni') || 'CloseFlow Pro - dostep do aplikacji na 30 dni',
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

export async function createStripeBlikCheckout({
  workspaceId,
  customerEmail,
  appUrl,
}: {
  workspaceId: string;
  customerEmail?: string | null;
  appUrl: string;
}) {
  const config = assertStripeCheckoutConfigured();
  if (!config.ok) return config;

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', `${appUrl}/billing?checkout=success`);
  params.set('cancel_url', `${appUrl}/billing?checkout=cancelled`);
  params.set('client_reference_id', workspaceId);

  params.set('payment_method_types[0]', 'card');
  params.set('payment_method_types[1]', 'blik');

  params.set('line_items[0][price_data][currency]', config.currency);
  params.set('line_items[0][price_data][unit_amount]', String(config.amount));
  params.set('line_items[0][price_data][product_data][name]', config.productName);
  params.set('line_items[0][quantity]', '1');

  params.set('metadata[workspace_id]', workspaceId);
  params.set('metadata[billing_provider]', 'stripe_blik');
  params.set('metadata[access_days]', '30');
  params.set('payment_intent_data[metadata][workspace_id]', workspaceId);
  params.set('payment_intent_data[metadata][billing_provider]', 'stripe_blik');
  params.set('payment_intent_data[description]', config.description);

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
    amount: config.amount,
    currency: config.currency,
  };
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
