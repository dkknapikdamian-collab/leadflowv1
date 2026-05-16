import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

function required(name, fallback = '') {
  const value = (process.env[name] || fallback || '').trim();
  if (!value) {
    throw new Error(`MISSING_ENV:${name}`);
  }
  return value;
}

function readServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  const fromPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!fromPath) {
    throw new Error('MISSING_ENV:FIREBASE_SERVICE_ACCOUNT_JSON_OR_PATH');
  }

  const absolute = path.isAbsolute(fromPath) ? fromPath : path.join(process.cwd(), fromPath);
  const raw = fs.readFileSync(absolute, 'utf8');
  return JSON.parse(raw);
}

function toIso(value) {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString();
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
}

function normalizePartialPayments(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const amount = Number(item.amount || 0);
      if (!Number.isFinite(amount) || amount < 0) return null;
      return {
        id: String(item.id || `payment-${index}`),
        amount,
        paidAt: typeof item.paidAt === 'string' && item.paidAt.trim() ? item.paidAt : undefined,
        createdAt: typeof item.createdAt === 'string' && item.createdAt.trim() ? item.createdAt : new Date().toISOString(),
      };
    })
    .filter(Boolean);
}

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

const supabaseUrl = required('VITE_SUPABASE_URL', process.env.SUPABASE_URL || '');
const serviceRole = required('SUPABASE_SERVICE_ROLE_KEY');

