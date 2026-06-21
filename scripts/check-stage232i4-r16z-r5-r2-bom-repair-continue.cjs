const fs = require('fs');

const managerPath = 'src/components/detail/MissingItemsManagerDialog.tsx';
const manager = fs.readFileSync(managerPath, 'utf8');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const errors = [];

function must(label, condition) {
  if (!condition) errors.push({ type: 'required', label });
}
function block(label, condition) {
  if (condition) errors.push({ type: 'forbidden', label });
}

must('R16Z_R5 marker still present', manager.includes('STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE'));
must('R16Z_R4 final layout still present', manager.includes('!w-[760px]') && manager.includes('flex w-full min-w-0 items-center gap-2 overflow-visible'));
must('R16Z_R4 readable blocker and delete visible still present', manager.includes('data-stage232i4-r16z-r4-manager-blocker-text="readable"') && manager.includes('data-stage232i4-r16z-r4-manager-delete-visible="true"'));
must('source truth still priority high', client.includes("priority === 'high'"));
block('raw BOM in manager', manager.charCodeAt(0) === 0xFEFF);
block('old R16O 1100px layout active in manager', manager.includes('xl:w-[1100px]'));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE', errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE',
  contract: 'R16Z_R5 continuation removes UTF-8 BOM from MissingItemsManagerDialog and preserves final R16Z_R4/R16Z_R5 manager contract.'
}, null, 2));