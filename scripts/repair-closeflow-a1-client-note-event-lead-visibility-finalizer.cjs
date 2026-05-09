#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = path.resolve(process.argv[2] || process.cwd());
process.chdir(repo);

const files = {
  supabase: 'src/lib/supabase-fallback.ts',
  activitiesApi: 'api/activities.ts',
  contextNote: 'src/components/ContextNoteDialog.tsx',
  eventDialog: 'src/components/EventCreateDialog.tsx',
  clientDetail: 'src/pages/ClientDetail.tsx',
  leads: 'src/pages/Leads.tsx',
  indexCss: 'src/index.css',
  packageJson: 'package.json',
};

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}
function fail(message) {
  console.error('A1_FINALIZER_REPAIR_FAIL: ' + message);
  process.exit(1);
}
function replaceOnce(text, needle, replacement, label) {
  if (!text.includes(needle)) fail('Missing pattern: ' + label);
  return text.replace(needle, replacement);
}
function ensureDir(rel) {
  fs.mkdirSync(path.join(repo, rel), { recursive: true });
}

console.log('== A1 finalizer: patch supabase-fallback ==');
{
  let text = read(files.supabase);

  text = text.replace(
    "type ActivityInput = { id?: string; caseId?: string | null; leadId?: string | null; ownerId?: string | null;",
    "type ActivityInput = { id?: string; caseId?: string | null; leadId?: string | null; clientId?: string | null; ownerId?: string | null;"
  );

  text = text.replace(
    "export async function fetchActivitiesFromSupabase(params?: { caseId?: string; leadId?: string; limit?: number }) {",
    "export async function fetchActivitiesFromSupabase(params?: { caseId?: string; leadId?: string; clientId?: string; limit?: number }) {"
  );

  text = text.replace(
    "const query = new URLSearchParams(); if (params?.caseId) query.set('caseId', params.caseId); if (params?.leadId) query.set('leadId', params.leadId); if (params?.limit) query.set('limit', String(params.limit));",
    "const query = new URLSearchParams(); if (params?.caseId) query.set('caseId', params.caseId); if (params?.leadId) query.set('leadId', params.leadId); if (params?.clientId) query.set('clientId', params.clientId); if (params?.limit) query.set('limit', String(params.limit));"
  );

  if (!text.includes('export async function deleteActivityFromSupabase')) {
    const insertAfter = /export async function updateActivityInSupabase\([^\n]+\)\s*\{[^\n]+\}\n/;
    const match = text.match(insertAfter);
    if (match) {
      text = text.replace(match[0], match[0] + "export async function deleteActivityFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/activities?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }\n");
    } else {
      const marker = "export async function insertActivityToSupabase";
      const idx = text.indexOf(marker);
      if (idx === -1) fail('Cannot find activity helper insertion point in supabase-fallback');
      const nextExport = text.indexOf("\nexport async function", idx + marker.length);
      const insertAt = nextExport === -1 ? text.length : nextExport;
      text = text.slice(0, insertAt) + "\nexport async function deleteActivityFromSupabase(id: string) { return callApi<SupabaseInsertResult>(`/api/activities?id=${encodeURIComponent(id)}`, { method: 'DELETE' }); }\n" + text.slice(insertAt);
    }
  }

  write(files.supabase, text);
}

console.log('== A1 finalizer: patch activities API ==');
{
  let text = read(files.activitiesApi);

  if (!text.includes('const clientId = asText(req.query?.clientId || body.clientId);')) {
    text = replaceOnce(
      text,
      "const leadId = asText(req.query?.leadId || body.leadId);",
      "const leadId = asText(req.query?.leadId || body.leadId);\n    const clientId = asText(req.query?.clientId || body.clientId);",
      'activities clientId const'
    );
  }

  if (!text.includes("filters.push(`client_id=eq.${encodeURIComponent(clientId)}`);")) {
    text = replaceOnce(
      text,
      "if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);",
      "if (leadId) filters.push(`lead_id=eq.${encodeURIComponent(leadId)}`);\n      if (clientId) filters.push(`client_id=eq.${encodeURIComponent(clientId)}`);",
      'activities clientId GET filter'
    );
  }

  if (!text.includes("client_id: clientId || null,")) {
    text = replaceOnce(
      text,
      "lead_id: leadId || null,",
      "lead_id: leadId || null,\n        client_id: clientId || null,",
      'activities clientId POST payload'
    );
  }

  if (!text.includes("if (body.clientId !== undefined) patch.client_id = asText(body.clientId) || null;")) {
    text = replaceOnce(
      text,
      "if (body.leadId !== undefined) patch.lead_id = asText(body.leadId) || null;",
      "if (body.leadId !== undefined) patch.lead_id = asText(body.leadId) || null;\n      if (body.clientId !== undefined) patch.client_id = asText(body.clientId) || null;",
      'activities clientId PATCH'
    );
  }

  write(files.activitiesApi, text);
}

