#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) fail('Missing file: ' + rel);
  return fs.readFileSync(full, 'utf8');
}
function fail(message) {
  console.error('CLOSEFLOW_DUPLICATE_WARNING_UX_FULL_FAIL: ' + message);
  process.exit(1);
}
function assert(condition, message) { if (!condition) fail(message); }
function has(text, needle, label) { assert(text.includes(needle), label + ' missing: ' + needle); }
function hasAny(text, needles, label) { assert(needles.some((needle) => text.includes(needle)), label + ' missing any of: ' + needles.join(' | ')); }

const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const dialog = read('src/components/EntityConflictDialog.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const systemApi = read('api/system.ts');
const leadApi = read('api/leads.ts');
const clientApi = read('api/clients.ts');
const entityHandler = read('src/server/entity-conflicts-handler.ts');
const pkg = JSON.parse(read('package.json'));

has(dialog, 'EntityConflictDialog', 'EntityConflictDialog export');
has(dialog, 'matchFields', 'EntityConflictDialog reason list');
has(dialog, 'Pokaż', 'EntityConflictDialog show action');
has(dialog, 'Przywróć', 'EntityConflictDialog restore action');
has(dialog, 'Dodaj mimo to', 'EntityConflictDialog create anyway action');

for (const [name, source, targetType] of [['Leads', leads, 'lead'], ['Clients', clients, 'client']]) {
  has(source, 'EntityConflictDialog', name + ' dialog usage');
  has(source, 'findEntityConflictsInSupabase', name + ' conflict lookup');
  has(source, "targetType: '" + targetType + "'", name + ' targetType');
  has(source, 'name:', name + ' sends name');
  has(source, 'email:', name + ' sends email');
  has(source, 'phone:', name + ' sends phone');
  has(source, 'company:', name + ' sends company');
  has(source, 'Dodaj mimo to', name + ' create anyway label');
  hasAny(source, ['onCreateAnyway', 'handleCreate', 'CreateAnyway'], name + ' create anyway flow');
}

has(systemApi, 'entityConflictsHandler', 'api/system routes entity conflicts handler');
has(systemApi, 'entity-conflicts', 'api/system entity-conflicts kind');

for (const field of ['email', 'phone', 'name', 'company']) {
  has(entityHandler, "matches.push('" + field + "')", 'backend conflict field ' + field);
}
has(entityHandler, 'matchFields', 'backend returns matchFields');
has(entityHandler, 'buildLeadCandidate', 'backend lead candidates');
has(entityHandler, 'buildClientCandidate', 'backend client candidates');
has(entityHandler, 'canRestore', 'backend restore flag');
has(entityHandler, 'url:', 'backend show URL');

has(fallback, 'findEntityConflictsInSupabase', 'frontend API conflict helper');
has(fallback, "targetType: 'lead' | 'client'", 'frontend conflict input target types');
hasAny(fallback, ['allowDuplicate?: boolean; forceDuplicate?: boolean', 'allowDuplicate?: boolean'], 'duplicate override typing');
hasAny(leadApi, ['sanitizeFreshLeadCreatePayloadA1', 'allowDuplicate', 'forceDuplicate'], 'lead API duplicate/create safety marker');
hasAny(clientApi, ['insertWithSchemaFallback', 'allowDuplicate', 'forceDuplicate'], 'client API create path marker');

assert(pkg.scripts && pkg.scripts['check:closeflow-duplicate-warning-ux-full'] === 'node scripts/check-closeflow-duplicate-warning-ux-full.cjs', 'package script check:closeflow-duplicate-warning-ux-full missing');

console.log('CLOSEFLOW_DUPLICATE_WARNING_UX_FULL_CHECK_OK');
console.log('fields=email,phone,name,company');
console.log('entities=lead,client');

