const fs = require('fs');
function read(p){ return fs.readFileSync(p,'utf8'); }
function fail(msg){ console.error(`STAGE231H_R1D2_R12G FAIL: ${msg}`); process.exit(1); }
function count(h,n){ return (h.match(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length; }

const qa = read('src/components/CaseQuickActions.tsx');
if (count(qa, "'data-context-case-id': caseId || ''") < 4) fail('CaseQuickActions must carry explicit data-context-case-id for all four case quick actions');
if (!qa.includes('STAGE231H_R1D2_R12G_CASE_QUICK_ACTIONS_EXPLICIT_CASE_SCOPE')) fail('missing R12G CaseQuickActions marker');

const note = read('src/components/ContextNoteDialog.tsx');
const createdIdx = note.indexOf('const createdNote = await insertActivityToSupabase(input);');
const savedIdx = note.indexOf('await onSaved?.(savedRecord);', createdIdx);
const closeIdx = note.indexOf('onOpenChange(false);', createdIdx);
if (createdIdx === -1 || savedIdx === -1 || closeIdx === -1 || savedIdx > closeIdx) fail('ContextNoteDialog must call onSaved(savedRecord) before closing dialog');
if (!note.includes('savedRecord,') || !note.includes('activity: savedRecord')) fail('ContextNoteDialog event must carry savedRecord and activity');
if (!note.includes('onSaved?: (savedRecord?: unknown)')) fail('ContextNoteDialog onSaved type must accept savedRecord');

const caseDetail = read('src/pages/CaseDetail.tsx');
for (const needle of ['closeflow:context-note-saved','savedRecord','setActivities','setPendingNoteFollowUp','STAGE231H_R1D2_R12G_CASE_DETAIL_QUICK_NOTE_LOCAL_APPEND']) {
  if (!caseDetail.includes(needle)) fail(`CaseDetail missing ${needle}`);
}

const client = read('src/pages/ClientDetail.tsx');
if (!client.includes('STAGE231H_R1D2_R12G_CLIENT_RIGHT_RAIL_ACTION_DEDUPE')) fail('ClientDetail missing R12G right rail dedupe marker');
if (!client.includes('function getClientRightRailActionDedupeKeyStage231H_R1D2_R12G')) fail('ClientDetail missing R12G right rail dedupe helper');
if (!client.includes('.filter((entry, index, array) => array.findIndex((candidate) => getClientRightRailActionDedupeKeyStage231H_R1D2_R12G(candidate)')) fail('ClientDetail nearest actions list must dedupe after task/event merge');

console.log('STAGE231H_R1D2_R12G PASS: quick note case scope, savedRecord handoff, CaseDetail local append/prompt and ClientDetail nearest-action dedupe are guarded.');

