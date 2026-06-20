const fs = require('fs');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const checks = [
  { ok: manager.includes('STAGE232I4_R16T_MISSING_MANAGER_TOGGLE_AND_BADGE_CLEANUP'), label: 'R16T manager marker' },
  { ok: manager.includes('data-stage232i4-r16t-manager-card-layout="checkbox-title-done-delete-fixed-columns-no-badges"'), label: 'checkbox title action layout' },
  { ok: manager.includes('data-stage232i4-r16t-manager-blocker-column="checkbox-only-visible"'), label: 'checkbox-only visible blocker column' },
  { ok: manager.includes('!w-[560px]'), label: 'narrower modal width' },
  { ok: !manager.includes('data-stage232i4-r16s-r2-manager-badges-cell'), label: 'old visual badges removed' },
  { ok: !manager.includes('>Blokuje</span>'), label: 'visible red Blokuje badge removed' },
  { ok: !manager.includes('>Info</span>'), label: 'visible Info badge removed' },
  { ok: !manager.includes('grid-cols-[90px_92px_minmax(120px,1fr)_68px_56px]'), label: 'old wide grid removed' },
  { ok: client.includes('stage232i4_r16t_client_missing_blocker_toggle_existing_fix'), label: 'toggle handler R16T source' },
  { ok: client.includes('const existingTask = Array.isArray(tasks)'), label: 'toggle handler defines existingTask before use' },
  { ok: client.includes("title: String(sourceTask?.title || item?.title || 'Brak')"), label: 'toggle sends full task title to API' },
  { ok: client.includes('payload: nextPayload'), label: 'toggle sends normalized payload' },
  { ok: !client.includes('blocksProgress,\n        payload:'), label: 'toggle does not send fragile top-level blocksProgress immediately before payload' },
  { ok: !client.includes('Owner Control') && !manager.includes('Owner Control'), label: 'scope excludes Owner Control' },
];
const errors = checks.filter((check) => !check.ok).map(({ label }) => label);
if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16T_MISSING_MANAGER_TOGGLE_AND_BADGE_CLEANUP', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: 'STAGE232I4_R16T_MISSING_MANAGER_TOGGLE_AND_BADGE_CLEANUP', contract: 'Badges removed, checkbox-only blocker control visible, compact modal, and client missing blocker toggle avoids existing runtime error by sending a full normalized task patch.' }, null, 2));
