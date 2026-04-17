import { findWorkspaceId, insertWithVariants, selectFirstAvailable } from './_supabase.js';

function normalizeLead(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    name: String(row.name || row.title || row.person_name || ''),
    company: String(row.company || row.company_name || ''),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    source: String(row.source || row.source_label || row.source_type || 'other'),
    status: String(row.status || 'new'),
    nextStep: String(row.next_step || row.nextStep || ''),
    nextActionAt: String(row.next_step_due_at || row.nextActionAt || ''),
    dealValue: Number(row.deal_value || row.value || row.dealValue || 0),
    isAtRisk: Boolean(row.is_at_risk || row.isAtRisk || false),
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const result = await selectFirstAvailable([
        'leads?select=*&order=updated_at.desc.nullslast&limit=200',
        'leads?select=*&order=created_at.desc.nullslast&limit=200',
      ]);

      res.status(200).json((result.data as Record<string, unknown>[]).map(normalizeLead));
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = await findWorkspaceId(body.workspaceId);
    if (!workspaceId) {
      throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
    }
    const nowIso = new Date().toISOString();
    const amount = Number(body.dealValue) || 0;
    const dueAt = body.nextActionAt ? new Date(body.nextActionAt).toISOString() : null;
    const source = body.source || 'Inne';

    const payload = {
      workspace_id: workspaceId,
      created_by_user_id: null,
      name: body.name,
      company: body.company || '',
      email: body.email || '',
      phone: body.phone || '',
      source,
      value: amount,
      summary: '',
      notes: '',
      status: 'new',
      priority: 'medium',
      next_action_title: body.nextStep || '',
      next_action_at: dueAt,
      next_action_item_id: null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const result = await insertWithVariants(['leads'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;

    res.status(200).json(normalizeLead(inserted as Record<string, unknown>));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'LEAD_INSERT_FAILED' });
  }
}
