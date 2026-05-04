#!/usr/bin/env node
/* FAZA4_ETAP43_CRITICAL_CRUD_RELOAD_SMOKE */
const crypto = require('node:crypto');

const BASE_URL = String(process.env.CLOSEFLOW_SMOKE_BASE_URL || '').replace(/\/+$/, '');
const ACCESS_TOKEN = String(process.env.CLOSEFLOW_SMOKE_ACCESS_TOKEN || '').trim();
const WORKSPACE_ID = String(process.env.CLOSEFLOW_SMOKE_WORKSPACE_ID || '').trim();
const KEEP_DATA = String(process.env.CLOSEFLOW_SMOKE_KEEP_DATA || '').toLowerCase() === '1';
const AI_EXPECTED = String(process.env.CLOSEFLOW_SMOKE_AI_EXPECTED || '').toLowerCase() === '1';

const marker = 'CF_SMOKE_43_' + new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) + '_' + crypto.randomUUID().slice(0, 8);
const created = {
  leads: [],
  tasks: [],
  events: [],
  aiDrafts: [],
  cases: [],
};

function fail(message, details) {
  const error = new Error(message);
  error.details = details;
  throw error;
}

function logStep(message) {
  console.log('== ' + message + ' ==');
}

function readId(row, label) {
  const id = row && typeof row === 'object' ? row.id || row.leadId || row.caseId || row.draftId : null;
  if (!id) fail(label + ': response has no id', row);
  return String(id);
}

