import { deleteById, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';

function normalizeCaseItem(row: Record<string, unknown>) {
  return {
    id: String(row.id || crypto.randomUUID()),
    caseId: String(row.case_id || row.caseId || ''),
    title: String(row.title || ''),
    description: String(row.description || ''),
    type: String(row.type || 'file'),
    status: String(row.status || 'missing'),
    isRequired: Boolean(row.is_required ?? row.isRequired ?? true),
    dueDate: row.due_date ? String(row.due_date) : '',
    order: Number(row.item_order || row.order || 0),
    response: row.response ? String(row.response) : null,
    fileUrl: row.file_url ? String(row.file_url) : null,
    fileName: row.file_name ? String(row.file_name) : null,
    approvedAt: row.approved_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const caseId = String(req.query?.caseId || '').trim();
      if (!caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      const result = await selectFirstAvailable([
        `case_items?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=item_order.asc,created_at.asc&limit=500`,
        `case_items?select=*&case_id=eq.${encodeURIComponent(caseId)}&order=created_at.asc&limit=500`,
      ]);

      res.status(200).json((result.data as Record<string, unknown>[]).map(normalizeCaseItem));
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.caseId) {
        res.status(400).json({ error: 'CASE_ID_REQUIRED' });
        return;
      }

      const nowIso = new Date().toISOString();
      const payload = {
        case_id: String(body.caseId),
        title: body.title || '',
        description: body.description || '',
        type: body.type || 'file',
        status: body.status || 'missing',
        is_required: body.isRequired !== undefined ? Boolean(body.isRequired) : true,
        due_date: body.dueDate || null,
        item_order: Number(body.order || 0),
        response: body.response || null,
        file_url: body.fileUrl || null,
        file_name: body.fileName || null,
        approved_at: body.approvedAt || null,
        created_at: nowIso,
        updated_at: nowIso,
      };

      const result = await insertWithVariants(['case_items'], [payload]);
      const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
      res.status(200).json(normalizeCaseItem(inserted as Record<string, unknown>));
      return;
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.id) {
        res.status(400).json({ error: 'CASE_ITEM_ID_REQUIRED' });
        return;
      }

      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (body.title !== undefined) payload.title = body.title || '';
      if (body.description !== undefined) payload.description = body.description || '';
      if (body.type !== undefined) payload.type = body.type || 'file';
      if (body.status !== undefined) payload.status = body.status || 'missing';
      if (body.isRequired !== undefined) payload.is_required = Boolean(body.isRequired);
      if (body.dueDate !== undefined) payload.due_date = body.dueDate || null;
      if (body.order !== undefined) payload.item_order = Number(body.order || 0);
      if (body.response !== undefined) payload.response = body.response || null;
      if (body.fileUrl !== undefined) payload.file_url = body.fileUrl || null;
      if (body.fileName !== undefined) payload.file_name = body.fileName || null;
      if (body.approvedAt !== undefined) payload.approved_at = body.approvedAt || null;

      const data = await updateById('case_items', String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      res.status(200).json(normalizeCaseItem(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '').trim();
      if (!id) {
        res.status(400).json({ error: 'CASE_ITEM_ID_REQUIRED' });
        return;
      }

      await deleteById('case_items', id);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'CASE_ITEM_API_FAILED' });
  }
}
