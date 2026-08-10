import {
  uploadPortalFileWithPolicy,
  type PortalUploadFile,
} from '../src/server/portal-upload.js';
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

function parseBody(req: any) {
  if (!req?.body) return {} as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}') as Record<string, unknown>;
    } catch {
      return {} as Record<string, unknown>;
    }
  }
  return req.body as Record<string, unknown>;
}

function writeJson(res: any, status: number, payload: Record<string, unknown>) {
  res.status(status).json(payload);
}

function readHeader(req: any, name: string) {
  const headers = req?.headers || {};
  return asText(headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()]);
}

function resolveErrorStatus(message: string) {
  if (message.includes('PORTAL_SESSION') || message.includes('PORTAL_TOKEN')) return 403;
  if (message.includes('PORTAL_PARENT_SCOPE_REQUIRED')) return 403;
  if (message === 'CASE_NOT_FOUND' || message === 'CASE_ITEM_NOT_FOUND') return 404;
  if (message.includes('QUOTA_EXCEEDED') || message.includes('RATE_LIMIT')) return 429;
  if (message.includes('REQUIRED') || message.includes('LIMIT') || message.includes('NOT_ALLOWED') || message.includes('MISMATCH') || message.includes('ENCODING')) return 400;
  if (message.includes('IN_PROGRESS') || message.includes('IDEMPOTENCY_CONFLICT')) return 409;
  if (message.includes('SUPABASE_SERVER_CONFIG_MISSING') || message.includes('SUPABASE_PORTAL_BUCKET_MISSING')) return 500;
  return 500;
}

function readFilePayload(value: unknown): PortalUploadFile | null {
  if (!value || typeof value !== 'object') return null;
  const file = value as Record<string, unknown>;
  return {
    name: asText(file.name),
    type: asText(file.type).toLowerCase(),
    size: Number(file.size),
    dataBase64: asText(file.dataBase64),
  };
}

async function handleHealth(req: any, res: any) {
  void req;
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
  if (fileSizeLimit && fileSizeLimit !== config.maxBytes) warnings.push('PORTAL_STORAGE_FILE_SIZE_LIMIT_DIFFERS_FROM_ENV');

  writeJson(res, 200, {
    ok: true,
    bucket: config.bucket,
    public: isPublic,
    fileSizeLimit: data.file_size_limit || null,
    allowedMimeTypes: data.allowed_mime_types || null,
    warnings,
  });
}

async function handleUpload(req: any, res: any) {
  const body = parseBody(req);
  const caseId = asText(body.caseId);
  const itemId = asText(body.itemId);
  const portalSession = asText(body.portalSession);
  const file = readFilePayload(body.file);

  if (!caseId) throw new Error('CASE_ID_REQUIRED');
  if (!itemId) throw new Error('CASE_ITEM_ID_REQUIRED');
  if (!portalSession) throw new Error('PORTAL_SESSION_REQUIRED');
  if (!file) throw new Error('PORTAL_FILE_REQUIRED');

  const uploaded = await uploadPortalFileWithPolicy(caseId, itemId, file, {
    portalSession,
    idempotencyKey: readHeader(req, 'x-idempotency-key'),
  });
  writeJson(res, 200, { ok: true, ...uploaded });
}

export default async function handler(req: any, res: any) {
  try {
    const method = String(req?.method || '').toUpperCase();
    if (method === 'GET' || method === 'HEAD') {
      await handleHealth(req, res);
      return;
    }
    if (method === 'POST') {
      await handleUpload(req, res);
      return;
    }
    writeJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    const message = String(error?.message || 'PORTAL_STORAGE_UPLOAD_OR_HEALTH_FAILED');
    writeJson(res, resolveErrorStatus(message), { error: message });
  }
}
