const DEFAULT_ADMIN_EMAILS = ['dk.knapikdamian@gmail.com'];

function parseAdminEmails(raw?: string) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

const ADMIN_EMAILS = new Set([
  ...DEFAULT_ADMIN_EMAILS,
]);

export function isAdminEmail(email?: string | null) {
  return !!email && ADMIN_EMAILS.has(email.trim().toLowerCase());
}
