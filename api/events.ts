import { deleteById, findWorkspaceId, insertWithVariants, selectFirstAvailable, updateById } from './_supabase.js';
import { resolveRequestWorkspaceId, withWorkspaceFilter, requireScopedRow } from './_request-scope.js';

function asBoolean(value) { return value === true || value === 'true'; }
function isUuid(value) { return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
function asNullableString(value) { if (typeof value !== 'string') return null; const trimmed = value.trim(); return trimmed ? trimmed : null; }
function asNullableUuid(value) { const normalized = asNullableString(value); return normalized && isUuid(normalized) ? normalized : null; }
function isEventRow(row) { const recordType = String(row.record_type || row.recordType || '').toLowerCase(); const hasStartAt = Boolean(row.start_at || row.startAt || row.end_at || row.endAt); if (recordType === 'task') return false; if (recordType === 'event') return true; if (hasStartAt) return true; if (asBoolean(row.show_in_calendar) && !asBoolean(row.show_in_tasks)) return true; return false; }
function normalizeEvent(row) { const startAt = row.start_at || row.scheduled_at || row.startAt || null; const endAt = row.end_at || row.endAt || null; const reminderAt = row.reminder && row.reminder !== 'none' ? String(row.reminder) : ''; const recurrenceRule = String(row.recurrence || 'none'); const reminderMinutes = reminderAt && startAt ? Math.max(0, Math.round((new Date(String(startAt)).getTime() - new Date(reminderAt).getTime()) / 60_000)) : 30; return { id: String(row.id || crypto.randomUUID()), title: String(row.title || ''), type: String(row.type || 'meeting'), startAt: String(startAt || ''), endAt: endAt ? String(endAt) : '', status: String(row.status || 'scheduled'), reminderAt, reminder: reminderAt ? { mode:'once', minutesBefore: reminderMinutes, recurrenceMode:'daily', recurrenceInterval:1, until:null } : { mode:'none', minutesBefore:30, recurrenceMode:'daily', recurrenceInterval:1, until:null }, recurrenceRule, recurrence: { mode: recurrenceRule, interval:1, until:null, endType:'never', count:null }, leadId: row.lead_id ? String(row.lead_id) : row.leadId ? String(row.leadId) : undefined, leadName: row.lead_name ? String(row.lead_name) : row.leadName ? String(row.leadName) : undefined }; }
async function syncLeadNextAction(leadId, item, workspaceId) { const normalizedLeadId = asNullableUuid(leadId); if (!normalizedLeadId || !workspaceId) return; await requireScopedRow('leads', normalizedLeadId, workspaceId, 'LEAD_NOT_FOUND'); await updateById('leads', normalizedLeadId, { next_action_title: String(item.title || ''), next_action_at: item.startAt ? new Date(String(item.startAt)).toISOString() : null, next_action_item_id: item.id ? String(item.id) : null, updated_at: new Date().toISOString() }); }
async function clearLeadNextActionIfCurrent(leadId, itemId, workspaceId) { const normalizedLeadId = asNullableUuid(leadId); const normalizedItemId = asNullableString(itemId); if (!normalizedLeadId || !normalizedItemId || !workspaceId) return; const row = await requireScopedRow('leads', normalizedLeadId, workspaceId, 'LEAD_NOT_FOUND'); const currentItemId = row?.next_action_item_id ? String(row.next_action_item_id) : null; if (currentItemId !== normalizedItemId) return; await updateById('leads', normalizedLeadId, { next_action_title: null, next_action_at: null, next_action_item_id: null, updated_at: new Date().toISOString() }); }

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const workspaceId = await resolveRequestWorkspaceId(req, body);
    if (req.method === 'GET') {
      if (!workspaceId) { res.status(401).json({ error: 'EVENT_WORKSPACE_REQUIRED' }); return; }
      const result = await selectFirstAvailable([withWorkspaceFilter('work_items?select=*&record_type=eq.event&order=start_at.asc.nullslast&limit=200', workspaceId), withWorkspaceFilter('work_items?select=*&show_in_calendar=is.true&order=start_at.asc.nullslast&limit=200', workspaceId), withWorkspaceFilter('work_items?select=*&order=start_at.asc.nullslast&limit=200', workspaceId)]);
      res.status(200).json((result.data || []).filter(isEventRow).map(normalizeEvent)); return;
    }
    if (req.method === 'PATCH') {
      if (!body.id || !workspaceId) { res.status(400).json({ error: 'EVENT_ID_REQUIRED' }); return; }
      const currentRow = await requireScopedRow('work_items', String(body.id), workspaceId, 'EVENT_NOT_FOUND');
      const payload = { updated_at: new Date().toISOString() };
      if (body.title !== undefined) payload.title = body.title;
      if (body.type !== undefined) payload.type = body.type;
      if (body.status !== undefined) payload.status = body.status;
      if (body.startAt !== undefined) { const iso = body.startAt ? new Date(body.startAt).toISOString() : null; payload.start_at = iso; payload.scheduled_at = iso; }
      if (body.endAt !== undefined) payload.end_at = body.endAt ? new Date(body.endAt).toISOString() : null;
      if (body.reminderAt !== undefined) payload.reminder = body.reminderAt || 'none';
      if (body.recurrenceRule !== undefined) payload.recurrence = body.recurrenceRule || 'none';
      if (body.leadId !== undefined) payload.lead_id = asNullableUuid(body.leadId);
      const data = await updateById('work_items', String(body.id), payload);
      const updatedRow = Array.isArray(data) && data[0] ? data[0] : { ...currentRow, ...payload, id: body.id };
      const effectiveLeadId = body.leadId !== undefined ? body.leadId : updatedRow.lead_id;
      const nextStatus = typeof (body.status ?? updatedRow.status) === 'string' ? String(body.status ?? updatedRow.status).toLowerCase() : '';
      if (effectiveLeadId && (nextStatus === 'done' || nextStatus === 'completed')) await clearLeadNextActionIfCurrent(effectiveLeadId, body.id, workspaceId); else if (effectiveLeadId) await syncLeadNextAction(effectiveLeadId, { id: body.id, title: body.title ?? payload.title ?? updatedRow.title, startAt: body.startAt ?? payload.start_at ?? updatedRow.start_at }, workspaceId);
      res.status(200).json(normalizeEvent(updatedRow)); return;
    }
    if (req.method === 'DELETE') {
      const id = String(req.query?.id || '');
      if (!id || !workspaceId) { res.status(400).json({ error: 'EVENT_ID_REQUIRED' }); return; }
      const currentRow = await requireScopedRow('work_items', id, workspaceId, 'EVENT_NOT_FOUND');
      if (currentRow?.lead_id) await clearLeadNextActionIfCurrent(currentRow.lead_id, id, workspaceId);
      await deleteById('work_items', id);
      res.status(200).json({ ok: true, id }); return;
    }
    if (req.method !== 'POST') { res.status(405).json({ error: 'METHOD_NOT_ALLOWED' }); return; }
    const finalWorkspaceId = workspaceId || await findWorkspaceId(body.workspaceId);
    if (!finalWorkspaceId) throw new Error('SUPABASE_WORKSPACE_ID_MISSING');
    const nowIso = new Date().toISOString();
    const startAt = body.startAt ? new Date(body.startAt).toISOString() : nowIso;
    const payload = { workspace_id: finalWorkspaceId, created_by_user_id: asNullableUuid(body.ownerId), lead_id: asNullableUuid(body.leadId), record_type:'event', type: body.type || 'meeting', title: body.title, description:'', status: body.status || 'scheduled', priority:'medium', scheduled_at:startAt, start_at:startAt, end_at: body.endAt ? new Date(body.endAt).toISOString() : null, recurrence: body.recurrenceRule || 'none', reminder: body.reminderAt || 'none', show_in_tasks:false, show_in_calendar:true, created_at: nowIso, updated_at: nowIso };
    const result = await insertWithVariants(['work_items'], [payload]);
    const inserted = Array.isArray(result.data) && result.data[0] ? result.data[0] : payload;
    if (body.leadId) await syncLeadNextAction(body.leadId, { id: inserted.id, title: body.title, startAt }, finalWorkspaceId);
    res.status(200).json(normalizeEvent(inserted));
  } catch (error) {
    const message = error?.message || 'EVENT_MUTATION_FAILED';
    res.status(message === 'EVENT_NOT_FOUND' || message === 'LEAD_NOT_FOUND' ? 404 : 500).json({ error: message });
  }
}
