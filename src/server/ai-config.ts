const DEFAULT_ADMIN_EMAILS = ['dk.knapikdamian@gmail.com'];

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function asBool(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  const normalized = asText(value).toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
}

function parseList(raw?: string) {
  return asText(raw)
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function adminEmails() {
  return new Set([
    ...DEFAULT_ADMIN_EMAILS,
    ...parseList(process.env.ADMIN_EMAILS),
    ...parseList(process.env.CLOSEFLOW_ADMIN_EMAILS),
  ]);
}

function isAdminEmail(email: string) {
  return !!email && adminEmails().has(email.trim().toLowerCase());
}

function hasEnv(name: string) {
  return Boolean(asText(process.env[name]));
}

function envText(name: string, fallback = '') {
  return asText(process.env[name]) || fallback;
}

function buildDiagnostics() {
  const primaryProvider = envText('AI_PRIMARY_PROVIDER', 'gemini');
  const fallbackProvider = envText('AI_FALLBACK_PROVIDER', 'cloudflare');
  const aiEnabled = asBool(process.env.AI_ENABLED, false);
  const quickLeadEnabled = asBool(process.env.QUICK_LEAD_CAPTURE_ENABLED, true);
  const deleteRawOnConfirm = asBool(process.env.QUICK_LEAD_DELETE_RAW_TEXT_ON_CONFIRM, true);
  const ttlHoursRaw = Number(envText('QUICK_LEAD_DRAFT_TTL_HOURS', '24'));
  const ttlHours = Number.isFinite(ttlHoursRaw) && ttlHoursRaw > 0 ? Math.floor(ttlHoursRaw) : 24;

  const geminiConfigured = hasEnv('GEMINI_API_KEY');
  const cloudflareConfigured = hasEnv('CLOUDFLARE_ACCOUNT_ID') && hasEnv('CLOUDFLARE_API_TOKEN');

  return {
    ok: true,
    scope: 'admin_only',
    ai: {
      enabled: aiEnabled,
      primaryProvider,
      fallbackProvider,
      quickLeadCaptureEnabled: quickLeadEnabled,
      draftTtlHours: ttlHours,
      deleteRawTextOnConfirm: deleteRawOnConfirm,
      status: aiEnabled ? 'enabled' : 'disabled_rule_parser_only',
    },
    providers: {
      ruleParser: {
        configured: true,
        available: true,
        role: 'always_on_fallback',
      },
      gemini: {
        configured: geminiConfigured,
        available: aiEnabled && geminiConfigured,
        model: envText('GEMINI_MODEL', 'gemini-2.5-flash-lite'),
        requiredEnv: ['GEMINI_API_KEY'],
      },
      cloudflare: {
        configured: cloudflareConfigured,
        available: aiEnabled && cloudflareConfigured,
        model: envText('CLOUDFLARE_AI_MODEL', ''),
        requiredEnv: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_AI_MODEL'],
        hasAccountId: hasEnv('CLOUDFLARE_ACCOUNT_ID'),
        hasToken: hasEnv('CLOUDFLARE_API_TOKEN'),
      },
    },
    notes: [
      'Klucze API sa trzymane w zmiennych srodowiskowych backendu.',
      'Frontend widzi tylko status konfiguracji, nigdy wartosci sekretow.',
      'Gdy AI jest wylaczone albo provider nie dziala, Quick Lead Capture ma uzyc parsera regulowego.',
    ],
  };
}

export default async function aiConfigHandler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const requesterEmail = asText(req?.headers?.['x-user-email'] || req?.query?.email).toLowerCase();
  if (!isAdminEmail(requesterEmail)) {
    res.status(403).json({ error: 'ADMIN_ONLY' });
    return;
  }

  res.status(200).json(buildDiagnostics());
}
