const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function readBuffer(rel) { return fs.readFileSync(path.join(root, rel)); }
function must(label, condition) { if (!condition) throw new Error(label); }

function extractBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker);
  must('Marker exists: ' + startMarker, start >= 0);
  must('Marker exists: ' + endMarker, end >= 0 && end > start);
  return text.slice(start, end + endMarker.length);
}

function assertCleanUtf8Text(label, text) {
  must('No replacement char in ' + label, !text.includes('\ufffd'));
  must('No common mojibake markers in ' + label, !/[\u0102\u0139\u00c2\u00c3\u00c4]/u.test(text));
}

function assertNoBom(rel) {
  const buf = readBuffer(rel);
  must('No UTF-8 BOM in ' + rel, !(buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf));
}

const checkedFullFiles = [
  '_project/runs/2026-06-09_1645_stage230a_ai_draft_inbox_voice_capture_roadmap.md',
  '_project/runs/2026-06-09_1730_stage230a4_ascii_backlog_repair_and_push.md',
  '_project/runs/2026-06-09_1800_stage230a5_utf8_clean_roadmap_repair.md',
  '_project/obsidian_updates/2026-06-09_1645_stage230a_ai_draft_inbox_voice_capture_roadmap.md',
  '_project/obsidian_updates/2026-06-09_1730_stage230a4_ascii_backlog_repair_and_push.md',
  '_project/obsidian_updates/2026-06-09_1800_stage230a5_utf8_clean_roadmap_repair.md',
  'scripts/check-stage230a-ai-draft-inbox-roadmap.cjs',
  'tests/stage230a-ai-draft-inbox-roadmap.test.cjs'
];

for (const rel of checkedFullFiles) {
  assertNoBom(rel);
  assertCleanUtf8Text(rel, read(rel));
}

assertNoBom('_project/07_NEXT_STEPS.md');
const next = read('_project/07_NEXT_STEPS.md');
const stage230Block = extractBetween(next, '<!-- STAGE230_AI_DRAFT_INBOX_ROADMAP_START -->', '<!-- STAGE230_AI_DRAFT_INBOX_ROADMAP_END -->');
assertCleanUtf8Text('Stage230 block in _project/07_NEXT_STEPS.md', stage230Block);

const aiDrafts = read('src/pages/AiDrafts.tsx');
const aiDraftLib = read('src/lib/ai-drafts.ts');
const approval = read('src/lib/ai-draft-approval.ts');

const start = next.indexOf('STAGE230_AI_DRAFT_INBOX_ROADMAP_START');
const oldStage = next.indexOf('## Current next step after 2026-05-16 memory closeout');

must('Stage230 roadmap marker exists', start >= 0);
must('Stage230 roadmap is before old next steps', oldStage < 0 || start < oldStage);

[
  'STAGE230A',
  'STAGE230B',
  'STAGE230C',
  'STAGE230D',
  'STAGE230E',
  'STAGE230F',
  'STAGE230G',
  'STAGE230H'
].forEach((marker) => must('Roadmap contains ' + marker, stage230Block.includes(marker)));

must('Roadmap contains clean Polish title', stage230Block.includes('Inbox szkiców'));
must('Roadmap contains clean Polish approval rule', stage230Block.includes('Użytkownik zatwierdza przed wykonaniem'));
must('Roadmap contains clean Polish duplicate words phrase', stage230Block.includes('duplikowania słów'));
must('Roadmap defines app-scoped AI boundary', stage230Block.includes('AI nie ma sprawdzać pogody') && stage230Block.includes('granicach aplikacji'));
must('Roadmap requires raw draft first', stage230Block.includes('Najpierw zawsze zapisujemy surowy szkic'));
must('Roadmap includes provider inventory candidates', stage230Block.includes('Google AI Studio') && stage230Block.includes('Cloudflare AI'));
must('Roadmap includes no client AI key rule', stage230Block.includes('brak kluczy AI w kliencie'));

must('Extra backlog includes documents for leads', stage230Block.includes('STAGE231A_DOCUMENTS_FOR_LEADS') && stage230Block.includes('dokumenty/załączniki do leadów'));
must('Extra backlog includes costs', stage230Block.includes('STAGE231B_COSTS_AND_FINANCIAL_ITEMS') && stage230Block.includes('koszty/pozycje kosztowe'));
must('Extra backlog includes simplified task/event editing', stage230Block.includes('STAGE231C_SIMPLIFY_TASK_EVENT_EDITING') && stage230Block.includes('uprościć edycję wydarzeń i zadań'));
must('Extra backlog includes production start screen', stage230Block.includes('STAGE231D_START_SCREEN_PRODUCTION_READINESS') && stage230Block.includes('ekran startowy przed wejściem produkcyjnym'));
must('Extra backlog includes Smart Prospecting as module not separate app', stage230Block.includes('STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER') && stage230Block.includes('nie budować osobnej aplikacji') && stage230Block.includes('moduł w CloseFlow / LeadFlow'));
must('Smart Prospecting is after CRM stabilization', stage230Block.includes('CRM ma najpierw działać dobrze') && stage230Block.includes('DO_POTWIERDZENIA po ustabilizowaniu CRM'));

must('Existing AiDrafts page supports draft filters', aiDrafts.includes('AI_DRAFT_FILTERS') && aiDrafts.includes("{ key: 'draft'") && aiDrafts.includes("{ key: 'errors'"));
must('Existing AiDrafts page supports lead/task/event/note approval types', aiDrafts.includes("value: 'lead'") && aiDrafts.includes("value: 'task'") && aiDrafts.includes("value: 'event'") && aiDrafts.includes("value: 'note'"));
must('Existing ai-drafts lib uses Supabase source marker', aiDraftLib.includes('AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11'));
must('Existing ai-drafts lib treats production local storage as fallback only', aiDraftLib.includes('canUseDevLocalDraftFallback') && aiDraftLib.includes('clearProductionLocalDrafts'));
must('Existing approval parser remains fallback only for lead/task/event/note', approval.includes('detectAiDraftApprovalType') && approval.includes('parsePolishDateHint'));

console.log('STAGE230A_AI_DRAFT_INBOX_VOICE_CAPTURE_ROADMAP PASS');