console.log('== A1 finalizer: patch ContextNoteDialog ==');
{
  let text = read(files.contextNote);
  text = text.replace(
    "if (context?.recordType === 'client') return 'client_note_added';",
    "if (context?.recordType === 'client') return 'client_note';"
  );
  write(files.contextNote, text);
}

console.log('== A1 finalizer: patch ClientDetail note compatibility ==');
{
  let text = read(files.clientDetail);

  if (!text.includes('CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER')) {
    const helper = `
const CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER = new Set([
  'client_note',
  'client_note_added',
  'client_note_dictated',
  'dictated_note',
  'note_added',
]);

function getActivityEventTypeA1(activity: any) {
  return String(activity?.eventType || activity?.activityType || activity?.event_type || '').trim();
}

function isClientNoteActivityA1(activity: any) {
  const eventType = getActivityEventTypeA1(activity);
  const payload = activity?.payload && typeof activity.payload === 'object' ? activity.payload : {};
  return CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER.has(eventType)
    || (String((payload as any).recordType || '').trim() === 'client' && Boolean((payload as any).note || (payload as any).content));
}

function normalizeClientActivitiesForA1(activities: any[]) {
  return Array.isArray(activities)
    ? activities.map((activity) => (isClientNoteActivityA1(activity) ? { ...activity, eventType: getActivityEventTypeA1(activity) || 'client_note' } : activity))
    : [];
}
`;
    const anchor = "function activityLabel(activity: any) {";
    const idx = text.indexOf(anchor);
    if (idx === -1) fail('Cannot find activityLabel insertion point in ClientDetail');
    text = text.slice(0, idx) + helper + "\n" + text.slice(idx);
  }

  // Make common existing filters accept every supported client-note type.
  text = text.replace(/String\(([^)]*?eventType[^)]*?)\s*\|\|\s*([^)]*?activityType[^)]*?)\s*\|\|\s*'activity'\)/g, "String($1 || $2 || 'activity')");
  text = text.replace(/eventType === 'client_note_added'/g, "isClientNoteActivityA1(activity)");
  text = text.replace(/eventType === 'client_note_dictated'/g, "isClientNoteActivityA1(activity)");
  text = text.replace(/eventType === 'dictated_note'/g, "isClientNoteActivityA1(activity)");
  text = text.replace(/eventType === 'note_added'/g, "isClientNoteActivityA1(activity)");

  // If the page stores fetched activities directly, normalize them before state update.
  text = text.replace(/setActivities\((activityRows|activitiesRows|activityList|activityResult|rows) as any\[\]\);/g, "setActivities(normalizeClientActivitiesForA1($1 as any[]));");
  text = text.replace(/setActivities\((activityRows|activitiesRows|activityList|activityResult|rows)\);/g, "setActivities(normalizeClientActivitiesForA1($1 as any[]));");

  // Fallback: preserve explicit compatibility strings even if current implementation uses another local variable name.
  if (!text.includes("'client_note',") || !text.includes("'client_note_added',") || !text.includes("'client_note_dictated',") || !text.includes("'dictated_note',") || !text.includes("'note_added',")) {
    fail('ClientDetail note compatibility constants not present after patch');
  }

  write(files.clientDetail, text);
}

console.log('== A1 finalizer: patch EventCreateDialog marker ==');
{
  let text = read(files.eventDialog);
  if (!text.includes('data-a1-event-modal-readable-finalizer="true"')) {
    text = text.replace(
      'data-event-create-dialog-stage85="true" data-event-create-dialog-stage22b="true"',
      'data-event-create-dialog-stage85="true" data-event-create-dialog-stage22b="true" data-a1-event-modal-readable-finalizer="true"'
    );
  }
  write(files.eventDialog, text);
}

console.log('== A1 finalizer: patch Leads create visibility ==');
{
  let text = read(files.leads);

  if (!text.includes('function sanitizeNewLeadCreatePayloadA1')) {
    const helper = `
function sanitizeNewLeadCreatePayloadA1(input: any) {
  const payload = { ...(input || {}) };
  delete payload.clientId;
  delete payload.linkedCaseId;
  delete payload.caseId;
  delete payload.client_id;
  delete payload.linked_case_id;
  delete payload.case_id;
  delete payload.leadVisibility;
  return payload;
}
`;
    const anchor = "function nativeSelectClassName()";
    const idx = text.indexOf(anchor);
    if (idx === -1) fail('Cannot find Leads helper insertion point');
    text = text.slice(0, idx) + helper + "\n" + text.slice(idx);
  }

  text = text.replace(
    "await insertLeadToSupabase({ ...preparedLead, allowDuplicate: Boolean(options?.forceDuplicate), ownerId: workspace?.ownerId, workspaceId: requireWorkspaceId(workspace) });",
    "await insertLeadToSupabase({ ...sanitizeNewLeadCreatePayloadA1(preparedLead), allowDuplicate: Boolean(options?.forceDuplicate), ownerId: workspace?.ownerId, workspaceId: requireWorkspaceId(workspace) });\n    setSearchQuery('');\n    setShowTrash(false);\n    setQuickFilter('all');\n    setValueSortEnabled(false);"
  );

  write(files.leads, text);
}

