const fs = require('fs');

const file = 'src/components/detail/MissingItemsManagerDialog.tsx';
const text = fs.readFileSync(file, 'utf8');

const required = [
  ['R16R marker comment', '// STAGE232I4_R16R_MISSING_MANAGER_PRODUCTION_FIT_NO_HORIZONTAL_SCROLL'],
  ['dialog production fit class', 'cf-missing-manager-dialog-stage232i4-r16r'],
  ['no add form contract', 'data-stage232i4-r16r-production-fit="no-horizontal-scroll-no-add-form"'],
  ['list no horizontal scroll marker', 'data-stage232i4-r16r-list-section="no-horizontal-scroll"'],
  ['body overflow-x hidden', 'overflow-x-hidden'],
  ['single visible row contract', 'data-stage232i4-r16r-manager-card-layout="single-visible-row-no-horizontal-scroll"'],
  ['inline-only item title', 'data-stage232i4-r16r-manager-item-title="inline-only"'],
  ['compact blocker', 'data-stage232i4-r16r-manager-blocker-compact="true"'],
  ['compact actions', 'data-stage232i4-r16r-manager-actions-compact="true"'],
  ['resolve action still present', 'data-stage232i4-r14-manager-resolve-action="true"'],
  ['delete action still present', 'data-stage232i4-r14-manager-delete-action="true"'],
];

const forbidden = [
  ['add form section removed', 'CloseFlowDialogSection'],
  ['old add form class removed', 'cf-missing-manager-add-form-stage232i4-r14'],
  ['old add form marker removed', 'data-stage232i4-r14-manager-add-form'],
  ['old title label removed', 'Nazwa braku'],
  ['kartoteka fallback removed', 'Kartoteka klienta'],
  ['source note cell removed', 'data-stage232i4-r16q-manager-source-note-cell'],
  ['wide grid no longer used', 'xl:grid-cols-[auto_minmax'],
  ['horizontal scroll not allowed', 'overflow-x-auto'],
  ['plus icon no longer used', 'Plus'],
  ['input import no longer used', "from '../ui/input'"],
  ['label import no longer used', "from '../ui/label'"],
];

const errors = [];
for (const [label, needle] of required) {
  if (!text.includes(needle)) errors.push({ type: 'missing', label, needle });
}
for (const [label, needle] of forbidden) {
  if (text.includes(needle)) errors.push({ type: 'forbidden', label, needle });
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16R_MISSING_MANAGER_PRODUCTION_FIT_NO_HORIZONTAL_SCROLL', errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16R_MISSING_MANAGER_PRODUCTION_FIT_NO_HORIZONTAL_SCROLL',
  contract: 'MissingItemsManagerDialog has no add form, no horizontal scroll, no Kartoteka klienta filler, and compact production rows with visible actions.'
}, null, 2));
