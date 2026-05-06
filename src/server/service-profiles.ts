import { insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { requireScopedRow, resolveRequestWorkspaceId, withWorkspaceFilter } from './_request-scope.js';

const START_RULES = new Set(['on_acceptance', 'on_deposit', 'on_full_payment', 'on_manual_approval', 'on_documents_ready', 'on_contract_signed', 'custom']);
const WIN_RULES = new Set(['on_case_started', 'on_full_payment', 'on_case_completed', 'on_commission_received', 'manual']);
const BILLING_MODELS = new Set(['upfront_full', 'deposit_then_rest', 'after_completion', 'success_fee', 'recurring', 'manual']);
const CASE_CREATION_MODES = new Set(['auto_on_start_rule', 'manual', 'suggested']);

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEnum(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = asText(value);
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeServiceProfile(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    workspaceId: asText(row.workspace_id || row.workspaceId),
    name: asText(row.name) || 'Profil',
    description: asText(row.description),
    startRule: normalizeEnum(row.start_rule || row.startRule, START_RULES, 'on_acceptance'),
    winRule: normalizeEnum(row.win_rule || row.winRule, WIN_RULES, 'manual'),
    billingModel: normalizeEnum(row.billing_model || row.billingModel, BILLING_MODELS, 'manual'),
    caseCreationMode: normalizeEnum(row.case_creation_mode || row.caseCreationMode, CASE_CREATION_MODES, 'suggested'),
    isDefault: Boolean(row.is_default ?? row.isDefault),
    isArchived: Boolean(row.is_archived ?? row.isArchived),
    createdAt: row.created_at || row.createdAt || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

function isMissingServiceProfilesTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.service_profiles'");
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const workspaceId = await resolveRequestWorkspaceId(req);
      if (!workspaceId) {
        res.status(401).json({ error: 'SERVICE_PROFILE_WORKSPACE_REQUIRED' });
        return;
      }

      const requestedId = asText(req.query?.id);
      const includeArchived = asText(req.query?.includeArchived) === '1';
      const basePath = `service_profiles?select=*&${requestedId ? `id=eq.${encodeURIComponent(requestedId)}&` : ''}${includeArchived ? '' : 'is_archived=is.false&'}order=is_default.desc,updated_at.desc.nullslast&limit=${requestedId ? 1 : 100}`;
      let normalized: ReturnType<typeof normalizeServiceProfile>[] = [];
      try {
        const result = await selectFirstAvailable([withWorkspaceFilter(basePath, workspaceId)]);
        normalized = (result.data || []).map((row: Record<string, unknown>) => normalizeServiceProfile(row));
      } catch (error) {
        if (!isMissingServiceProfilesTableError(error)) throw error;
      }

      if (requestedId) {
        const match = normalized.find((entry: Record<string, unknown>) => String(entry.id) === requestedId);
        if (!match) {
          res.status(404).json({ error: 'SERVICE_PROFILE_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }

      res.status(200).json(normalized);
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req);

    if (req.method === 'POST') {
      const finalWorkspaceId = workspaceId;
      if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
      const nowIso = new Date().toISOString();
      const isDefault = Boolean(body.isDefault);

      const payload = {
        workspace_id: finalWorkspaceId,
        name: asText(body.name) || 'Nowy profil',
        description: asText(body.description) || '',
        start_rule: normalizeEnum(body.startRule, START_RULES, 'on_acceptance'),
        win_rule: normalizeEnum(body.winRule, WIN_RULES, 'manual'),
        billing_model: normalizeEnum(body.billingModel, BILLING_MODELS, 'manual'),
        case_creation_mode: normalizeEnum(body.caseCreationMode, CASE_CREATION_MODES, 'suggested'),
        is_default: isDefault,
        is_archived: Boolean(body.isArchived),
        created_at: nowIso,
        updated_at: nowIso,
      };

      const result = await insertWithVariants(['service_profiles'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeServiceProfile(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const id = asText(body.id);
      if (!id || !workspaceId) {
        res.status(400).json({ error: 'SERVICE_PROFILE_ID_REQUIRED' });
        return;
      }
      await requireScopedRow('service_profiles', id, workspaceId, 'SERVICE_PROFILE_NOT_FOUND');
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (body.name !== undefined) payload.name = asText(body.name) || 'Profil';
      if (body.description !== undefined) payload.description = asText(body.description) || '';
      if (body.startRule !== undefined) payload.start_rule = normalizeEnum(body.startRule, START_RULES, 'on_acceptance');
      if (body.winRule !== undefined) payload.win_rule = normalizeEnum(body.winRule, WIN_RULES, 'manual');
      if (body.billingModel !== undefined) payload.billing_model = normalizeEnum(body.billingModel, BILLING_MODELS, 'manual');
      if (body.caseCreationMode !== undefined) payload.case_creation_mode = normalizeEnum(body.caseCreationMode, CASE_CREATION_MODES, 'suggested');
      if (body.isDefault !== undefined) payload.is_default = Boolean(body.isDefault);
      if (body.isArchived !== undefined) payload.is_archived = Boolean(body.isArchived);
      const data = await updateById('service_profiles', id, payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id, ...payload };
      res.status(200).json(normalizeServiceProfile(updated as Record<string, unknown>));
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    const message = error?.message || 'SERVICE_PROFILE_API_FAILED';
    res.status(message === 'SERVICE_PROFILE_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}
