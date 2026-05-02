const DEFAULT_PORTAL_UPLOAD_BUCKET = 'portal-uploads';
const DEFAULT_PORTAL_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
const HARD_PORTAL_UPLOAD_MAX_BYTES = 25 * 1024 * 1024;

const DEFAULT_PORTAL_UPLOAD_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parsePositiveInt(value: unknown, fallback: number) {
  const raw = asText(value);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, HARD_PORTAL_UPLOAD_MAX_BYTES);
}

function parseMimeTypes(value: unknown) {
  const raw = asText(value);
  if (!raw) return DEFAULT_PORTAL_UPLOAD_ALLOWED_MIME_TYPES;
  const parsed = raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return parsed.length ? Array.from(new Set(parsed)) : DEFAULT_PORTAL_UPLOAD_ALLOWED_MIME_TYPES;
}

export function getPortalStorageConfig() {
  const supabaseUrl = asText(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/+$/, '');
  const serviceRoleKey = asText(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const bucket = asText(process.env.SUPABASE_PORTAL_BUCKET) || DEFAULT_PORTAL_UPLOAD_BUCKET;
  const maxBytes = parsePositiveInt(process.env.PORTAL_UPLOAD_MAX_BYTES, DEFAULT_PORTAL_UPLOAD_MAX_BYTES);
  const allowedMimeTypes = parseMimeTypes(process.env.PORTAL_UPLOAD_ALLOWED_MIME_TYPES);

  return {
    supabaseUrl,
    serviceRoleKey,
    bucket,
    maxBytes,
    allowedMimeTypes,
  };
}

export function requirePortalStorageServerConfig() {
  const config = getPortalStorageConfig();
  if (!config.supabaseUrl || !config.serviceRoleKey) {
    throw new Error('SUPABASE_SERVER_CONFIG_MISSING');
  }
  if (!config.bucket) {
    throw new Error('SUPABASE_PORTAL_BUCKET_MISSING');
  }
  return config;
}

export function isAllowedPortalUploadFileType(fileType: string, allowedMimeTypes = getPortalStorageConfig().allowedMimeTypes) {
  const normalized = asText(fileType).toLowerCase();
  return normalized ? allowedMimeTypes.includes(normalized) : false;
}

export function sanitizePortalUploadFileName(value: unknown) {
  const raw = asText(value) || 'upload.bin';
  return raw.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120) || 'upload.bin';
}

export function getPortalStorageHealthSecret() {
  return asText(process.env.PORTAL_STORAGE_HEALTH_SECRET || process.env.CRON_SECRET);
}

export function getDefaultPortalStorageBucket() {
  return DEFAULT_PORTAL_UPLOAD_BUCKET;
}

export function getDefaultPortalUploadMaxBytes() {
  return DEFAULT_PORTAL_UPLOAD_MAX_BYTES;
}

export function getDefaultPortalUploadAllowedMimeTypes() {
  return [...DEFAULT_PORTAL_UPLOAD_ALLOWED_MIME_TYPES];
}
