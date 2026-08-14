#!/usr/bin/env node
/* CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_CURRENT_SOT */
/*
 * This compatibility entry point intentionally delegates to the current
 * loading-reference guard. The orphan CaseDetailLoadingState helper was
 * removed by A2-07; keeping a second helper-based contract here would create
 * a stale, contradictory source of truth for the same release gate.
 */
const cp = require('node:child_process');
const path = require('node:path');

const guardPath = path.join(__dirname, 'check-closeflow-case-detail-loading-reference.cjs');
const result = cp.spawnSync(process.execPath, [guardPath], { stdio: 'inherit' });

if (result.error) {
  console.error(`CaseDetail loading guard could not start: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('✔ CaseDetail no-partial-loading compatibility guard uses the current loading source of truth');
