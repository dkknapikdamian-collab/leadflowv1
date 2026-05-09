#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
function read(file){ return fs.readFileSync(file, 'utf8'); }
function fail(message){ console.error('CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER_FAIL: ' + message); process.exit(1); }
function has(text, needle, message){ if(!text.includes(needle)) fail(message + ': ' + needle); }
const supabase = read('src/lib/supabase-fallback.ts');
const api = read('api/activities.ts');
const client = read('src/pages/ClientDetail.tsx');
const note = read('src/components/ContextNoteDialog.tsx');
const leads = read('src/pages/Leads.tsx');

has(supabase, 'type ActivityInput', 'ActivityInput missing');
has(supabase, 'clientId?: string | null', 'ActivityInput clientId missing');
has(supabase, 'fetchActivitiesFromSupabase(params?:', 'fetchActivitiesFromSupabase missing');
has(supabase, 'clientId?: string', 'fetchActivities clientId param missing');
has(supabase, "query.set('clientId'", 'fetchActivities clientId query missing');
has(supabase, 'export async function deleteActivityFromSupabase', 'deleteActivityFromSupabase missing');
has(supabase, "method: 'DELETE'", 'deleteActivityFromSupabase DELETE method missing');

has(api, 'const clientId = asText(req.query?.clientId || body.clientId);', 'api clientId read missing');
has(api, 'client_id=eq.', 'api GET client_id filter missing');
has(api, 'client_id: clientId || null', 'api POST client_id missing');
has(api, 'if (body.clientId !== undefined) patch.client_id', 'api PATCH client_id missing');
has(api, "if (req.method === 'DELETE')", 'api DELETE branch missing');
has(api, "PORTAL_ACTIVITY_DELETE_FORBIDDEN", 'api portal delete guard missing');

has(note, "if (context?.recordType === 'client') return 'client_note';", 'ContextNoteDialog client_note mapping missing');

has(client, 'deleteActivityFromSupabase', 'ClientDetail delete helper import/use missing');
has(client, 'fetchActivitiesFromSupabase({ clientId:', 'ClientDetail clientId activity fetch missing');
has(client, 'CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER', 'ClientDetail note type finalizer set missing');
for (const eventType of ['client_note', 'client_note_added', 'client_note_dictated', 'dictated_note', 'note_added']) {
  has(client, eventType, 'ClientDetail legacy note event type missing');
}
has(client, 'normalizeClientActivitiesForA1', 'ClientDetail client note normalizer missing');

has(leads, 'A1_LEAD_CREATE_VISIBILITY_FINALIZER', 'Leads visibility finalizer marker missing');
has(leads, "setSearchQuery('')", 'Leads search clear missing');
has(leads, "setQuickFilter('all')", 'Leads quick filter reset missing');
has(leads, 'delete sanitizedPreparedLead.clientId', 'Leads stale clientId strip missing');
has(leads, 'delete sanitizedPreparedLead.linkedCaseId', 'Leads stale linkedCaseId strip missing');

console.log('CLOSEFLOW_A1_CLIENT_NOTE_EVENT_LEAD_VISIBILITY_FINALIZER_CHECK_OK');
