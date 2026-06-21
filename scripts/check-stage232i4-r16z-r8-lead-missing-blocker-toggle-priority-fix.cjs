const fs = require('fs');

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
}
function section(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = end ? source.indexOf(end, startIndex + start.length) : -1;
  if (startIndex < 0) return '';
  return endIndex > startIndex ? source.slice(startIndex, endIndex) : source.slice(startIndex);
}
const lead = read('src/pages/LeadDetail.tsx');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
const errors = [];
function must(label, condition) { if (!condition) errors.push({ type: 'required', label }); }
function block(label, condition) { if (condition) errors.push({ type: 'forbidden', label }); }

const addHandler = section(lead, 'const handleAddLeadMissingFromManagerStage232I4R14 = async () => {', 'const handleToggleLeadMissingBlockerStage232I4R14 = async');
const toggleHandler = section(lead, 'const handleToggleLeadMissingBlockerStage232I4R14 = async', 'const handleResolveLeadMissingItemStage228R13');

must('stage marker exists', lead.includes('STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX'));
must('lead add handler exists', addHandler.includes('handleAddLeadMissingFromManagerStage232I4R14'));
must('lead toggle handler exists', toggleHandler.includes('handleToggleLeadMissingBlockerStage232I4R14'));
must('lead add writes blocker-dependent priority', addHandler.includes("priority: leadMissingManagerBlocksProgress ? 'high' : 'medium'"));
block('lead add no longer writes unconditional high priority', addHandler.includes("priority: 'high'"));
must('toggle computes blocker-dependent next priority', toggleHandler.includes("const nextPriorityStage232I4R16ZR8 = blocksProgress ? 'high' : 'medium';"));
must('toggle sends priority to updateTaskInSupabase', toggleHandler.includes('priority: nextPriorityStage232I4R16ZR8'));
must('toggle payload stores priority with blocksProgress/status', toggleHandler.includes('priority: nextPriorityStage232I4R16ZR8') && toggleHandler.includes('blocksProgress') && toggleHandler.includes('status: nextStatus'));
must('toggle optimistic linkedTasks updates priority', toggleHandler.includes('priority: nextPriorityStage232I4R16ZR8, blocksProgress'));
must('toggle source marker updated', toggleHandler.includes("stage232i4_r16z_r8_lead_missing_blocker_toggle_priority_fix"));
must('CF runtime allowlist contains R16Z_R8 guard', cfRuntime.includes('check-stage232i4-r16z-r8-lead-missing-blocker-toggle-priority-fix.cjs'));
must('R16Z_R5 close guard allows R16Z_R8 files', closeGuard.includes('STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX_ALLOWLIST'));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX', contract: 'LeadDetail missing manager blocker toggle persists priority high/medium together with status and payload so unchecking Blokuje survives silent reload and F5.' }, null, 2));
