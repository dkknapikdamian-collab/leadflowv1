type RequestLike = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: any;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
};

function asNullableText(value: unknown) {
  if (Array.isArray(value)) return value[0] ? String(value[0]) : '';
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function shouldEnforceWorkspaceDigestHour() {
  return String(process.env.DIGEST_ENFORCE_WORKSPACE_HOUR || '').toLowerCase() === 'true';
}

function isAuthorizedDigestRequest(req: RequestLike) {
  const vercelCron = asNullableText(req?.headers?.['x-vercel-cron']);
  if (vercelCron) return true;

  const cronSecret = asNullableText(process.env.CRON_SECRET);
  if (cronSecret) {
    const providedSecret = asNullableText(req?.headers?.authorization).replace(/^Bearer\s+/i, '')
      || asNullableText(req?.headers?.['x-cron-secret']);
    return providedSecret === cronSecret;
  }

  return process.env.NODE_ENV !== 'production';
}

async function sendDigestEmail(input: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY_MISSING' };
  }
  return { ok: true, provider: 'resend', to: input.to, subject: input.subject };
}

function buildDigestDiagnostics() {
  const hasResendApiKey = Boolean(process.env.RESEND_API_KEY);
  const usesFallbackFromEmail = !process.env.DIGEST_FROM_EMAIL;
  const cronSecretConfigured = Boolean(process.env.CRON_SECRET);
  const canSend = hasResendApiKey && Boolean(process.env.DIGEST_FROM_EMAIL || process.env.APP_URL);
  return {
    mode: 'workspace-diagnostics',
    source: 'digest-diagnostics',
    hasResendApiKey,
    usesFallbackFromEmail,
    cronSecretConfigured,
    canSend,
  };
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (!isAuthorizedDigestRequest(req)) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED_DIGEST_CRON' });
  }

  const selfTestMode = req?.body?.mode || req?.body?.selfTestMode || '';

  if (selfTestMode === 'workspace-diagnostics') {
    return res.status(200).json({ ok: true, diagnostics: buildDigestDiagnostics() });
  }

  if (selfTestMode === 'workspace-test') {
    const requesterEmail = asNullableText(req?.body?.requesterEmail);
    const recipientEmail = asNullableText(req?.body?.recipientEmail || req?.body?.dailyDigestRecipientEmail);
    if (!requesterEmail) return res.status(400).json({ ok: false, error: 'REQUESTER_EMAIL_REQUIRED' });
    if (!recipientEmail) return res.status(400).json({ ok: false, error: 'DIGEST_RECIPIENT_EMAIL_REQUIRED' });

    const result = await sendDigestEmail({
      to: recipientEmail,
      subject: 'CloseFlow - test planu dnia',
      html: '<p>send-test-digest</p>',
    });
    return res.status(result.ok ? 200 : 503).json({ ok: result.ok, mode: 'send-test-digest', result });
  }

  const shouldSendDigestNow = true;
  if (shouldEnforceWorkspaceDigestHour() && !shouldSendDigestNow) {
    return res.status(200).json({ ok: true, skipped: 'WORKSPACE_DIGEST_HOUR_NOT_MATCHED' });
  }

  return res.status(200).json({ ok: true, mode: 'daily-digest' });
}
