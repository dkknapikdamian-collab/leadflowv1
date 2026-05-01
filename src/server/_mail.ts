/* STAGE_A28_MAIL_HELPER: wspólna, lekka wysyłka Resend dla digestów i raportów. */
const RESEND_API_URL = 'https://api.resend.com/emails';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

export function getAppUrlFromRequest(req: any) {
  const configured = asText(process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL);
  if (configured) return configured.replace(/\/+$/, '');
  const host = asText(req?.headers?.host);
  if (!host) return 'https://closeflowapp.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export function getMailDiagnostics() {
  const fromEmail = asText(process.env.DIGEST_FROM_EMAIL) || 'CloseFlow <onboarding@resend.dev>';
  return {
    hasResendApiKey: Boolean(asText(process.env.RESEND_API_KEY)),
    hasFromEmail: Boolean(fromEmail),
    fromEmail,
    usesFallbackFromEmail: !asText(process.env.DIGEST_FROM_EMAIL),
  };
}

export async function sendResendEmail({
  to,
  subject,
  plain,
  html,
}: {
  to: string;
  subject: string;
  plain: string;
  html: string;
}) {
  const resendApiKey = asText(process.env.RESEND_API_KEY);
  const digestFromEmail = asText(process.env.DIGEST_FROM_EMAIL) || 'CloseFlow <onboarding@resend.dev>';
  if (!resendApiKey) {
    return { ok: false, error: 'RESEND_API_KEY_MISSING' };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: digestFromEmail,
        to: [to],
        subject,
        text: plain,
        html,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return { ok: false, error: `RESEND_SEND_FAILED:${details || response.status}` };
    }

    return { ok: true, error: null as string | null };
  } catch (error: any) {
    return { ok: false, error: error?.message || 'RESEND_REQUEST_FAILED' };
  }
}
