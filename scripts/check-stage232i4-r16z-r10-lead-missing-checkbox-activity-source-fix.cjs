const fs = require('fs');
const { execSync } = require('child_process');

function read(path) { return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : ''; }
function section(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = end ? source.indexOf(end, startIndex + start.length) : -1;
  if (startIndex < 0) return '';
  return endIndex > startIndex ? source.slice(startIndex, endIndex) : source.slice(startIndex);
}
const lead = read('src/pages/LeadDetail.tsx');
const errors = [];
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }
function block(label, condition) { if (condition) errors.push({ type: 'forbidden', label }); }
const builder = section(lead, 'function buildLeadMissingActivityMetadataStage232AR8', 'function readActivityMissingMetadataStage232AR8');
const direct = section(lead, 'function readLeadMissingDirectBlockerOverrideStage232I4R10', 'function isLeadBlockerTaskStage232AR8');
const classifier = section(lead, 'function isLeadBlockerTaskStage232AR8', 'function isWorkItemOverdue');
const toggle = section(lead, 'const handleToggleLeadMissingBlockerStage232I4R14', 'const handleResolveLeadMissingItemStage228R13');

must('R10 marker exists', lead.includes('STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX'));
must('metadata stores happenedAtMs', lead.includes('happenedAtMs: number'));
must('metadata assign helper keeps newest by timestamp', builder.includes('assignMetadataStage232I4R10') && builder.includes('metadata.happenedAtMs >= current.happenedAtMs'));
must('explicit false blocksProgress is not turned true by eventType includes block', builder.includes('explicitBlocksProgress !== undefined && explicitBlocksProgress !== null ? boolStage232AR8(explicitBlocksProgress)'));
must('direct override function exists', direct.includes('readLeadMissingDirectBlockerOverrideStage232I4R10'));
must('direct override reads raw and payload blocksProgress', direct.includes('metadata.raw?.blocksProgress') && direct.includes('metadata.payload?.blocksProgress'));
must('direct override maps missing_item status to false', direct.includes("if (status === 'missing_item') return false"));
must('direct override maps medium priority to false', direct.includes("['medium', 'normal', 'low'].includes(priority)"));
must('classifier reads direct override first', classifier.indexOf('const directOverride = readLeadMissingDirectBlockerOverrideStage232I4R10(item);') >= 0 && classifier.indexOf('if (directOverride !== null) return directOverride;') > classifier.indexOf('const directOverride'));
must('activity fallback remains after direct and AR6', classifier.includes('readActivityMissingMetadataStage232AR8'));
must('toggle writes non-blocking activity state', toggle.includes("await addActivity('missing_item_state_updated'") && toggle.includes('blocksProgress,') && toggle.includes('priority: nextPriorityStage232I4R16ZR8'));
block('toggle must not use event type containing blocker/block for false state activity', toggle.includes("missing_item_blocker_updated"));

const changed = execSync('git status --short', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => line.slice(3));
const allowed = new Set([
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'src/pages/LeadDetail.tsx',
  'scripts/check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs',
  'tests/stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  'scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs',
  'tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  'scripts/check-cf-runtime-00-source-truth.cjs',
  'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/CODEX_CONTEXT_INDEX.md',
]);
for (const path of changed) must('change scope allowed: ' + path, allowed.has(path));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX', contract: 'Lead missing checkbox state uses task/payload direct source before stale activity metadata and writes a neutral missing_item_state_updated activity so unchecking Blokuje survives reload/F5.' }, null, 2));
