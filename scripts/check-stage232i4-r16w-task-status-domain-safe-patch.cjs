const fs = require('fs');

const supabase = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const errors = [];
function requireContains(label, needle, text = supabase) { if (!text.includes(needle)) errors.push({ type: 'missing', label, needle }); }
function forbidContains(label, needle, text = supabase) { if (text.includes(needle)) errors.push({ type: 'forbidden', label, needle }); }

requireContains('R16W marker', 'STAGE232I4_R16W_TASK_STATUS_DOMAIN_SAFE_PATCH');
requireContains('status sanitizer helper', 'normalizeWorkItemTaskStatusForDomainStage232I4R16W');
requireContains('invalid work_items status is deleted before PATCH', 'delete taskPatch.status');
requireContains('PATCH still uses consolidated tasks route', "/api/system?apiRoute=tasks");
requireContains('allowed todo status exists', "'todo'");
requireContains('allowed in_progress status exists', "'in_progress'");
requireContains('allowed done status exists', "'done'");
forbidContains('raw input is no longer stringified directly for task PATCH', 'body: JSON.stringify({ ...input, id: taskId })');
forbidContains('missing_item must never be an allowed work_items status', "'missing_item'");
requireContains('approved compact blocker label stays visible', 'Blokuje', manager);
forbidContains('Klient badge must not return in manager', '>Klient<', manager);
forbidContains('red Blokuje badge must not return in manager', 'data-stage232i4-r16s-r2-source-badges', manager);
forbidContains('horizontal overflow must stay blocked', 'overflow-x-auto', manager);

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16W_TASK_STATUS_DOMAIN_SAFE_PATCH', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE232I4_R16W_TASK_STATUS_DOMAIN_SAFE_PATCH', contract: 'Task PATCH sanitizes work_items.status so missing_item cannot violate work_items_status_domain_check; approved compact checkbox layout is preserved.' }, null, 2));