console.log('== A1 finalizer: patch api/leads create payload guard ==');
{
  let text = read(files.packageJson); // existence only, api/leads is optional to patch safely below
}
{
  const rel = 'api/leads.ts';
  let text = read(rel);

  if (!text.includes('function sanitizeFreshLeadCreatePayloadA1')) {
    const helper = `
function sanitizeFreshLeadCreatePayloadA1(payload: Record<string, unknown>) {
  const next = { ...payload };
  delete next.client_id;
  delete next.clientId;
  delete next.linked_case_id;
  delete next.linkedCaseId;
  delete next.case_id;
  delete next.caseId;
  return next;
}
`;
    const anchor = "async function insertLeadWithSchemaFallback(payload: Record<string, unknown>) {";
    const idx = text.indexOf(anchor);
    if (idx === -1) fail('Cannot find insertLeadWithSchemaFallback in api/leads.ts');
    text = text.slice(0, idx) + helper + "\n" + text.slice(idx);
  }

  text = text.replace(
    "let currentPayload: Record<string, unknown> = { ...payload, company: asLeadCompanyForNotNull(payload.company) };",
    "let currentPayload: Record<string, unknown> = { ...sanitizeFreshLeadCreatePayloadA1(payload), company: asLeadCompanyForNotNull(payload.company) };"
  );

  write(rel, text);
}

console.log('== A1 finalizer: scoped CSS import ==');
{
  const cssRel = 'src/styles/closeflow-a1-client-note-event-lead-visibility-finalizer.css';
  const css = `/* CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER
   Scope: only the shared event create modal readability. No visual-system migration here.
*/
.closeflow-event-modal-readable[data-a1-event-modal-readable-finalizer="true"] {
  background: #ffffff !important;
  color: #0f172a !important;
}

.closeflow-event-modal-readable[data-a1-event-modal-readable-finalizer="true"] :is(label, p, span, div, h1, h2, h3, h4, strong, small) {
  color: #0f172a;
}

.closeflow-event-modal-readable[data-a1-event-modal-readable-finalizer="true"] :is(input, select, textarea) {
  background: #ffffff !important;
  color: #0f172a !important;
  border-color: #cbd5e1 !important;
}

.closeflow-event-modal-readable[data-a1-event-modal-readable-finalizer="true"] :is(option) {
  background: #ffffff !important;
  color: #0f172a !important;
}

.closeflow-event-modal-readable[data-a1-event-modal-readable-finalizer="true"] .event-form-footer {
  background: #ffffff !important;
  border-top: 1px solid #e2e8f0;
}
`;
  write(cssRel, css);

  let index = read(files.indexCss);
  const importLine = "@import './styles/closeflow-a1-client-note-event-lead-visibility-finalizer.css';";
  if (!index.includes(importLine)) {
    index += "\n" + importLine + "\n";
  }
  write(files.indexCss, index);
}

console.log('== A1 finalizer: docs and package scripts ==');
{
  ensureDir('docs/runtime');
  const docRel = 'docs/runtime/CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER_2026-05-09.md';
  const doc = `# CloseFlow A1 - Client note / event modal / lead visibility finalizer

## Zakres

Ten etap domyka P1 runtime i dane:

- notatki klienta sa zapisywane jako client_note,
- stare typy notatek klienta pozostaja obslugiwane,
- activities API i frontendowy helper obsluguja clientId,
- notatki klienta moga byc usuwane przez deleteActivityFromSupabase,
- modal wydarzenia ma czytelny styl zapisu,
- nowy lead po dodaniu nie dziedziczy clientId / linkedCaseId i resetuje filtry listy.

## Nie ruszano

- finansow,
- visual systemu jako migracji,
- routingu,
- migracji bazy,
- starych typow activity.

## Check

- npm run check:a1-client-note-event-lead-visibility-finalizer
- npm run check:polish-mojibake
- npm run build

## Manualny smoke test po wdrozeniu

1. Wejdz w klienta.
2. Dodaj notatke przez akcje kontekstowa / dyktowanie.
3. Sprawdz, czy widac ja w historii jak zwykla notatke.
4. Usun notatke i sprawdz, ze nie ma ReferenceError.
5. Z klienta dodaj wydarzenie i sprawdz, ze modal ma widoczny tekst oraz przycisk "Zapisz wydarzenie".
6. Wejdz w Leady, ustaw wyszukiwanie lub filtr, dodaj nowego leada.
7. Po zapisie lista ma pokazac nowego leada bez recznego czyszczenia filtra.
`;
  write(docRel, doc);

  const pkgPath = path.join(repo, files.packageJson);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:a1-client-note-event-lead-visibility-finalizer'] = 'node scripts/check-closeflow-a1-client-note-event-lead-visibility-finalizer.cjs';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

console.log('CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER_REPAIR_OK');
