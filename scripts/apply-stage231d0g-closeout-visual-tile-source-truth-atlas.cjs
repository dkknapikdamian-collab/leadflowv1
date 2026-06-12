#!/usr/bin/env node
const fs = require('fs');

const STAGE_MARKER = 'STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12';

function read(path, optional = false) {
  if (!fs.existsSync(path)) {
    if (optional) return '';
    throw new Error(`Missing file: ${path}`);
  }
  return fs.readFileSync(path, 'utf8');
}

function write(path, text) {
  fs.writeFileSync(path, text.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n*$/u, '\n'), 'utf8');
}

function appendOnce(path, block) {
  const text = read(path, true);
  const start = `<!-- ${STAGE_MARKER}_START -->`;
  if (text.includes(start)) return;
  write(path, `${text.trimEnd()}\n\n${block.trimEnd()}\n`);
}

function replaceRunStatus() {
  const path = '_project/runs/2026-06-12_STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS.md';
  let text = read(path);

  text = text.replace(/Status:\s*\nREADY_TO_APPLY/g, 'Status:\nPASS / CLOSED');

  const block = `<!-- ${STAGE_MARKER}_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT

Status:
PASS / CLOSED

## Test results

- \`node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs\`: PASS
- \`node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs\`: PASS
- \`node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs\`: PASS
- \`node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs\`: PASS
- \`npm run build\`: PASS
- \`git diff --check\`: PASS, only LF/CRLF warnings allowed

## Final decision

D0G is closed as documentation/source-truth stage.

Closed artifacts:
- \`_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md\`
- \`_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md\`
- \`_project/UI_DICTIONARY_STAGE231D0A.md\`
- \`scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs\`
- \`tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs\`

No runtime UI migration was performed in this closeout.

## Next step

\`STAGE231D0H-1 — Leads + Clients metric tiles and filters to CloseFlowMetricTileV2\`

## Risk audit

- UI Dictionary still contains historical duplicate/mojibake entries. Active D0G block is valid. Full dictionary cleanup should be a separate hygiene stage.
- Working tree may still contain old local artifacts. Push must remain selective.
<!-- ${STAGE_MARKER}_END -->`;

  if (!text.includes(`<!-- ${STAGE_MARKER}_START -->`)) {
    text = `${text.trimEnd()}\n\n${block}\n`;
  }

  write(path, text);
}

const commonBlock = `<!-- ${STAGE_MARKER}_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT Visual Tile Source Truth Atlas

STATUS: PASS / CLOSED

FAKTY:
- D0G source truth and atlas were already committed and pushed.
- Closeout reran D0G guard/test and R13 regression guard/test.
- Build passed.
- \`git diff --check\` passed with non-blocking LF/CRLF warnings only.
- Runtime UI was not changed.

TESTY:
- \`node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs\`: PASS
- \`node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs\`: PASS
- \`node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs\`: PASS
- \`node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs\`: PASS
- \`npm run build\`: PASS
- \`git diff --check\`: PASS

DECYZJA:
D0G is closed. Next implementation stage is D0H-1: Leads + Clients metric tiles and filters to CloseFlowMetricTileV2.

RYZYKA:
- Historical UI Dictionary duplicate/mojibake entries remain outside active D0G block.
- Old local artifacts must not be included in push.
<!-- ${STAGE_MARKER}_END -->`;

const nextStepsBlock = `<!-- ${STAGE_MARKER}_START -->
## 2026-06-12 — Next after STAGE231D0G-CLOSEOUT

STATUS: D0G CLOSED

Next stage:
\`STAGE231D0H-1 — Leads + Clients metric tiles and filters to CloseFlowMetricTileV2\`

Scope for D0H-1:
- \`/leads\`
- \`/clients\`
- metric tiles
- shared filter strips
- list/record cards if directly tied to tile visual parity

Do not include in D0H-1:
- SQL
- Supabase schema
- routing
- CaseDetail
- Calendar
- Billing
- Settings
- full UI Dictionary cleanup
<!-- ${STAGE_MARKER}_END -->`;

const changelogBlock = `<!-- ${STAGE_MARKER}_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT

- Closed D0G Visual Tile Source Truth Atlas after guard/test/build verification.
- Updated run report from READY_TO_APPLY to PASS / CLOSED.
- Recorded test results in central project files.
- Confirmed next stage: STAGE231D0H-1 Leads + Clients metric tiles and filters to CloseFlowMetricTileV2.
- No runtime UI, SQL, Supabase, routing, kanban or drag/drop changes.
<!-- ${STAGE_MARKER}_END -->`;

const testHistoryBlock = `<!-- ${STAGE_MARKER}_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT test history

Result:
PASS / CLOSED

Commands:
- \`node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs\` — PASS
- \`node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs\` — PASS
- \`node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs\` — PASS
- \`node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs\` — PASS
- \`npm run build\` — PASS
- \`git diff --check\` — PASS, non-blocking LF/CRLF warnings allowed

Build warning still present:
- \`src/components/ContextActionDialogs.tsx: Duplicate key "savedRecord"\`
- Not part of D0G closeout; should be fixed in a separate small stage.
<!-- ${STAGE_MARKER}_END -->`;

const riskBlock = `<!-- ${STAGE_MARKER}_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT risk audit

Risk audit result:
- D0G can be closed as a documentation/source-truth stage.
- UI Dictionary still has historical duplicate/mojibake entries. Active D0G block is clean enough for next stages.
- Full UI Dictionary cleanup should not be mixed with Leads/Clients migration.
- Working tree has old local artifacts from previous stages; push only selected D0G-CLOSEOUT files.
- Build warning \`Duplicate key "savedRecord"\` remains non-blocking and should be separate.
<!-- ${STAGE_MARKER}_END -->`;

replaceRunStatus();
appendOnce('_project/06_GUARDS_AND_TESTS.md', commonBlock);
appendOnce('_project/07_NEXT_STEPS.md', nextStepsBlock);
appendOnce('_project/08_CHANGELOG_AI.md', changelogBlock);
appendOnce('_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md', riskBlock);
appendOnce('_project/13_TEST_HISTORY.md', testHistoryBlock);

const obsidian = `# 2026-06-12 — STAGE231D0G-CLOSEOUT Visual Tile Source Truth Atlas

## Zapis do Obsidiana

- data i godzina: 2026-06-12 Europe/Warsaw
- nazwa / alias wejściowy: STAGE231D0G-CLOSEOUT — Visual Tile Source Truth Atlas closeout
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: \`10_PROJEKTY/CloseFlow_Lead_App\`
- typ wpisu: closeout etapu dokumentacyjnego / source truth
- status zapisu: PASS / CLOSED payload in repo
- repo: \`dkknapikdamian-collab/leadflowv1\`
- branch: \`dev-rollout-freeze\`
- local path: \`C:\\\\Users\\\\malim\\\\Desktop\\\\biznesy_ai\\\\2.closeflow\`
- testy: D0G guard/test PASS, R13 regression PASS, build PASS, git diff --check PASS
- audyt ryzyk po etapie: UI Dictionary history still dirty; cleanup separate
- czego nie ruszano: runtime UI, SQL, Supabase, routing, kanban, drag/drop
- następny krok: STAGE231D0H-1 — Leads + Clients metric tiles and filters to CloseFlowMetricTileV2
`;
write('_project/obsidian_updates/2026-06-12_STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS.md', obsidian);

console.log('STAGE231D0G-CLOSEOUT project memory patched.');
