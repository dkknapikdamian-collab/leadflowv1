const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function fail(msg) { console.error('CLOSEFLOW_CASE_NOTE_ACTIONS_CHECK_FAIL:', msg); process.exit(1); }
const component = read('src/components/ActivityRoadmap.tsx');
const preview = read('src/components/ActivityItemPreviewDialog.tsx');
const edit = read('src/components/EditActivityNoteDialog.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const lib = read('src/lib/activity-roadmap.ts');
const pkg = JSON.parse(read('package.json'));
if (!exists('src/components/ActivityItemPreviewDialog.tsx')) fail('missing preview dialog');
if (!exists('src/components/EditActivityNoteDialog.tsx')) fail('missing edit dialog');
for (const text of ['Podgląd', 'Edytuj', 'Usuń']) {
  if (!component.includes(text)) fail('missing note action button: ' + text);
}
if (!component.includes("item.kind === 'note'")) fail('note actions must be scoped to kind note');
if (!component.includes('updateActivityInSupabase')) fail('missing activity update call');
if (!component.includes('deleteActivityFromSupabase')) fail('missing activity delete call');
if (!component.includes('insertActivityToSupabase')) fail('missing note_deleted activity log call');
if (!component.includes('setHiddenIds')) fail('delete must hide roadmap item without reload');
if (!preview.includes('Notatka') || !preview.includes('Dodano') || !preview.includes('Powiązanie')) fail('preview dialog missing required copy');
if (!edit.includes('Edytuj notatkę') || !edit.includes('Textarea') || !edit.includes('Zapisz')) fail('edit dialog missing required form');
if (!component.includes('Usunąć notatkę?') || !component.includes('Tej akcji nie da się łatwo cofnąć.')) fail('delete confirmation missing');
if (!fallback.includes('updateActivityInSupabase') || !fallback.includes('deleteActivityFromSupabase')) fail('supabase fallback activity mutations missing');
if (!lib.includes('getRoadmapItemNoteText')) fail('missing note text extractor');
if (pkg.scripts?.['check:closeflow-case-note-actions'] !== 'node scripts/check-closeflow-case-note-actions.cjs') fail('missing package script');
console.log('CLOSEFLOW_CASE_NOTE_ACTIONS_CHECK_OK');
