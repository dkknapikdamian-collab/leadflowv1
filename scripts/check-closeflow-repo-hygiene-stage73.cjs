const fs = require('fs');
const path = require('path');

const root = process.cwd();
const blockedPaths = [
  '.closeflow-repair-backups',
  'case-detail-tabscontent-diagnostics-2026-05-13.txt',
  'hook-order-risk-report-2026-05-12.json',
  'patches/calendar-selected-day-handlers-v6-block.txt',
  'src/pages/CloseFlowVisualSystemPreview.tsx',
  'src/styles/closeflow-visual-system-source-truth.css',
  'tools/audit-hook-order-risk-local-2026-05-12.cjs',
  'tools/blocks',
  'tools/patch-case-detail-history-real-tab-scope-nozip-2026-05-13.cjs',
  'tools/patch-closeflow-clientdetail-notes-hook-order-fix-2026-05-12.cjs',
  'tools/patch-closeflow-clientdetail-notes-hook-order-fix-repair1-2026-05-12.cjs',
  'tools/patch-closeflow-clientdetail-notes-length-real-fix-repair3-2026-05-12.cjs',
  'tools/patch-closeflow-clientdetail-notes-length-real-fix-repair4-2026-05-12.cjs',
  'tools/patch-closeflow-clientdetail-notes-real-fix-repair2-2026-05-12.cjs',
  'tools/patch-closeflow-clientdetail-null-length-safe-collections-2026-05-12.cjs',
  'tools/patch-closeflow-mobile-hide-top-tiles-source-truth-final-2026-05-12.cjs',
  'tools/patch-fin14-repair3-tasks-header-click-guard.cjs',
  'tools/repair-calendar-selected-day-handlers-runtime-fix-v11-clean.cjs'
];

const blockedPrefixes = [
  'docs/release/CLOSEFLOW_VISUAL_SYSTEM_SOURCE_TRUTH_PREVIEW_',
  'docs/release/CLOSEFLOW_OPERATOR_TOP_TRIM_SOURCE_TRUTH_REPAIR2_',
  'docs/release/CLOSEFLOW_CLIENTDETAIL_NOTES_LENGTH_REAL_FIX_REPAIR4_',
  'docs/release/CLOSEFLOW_FIN14_REPAIR3_TASKS_HEADER_CLICK_GUARD_',
  'docs/release/CLOSEFLOW_CALENDAR_SELECTED_DAY_HANDLERS_RUNTIME_FIX_V11_CLEAN_',
  'scripts/check-closeflow-visual-system-source-truth.cjs',
  'scripts/check-closeflow-operator-top-trim-source-truth-repair2.cjs',
  'scripts/check-closeflow-clientdetail-notes-length-real-fix-repair4.cjs',
  'scripts/check-closeflow-mobile-hide-top-tiles-source-truth-final-2026-05-12.cjs',
  'scripts/check-calendar-selected-day-handlers-runtime-fix-v11-clean.cjs'
];

function fail(message) {
  console.error('CLOSEFLOW_REPO_HYGIENE_STAGE73_FAIL:', message);
  process.exit(1);
}

function existsRel(relPath) {
  return fs.existsSync(path.join(root, ...relPath.split('/')));
}

for (const relPath of blockedPaths) {
  if (existsRel(relPath)) fail(`stale repair artifact is present: ${relPath}`);
}

for (const relPath of blockedPrefixes) {
  if (existsRel(relPath)) fail(`stale repair artifact is present: ${relPath}`);
}

console.log('OK closeflow repo hygiene stage73');
