import { findWorkspaceId, insertWithVariants, selectFirstAvailable } from './_supabase.js';

function normalizeTask(row: Record<string, unknown>) {
  const dueAt = row.scheduled_at || row.due_at || row.date || row.dueAt || null;
  const normalizedDate = typeof dueAt === 'string' && dueAt.includes('T') ? dueAt.slice(0, 10) : String(dueAt || '');

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || row.task_type || 'task'),
    date: normalizedDate,
    status: String(row.status || 'todo'),
    priority: String(row.priority || 'medium'),
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const result = await selectFirstAvailable([
        'work_items?select=*&record_type=eq.task&order=created_at.desc.nullslast&limit=200',
        'work_items?select=*&type=eq.task&order=created_at.desc.nullslast&limit=200',
        'work_items?select=*&order=created_at.desc.nullslast&limit=200',
      ]);

      res.status(200).json((result.data as Record<string, unknown>[]).map(normalizeTask));
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
      lead_id: null,
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

    res.status(200).json(normalizeTask(inserted as Record<string, unknown>));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'TASK_INSERT_FAILED' });
  }
}
