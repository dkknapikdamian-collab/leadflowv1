#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function fail(message) {
  console.error('CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL_FAIL: ' + message);
  process.exit(1);
}
function has(text, needle, label) {
  if (!text.includes(needle)) fail(label + ': missing ' + needle);
}
function hasAny(text, needles, label) {
  if (!needles.some((needle) => text.includes(needle))) fail(label + ': missing one of ' + needles.join(' | '));
}
function sequence(text, needles, label) {
  let index = -1;
  for (const needle of needles) {
    const next = text.indexOf(needle, index + 1);
    if (next < 0) fail(label + ': missing/order ' + needle);
    index = next;
  }
}

const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const dialog = read('src/components/EntityConflictDialog.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const system = read('api/system.ts');
const pkg = JSON.parse(read('package.json'));

has(fallback, 'findEntityConflictsInSupabase', 'Supabase fallback exposes conflict lookup');
has(system, 'entity-conflicts', 'System API routes entity conflicts');
has(dialog, 'Możliwy duplikat', 'Conflict dialog default title/copy');
has(dialog, 'Pokaż', 'Conflict dialog show action');
has(dialog, 'Przywróć', 'Conflict dialog restore action');
has(dialog, 'Dodaj mimo to', 'Conflict dialog create-anyway default action');

has(leads, 'findEntityConflictsInSupabase', 'Leads imports/uses conflict lookup');
has(leads, "targetType: 'lead'", 'Leads checks lead target type');
sequence(leads, ['preparedLead.name', 'preparedLead.email', 'preparedLead.phone', 'preparedLead.company'], 'Leads checks name/email/phone/company');
has(leads, 'setLeadConflictCandidates', 'Leads stores conflict candidates');
has(leads, 'setLeadConflictPendingInput', 'Leads stores pending input');
has(leads, 'handleCreateLeadAnyway', 'Leads has create-anyway action');
has(leads, 'forceDuplicate: true', 'Leads creates anyway only after explicit confirmation');

has(clients, 'findEntityConflictsInSupabase', 'Clients imports/uses conflict lookup');
has(clients, "targetType: 'client'", 'Clients checks client target type');
sequence(clients, ['preparedClient.name', 'preparedClient.email', 'preparedClient.phone', 'preparedClient.company'], 'Clients checks name/email/phone/company');
has(clients, 'setClientConflictCandidates', 'Clients stores conflict candidates');
has(clients, 'setClientConflictPendingInput', 'Clients stores pending input');
has(clients, 'handleCreateClientAnyway', 'Clients has create-anyway action');
has(clients, 'forceDuplicate: true', 'Clients creates anyway only after explicit confirmation');
has(clients, '<EntityConflictDialog', 'Clients renders conflict dialog');
hasAny(clients, ['title="Możliwy duplikat"', 'title="Możliwy duplikat klienta lub leada"'], 'Clients duplicate modal title');
hasAny(clients, ['createAnywayLabel="Dodaj mimo to"', 'createAnywayLabel="Dodaj klienta mimo to"'], 'Clients create-anyway label');
has(clients, 'onRestore={restoreClientConflictCandidate}', 'Clients restore action is wired');
has(clients, 'onCancel={() => { setClientConflictOpen(false); setIsCreateOpen(true); }}', 'Clients cancel returns to form');

if (!pkg.scripts || pkg.scripts['check:a2-duplicate-warning-ux-full'] !== 'node scripts/check-closeflow-a2-duplicate-warning-ux-full.cjs') {
  fail('package.json missing check:a2-duplicate-warning-ux-full');
}

console.log('CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FULL_CHECK_OK');
