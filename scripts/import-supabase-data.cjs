#!/usr/bin/env node
/**
 * A23 Supabase import helper.
 *
 * Modes:
 *   DRY_RUN - default, no writes.
 *   IMPORT  - writes only when explicitly confirmed.
 *
 * Decisions:
 *   CLEAN_START       - default A23 decision, no import.
 *   MIGRATE_FIRESTORE - enables import planning/import from exported JSON.
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mode = String(process.env.A23_MODE || 'DRY_RUN').trim().toUpperCase();
const decision = String(process.env.A23_DECISION || 'CLEAN_START').trim().toUpperCase();
const inputFile = path.resolve(root, process.env.A23_INPUT_FILE || 'data/firestore-export.json');
const reportFile = path.resolve(root, process.env.A23_REPORT_FILE || 'migration-reports/a23-last-report.json');

const tableMap = {
  leads: 'leads',
  clients: 'clients',
  cases: 'cases',
  tasks: 'work_items',
  events: 'work_items',
  aiDrafts: 'ai_drafts',
  aidrafts: 'ai_drafts',
  responseTemplates: 'response_templates',
  responsetemplates: 'response_templates',
  activities: 'activities',
};

const fieldMap = {
  ownerId: 'user_id',
  workspaceId: 'workspace_id',
  leadId: 'lead_id',
  caseId: 'case_id',
};

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizeCollectionPayload(raw) {
  const rootObj = asObject(raw);
  const collections = asObject(rootObj.collections);

  if (Object.keys(collections).length > 0) {
    return collections;
  }

  const inferred = {};
  for (const key of Object.keys(tableMap)) {
    if (Array.isArray(rootObj[key])) inferred[key] = rootObj[key];
  }
  return inferred;
}

function normalizeInputRecord(row) {
  if (!row || typeof row !== 'object') return null;
  if ('data' in row && row.data && typeof row.data === 'object') {
    return {
      sourceId: String(row.id || row.data.id || '').trim(),
      data: { ...row.data },
    };
  }
  return {
    sourceId: String(row.id || row.sourceId || '').trim(),
    data: { ...row },
  };
}

function mapRecord(collectionName, source) {
  const sourceId = source.sourceId || String(source.data.id || '').trim();
  const out = { ...source.data };

  for (const [from, to] of Object.entries(fieldMap)) {
    if (Object.prototype.hasOwnProperty.call(out, from) && !Object.prototype.hasOwnProperty.call(out, to)) {
      out[to] = out[from];
    }
  }

  if (!out.source_id && sourceId) out.source_id = sourceId;
  if (!out.import_source) out.import_source = 'firestore';
  if (!out.imported_at) out.imported_at = nowIso();

  if (collectionName === 'tasks') {
    out.kind = out.kind || 'task';
  }

  if (collectionName === 'events') {
    out.kind = out.kind || 'event';
  }

  return out;
}

function getTargetTable(collectionName) {
  return tableMap[collectionName] || tableMap[collectionName.toLowerCase()] || null;
}

function duplicateKey(collectionName, table, record) {
  const id = String(record.source_id || record.id || '').trim();
  if (id) return table + ':' + id;

  const workspaceId = String(record.workspace_id || '').trim().toLowerCase();
  const email = String(record.email || record.contact_email || '').trim().toLowerCase();
  const phone = String(record.phone || record.contact_phone || '').trim().replace(/\s+/g, '');
  if (collectionName === 'leads' && (email || phone)) {
    return table + ':' + workspaceId + ':' + email + ':' + phone;
  }

  return table + ':NO_ID:' + JSON.stringify(record).slice(0, 160);
}

function buildPlan(raw) {
  const collections = normalizeCollectionPayload(raw);
  const seen = new Map();
  const duplicates = [];
  const missingRelations = [];
  const planned = [];
  const counts = {};

  for (const [collectionName, rows] of Object.entries(collections)) {
    const list = Array.isArray(rows) ? rows : [];
    counts[collectionName] = list.length;

    const table = getTargetTable(collectionName);
    if (!table) {
      missingRelations.push({
        type: 'UNKNOWN_COLLECTION',
        collection: collectionName,
        count: list.length,
      });
      continue;
    }

    for (const rawRow of list) {
      const normalized = normalizeInputRecord(rawRow);
      if (!normalized) continue;

      const record = mapRecord(collectionName, normalized);
      const key = duplicateKey(collectionName, table, record);

      if (seen.has(key)) {
        duplicates.push({
          key,
          collection: collectionName,
          table,
          currentSourceId: record.source_id || null,
          previousSourceId: seen.get(key),
        });
        continue;
      }

      seen.set(key, record.source_id || null);

      if ((collectionName === 'tasks' || collectionName === 'events') && record.leadId && !record.lead_id) {
        missingRelations.push({
          type: 'MISSING_LEAD_MAPPING',
          collection: collectionName,
          sourceId: record.source_id || null,
        });
      }

      if (collectionName === 'cases' && record.clientId && !record.client_id) {
        missingRelations.push({
          type: 'CLIENT_MAPPING_NOT_STANDARDIZED',
          collection: collectionName,
          sourceId: record.source_id || null,
        });
      }

      planned.push({
        collection: collectionName,
        table,
        sourceId: record.source_id || null,
        record,
      });
    }
  }

  const targetCounts = {};
  for (const item of planned) {
    targetCounts[item.table] = (targetCounts[item.table] || 0) + 1;
  }

  return {
    counts,
    targetCounts,
    duplicates,
    missingRelations,
    planned,
  };
}

function createCleanStartReport() {
  return {
    generatedAt: nowIso(),
    decision,
    mode,
    status: 'CLEAN_START_CONFIRMED',
    imported: false,
    message: 'A23 decision is clean start in Supabase. No Firestore data was imported.',
    inputFile: path.relative(root, inputFile),
    counts: {},
    targetCounts: {},
    duplicates: [],
    missingRelations: [],
  };
}

async function supabaseInsert(table, rows) {
  const url = String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }

  if (!rows.length) return [];

  const response = await fetch(url + '/rest/v1/' + encodeURIComponent(table), {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      Prefer: 'return=representation,resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error('SUPABASE_IMPORT_FAILED:' + table + ':' + response.status + ':' + text);
  }

  return data;
}

async function runImport(plan) {
  if (mode !== 'IMPORT') return { imported: false, writes: {} };

  if (decision !== 'MIGRATE_FIRESTORE') {
    throw new Error('IMPORT blocked. Set A23_DECISION=MIGRATE_FIRESTORE.');
  }

  if (process.env.A23_IMPORT_CONFIRM !== 'IMPORT_FIRESTORE_TO_SUPABASE') {
    throw new Error('IMPORT blocked. Set A23_IMPORT_CONFIRM=IMPORT_FIRESTORE_TO_SUPABASE.');
  }

  const rowsByTable = {};
  for (const item of plan.planned) {
    if (!rowsByTable[item.table]) rowsByTable[item.table] = [];
    rowsByTable[item.table].push(item.record);
  }

  const writes = {};
  for (const [table, rows] of Object.entries(rowsByTable)) {
    const inserted = await supabaseInsert(table, rows);
    writes[table] = Array.isArray(inserted) ? inserted.length : rows.length;
  }

  return { imported: true, writes };
}

async function main() {
  if (!['DRY_RUN', 'IMPORT'].includes(mode)) {
    throw new Error('A23_MODE must be DRY_RUN or IMPORT.');
  }

  let report;

  if (decision === 'CLEAN_START') {
    report = createCleanStartReport();
  } else {
    if (!fs.existsSync(inputFile)) {
      throw new Error('Input file not found: ' + path.relative(root, inputFile));
    }

    const raw = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const plan = buildPlan(raw);
    const importResult = await runImport(plan);

    report = {
      generatedAt: nowIso(),
      decision,
      mode,
      status: importResult.imported ? 'IMPORT_DONE' : 'DRY_RUN_DONE',
      imported: importResult.imported,
      inputFile: path.relative(root, inputFile),
      counts: plan.counts,
      targetCounts: plan.targetCounts,
      duplicates: plan.duplicates,
      missingRelations: plan.missingRelations,
      writes: importResult.writes,
      plannedRecords: plan.planned.length,
      targetTables: Object.keys(plan.targetCounts).sort(),
    };
  }

  ensureDir(reportFile);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

  console.log('A23 decision: ' + decision);
  console.log('A23 mode: ' + mode);
  console.log('A23 status: ' + report.status);
  console.log('Report: ' + path.relative(root, reportFile));
  if (report.duplicates && report.duplicates.length) {
    console.log('Duplicates: ' + report.duplicates.length);
  }
  if (report.missingRelations && report.missingRelations.length) {
    console.log('Relation warnings: ' + report.missingRelations.length);
  }
}

main().catch((error) => {
  console.error('A23 Supabase import failed:', error && error.message ? error.message : error);
  process.exit(1);
});
