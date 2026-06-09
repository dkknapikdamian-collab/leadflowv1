const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function readBuffer(rel) { return fs.readFileSync(path.join(root, rel)); }
function must(label, condition) { if (!condition) throw new Error(label); }

const files = [
  '_project/07_NEXT_STEPS.md',
  '_project/runs/2026-06-09_1845_stage240r2_ai_opportunity_finder_roadmap.md',
  '_project/runs/2026-06-09_1915_stage240r4_restore_growth_block_and_push.md',
  '_project/runs/2026-06-09_1930_stage240r5_scoped_diffcheck_ai_opportunity_finder.md',
  '_project/obsidian_updates/2026-06-09_1845_stage240r2_ai_opportunity_finder_roadmap.md',
  '_project/obsidian_updates/2026-06-09_1915_stage240r4_restore_growth_block_and_push.md',
  '_project/obsidian_updates/2026-06-09_1930_stage240r5_scoped_diffcheck_ai_opportunity_finder.md',
  'scripts/check-stage240r2-ai-opportunity-finder-roadmap.cjs',
  'tests/stage240r2-ai-opportunity-finder-roadmap.test.cjs'
];

for (const rel of files) {
  const buf = readBuffer(rel);
  must('No UTF-8 BOM in ' + rel, !(buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf));
}

const next = read('_project/07_NEXT_STEPS.md');

const heading = '## 2026-06-09 16:00 Europe/Warsaw — LeadFlow AI Opportunity Finder';
const stage230End = '<!-- STAGE230_AI_DRAFT_INBOX_ROADMAP_END -->';
const stage230Start = '<!-- STAGE230_AI_DRAFT_INBOX_ROADMAP_START -->';

must('Stage230 start marker exists', next.includes(stage230Start));
must('Stage230 end marker exists', next.includes(stage230End));
must('AI Opportunity Finder heading exists', next.includes(heading));
must('AI Opportunity Finder is inside active Stage230 roadmap block', next.indexOf(heading) > next.indexOf(stage230Start) && next.indexOf(heading) < next.indexOf(stage230End));
must('Status is direction to accept', next.includes('Status: KIERUNEK_ROZWOJU_DO_AKCEPTACJI'));
must('Priority is high', next.includes('Priorytet: WYSOKI'));
must('Does not block current production stages', next.includes('Nie blokuje aktualnych etapów produkcyjnych.'));
must('Not generic company database', next.includes('Nie budujemy zwykłej bazy firm'));
must('Problem-signal-contact reason principle exists', next.includes('Tak: znajdź firmy z problemem.'));
must('Not a separate app', next.includes('AI Opportunity Finder ma być modułem LeadFlow / CloseFlow, nie osobną aplikacją.'));
must('Contains target workflow', next.includes('system zapisuje leady do LeadFlow') && next.includes('system ustawia follow-up'));
must('Contains boundaries against Apollo clone', next.includes('kopii Apollo/Clay/Lusha') && next.includes('generycznej bazy firm'));
must('Contains later stage markers', next.includes('STAGE240A_SMART_SEARCH_INPUT_AND_MANUAL_IMPORT') && next.includes('STAGE240E_MONTHLY_OPPORTUNITY_MONITORING'));
must('Old growth backlog is still present for Stage230A guard compatibility', next.includes('STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER') && next.includes('rozwijać to jako moduł w CloseFlow / LeadFlow'));

const stage230Block = next.slice(next.indexOf(stage230Start), next.indexOf(stage230End) + stage230End.length);
must('No trailing whitespace in Stage230 block', !/[ \t]+$/m.test(stage230Block));

console.log('STAGE240R2_AI_OPPORTUNITY_FINDER_ROADMAP PASS');