async function rest(pathName, init = {}) {
  const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/${pathName}`, {
    ...init,
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`SUPABASE_${response.status}:${JSON.stringify(payload)}`);
  }
  return payload;
}

async function getWorkspaceId() {
  if (process.env.SUPABASE_WORKSPACE_ID?.trim()) return process.env.SUPABASE_WORKSPACE_ID.trim();
  const rows = await rest('workspaces?select=id&order=created_at.asc&limit=1', { method: 'GET' });
  if (!Array.isArray(rows) || !rows[0]?.id) {
    throw new Error('WORKSPACE_NOT_FOUND');
  }
  return String(rows[0].id);
}

async function upsertByLegacy(table, rows) {
  if (!rows.length) return [];
  const batches = chunk(rows, 200);
  const merged = [];
  for (const batch of batches) {
    const inserted = await rest(`${table}?on_conflict=legacy_firestore_id`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(batch),
    });
    if (Array.isArray(inserted)) merged.push(...inserted);
  }
  return merged;
}

async function run() {
  const serviceAccount = readServiceAccount();
  initializeApp({ credential: cert(serviceAccount) });
  const firestore = getFirestore();

  const workspaceId = await getWorkspaceId();
  console.log('Workspace:', workspaceId);

  const [leadsSnap, tasksSnap, eventsSnap, casesSnap] = await Promise.all([
    firestore.collection('leads').get(),
    firestore.collection('tasks').get(),
    firestore.collection('events').get(),
    firestore.collection('cases').get(),
  ]);

  const nowIso = new Date().toISOString();

  const leadRows = leadsSnap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      workspace_id: workspaceId,
      created_by_user_id: null,
      name: String(data.name || ''),
      company: String(data.company || ''),
      email: String(data.email || ''),
      phone: String(data.phone || ''),
      source: String(data.source || 'other'),
      value: Number(data.dealValue || 0),
      partial_payments: normalizePartialPayments(data.partialPayments),
      summary: String(data.summary || ''),
      notes: String(data.notes || ''),
      status: String(data.status || 'new'),
      priority: data.isAtRisk ? 'high' : 'medium',
      is_at_risk: Boolean(data.isAtRisk),
      next_action_title: String(data.nextStep || ''),
      next_action_at: toIso(data.nextActionAt),
      next_action_item_id: null,
      created_at: toIso(data.createdAt) || nowIso,
      updated_at: toIso(data.updatedAt) || nowIso,
      legacy_firestore_id: docSnap.id,
    };
  });

  const leadInsertResult = await upsertByLegacy('leads', leadRows);
  const leadIdByLegacy = new Map(leadInsertResult.map((row) => [String(row.legacy_firestore_id), String(row.id)]));

  const taskRows = tasksSnap.docs.map((docSnap) => {
    const data = docSnap.data();
    const leadId = data.leadId ? leadIdByLegacy.get(String(data.leadId)) : null;
    const scheduledAt = toIso(data.date ? `${data.date}T09:00:00` : data.scheduledAt || data.date || data.createdAt);
    return {
      workspace_id: workspaceId,
      created_by_user_id: null,
      lead_id: leadId || null,
      record_type: 'task',
      type: String(data.type || 'task'),
      title: String(data.title || ''),
      description: String(data.description || ''),
      status: String(data.status || 'todo'),
      priority: String(data.priority || 'medium'),
      scheduled_at: scheduledAt || nowIso,
      start_at: null,
      end_at: null,
      recurrence: String(data.recurrence || data.recurrenceRule || 'none'),
      reminder: String(data.reminder || data.reminderAt || 'none'),
      show_in_tasks: true,
      show_in_calendar: true,
      created_at: toIso(data.createdAt) || nowIso,
      updated_at: toIso(data.updatedAt) || nowIso,
      legacy_firestore_id: docSnap.id,
    };
  });

  const eventRows = eventsSnap.docs.map((docSnap) => {
    const data = docSnap.data();
    const leadId = data.leadId ? leadIdByLegacy.get(String(data.leadId)) : null;
    const startAt = toIso(data.startAt || data.date || data.createdAt) || nowIso;
    return {
      workspace_id: workspaceId,
      created_by_user_id: null,
      lead_id: leadId || null,
      record_type: 'event',
      type: String(data.type || 'meeting'),
      title: String(data.title || ''),
      description: String(data.description || ''),
      status: String(data.status || 'scheduled'),
      priority: String(data.priority || 'medium'),
      scheduled_at: startAt,
      start_at: startAt,
      end_at: toIso(data.endAt),
      recurrence: String(data.recurrence || data.recurrenceRule || 'none'),
      reminder: String(data.reminder || data.reminderAt || 'none'),
      show_in_tasks: false,
      show_in_calendar: true,
      created_at: toIso(data.createdAt) || nowIso,
      updated_at: toIso(data.updatedAt) || nowIso,
      legacy_firestore_id: docSnap.id,
    };
  });

  const workItemInsertResult = await upsertByLegacy('work_items', [...taskRows, ...eventRows]);
  const workItemIdByLegacy = new Map(workItemInsertResult.map((row) => [String(row.legacy_firestore_id), String(row.id)]));

  const caseRows = casesSnap.docs.map((docSnap) => {
    const data = docSnap.data();
    const leadId = data.leadId ? leadIdByLegacy.get(String(data.leadId)) : null;
    return {
      workspace_id: workspaceId,
      created_by_user_id: null,
      lead_id: leadId || null,
      title: String(data.title || data.name || 'Sprawa bez tytu\u0142u'),
      client_name: String(data.clientName || data.client_name || ''),
      status: String(data.status || 'in_progress'),
      completeness_percent: Number(data.completenessPercent || 0),
      portal_ready: Boolean(data.portalReady),
      created_at: toIso(data.createdAt) || nowIso,
      updated_at: toIso(data.updatedAt) || nowIso,
      next_action_item_id: data.nextActionItemId ? workItemIdByLegacy.get(String(data.nextActionItemId)) || null : null,
      legacy_firestore_id: docSnap.id,
    };
  });

  const caseInsertResult = await upsertByLegacy('cases', caseRows);

  const sample = leadRows.slice(0, 10).map((lead) => {
    const migrated = leadInsertResult.find((row) => String(row.legacy_firestore_id) === lead.legacy_firestore_id);
    return {
      legacy_firestore_id: lead.legacy_firestore_id,
      name_firestore: lead.name,
      name_supabase: migrated?.name || null,
      value_firestore: lead.value,
      value_supabase: migrated?.value || null,
      next_action_firestore: lead.next_action_title,
      next_action_supabase: migrated?.next_action_title || null,
    };
  });

  console.log('\n=== RAPORT MIGRACJI ===');
  console.log(`Firestore leads: ${leadsSnap.size} -> Supabase leads upserted: ${leadInsertResult.length}`);
  console.log(`Firestore tasks: ${tasksSnap.size} + events: ${eventsSnap.size} -> Supabase work_items upserted: ${workItemInsertResult.length}`);
  console.log(`Firestore cases: ${casesSnap.size} -> Supabase cases upserted: ${caseInsertResult.length}`);
  console.log('\nLosowa pr\u00F3bka lead\u00F3w (do r\u0119cznej kontroli):');
  console.table(sample);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
