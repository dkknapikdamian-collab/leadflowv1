const fs = require('fs');
const stage = 'STAGE232I4_R16X_MISSING_BLOCKER_TOGGLE_STATE_AND_ACTION_LABEL';
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const errors = [];
const requireText = (text, needle, label) => { if (!text.includes(needle)) errors.push({ type: 'missing', label, needle }); };
const forbidText = (text, needle, label) => { if (text.includes(needle)) errors.push({ type: 'forbidden', label, needle }); };
requireText(client, 'STAGE232I4_R16X_MISSING_BLOCKER_TOGGLE_STATE_AND_ACTION_LABEL', 'ClientDetail R16X marker');
requireText(client, 'const nextPriorityStage232I4R16X = blocksProgress ? \'high\' : \'medium\';', 'priority maps blocker to legal persisted state');
requireText(client, 'priority: nextPriorityStage232I4R16X', 'toggle PATCH/local state sends priority mapping');
requireText(client, 'status: nextMissingStateStage232I4R16X', 'local state still knows missing/blocking semantic status');
const toggleStart = client.indexOf('const handleToggleClientMissingBlockerStage232I4R13F');
const toggleEnd = client.indexOf('const handleResolveClientMissingItemStage228R13', toggleStart);
if (toggleStart < 0 || toggleEnd < 0) errors.push({ type: 'missing', label: 'toggle handler boundaries' });
else {
  const toggleBlock = client.slice(toggleStart, toggleEnd);
  const updateStart = toggleBlock.indexOf('await updateTaskInSupabase({');
  const updateEnd = toggleBlock.indexOf('} as any);', updateStart);
  if (updateStart < 0 || updateEnd < 0) errors.push({ type: 'missing', label: 'toggle updateTaskInSupabase payload' });
  else {
    const updatePayload = toggleBlock.slice(updateStart, updateEnd);
    if (/\n\s*status\s*:/.test(updatePayload)) errors.push({ type: 'forbidden', label: 'toggle PATCH must not send invalid missing status to work_items.status' });
    if (!/priority\s*:\s*nextPriorityStage232I4R16X/.test(updatePayload)) errors.push({ type: 'missing', label: 'toggle PATCH priority mapping' });
  }
}
requireText(manager, 'STAGE232I4_R16X_MISSING_BLOCKER_TOGGLE_STATE_AND_ACTION_LABEL', 'manager R16X marker');
requireText(manager, 'data-stage232i4-r16x-toggle-state-visual-guard="checkbox-label-delete-action"', 'visual layout guard');
requireText(manager, 'data-stage232i4-r16v-manager-blocker-text="true">Blokuje</span>', 'visible Blokuje label');
requireText(manager, 'data-stage232i4-r14-manager-delete-action="true"', 'delete action is present');
requireText(manager, 'Usuń', 'delete button copy');
requireText(manager, 'Uzupełnij', 'completion action copy');
forbidText(manager, '>Gotowe<', 'old unclear Gotowe copy removed');
forbidText(manager, 'overflow-x-auto', 'horizontal scroll must not return');
forbidText(manager, '>Klient<', 'Klient badge must not return');
if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage, contract: 'Client missing blocker checkbox persists via legal priority mapping, does not send invalid missing status, keeps compact UI, visible Blokuje label, delete action and clearer completion label.' }, null, 2));
