import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';

function asBoolean(value: unknown) {
  return value === true || value === 'true';
}

function isEventRow(row: Record<string, unknown>) {
  const recordType = String(row.record_type || row.recordType || '').toLowerCase();
  const hasStartAt = Boolean(row.start_at || row.startAt || row.end_at || row.endAt);

  if (recordType === 'task') return false;
  if (recordType === 'event') return true;
  if (hasStartAt) return true;
  if (asBoolean(row.show_in_calendar) && !asBoolean(row.show_in_tasks)) return true;

  return false;
}

function normalizeEvent(row: Record<string, unknown>) {
  const startAt = row.start_at || row.scheduled_at || row.startAt || null;
  const endAt = row.end_at || row.endAt || null;
  const reminderAt = row.reminder && row.reminder !== 'none' ? String(row.reminder) : '';
  const recurrenceRule = String(row.recurrence || 'none');
  const reminderMinutes = reminderAt && startAt
    ? Math.max(0, Math.round((new Date(String(startAt)).getTime() - new Date(reminderAt).getTime()) / 60_000))
    : 30;

  return {
    id: String(row.id || crypto.randomUUID()),
    title: String(row.title || ''),
    type: String(row.type || 'meeting'),
    startAt: String(startAt || ''),
    endAt: endAt ? String(endAt) : '',
    status: String(row.status || 'scheduled'),
    reminderAt,
    reminder: reminderAt
      ? {
          mode: 'once',
          minutesBefore: reminderMinutes,
          recurrenceMode: 'daily',
          recurrenceInterval: 1,
          until: null,
        }
      : { mode: 'none', minutesBefore: 30, recurrenceMode: 'daily', recurrenceInterval: 1, until: null },
    recurrenceRule,
    recurrence: {
      mode: recurrenceRule,
      interval: 1,
      until: null,
      endType: 'never',
      count: null,
    },
    leadId: row.lead_id ? String(row.lead_id) : row.leadId ? String(row.leadId) : undefined,
    leadName: row.lead_name ? String(row.lead_name) : row.leadName ? String(row.leadName) : undefined,
  };
}

async function syncLeadNextAction(leadId: unknown, item: { id?: unknown; title?: unknown; startAt?: unknown }) {
  if (typeof leadId !== 'string' || !leadId.trim()) return;

  await updateById('leads', leadId, {
    next_action_title: String(item.title || ''),
    next_action_at: item.startAt ? new Date(String(item.startAt)).toISOString() : null,
    next_action_item_id: item.id ? String(item.id) : null,
    updated_at: new Date().toISOString(),
  });
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const result = await selectFirstAvailable([
        'work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=200',
        'work_items?select=*&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=200',
        'work_items?select=*&order=start_at.asc.nullslast&limit=200',
      ]);

      const rows = (result.data as Record<string, unknown>[]).filter(isEventRow);
      res.status(200).json(rows.map(normalizeEvent));
      return;
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.id) {
        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });
        return;
      }

      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (body.title !== undefined) payload.title = body.title;
      if (body.type !== undefined) payload.type = body.type;
      if (body.status !== undefined) payload.status = body.status;
      if (body.startAt !== undefined) {
        const iso = body.startAt ? new Date(body.startAt).toISOString() : null;
        payload.start_at = iso;
        payload.scheduled_at = iso;
      }
      if (body.endAt !== undefined) payload.end_at = body.endAt ? new Date(body.endAt).toISOString() : null;
      if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';
      if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';
      if (body.leadId !== undefined) payload.lead_id = body.leadId || null;

      const data = await updateById('work_items', String(body.id), payload);
      const updated = Array.isArray(data) && data[0] ? data[0] : { id: body.id, ...payload };
      if (body.leadId) {
        await syncLeadNextAction(body.leadId, {
          id: body.id,
          title: body.title ?? payload.title,
          startAt: body.startAt ?? payload.start_at,
        });
      }
      res.status(200).json(normalizeEvent(updated as Record<string, unknown>));
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '');
      if (!id) {
        res.status(400).json({ error: 'EVENT_ID_REQUIRED' });
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
    const startAt = body.startAt ? new Date(body.startAt).toISOString() : nowIso;
    const payload = {
      workspace_id: workspaceId,
      created_by_user_id: body.ownerId || null,
      lead_id: body.leadId || null,
      record_type: 'event',
      type: body.type || 'meeting',
      title: body.title,
      description: '',
      status: body.status || 'scheduled',
      priority: 'medium',
      scheduled_at: startAt,
      start_at: startAt,
      end_at: body.endAt ? new Date(body.endAt).toISOString() : null,
      recurrence: body.recurrenceRule || 'none',
      reminder: body.reminderAt || 'none',
      show_in_tasks: false,
      show_in_calendar: true,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const result = await insertWithVariants(['work_items'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    if (body.leadId) {
      await syncLeadNextAction(body.leadId, {
        id: (inserted as Record<string, unknown>).id,
        title: body.title,
        startAt,
      });
    }

    res.status(200).json(normalizeEvent(inserted as Record<string, unknown>));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'EVENT_MUTATION_FAILED' });
  }
}
