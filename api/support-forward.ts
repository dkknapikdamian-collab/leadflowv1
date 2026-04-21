const RESEND_API_URL = 'https://api.resend.com/emails';

function asString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const supportForwardEmail = process.env.SUPPORT_FORWARD_EMAIL;
  const supportFromEmail = process.env.SUPPORT_FROM_EMAIL || 'Close Flow <onboarding@resend.dev>';

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const kind = asString(body.kind) || 'support';
  const subject = asString(body.subject) || 'Nowe zgłoszenie closeflow';
  const message = asString(body.message) || 'Brak treści';
  const ownerEmail = asString(body.ownerEmail) || 'brak';
  const ownerId = asString(body.ownerId) || 'brak';
  const workspaceId = asString(body.workspaceId) || 'brak';

  if (!resendApiKey || !supportForwardEmail) {
    res.status(200).json({ forwarded: false, reason: 'EMAIL_NOT_CONFIGURED' });
    return;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: supportFromEmail,
        to: [supportForwardEmail],
        subject: `[closeflow] ${kind.toUpperCase()} • ${subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Nowe zgłoszenie z aplikacji closeflow</h2>
            <p><strong>Kategoria:</strong> ${escapeHtml(kind)}</p>
            <p><strong>Temat:</strong> ${escapeHtml(subject)}</p>
            <p><strong>Użytkownik:</strong> ${escapeHtml(ownerEmail)}</p>
            <p><strong>Owner ID:</strong> ${escapeHtml(ownerId)}</p>
            <p><strong>Workspace ID:</strong> ${escapeHtml(workspaceId)}</p>
            <hr />
            <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      res.status(200).json({ forwarded: false, reason: 'EMAIL_PROVIDER_ERROR', details: responseText });
      return;
    }

    res.status(200).json({ forwarded: true });
  } catch (error) {
    res.status(200).json({ forwarded: false, reason: 'EMAIL_REQUEST_FAILED', details: error?.message || 'UNKNOWN' });
  }
}
