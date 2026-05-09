#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = path.resolve(process.argv[2] || process.cwd());
process.chdir(repo);

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function fail(message) {
  console.error('CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER_FAIL: ' + message);
  process.exit(1);
}
function assert(condition, message) {
  if (!condition) fail(message);
}
function includes(rel, text) {
  assert(read(rel).includes(text), `${rel} missing: ${text}`);
}

includes('src/lib/supabase-fallback.ts', 'clientId?: string | null');
includes('src/lib/supabase-fallback.ts', 'params?.clientId');
includes('src/lib/supabase-fallback.ts', "query.set('clientId', params.clientId)");
includes('src/lib/supabase-fallback.ts', 'deleteActivityFromSupabase');

includes('api/activities.ts', 'const clientId = asText(req.query?.clientId || body.clientId);');
includes('api/activities.ts', 'client_id=eq.${encodeURIComponent(clientId)}');
includes('api/activities.ts', 'client_id: clientId || null');
includes('api/activities.ts', 'patch.client_id = asText(body.clientId) || null');

includes('src/components/ContextNoteDialog.tsx', "if (context?.recordType === 'client') return 'client_note';");

for (const marker of [
  'CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER',
  "'client_note'",
  "'client_note_added'",
  "'client_note_dictated'",
  "'dictated_note'",
  "'note_added'",
  'isClientNoteActivityA1',
  'deleteActivityFromSupabase',
]) {
  includes('src/pages/ClientDetail.tsx', marker);
}

includes('src/components/EventCreateDialog.tsx', 'data-a1-event-modal-readable-finalizer="true"');
includes('src/index.css', "closeflow-a1-client-note-event-lead-visibility-finalizer.css");
includes('src/styles/closeflow-a1-client-note-event-lead-visibility-finalizer.css', 'CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER');

includes('src/pages/Leads.tsx', 'sanitizeNewLeadCreatePayloadA1');
includes('src/pages/Leads.tsx', "setSearchQuery('')");
includes('src/pages/Leads.tsx', "setQuickFilter('all')");
includes('src/pages/Leads.tsx', 'delete payload.clientId');
includes('src/pages/Leads.tsx', 'delete payload.linkedCaseId');

includes('api/leads.ts', 'sanitizeFreshLeadCreatePayloadA1');
includes('api/leads.ts', 'delete next.client_id');
includes('api/leads.ts', 'delete next.linked_case_id');

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:a1-client-note-event-lead-visibility-finalizer'], 'package.json missing check script');

console.log('CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER_CHECK_OK');
