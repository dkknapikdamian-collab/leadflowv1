import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, supabaseRequest, updateById } from './_supabase.js';

function isUuid(value: unknown) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asNullableUuid(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed && isUuid(trimmed) ? trimmed : null;
}

function isMissingCasesTableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PGRST205') || message.includes("table 'public.cases'");
}

function normalizeCase(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || row.name || 'Sprawa bez tytułu'),
    clientName: String(row.client_name || row.clientName || ''),
    clientId: row.client_id ? String(row.client_id) : undefined,
    clientEmail: String(row.client_email || row.clientEmail || ''),
    clientPhone: String(row.client_phone || row.clientPhone || ''),
    status: String(row.status || 'in_progress'),
    completenessPercent: Number(row.completeness_percent || row.completenessPercent || 0),
    leadId: row.lead_id ? String(row.lead_id) : undefined,
    portalReady: Boolean(row.portal_ready || row.portalReady || false),
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

async function bestEffortPatch(path: string, payload: Record<string, unknown>) {
  try {
    await supabaseRequest(path, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  } catch {
    // best effort only during cutover
  }
}

async function bestEffortDelete(path: string) {
  try {
    await supabaseRequest(path, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    });
  } catch {
    // optional cleanup only
  }
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const requestedId = String(req.query?.id || '').trim();
      let rows: Record<string, unknown>[] = [];
      try {
        const result = await selectFirstAvailable([
          'cases?select=*&order=updated_at.desc.nullslast&limit=200',
          'cases?select=*&order=created_at.desc.nullslast&limit=200',
        ]);
        rows = result.data as Record<string, unknown>[];
      } catch (error) {
        if (!isMissingCasesTableError(error)) throw error;
        rows = [];
      }
      const normalized = rows.map(normalizeCase);

      if (requestedId) {
        const match = normalized.find((item) => item.id === requestedId);
        if (!match) {
          res.status(404).json({ error: 'CASE_NOT_FOUND' });
          return;
        }
        res.status(200).json(match);
        return;
      }

      res.status(200).json(normalized);
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const workspaceId = await findWorkspaceId(body.workspaceId);
      if (!workspaceId) {
        throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
      }

      const nowIso = new Date().toISOString();
      const normalizedLeadId = asNullableUuid(body.leadId);
      const normalizedClientId = asNullableUuid(body.clientId);

      const payload = {
        workspace_id: workspaceId,
        lead_id: normalizedLeadId,
        client_id: normalizedClientId,
        title: body.title || 'Nowa sprawa',
        client_name: body.clientName || '',
        client_email: body.clientEmail || '',
        client_phone: body.clientPhone || '',
        status: body.status || 'in_progress',
        completeness_percent: Number(body.completenessPercent || 0),
        portal_ready: Boolean(body.portalReady || false),
        created_at: nowIso,
        updated_at: nowIso,
      };

      const result = await insertWithVariants(['cases'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      const insertedId = String((inserted as Record<string, unknown>).id || '');

      if (insertedId) {
        await bestEffortPatch(`leads?linked_case_id=eq.${encodeURIComponent(insertedId)}`, {
          linked_case_id: null,
          updated_at: nowIso,
        });
      }

      if (normalizedLeadId && insertedId) {
        await bestEffortPatch(`leads?id=eq.${encodeURIComponent(normalizedLeadId)}`, {
          linked_case_id: insertedId,
          updated_at: nowIso,
        });
      }

      res.status(200).json(normalizeCase(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.id) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      const nowIso = new Date().toISOString();
      const normalizedLeadId = body.leadId !== undefined ? asNullableUuid(body.leadId) : undefined;
      const normalizedClientId = body.clientId !== undefined ? asNullableUuid(body.clientId) : undefined;
      const payload: Record<string, unknown> = {
        updated_at: nowIso,
      };

      if (body.title !== undefined) payload.title = body.title || 'Sprawa bez tytułu';
      if (body.clientName !== undefined) payload.client_name = body.clientName || '';
      if (body.clientEmail !== undefined) payload.client_email = body.clientEmail || '';
      if (body.clientPhone !== undefined) payload.client_phone = body.clientPhone || '';
      if (body.clientId !== undefined) payload.client_id = normalizedClientId;
      if (body.status !== undefined) payload.status = body.status || 'in_progress';
      if (body.completenessPercent !== undefined) payload.completeness_percent = Number(body.completenessPercent || 0);
      if (body.leadId !== undefined) payload.lead_id = normalizedLeadId;
      if (body.portalReady !== undefined) payload.portal_ready = Boolean(body.portalReady);

      const data = await updateById('cases', String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };

      await bestEffortPatch(`leads?linked_case_id=eq.${encodeURIComponent(String(body.id))}`, {
        linked_case_id: null,
        updated_at: nowIso,
      });

      if (normalizedLeadId) {
        await bestEffortPatch(`leads?id=eq.${encodeURIComponent(normalizedLeadId)}`, {
          linked_case_id: String(body.id),
          updated_at: nowIso,
        });
      }

      res.status(200).json(normalizeCase(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '').trim();
      if (!id) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      const nowIso = new Date().toISOString();

      await bestEffortPatch(`work_items?case_id=eq.${encodeURIComponent(id)}`, {
        case_id: null,
        case_title: null,
        updated_at: nowIso,
      });

      await bestEffortPatch(`leads?linked_case_id=eq.${encodeURIComponent(id)}`, {
        linked_case_id: null,
        updated_at: nowIso,
      });

      await bestEffortDelete(`client_portal_tokens?case_id=eq.${encodeURIComponent(id)}`);
      await bestEffortDelete(`case_items?case_id=eq.${encodeURIComponent(id)}`);
      await bestEffortDelete(`activities?case_id=eq.${encodeURIComponent(id)}`);
      await deleteById('cases', id);

      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'CASE_API_FAILED' });
  }
}