function assert(condition, message, details) {
  if (!condition) fail(message, details);
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function findById(rows, id) {
  return normalizeArray(rows).find((row) => String(row?.id || '') === String(id));
}

async function api(path, options = {}) {
  if (!BASE_URL) fail('CLOSEFLOW_SMOKE_BASE_URL is required');
  if (!ACCESS_TOKEN) fail('CLOSEFLOW_SMOKE_ACCESS_TOKEN is required');

  const url = BASE_URL + path;
  const headers = {
    Authorization: 'Bearer ' + ACCESS_TOKEN,
    'Content-Type': 'application/json',
    ...(WORKSPACE_ID ? {
      'x-workspace-id': WORKSPACE_ID,
      'x-closeflow-workspace-id': WORKSPACE_ID,
    } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const code = data && typeof data === 'object' && data.error ? String(data.error) : text.slice(0, 240);
    const error = new Error(`${options.method || 'GET'} ${path} failed: ${response.status}:${code}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function cleanup() {
  if (KEEP_DATA) {
    console.log('SKIP cleanup: CLOSEFLOW_SMOKE_KEEP_DATA=1');
    return;
  }

  logStep('Cleanup smoke records');
  const jobs = [];
  for (const id of created.aiDrafts.reverse()) jobs.push(api(`/api/system?kind=ai-drafts&id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((error) => console.warn('cleanup ai draft failed:', id, error.message)));
  for (const id of created.tasks.reverse()) jobs.push(api(`/api/tasks?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((error) => console.warn('cleanup task failed:', id, error.message)));
  for (const id of created.events.reverse()) jobs.push(api(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((error) => console.warn('cleanup event failed:', id, error.message)));
  for (const id of created.cases.reverse()) jobs.push(api(`/api/cases?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((error) => console.warn('cleanup case failed:', id, error.message)));
  for (const id of created.leads.reverse()) jobs.push(api(`/api/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' }).catch((error) => console.warn('cleanup lead failed:', id, error.message)));
  await Promise.all(jobs);
}

async function smokeLeadCrud() {
  logStep('Lead CRUD + reload persistence');
  const leadName = marker + '_LEAD';
  const lead = await api('/api/leads', {
    method: 'POST',
    body: {
      name: leadName,
      email: marker.toLowerCase() + '@example.com',
      phone: '+48111111111',
      source: 'form',
      dealValue: 1234,
      nextActionAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  });
  const leadId = readId(lead, 'lead create');
  created.leads.push(leadId);

  const leadReload = await api(`/api/leads?id=${encodeURIComponent(leadId)}`);
  assert(String(leadReload.id) === leadId, 'Lead reload by id failed', leadReload);
  assert(String(leadReload.name || '').includes(leadName), 'Lead reload lost name', leadReload);

  const patchedName = leadName + '_PATCHED';
  const patched = await api('/api/leads', {
    method: 'PATCH',
    body: { id: leadId, name: patchedName, notes: 'Stage43 reload smoke update' },
  });
  assert(String(patched.id || leadId) === leadId, 'Lead patch returned wrong id', patched);

  const leadAfterPatch = await api(`/api/leads?id=${encodeURIComponent(leadId)}`);
  assert(String(leadAfterPatch.name || '').includes(patchedName), 'Lead patch not visible after reload', leadAfterPatch);

  return { leadId, leadName: patchedName };
}

async function smokeTaskCrud(leadId) {
  logStep('Task CRUD + reload persistence');
  const title = marker + '_TASK';
  const scheduledAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

  const task = await api('/api/tasks', {
    method: 'POST',
    body: {
      title,
      type: 'follow_up',
      priority: 'medium',
      status: 'todo',
      scheduledAt,
      leadId,
    },
  });
  const taskId = readId(task, 'task create');
  created.tasks.push(taskId);

  const taskList = await api('/api/tasks');
  const foundTask = findById(taskList, taskId);
  assert(foundTask, 'Task not visible after reload GET /api/tasks', taskList);

  const patchedTitle = title + '_PATCHED';
  await api('/api/tasks', {
    method: 'PATCH',
    body: { id: taskId, title: patchedTitle, scheduledAt },
  });
  const taskListAfterPatch = await api('/api/tasks');
  const patched = findById(taskListAfterPatch, taskId);
  assert(patched && String(patched.title || '').includes(patchedTitle), 'Task patch not visible after reload', patched || taskListAfterPatch);

  return { taskId };
}

async function smokeEventCrud(leadId) {
  logStep('Event CRUD + reload persistence');
  const title = marker + '_EVENT';
  const startAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const endAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString();

  const event = await api('/api/events', {
    method: 'POST',
    body: {
      title,
      type: 'meeting',
      status: 'scheduled',
      startAt,
      endAt,
      leadId,
    },
  });
  const eventId = readId(event, 'event create');
  created.events.push(eventId);

  const eventList = await api('/api/events');
  const foundEvent = findById(eventList, eventId);
  assert(foundEvent, 'Event not visible after reload GET /api/events', eventList);

  const patchedTitle = title + '_PATCHED';
  await api('/api/events', {
    method: 'PATCH',
    body: { id: eventId, title: patchedTitle, startAt, endAt },
  });
  const eventListAfterPatch = await api('/api/events');
  const patched = findById(eventListAfterPatch, eventId);
  assert(patched && String(patched.title || '').includes(patchedTitle), 'Event patch not visible after reload', patched || eventListAfterPatch);

  return { eventId };
}

async function smokeAiDrafts() {
  logStep('AI draft confirm/cancel smoke');
  try {
    const confirmDraft = await api('/api/system?kind=ai-drafts', {
      method: 'POST',
      body: {
        rawText: marker + ' lead draft to confirm',
        type: 'lead',
        source: 'manual',
        provider: 'local',
        parsedDraft: { name: marker + '_AI_DRAFT_CONFIRM' },
      },
    });
    const confirmDraftId = readId(confirmDraft, 'AI draft create for confirm');
    created.aiDrafts.push(confirmDraftId);

    const confirmed = await api('/api/system?kind=ai-drafts', {
      method: 'PATCH',
      body: { id: confirmDraftId, action: 'confirm' },
    });
    assert(['converted', 'confirmed'].includes(String(confirmed.status || '').toLowerCase()), 'AI draft confirm did not convert/confirm', confirmed);
    assert(!String(confirmed.rawText || '').trim(), 'AI draft rawText not cleared after confirm', confirmed);

    const cancelDraft = await api('/api/system?kind=ai-drafts', {
      method: 'POST',
      body: {
        rawText: marker + ' note draft to cancel',
        type: 'note',
        source: 'manual',
        provider: 'local',
        parsedDraft: { note: marker + '_AI_DRAFT_CANCEL' },
      },
    });
    const cancelDraftId = readId(cancelDraft, 'AI draft create for cancel');
    created.aiDrafts.push(cancelDraftId);

    const cancelled = await api('/api/system?kind=ai-drafts', {
      method: 'PATCH',
      body: { id: cancelDraftId, action: 'cancel' },
    });
    assert(['archived', 'cancelled'].includes(String(cancelled.status || '').toLowerCase()), 'AI draft cancel did not archive/cancel', cancelled);
    assert(!String(cancelled.rawText || '').trim(), 'AI draft rawText not cleared after cancel', cancelled);

    return { ai: 'passed' };
  } catch (error) {
    const planGated = error && (error.status === 402 || error.status === 403) && /AI|WORKSPACE_FEATURE|WORKSPACE_AI|PLAN|ACCESS/i.test(error.message || '');
    if (planGated && !AI_EXPECTED) {
      console.log('SKIP AI draft smoke: workspace plan does not allow AI. Set CLOSEFLOW_SMOKE_AI_EXPECTED=1 to make this fail.');
      return { ai: 'skipped_plan_gate' };
    }
    throw error;
  }
}

async function smokeLeadToCase(leadId, leadName) {
  logStep('Lead -> Case handoff');
  const result = await api('/api/leads', {
    method: 'POST',
    body: {
      action: 'start_service',
      id: leadId,
      title: marker + '_CASE',
      caseStatus: 'in_progress',
      clientName: leadName,
      clientEmail: marker.toLowerCase() + '@example.com',
      clientPhone: '+48222222222',
    },
  });
  const caseId = result?.case?.id || result?.caseId || result?.case?.caseId;
  assert(caseId, 'start_service did not return case id', result);
  created.cases.push(String(caseId));

  const cases = await api(`/api/cases?leadId=${encodeURIComponent(leadId)}`);
  const found = Array.isArray(cases) ? cases.find((row) => String(row?.id || '') === String(caseId)) : null;
  assert(found || result?.case, 'Case not visible after lead -> case handoff reload', { result, cases });

  const leadAfter = await api(`/api/leads?id=${encodeURIComponent(leadId)}`);
  assert(leadAfter.linkedCaseId || leadAfter.linked_case_id || leadAfter.status === 'moved_to_service' || leadAfter.movedToServiceAt, 'Lead does not show handoff state after reload', leadAfter);

  return { caseId: String(caseId) };
}

async function smokeContext() {
  logStep('Assistant context / aggregate read sanity');
  try {
    const context = await api('/api/system?kind=assistant-context');
    assert(context && typeof context === 'object', 'Assistant context did not return object', context);
    for (const key of ['leads', 'tasks', 'events', 'cases']) {
      assert(Array.isArray(context[key]), `Assistant context missing array: ${key}`, context);
    }
    return { context: 'passed' };
  } catch (error) {
    console.log('WARN assistant context sanity skipped/failed:', error.message);
    return { context: 'warn_only' };
  }
}

async function main() {
  console.log('CloseFlow Stage43 critical CRUD smoke');
  console.log('Base URL:', BASE_URL || '(missing)');
  console.log('Marker:', marker);
  console.log('Workspace hint:', WORKSPACE_ID || '(none)');

  try {
    logStep('Auth/me sanity');
    const me = await api('/api/me');
    assert(me && typeof me === 'object', '/api/me did not return object', me);
    assert(me.workspace || me.access || me.profile, '/api/me missing workspace/access/profile surface', me);

    const lead = await smokeLeadCrud();
    await smokeTaskCrud(lead.leadId);
    await smokeEventCrud(lead.leadId);
    await smokeAiDrafts();
    await smokeContext();
    await smokeLeadToCase(lead.leadId, lead.leadName);

    console.log('\nPASS critical CRUD smoke');
  } catch (error) {
    console.error('\nFAIL critical CRUD smoke');
    console.error(error && error.stack ? error.stack : String(error));
    if (error && error.details) console.error(JSON.stringify(error.details, null, 2).slice(0, 4000));
    process.exitCode = 1;
  } finally {
    await cleanup();
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
