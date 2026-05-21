import {
  getPortalStorageHealthSecret,
  requirePortalStorageServerConfig,
} from '../src/server/_portal-storage.js';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return asText(value[0]);
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function readHeader(req: any, name: string) {
  const headers = req?.headers || {};
  return asText(headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()]);
}

function writeJson(res: any, status: number, payload: Record<string, unknown>) {
  res.status(status).json(payload);
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      writeJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const expectedSecret = getPortalStorageHealthSecret();
    if (!expectedSecret) {
      writeJson(res, 500, { ok: false, error: 'PORTAL_STORAGE_HEALTH_SECRET_MISSING' });
      return;
    }

    const providedSecret = readHeader(req, 'x-closeflow-storage-check-secret');
    if (!providedSecret || providedSecret !== expectedSecret) {
      writeJson(res, 403, { ok: false, error: 'PORTAL_STORAGE_HEALTH_UNAUTHORIZED' });
      return;
    }

    const config = requirePortalStorageServerConfig();
    const response = await fetch(`${config.supabaseUrl}/storage/v1/bucket/${encodeURIComponent(config.bucket)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
      },
    });

    const text = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) as Record<string, unknown> : {};
    } catch {
      data = { raw: text.slice(0, 240) };
    }

    if (!response.ok) {
      writeJson(res, 500, {
        ok: false,
        error: 'PORTAL_STORAGE_BUCKET_NOT_FOUND_OR_INACCESSIBLE',
        bucket: config.bucket,
        status: response.status,
      });
      return;
    }

    const isPublic = Boolean(data.public);
    if (isPublic) {
      writeJson(res, 500, {
        ok: false,
        error: 'PORTAL_STORAGE_BUCKET_MUST_NOT_BE_PUBLIC',
        bucket: config.bucket,
        public: isPublic,
      });
      return;
    }

    const warnings: string[] = [];
    const fileSizeLimit = Number(data.file_size_limit || 0);
    if (fileSizeLimit && fileSizeLimit !== config.maxBytes) {
      warnings.push('PORTAL_STORAGE_FILE_SIZE_LIMIT_DIFFERS_FROM_ENV');
    }

    writeJson(res, 200, {
      ok: true,
      bucket: config.bucket,
      public: isPublic,
      fileSizeLimit: data.file_size_limit || null,
      allowedMimeTypes: data.allowed_mime_types || null,
      warnings,
    });
  } catch (error: any) {
    writeJson(res, 500, { ok: false, error: String(error?.message || 'PORTAL_STORAGE_HEALTH_FAILED') });
  }
}
