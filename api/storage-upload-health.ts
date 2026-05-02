import { timingSafeEqual } from 'node:crypto';
import {
  getPortalStorageHealthSecret,
  requirePortalStorageServerConfig,
} from '../src/server/_portal-storage.js';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function safeEquals(a: string, b: string) {
  if (!a || !b) return false;
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function readCheckSecret(req: any) {
  return asText(
    req?.headers?.['x-closeflow-storage-check-secret']
    || req?.headers?.['X-Closeflow-Storage-Check-Secret']
    || req?.query?.secret
  );
}

async function readBucket(config: ReturnType<typeof requirePortalStorageServerConfig>) {
  const response = await fetch(`${config.supabaseUrl}/storage/v1/bucket/${encodeURIComponent(config.bucket)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.serviceRoleKey}`,
      apikey: config.serviceRoleKey,
    },
  });

  const text = await response.text();
  let data: any = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 240) }; }
  }

  if (!response.ok) {
    return { ok: false, status: response.status, data };
  }

  return { ok: true, status: response.status, data };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const expectedSecret = getPortalStorageHealthSecret();
    if (!expectedSecret || !safeEquals(readCheckSecret(req), expectedSecret)) {
      res.status(403).json({ ok: false, error: 'STORAGE_HEALTH_SECRET_REQUIRED' });
      return;
    }

    const config = requirePortalStorageServerConfig();
    const bucketResult = await readBucket(config);

    if (!bucketResult.ok) {
      res.status(500).json({
        ok: false,
        error: 'PORTAL_STORAGE_BUCKET_NOT_FOUND_OR_INACCESSIBLE',
        bucket: config.bucket,
        status: bucketResult.status,
      });
      return;
    }

    const bucket = bucketResult.data || {};
    if (bucket.public === true) {
      res.status(500).json({
        ok: false,
        error: 'PORTAL_STORAGE_BUCKET_MUST_NOT_BE_PUBLIC',
        bucket: config.bucket,
        public: true,
      });
      return;
    }

    const bucketAllowedMimeTypes = Array.isArray(bucket.allowed_mime_types) ? bucket.allowed_mime_types : [];
    const bucketFileSizeLimit = typeof bucket.file_size_limit === 'number' ? bucket.file_size_limit : null;

    const warnings: string[] = [];
    if (bucketFileSizeLimit !== null && bucketFileSizeLimit > config.maxBytes) {
      warnings.push('BUCKET_FILE_SIZE_LIMIT_HIGHER_THAN_APP_LIMIT');
    }
    if (bucketAllowedMimeTypes.length) {
      const missing = config.allowedMimeTypes.filter((mime) => !bucketAllowedMimeTypes.includes(mime));
      if (missing.length) warnings.push('BUCKET_ALLOWED_MIME_TYPES_DIFFER_FROM_APP_CONFIG');
    }

    res.status(200).json({
      ok: true,
      bucket: config.bucket,
      public: bucket.public === true,
      appMaxBytes: config.maxBytes,
      appAllowedMimeTypes: config.allowedMimeTypes,
      bucketFileSizeLimit,
      bucketAllowedMimeTypes,
      warnings,
    });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: String(error?.message || 'PORTAL_STORAGE_HEALTH_FAILED') });
  }
}
