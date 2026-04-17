import { findWorkspaceId, insertWithVariants, selectFirstAvailable } from './_supabase.js';

function normalizeTask(row: Record<string, unknown>) {
  const dueAt = row.due_at || row.date || row.dueAt || null;
  const normalizedDate = typeof dueAt === 'string' && dueAt.includes('T') ? dueAt.slice(0, 10) : String(dueAt || '');

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || row.task_type || 'follow_up'),
    date: normalizedDate,
    status: String(row.status || 'todo'),
    priority: String(row.priority || 'medium'),
  };
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const result = await selectFirstAvailable([
        'tasks?select=*&order=created_at.desc.nullslast&limit=200',
        'work_items?select=*&order=created_at.desc.nullslast&limit=200',
        'lead_tasks?select=*&order=created_at.desc.nullslast&limit=200',
      ]);

      res.status(200).json((result.data as Record<string, unknown>[]).map(normalizeTask));
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const workspaceId = body.workspaceId || (await findWorkspaceId());
    const nowIso = new Date().toISOString();
    const dueAt = body.date ? new Date(`${body.date}T09:00:00`).toISOString() : null;

    const payloads = [
      {
        organization_id: workspaceId,
        task_type: body.type || 'follow_up',
        title: body.title,
        due_at: dueAt,
        status: 'open',
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        workspace_id: workspaceId,
        title: body.title,
        type: body.type || 'follow_up',
        status: body.status || 'todo',
        due_at: dueAt,
        priority: body.priority || 'medium',
        created_at: nowIso,
        updated_at: nowIso,
      },
      {
        title: body.title,
        type: body.type || 'follow_up',
        date: body.date || null,
        status: body.status || 'todo',
        priority: body.priority || 'medium',
      },
    ];

    const result = await insertWithVariants(['tasks', 'work_items', 'lead_tasks'], payloads);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payloads[0];

    res.status(200).json(normalizeTask(inserted as Record<string, unknown>));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'TASK_INSERT_FAILED' });
  }
}
