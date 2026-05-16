const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function must(rel, pattern, label) {
  const source = read(rel);
  if (!pattern.test(source)) throw new Error(`Brak markera ${label} w ${rel}`);
}
function mustNot(rel, pattern, label) {
  const source = read(rel);
  if (pattern.test(source)) throw new Error(`Wykryto ${label} w ${rel}`);
}
must('src/pages/Today.tsx', /TODAY_TOP_TILES_DIRECT_ANCHORS_STAGE01|TODAY_TOP_TILES_CLICK_FIX_V109|data-today-pipeline-shortcut="urgent"/, 'Stage01 Today tiles');
must('src/server/assistant-context.ts', /AI_OPERATOR_SNAPSHOT_STAGE02|operatorSnapshot|searchIndex/, 'Stage02 AI snapshot');
must('src/pages/AiDrafts.tsx', /AI_DRAFT_APPROVAL_TO_FINAL_RECORD_STAGE03|Przejrzyj i zatwierd\u017A/, 'Stage03 draft approval');
mustNot('src/pages/AiDrafts.tsx', /insertLeadToSupabase/, 'bezpo\u015Bredni insert leada w inboxie szkic\u00F3w');
must('src/pages/Today.tsx', /TODAY_AI_DRAFTS_STAGE04|data-today-ai-drafts-shortcut="true"/, 'Stage04 drafts in Today');
must('src/server/_digest.ts', /DAILY_DIGEST_AI_DRAFTS_STAGE05|pendingAiDrafts|aiDraftCount/, 'Stage05 digest drafts');
must('src/lib/ai-assistant.ts', /AI_OPERATOR_QUALITY_STAGE06_TYPES|operatorSnapshot\?: Record<string, unknown>/, 'Stage06 AI type guard');
must('src/components/TodayAiAssistant.tsx', /AI_OPERATOR_QUALITY_STAGE06_COST_GUARD|shouldRegisterAiUsage/, 'Stage06 usage guard');
for (const rel of ['src/pages/Today.tsx','src/pages/AiDrafts.tsx','src/lib/ai-assistant.ts','src/server/_digest.ts']) {
  mustNot(rel, /\u00c4|\u0139|\u00c5|\u00c3/, 'mojibake');
}
console.log('OK: CloseFlow cumulative next stages guard passed.');
