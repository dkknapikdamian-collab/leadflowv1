const fs = require('fs');

const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const errors = [];

function must(label, condition) {
  if (!condition) errors.push({ type: 'required', label });
}
function block(label, condition) {
  if (condition) errors.push({ type: 'forbidden', label });
}

must('R16Z_R4 marker', manager.includes('STAGE232I4_R16Z_R4_MISSING_MANAGER_FINAL_VISUAL_FIT_NO_ZIP'));
must('modal width 760 viewport safe', manager.includes('!w-[760px]') && manager.includes('sm:!max-w-[760px]'));
must('modal fit marker', manager.includes('data-stage232i4-r16z-r4-modal-fit="flex-no-clipping"'));
must('row uses flex no clipping', manager.includes('flex w-full min-w-0 items-center gap-2 overflow-visible'));
must('blocker chip width readable', manager.includes('w-[118px] min-w-[118px]'));
must('blocker text readable marker', manager.includes('data-stage232i4-r16z-r4-manager-blocker-text="readable"'));
must('blocker text high contrast', manager.includes('font-black leading-none text-slate-950'));
must('delete action visible width', manager.includes('w-[78px] min-w-[78px]') && manager.includes('data-stage232i4-r16z-r4-manager-delete-visible="true"'));
must('title can shrink', manager.includes('min-w-0 flex-1 truncate'));
must('source truth still priority high', client.includes("priority === 'high'"));
must('status domain still not used as blocker truth only', client.includes("status === 'blocking_missing_item'"));

block('old fixed clipped grid', manager.includes('grid w-full min-w-0 grid-cols-[92px_minmax(120px,1fr)_88px_66px] items-center gap-2 overflow-hidden'));
block('old blocker chip 92px', manager.includes('h-7 w-[92px] shrink-0'));
block('old delete 66px', manager.includes('w-[66px] min-w-[66px]'));
block('old blocker weak contrast', manager.includes('text-slate-800" data-stage232i4-r16v-manager-blocker-text="true"'));

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16Z_R4_MISSING_MANAGER_FINAL_VISUAL_FIT_NO_ZIP', errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16Z_R4_MISSING_MANAGER_FINAL_VISUAL_FIT_NO_ZIP',
  contract: 'Missing manager modal uses flex rows, readable Blokuje chip, visible Usun action and preserves priority high source truth.'
}, null, 2));