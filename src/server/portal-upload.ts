import { createHash } from 'node:crypto';
import { selectFirstAvailable, supabaseRpc } from './_supabase.js';
import { requireCaseItemInCase } from './case-item-scope.js';
import {
  requireOperatorCaseAccess,
  requirePortalSessionContext,
} from './_portal-token.js';
import {
  isAllowedPortalUploadFileType,
  requirePortalStorageServerConfig,
  sanitizePortalUploadFileName,
} from './_portal-storage.js';

export type PortalUploadFile = {
  name: string;
  type: string;
  size: number;
  dataBase64: string;
};

type UploadOptions = {
  portalSession?: string | null;
  operatorRequest?: unknown;
  idempotencyKey?: string | null;
};

function asText(value: unknown) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function encodeStorageObjectPath(objectPath: string) {
  return objectPath.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function decodeFile(file: PortalUploadFile, maxBytes: number) {
  if (!file.name || !file.type || !file.dataBase64) throw new Error('PORTAL_FILE_REQUIRED');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(file.dataBase64) || file.dataBase64.length % 4 === 1) {
    throw new Error('PORTAL_FILE_ENCODING_INVALID');
  }
  if (file.dataBase64.length > 4 * Math.ceil(maxBytes / 3)) {
    throw new Error('PORTAL_FILE_SIZE_LIMIT');
  }
  const binary = Buffer.from(file.dataBase64, 'base64');
  const normalizedInput = file.dataBase64.replace(/=+$/, '');
  const normalizedOutput = binary.toString('base64').replace(/=+$/, '');
  if (normalizedInput !== normalizedOutput) throw new Error('PORTAL_FILE_ENCODING_INVALID');
  if (!Number.isInteger(file.size) || file.size <= 0) throw new Error('PORTAL_FILE_SIZE_LIMIT');
  if (binary.byteLength !== file.size) throw new Error('PORTAL_FILE_SIZE_MISMATCH');
  return binary;
}

export async function requirePortalUploadedObject(
  workspaceId: string,
  caseId: string,
  itemId: string,
  objectPath: string,
) {
  const normalizedWorkspaceId = asText(workspaceId);
  const normalizedCaseId = asText(caseId);
  const normalizedItemId = asText(itemId);
  const normalizedPath = asText(objectPath);
  const expectedPrefix = `portal/${normalizedCaseId}/${normalizedItemId}/`;
  if (!normalizedWorkspaceId || !normalizedCaseId || !normalizedItemId || !normalizedPath.startsWith(expectedPrefix) || normalizedPath.includes('..') || normalizedPath.includes('://')) {
    throw new Error('PORTAL_FILE_URL_NOT_ADMITTED');
  }

  const result = await selectFirstAvailable([
    `portal_upload_admissions?select=object_path,file_name&workspace_id=eq.${encodeURIComponent(normalizedWorkspaceId)}&case_id=eq.${encodeURIComponent(normalizedCaseId)}&case_item_id=eq.${encodeURIComponent(normalizedItemId)}&object_path=eq.${encodeURIComponent(normalizedPath)}&status=eq.uploaded&limit=1`,
  ]);
  const rows = Array.isArray(result.data) ? result.data as Record<string, unknown>[] : [];
  const row = rows[0];
  if (!row) throw new Error('PORTAL_FILE_URL_NOT_ADMITTED');
  return {
    objectPath: asText(row.object_path) || normalizedPath,
    fileName: asText(row.file_name),
  };
}

function admissionRow(value: unknown) {
  const row = Array.isArray(value) ? value[0] : value;
  return row && typeof row === 'object' ? row as Record<string, unknown> : null;
}

function deriveIdempotencyKey(caseId: string, itemId: string, contentHash: string, explicit: unknown) {
  const requested = asText(explicit);
  if (requested) return requested.slice(0, 128);
  return createHash('sha256').update(`${caseId}:${itemId}:${contentHash}`).digest('hex');
}

