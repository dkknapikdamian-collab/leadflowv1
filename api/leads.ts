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
    const workspaceId = body.workspaceId || (await findWorkspaceId());
    if (!workspaceId) {
      throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
    }
    const nowIso = new Date().toISOString();
    const amount = Number(body.dealValue) || 0;
    const dueAt = body.nextActionAt ? new Date(body.nextActionAt).toISOString() : null;
    const source = body.source || 'other';

    const payloads = [
      {
        title: body.name,
        person_name: body.name,
        company_name: body.company || '',
        email: body.email || '',
        phone: body.phone || '',
        source_type: source,
        source_label: source,
        status: 'new',
        next_step: body.nextStep || '',
        next_step_due_at: dueAt,
        organization_id: workspaceId,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        workspace_id: workspaceId,
        name: body.name,
        company: body.company || '',
        email: body.email || '',
        phone: body.phone || '',
        source,
        status: 'new',
        value: amount,
        next_step: body.nextStep || '',
        next_step_due_at: dueAt,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        workspace_id: workspaceId,
        name: body.name,
        company: body.company || '',
        email: body.email || '',
        phone: body.phone || '',
        source,
        status: 'new',
        deal_value: amount,
        next_step: body.nextStep || '',
        next_step_due_at: dueAt,
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        name: body.name,
        status: 'new',
      },
    ];

    const result = await insertWithVariants(['leads'], payloads);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payloads[0];

    res.status(200).json(normalizeLead(inserted as Record<string, unknown>));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'LEAD_INSERT_FAILED' });
  }
}
