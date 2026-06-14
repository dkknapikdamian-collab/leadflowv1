const fs = require('fs');
function fail(message) {
  console.error('STAGE231H_R1D2_R10C FAIL: ' + message);
  process.exit(1);
}
function read(path) {
  return fs.readFileSync(path, 'utf8');
}
const caseText = read('src/pages/CaseDetail.tsx');
const noteText = read('src/components/ContextNoteDialog.tsx');
const stage = 'STAGE231H_R1D2_R10C_CASE_DETAIL_ACTION_MAP_FOLLOWUP_NOTES_FINANCE_LOADING';
if (!caseText.includes(stage)) fail('missing CaseDetail stage marker');
if (caseText.includes("const title = 'Follow-up: ' + getCaseTitle(caseData)")) fail('old case-title follow-up label remains');
if (!caseText.includes("const title = 'Follow-up po notatce'")) fail('note follow-up title missing');
if (!caseText.includes('notePreviewStage231H_R1D2_R10C')) fail('note preview source missing');
if (!caseText.includes("'Notatka · follow-up przypięty do sprawy'")) fail('note follow-up subtitle missing');
if (!caseText.includes("'note-follow-up'")) fail('semantic note follow-up dedupe missing');
if (!caseText.includes('data-stage231h-r1d2-r10c-note-kind-label="true"')) fail('note row kind label missing');
const loadingStart = caseText.indexOf('case-detail-loading-card');
const loadingEnd = caseText.indexOf('if (loadError || !caseData)', loadingStart);
const loadingSegment = loadingStart >= 0 && loadingEnd > loadingStart ? caseText.slice(loadingStart, loadingEnd) : '';
if (!loadingSegment) fail('loading segment not found');
if (loadingSegment.includes('CaseSettlementSection') || loadingSegment.includes('data-fin5-case-settlement-instance="true"')) fail('finance panel still rendered in loading state');
if (!noteText.includes('const createdNote = await insertActivityToSupabase(input);')) fail('ContextNoteDialog does not capture created note');
if (!noteText.includes('savedRecord: createdNote || input')) fail('ContextNoteDialog does not emit saved note record');
if (!noteText.includes('await onSaved?.(createdNote || input);')) fail('ContextNoteDialog does not pass saved note to host');
if (!caseText.includes("kind === 'task' || kind === 'event' || kind === 'note'")) fail('CaseDetail saved event listener does not handle note');
if (!caseText.includes('setActivities((current) => sortActivities([normalizedNote, ...current]))')) fail('CaseDetail does not append saved note locally');
for (const file of [
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/13_TEST_HISTORY.md',
]) {
  if (!read(file).includes(stage)) fail('missing docs marker in ' + file);
}
console.log('STAGE231H_R1D2_R10C PASS: CaseDetail action map, note follow-up display, quick note append and loading state are guarded.');
