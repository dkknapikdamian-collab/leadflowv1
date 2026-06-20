const fs = require('fs');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const stage = 'STAGE232I4_R16Y_R2_MISSING_BLOCKER_SOURCE_TRUTH_ROBUST_FINAL';
const errors = [];
function req(label, ok) { if (!ok) errors.push({ type: 'required', label }); }
function forbid(label, ok) { if (ok) errors.push({ type: 'forbidden', label }); }
req('ClientDetail has R16Y_R2 marker', client.includes(stage));
req('blocking helper treats priority high as blocker source truth', /function\s+isStage232I2BlockingMissingItem[\s\S]*priority\s*===\s*['"]high['"]/.test(client));
req('new missing item priority follows blocker checkbox', client.includes("priority: clientMissingBlocksProgress ? 'high' : 'medium'"));
req('toggle persists legal priority high/medium', client.includes("const nextPriorityStage232I4R16X = blocksProgress ? 'high' : 'medium';"));
const toggleStart = client.indexOf('const handleToggleClientMissingBlockerStage232I4R13F = useCallback');
const toggleEnd = client.indexOf('  const handleResolveClientMissingItemStage228R13', toggleStart);
const toggleBlock = toggleStart >= 0 && toggleEnd > toggleStart ? client.slice(toggleStart, toggleEnd) : '';
const patchStart = toggleBlock.indexOf('await updateTaskInSupabase({');
const patchEnd = toggleBlock.indexOf('} as any);', patchStart);
const updatePayload = patchStart >= 0 && patchEnd > patchStart ? toggleBlock.slice(patchStart, patchEnd) : '';
req('guard can isolate toggle updateTaskInSupabase payload', Boolean(updatePayload));
req('toggle DB PATCH uses priority field', /priority\s*:\s*nextPriorityStage232I4R16X/.test(updatePayload));
forbid('toggle DB PATCH sends missing_item/blocking_missing_item as work_items.status', /\n\s*status\s*:\s*nextMissingStateStage232I4R16X\s*,/.test(updatePayload) || /status\s*:\s*['"](?:missing_item|blocking_missing_item)['"]/.test(updatePayload));
req('manager keeps visible Blokuje label', manager.includes('data-stage232i4-r16v-manager-blocker-text="true"') && manager.includes('>Blokuje<'));
req('manager keeps Uzupełnij action', manager.includes('Uzupełnij'));
req('manager keeps Usuń action', manager.includes('Usuń'));
req('manager delete has R16Y_R2 visibility marker', manager.includes('data-stage232i4-r16y-r2-manager-delete-visible="true"'));
req('manager width widened to avoid delete clipping', manager.includes('!w-[620px]') && manager.includes('sm:!max-w-[620px]'));
forbid('badges Klient/Blokuje source chips returned', manager.includes('data-stage232i4-r16t-badge-cleanup="badge-title-actions"'));
forbid('horizontal scroll returned', /overflow-x-auto|overflow-x-scroll/.test(manager));
if (errors.length) { console.error(JSON.stringify({ ok: false, stage, errors }, null, 2)); process.exit(1); }
console.log(JSON.stringify({ ok: true, stage, contract: 'Client missing blocker source truth reads priority high/medium; compact manager stays accepted and delete action remains visible.' }, null, 2));
