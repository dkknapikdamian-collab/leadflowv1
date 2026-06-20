const fs = require('fs');
const path = require('path');

const root = process.cwd();
const manager = fs.readFileSync(path.join(root, 'src/components/detail/MissingItemsManagerDialog.tsx'), 'utf8');
const client = fs.readFileSync(path.join(root, 'src/pages/ClientDetail.tsx'), 'utf8');

const required = [
  ['manager stage marker', manager.includes('STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX')],
  ['wide modal R16Q class', manager.includes('cf-missing-manager-dialog-stage232i4-r16q') && manager.includes('w-[calc(100vw-48px)]') && manager.includes('xl:w-[1180px]')],
  ['compact row card marker', manager.includes('data-stage232i4-r16q-manager-card-layout="single-horizontal-row"')],
  ['compact row class', manager.includes('cf-missing-manager-row-stage232i4-r16q')],
  ['add form readable marker', manager.includes('cf-missing-manager-add-form-stage232i4-r16q')],
  ['add form dark readable input', manager.includes('bg-slate-900 text-slate-50 placeholder:text-slate-500')],
  ['source note inline cell', manager.includes('data-stage232i4-r16q-manager-source-note-cell="true"')],
  ['inline blocker marker', manager.includes('data-stage232i4-r11-manager-blocker-column="blocker-inline"')],
  ['inline action marker', manager.includes('data-stage232i4-r11-manager-actions-column="actions-inline-right"')],
  ['resolve action preserved', manager.includes('data-stage232i4-r14-manager-resolve-action="true"')],
  ['delete action preserved', manager.includes('data-stage232i4-r14-manager-delete-action="true"')],
  ['ClientDetail still R16O shared manager', client.includes('STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL') && client.includes('<MissingItemsManagerDialog')],
];

const forbidden = [
  ['old vertical layout contract', manager.includes('data-stage232i4-r12-manager-card-layout="title-first-controls-below"')],
  ['old low contrast add label', manager.includes('cf-missing-manager-title-field-stage232i4-r14 block text-sm font-medium text-slate-200')],
  ['old controls below marker', manager.includes('title-first-card-controls-below')],
  ['SQL touched in manager', /supabase\.sql|create table|alter table|drop table/i.test(manager)],
  ['Owner Control touched in manager', /Owner Control|owner-control/i.test(manager)],
];

const failures = [];
for (const [label, ok] of required) {
  if (!ok) failures.push({ type: 'missing', label });
}
for (const [label, bad] of forbidden) {
  if (bad) failures.push({ type: 'forbidden', label });
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX', failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX',
  contract: 'MissingItemsManagerDialog keeps cards stacked vertically but each card is a compact horizontal row; add form is readable on dark modal background.'
}, null, 2));
