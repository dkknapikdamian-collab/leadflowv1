import { requirePortalSessionContext } from '../src/server/_portal-token.js';
import {
  isAllowedPortalUploadFileType,
  requirePortalStorageServerConfig,
  sanitizePortalUploadFileName,
} from '../src/server/_portal-storage.js';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
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

function encodeStorageObjectPath(objectPath: string) {
  return objectPath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function resolveErrorStatus(message: string) {
  if (message.includes('PORTAL_SESSION') || message.includes('PORTAL_TOKEN')) return 403;
  if (message === 'CASE_NOT_FOUND') return 404;
  if (message.includes('REQUIRED') || message.includes('LIMIT') || message.includes('NOT_ALLOWED') || message.includes('MISMATCH')) return 400;
  if (message.includes('SUPABASE_SERVER_CONFIG_MISSING') || message.includes('SUPABASE_PORTAL_BUCKET_MISSING')) return 500;
  return 500;
}

function readFilePayload(value: unknown) {
  if (!value || typeof value !== 'object') return null;
  const file = value as Record<string, unknown>;
  return {
    name: asText(file.name),
    type: asText(file.type).toLowerCase(),
    size: Number(file.size),
    dataBase64: asText(file.dataBase64),
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      writeJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req);
    const caseId = asText(body.caseId);
    const itemId = asText(body.itemId);
    const portalSession = asText(body.portalSession);
    const file = readFilePayload(body.file);

    if (!caseId) throw new Error('CASE_ID_REQUIRED');
    if (!itemId) throw new Error('CASE_ITEM_ID_REQUIRED');
    if (!portalSession) throw new Error('PORTAL_SESSION_REQUIRED');
    if (!file) throw new Error('PORTAL_FILE_REQUIRED');
    if (!file.name || !file.type || !file.dataBase64) throw new Error('PORTAL_FILE_REQUIRED');

    await requirePortalSessionContext(caseId, portalSession);

    const config = requirePortalStorageServerConfig();
    const fileName = sanitizePortalUploadFileName(file.name);

    if (!isAllowedPortalUploadFileType(file.type, config.allowedMimeTypes)) {
      throw new Error('PORTAL_FILE_TYPE_NOT_ALLOWED');
    }
    if (!Number.isFinite(file.size) || file.size <= 0 || file.size > config.maxBytes) {
      throw new Error('PORTAL_FILE_SIZE_LIMIT');
    }

    const binary = Buffer.from(file.dataBase64, 'base64');
    if (binary.byteLength !== file.size) {
      throw new Error('PORTAL_FILE_SIZE_MISMATCH');
    }

    const objectPath = `portal/${caseId}/${itemId}/${Date.now()}-${fileName}`;
    const uploadUrl = `${config.supabaseUrl}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodeStorageObjectPath(objectPath)}`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: binary,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('PORTAL_FILE_UPLOAD_FAILED', {
        status: response.status,
        bucket: config.bucket,
        objectPath,
        message: text.slice(0, 240),
      });
      throw new Error('PORTAL_FILE_UPLOAD_FAILED');
    }

    writeJson(res, 200, { ok: true, filePath: objectPath, fileName });
  } catch (error: any) {
    const message = String(error?.message || 'PORTAL_FILE_UPLOAD_FAILED');
    writeJson(res, resolveErrorStatus(message), { error: message });
  }
}