export async function uploadPortalFileWithPolicy(
  caseId: string,
  itemId: string,
  file: PortalUploadFile,
  options: UploadOptions = {},
) {
  const normalizedCaseId = asText(caseId);
  const normalizedItemId = asText(itemId);
  if (!normalizedCaseId) throw new Error('CASE_ID_REQUIRED');
  if (!normalizedItemId) throw new Error('CASE_ITEM_ID_REQUIRED');

  let workspaceId = '';
  if (asText(options.portalSession)) {
    const context = await requirePortalSessionContext(normalizedCaseId, asText(options.portalSession));
    workspaceId = asText(context.workspaceId);
  } else {
    if (!options.operatorRequest) throw new Error('PORTAL_SESSION_REQUIRED');
    workspaceId = asText(await requireOperatorCaseAccess(options.operatorRequest, normalizedCaseId));
  }
  if (!workspaceId) throw new Error('PORTAL_WORKSPACE_SCOPE_REQUIRED');
  await requireCaseItemInCase(normalizedItemId, normalizedCaseId);

  const config = requirePortalStorageServerConfig();
  if (!isAllowedPortalUploadFileType(file.type, config.allowedMimeTypes)) {
    throw new Error('PORTAL_FILE_TYPE_NOT_ALLOWED');
  }
  if (!Number.isInteger(file.size) || file.size <= 0 || file.size > config.maxBytes) {
    throw new Error('PORTAL_FILE_SIZE_LIMIT');
  }

  const binary = decodeFile(file, config.maxBytes);
  const fileName = sanitizePortalUploadFileName(file.name);
  const contentHash = createHash('sha256').update(binary).digest('hex');
  const idempotencyKey = deriveIdempotencyKey(normalizedCaseId, normalizedItemId, contentHash, options.idempotencyKey);
  const objectPath = `portal/${normalizedCaseId}/${normalizedItemId}/${idempotencyKey.slice(0, 48)}-${fileName}`;
  let admission: Record<string, unknown> | null = null;
  try {
    admission = admissionRow(await supabaseRpc('closeflow_portal_upload_admit', {
      p_workspace_id: workspaceId,
      p_case_id: normalizedCaseId,
      p_case_item_id: normalizedItemId,
      p_bytes: binary.byteLength,
      p_mime_type: asText(file.type).toLowerCase(),
      p_file_name: fileName,
      p_content_hash: contentHash,
      p_idempotency_key: idempotencyKey,
      p_object_path: objectPath,
      p_daily_quota_bytes: config.dailyQuotaBytes,
      p_window_upload_count: config.windowUploadCount,
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const knownCode = [
      'PORTAL_UPLOAD_QUOTA_EXCEEDED',
      'PORTAL_UPLOAD_RATE_LIMIT',
      'PORTAL_PARENT_SCOPE_REQUIRED',
      'CASE_ITEM_NOT_FOUND',
      'PORTAL_UPLOAD_IDEMPOTENCY_CONFLICT',
    ].find((code) => message.includes(code));
    if (knownCode) throw new Error(knownCode);
    throw error;
  }
  if (!admission) throw new Error('PORTAL_UPLOAD_ADMISSION_FAILED');

  const admissionStatus = asText(admission.status);
  if (admissionStatus === 'uploaded') {
    return { filePath: asText(admission.object_path) || objectPath, fileName: asText(admission.file_name) || fileName };
  }
  if (admissionStatus === 'pending' && admission.is_existing === true) throw new Error('PORTAL_UPLOAD_IN_PROGRESS');
  if (admissionStatus === 'failed') throw new Error('PORTAL_UPLOAD_RETRY_REQUIRED');

  const uploadUrl = `${config.supabaseUrl}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodeStorageObjectPath(objectPath)}`;
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
        'Content-Type': asText(file.type).toLowerCase(),
        'x-upsert': 'false',
      },
      body: binary,
    });
    if (!response.ok) throw new Error('PORTAL_FILE_UPLOAD_FAILED');
  } catch (error) {
    try {
      await supabaseRpc('closeflow_portal_upload_finalize', {
        p_admission_id: asText(admission.id),
        p_workspace_id: workspaceId,
        p_status: 'failed',
        p_object_path: objectPath,
      });
    } catch (finalizeError) {
      console.error('PORTAL_UPLOAD_FAILURE_FINALIZE_FAILED', finalizeError instanceof Error ? finalizeError.message : 'UNKNOWN');
    }
    throw error;
  }

  await supabaseRpc('closeflow_portal_upload_finalize', {
    p_admission_id: asText(admission.id),
    p_workspace_id: workspaceId,
    p_status: 'uploaded',
    p_object_path: objectPath,
  });
  return { filePath: objectPath, fileName };
}
