const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function must(label, condition) { if (!condition) throw new Error(label); }

const next = read('_project/07_NEXT_STEPS.md');
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
].forEach((marker) => must('Roadmap contains ' + marker, next.includes(marker)));

must('Roadmap defines app-scoped AI boundary', next.includes('AI nie ma sprawdza') && next.includes('granicach aplikacji'));
must('Roadmap requires raw draft first', next.includes('Najpierw zawsze zapisujemy surowy szkic'));
must('Roadmap requires approval before mutation', next.includes('Uzytkownik zatwierdza przed wykonaniem') || next.includes('UĹĽytkownik zatwierdza przed wykonaniem'));
must('Roadmap includes phone dictation duplicate-words audit', next.includes('Phone dictation duplicate-words audit') && next.includes('duplikowania slow') || next.includes('duplikowania sĹ‚Ăłw'));
must('Roadmap includes provider inventory candidates', next.includes('Google AI Studio') && next.includes('Cloudflare AI'));
must('Roadmap includes no client AI key rule', next.includes('brak kluczy AI w kliencie'));

must('Extra backlog marker exists', next.includes('STAGE230A3_EXTRA_BACKLOG_START'));
must('Extra backlog includes documents for leads', next.includes('STAGE231A_DOCUMENTS_FOR_LEADS') && next.includes('dokumenty / zalaczniki do leadow'));
must('Extra backlog includes costs', next.includes('STAGE231B_COSTS_AND_FINANCIAL_ITEMS') && next.includes('koszty / pozycje kosztowe'));
must('Extra backlog includes simplified task/event editing', next.includes('STAGE231C_SIMPLIFY_TASK_EVENT_EDITING') && next.includes('uproscic edycje wydarzen i zadan'));
must('Extra backlog includes production start screen', next.includes('STAGE231D_START_SCREEN_PRODUCTION_READINESS') && next.includes('ekran startowy przed wejsciem produkcyjnym'));
must('Extra backlog includes Smart Prospecting as module not separate app', next.includes('STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER') && next.includes('nie budowac osobnej aplikacji') && next.includes('modul w CloseFlow / LeadFlow'));
must('Smart Prospecting is after CRM stabilization', next.includes('CRM ma najpierw dzialac dobrze') && next.includes('DO_POTWIERDZENIA po ustabilizowaniu CRM'));

must('Existing AiDrafts page supports draft filters', aiDrafts.includes('AI_DRAFT_FILTERS') && aiDrafts.includes("{ key: 'draft'") && aiDrafts.includes("{ key: 'errors'"));
must('Existing AiDrafts page supports lead/task/event/note approval types', aiDrafts.includes("value: 'lead'") && aiDrafts.includes("value: 'task'") && aiDrafts.includes("value: 'event'") && aiDrafts.includes("value: 'note'"));
must('Existing ai-drafts lib uses Supabase source marker', aiDraftLib.includes('AI_DRAFTS_SUPABASE_SOURCE_OF_TRUTH_STAGE11'));
must('Existing ai-drafts lib treats production local storage as fallback only', aiDraftLib.includes('canUseDevLocalDraftFallback') && aiDraftLib.includes('clearProductionLocalDrafts'));
must('Existing approval parser remains fallback only for lead/task/event/note', approval.includes('detectAiDraftApprovalType') && approval.includes('parsePolishDateHint'));

console.log('STAGE230A_AI_DRAFT_INBOX_VOICE_CAPTURE_ROADMAP PASS');
