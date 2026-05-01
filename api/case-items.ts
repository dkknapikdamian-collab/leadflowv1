import { insertWithVariants, selectFirstAvailable, supabaseRequest, updateById } from '../src/server/_supabase.js';
import { readPortalSession, requireOperatorCaseAccess, requirePortalSessionContext } from '../src/server/_portal-token.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter } from '../src/server/_request-scope.js';
import { writeAuthErrorResponse } from '../src/server/_supabase-auth.js';

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBody(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return {}; }
  }
  return req.body || {};
}

const SENSITIVE_TEXT_PATTERN = /\b(haslo|hasło|password|passcode|secret|credential|login|api[_ -]?key|token)\b/i;

function looksSensitive(value: unknown) {
  return typeof value === 'string' && SENSITIVE_TEXT_PATTERN.test(value);
}

function sanitizeAccessResponse(type: string, response: unknown) {
  if (looksSensitive(response)) return '[SECURE_RESPONSE_REDACTED]';
  if (type !== 'access') return typeof response === 'string' ? response : null;
  return response ? '[SECURE_RESPONSE_REDACTED]' : null;
}

function normalizeCaseItem(row: any, forPortal = false) {
  const itemType = String(row.type || 'file');
  return {
    id: String(row.id || ''),
    caseId: String(row.case_id || ''),
    title: String(row.title || ''),
    description: String(row.description || ''),
    type: itemType,
    status: String(row.status || 'missing'),
    isRequired: Boolean(row.is_required ?? true),
    dueDate: row.due_date || null,
    order: Number(row.item_order || 0),
    response: itemType === 'access' ? null : (row.response || null),
    fileUrl: row.file_url || null,
    fileName: row.file_name || null,
    approvedAt: row.approved_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    portalSafe: forPortal || undefined,
  };
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
    const body = parseBody(req);
    const caseId = asText(req.query?.caseId || body.caseId);
    const portalSession = readPortalSession(req, body);
    const portalMode = Boolean(portalSession);

    if (req.method === 'GET') {
      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }
      if (portalMode) {
        await requirePortalSessionContext(caseId, portalSession);
      } else {
        await requireOperatorCaseAccess(req, caseId);
      }

      const result = await selectFirstAvailable([`case_items?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=item_order.asc,created_at.asc&limit=500`]);
      const rows = Array.isArray(result.data) ? result.data : [];
      res.status(200).json(rows.map((row) => normalizeCaseItem(row, portalMode)));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id);
      if (!id || !caseId) {
        res.status(400).json({ error: 'CASE_ITEM_ID_REQUIRED' });
        return;
      }
      let itemType = asText(body.type);
      if (portalMode) {
        await requirePortalSessionContext(caseId, portalSession);
      } else {
        const workspaceId = await resolveRequestWorkspaceId(req);
        if (!workspaceId) throw new Error('AUTH_WORKSPACE_REQUIRED');
      }

      const current = await selectFirstAvailable([`case_items?select=*&id=eq.${encodeURIComponent(id)}&case_id=eq.${encodeURIComponent(caseId)}&limit=1`]);
      const currentRow = Array.isArray(current.data) && current.data[0] ? current.data[0] as Record<string, unknown> : null;
      if (!currentRow) {
        res.status(404).json({ error: 'CASE_ITEM_NOT_FOUND' });
        return;
      }
      if (!itemType) itemType = asText((currentRow as any).type) || 'file';

      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.status !== undefined) payload.status = asText(body.status) || 'missing';
      if (body.response !== undefined) payload.response = sanitizeAccessResponse(itemType, body.response);
      if (body.fileUrl !== undefined) payload.file_url = asText(body.fileUrl) || null;
      if (body.fileName !== undefined) payload.file_name = asText(body.fileName) || null;
      if (!portalMode) {
        if (body.title !== undefined) payload.title = asText(body.title);
        if (body.description !== undefined) payload.description = asText(body.description);
        if (body.type !== undefined) payload.type = itemType;
      }
      if (body.file !== undefined && body.file && typeof body.file === 'object') {
        const uploaded = await uploadPortalFile(caseId, id, body.file as { name: string; type: string; size: number; dataBase64: string });
        payload.file_name = uploaded.fileName;
        payload.file_url = uploaded.filePath;
      }
      const updated = await updateById('case_items', id, payload);
      const row = Array.isArray(updated) && updated[0] ? updated[0] : { ...currentRow, ...payload, id };
      res.status(200).json(normalizeCaseItem(row, portalMode));
      return;
    }

    if (!portalMode) {
      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) throw new Error('AUTH_WORKSPACE_REQUIRED');
    } else if (caseId) {
      await requirePortalSessionContext(caseId, portalSession);
    }

    if (req.method === 'POST') {
      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }
      const now = new Date().toISOString();
      const itemType = asText(body.type) || 'file';
      const payload = {
        case_id: caseId,
        title: asText(body.title),
        description: asText(body.description),
        type: itemType,
        status: asText(body.status) || 'missing',
        is_required: body.isRequired !== undefined ? Boolean(body.isRequired) : true,
        due_date: body.dueDate || null,
        item_order: Number(body.order || 0),
        response: sanitizeAccessResponse(itemType, body.response),
        file_url: null,
        file_name: null,
        approved_at: body.approvedAt || null,
        created_at: now,
        updated_at: now,
      };
      const inserted = await insertWithVariants(['case_items'], [payload]);
      const row = Array.isArray(inserted.data) && inserted.data[0] ? inserted.data[0] : payload;
      res.status(200).json(normalizeCaseItem(row, portalMode));
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    if (error?.code || error?.status) {
      writeAuthErrorResponse(res, error);
      return;
    }
    const message = String(error?.message || 'CASE_ITEMS_API_FAILED');
    const status = message.includes('PORTAL_TOKEN') ? 403 : message === 'CASE_NOT_FOUND' ? 404 : 500;
    res.status(status).json({ error: message });
  }
}
