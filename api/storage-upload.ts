import { readPortalSession, requirePortalSessionContext } from '../src/server/_portal-token.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body || {};
}

function isAllowedFileType(fileType: string) {
  const allowed = new Set([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);
  return allowed.has(fileType);
}

async function uploadPortalFile(caseId: string, itemId: string, file: { name: string; type: string; size: number; dataBase64: string }) {
  if (!isAllowedFileType(file.type)) throw new Error('PORTAL_FILE_TYPE_NOT_ALLOWED');
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > 10 * 1024 * 1024) throw new Error('PORTAL_FILE_SIZE_LIMIT');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120) || 'upload.bin';
  const path = `portal/${caseId}/${itemId}/${Date.now()}-${safeName}`;
  const binary = Buffer.from(file.dataBase64, 'base64');
  if (binary.byteLength !== file.size) throw new Error('PORTAL_FILE_SIZE_MISMATCH');

  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const bucket = process.env.SUPABASE_PORTAL_BUCKET || 'portal-uploads';
  if (!url || !key) throw new Error('SUPABASE_SERVER_CONFIG_MISSING');

  const response = await fetch(`${url}/storage/v1/object/${bucket}/${encodeURIComponent(path)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': file.type,
      'x-upsert': 'true',
    },
    body: binary,
  });
  if (!response.ok) throw new Error('PORTAL_FILE_UPLOAD_FAILED');
  return { filePath: path, fileName: safeName };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = parseBody(req);
    const caseId = asText(body.caseId);
    const itemId = asText(body.itemId);
    const file = body.file as { name: string; type: string; size: number; dataBase64: string } | undefined;
    const portalSession = readPortalSession(req, body);

    if (!caseId || !itemId) {
      res.status(400).json({ error: 'CASE_AND_ITEM_REQUIRED' });
      return;
    }
    if (!portalSession) {
      res.status(403).json({ error: 'PORTAL_SESSION_REQUIRED' });
      return;
    }
    if (!file || typeof file !== 'object') {
      res.status(400).json({ error: 'FILE_REQUIRED' });
      return;
    }

    await requirePortalSessionContext(caseId, portalSession);
    const uploaded = await uploadPortalFile(caseId, itemId, file);
    res.status(200).json({ ok: true, ...uploaded });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    const message = String(error?.message || 'STORAGE_UPLOAD_FAILED');
    const status = message.includes('PORTAL_') ? 403 : 500;
    res.status(status).json({ error: message });
  }
}

