import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';

function asIsoDate(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function normalizeTask(row: Record<string, unknown>) {
  const dueAt =
    asIsoDate(row.scheduled_at) ||
    asIsoDate(row.due_at) ||
    asIsoDate(row.date) ||
    asIsoDate(row.dueAt) ||
    asIsoDate(row.start_at) ||
    asIsoDate(row.created_at) ||
    new Date().toISOString();
  const normalizedDate = dueAt.slice(0, 10);

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || row.task_type || 'task'),
    date: normalizedDate,
    status: String(row.status || 'todo'),
    priority: String(row.priority || 'medium'),
    leadId: row.lead_id ? String(row.lead_id) : undefined,
  };
}

async function syncLeadNextAction(leadId: unknown, item: { id?: unknown; title?: unknown; scheduledAt?: unknown }) {
  if (typeof leadId !== 'string' || !leadId.trim()) return;

  await updateById('leads', leadId, {
    next_action_title: String(item.title || ''),
    next_action_at: item.scheduledAt ? new Date(String(item.scheduledAt)).toISOString() : null,
    next_action_item_id: item.id ? String(item.id) : null,
    updated_at: new Date().toISOString(),
  });
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const result = await selectFirstAvailable([
        'work_items?select=*&show_in_tasks=is.true&order=created_at.desc.nullslast&limit=200',
        'work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=200',
        'work_items?select=*&type=eq.task&order=created_at.desc.nullslast&limit=200',
        'work_items?select=*&order=created_at.desc.nullslast&limit=200',
      ]);

      res.status(200).json((result.data as Record<string, unknown>[]).map(normalizeTask));
      return;
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.id) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
        return;
      }

      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (body.title !== undefined) payload.title = body.title;
      if (body.type !== undefined) payload.type = body.type;
      if (body.status !== undefined) payload.status = body.status;
      if (body.priority !== undefined) payload.priority = body.priority;
      if (body.date !== undefined) payload.scheduled_at = body.date ? new Date(`${body.date}T09:00:00`).toISOString() : null;
      if (body.scheduledAt !== undefined) payload.scheduled_at = body.scheduledAt ? new Date(body.scheduledAt).toISOString() : null;
      if (body.leadId !== undefined) payload.lead_id = body.leadId || null;

      const data = await updateById('work_items', String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      if (body.leadId) {
        await syncLeadNextAction(body.leadId, {
          id: body.id,
          title: body.title ?? payload.title,
          scheduledAt: body.scheduledAt ?? payload.scheduled_at ?? body.date,
        });
      }
      res.status(200).json(normalizeTask(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '');
      if (!id) {
        res.status(400).json({ error: 'TASK_ID_REQUIRED' });
        return;
      }

      await deleteById('work_items', id);
      res.status(200).json({ ok: true, id });
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
    const scheduledAt = body.date ? new Date(`${body.date}T09:00:00`).toISOString() : null;

    const payload = {
      workspace_id: workspaceId,
      created_by_user_id: null,
      lead_id: body.leadId || null,
      record_type: 'task',
      type: body.type || 'task',
      title: body.title,
      description: '',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      scheduled_at: scheduledAt,
      start_at: null,
      end_at: null,
      recurrence: 'none',
      reminder: 'none',
      show_in_tasks: true,
      show_in_calendar: false,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const result = await insertWithVariants(['work_items'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    if (body.leadId) {
      await syncLeadNextAction(body.leadId, {
        id: (inserted as Record<string, unknown>).id,
        title: body.title,
        scheduledAt,
      });
    }

    res.status(200).json(normalizeTask(inserted as Record<string, unknown>));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'TASK_INSERT_FAILED' });
  }
}
