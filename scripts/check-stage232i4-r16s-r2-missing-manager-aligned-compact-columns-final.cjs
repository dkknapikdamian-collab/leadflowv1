const fs = require('fs');
const file = 'src/components/detail/MissingItemsManagerDialog.tsx';
const text = fs.readFileSync(file, 'utf8');
const STAGE = 'STAGE232I4_R16S_R2_MISSING_MANAGER_ALIGNED_COMPACT_COLUMNS_FINAL';
const required = [
  ['stage marker', 'STAGE232I4_R16S_R2_MISSING_MANAGER_ALIGNED_COMPACT_COLUMNS_FINAL'],
  ['narrow modal', '!w-[720px]'],
  ['compact fixed grid', 'grid-cols-[90px_92px_minmax(120px,1fr)_68px_56px]'],
  ['visible checkbox column', 'data-stage232i4-r16s-r2-manager-blocker-column="visible-fixed-checkbox"'],
  ['title fixed column', 'data-stage232i4-r16s-r2-manager-item-title="fixed-title-column"'],
  ['done fixed column', 'data-stage232i4-r16s-r2-manager-resolve-column="fixed"'],
  ['delete fixed column', 'data-stage232i4-r16s-r2-manager-delete-column="fixed"'],
  ['no horizontal scroll body', 'overflow-x-hidden'],
  ['no top add form marker from R16R still baseline', 'data-stage232i4-r16r-production-fit="no-horizontal-scroll-no-add-form"'],
];
const forbidden = [
  ['old full width modal', '!w-[96vw]'],
  ['old max width modal', '!max-w-[1040px]'],
  ['old wide actions group', 'w-[142px]'],
  ['old checkbox width', 'w-[104px]'],
  ['check icon import/use', 'CheckCircle2'],
  ['trash icon import/use', 'Trash2'],
  ['kartoteka filler', 'Kartoteka klienta'],
  ['top add form class', 'missing-manager-add-form'],
  ['horizontal auto scroll', 'overflow-x-auto'],
  ['old exact R16S broken marker', 'STAGE232I4_R16S_MISSING_MANAGER_ALIGNED_COMPACT_COLUMNS\n'],
];
const errors = [];
for (const [label, needle] of required) if (!text.includes(needle)) errors.push({ type: 'required', label, needle });
for (const [label, needle] of forbidden) if (text.includes(needle)) errors.push({ type: 'forbidden', label, needle });
if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: STAGE, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, stage: STAGE, contract: 'Missing manager uses narrow production modal and aligned compact columns: badge, visible blocker checkbox, title, Done, Delete.' }, null, 2));
