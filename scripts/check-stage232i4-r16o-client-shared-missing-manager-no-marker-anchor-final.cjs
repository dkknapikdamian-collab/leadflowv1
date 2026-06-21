const fs = require('fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

const errors = [];
function must(source, needle, label = needle) {
  if (!source.includes(needle)) errors.push({ type: 'required', label });
}
function mustNot(source, needle, label = needle) {
  if (source.includes(needle)) errors.push({ type: 'forbidden', label });
}

must(client, 'STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL', 'ClientDetail R16O stage marker');
must(client, '<MissingItemsManagerDialog', 'ClientDetail shared manager render');
must(client, 'open={clientMissingListOpenStage232I6}', 'ClientDetail manager open state');
must(client, 'scopeLabel="Klient"', 'ClientDetail manager Klient scope');
must(client, 'items={stage232i2AllActiveMissingItems.map', 'ClientDetail inline manager item adapter');
must(client, 'payload?.title', 'payload title fallback');
must(client, 'payload?.content', 'payload content fallback');
must(client, 'payload?.note', 'payload note fallback');
must(client, 'raw?.title', 'raw title fallback');
must(client, 'data-stage232i4-r16-client-missing-lead-vst="true"', 'R16 tile marker');
must(client, 'onAdd={handleSaveClientMissingItemStage227C3B}', 'manager add handler');
must(client, 'onToggleBlocker={handleToggleClientMissingBlockerStage232I4R13F}', 'manager toggle handler');
must(client, 'onResolve={handleResolveClientMissingItemStage228R13}', 'manager resolve handler');
must(client, 'onDelete={handleDeleteClientMissingItemStage228R15}', 'manager delete handler');
must(client, 'setClientMissingModalOpen(true)', 'quick add opens quick modal');
must(client, 'setClientMissingListOpenStage232I6(false)', 'quick add keeps manager closed after save');
must(client, 'setClientMissingListOpenStage232I6(true)', 'view all opens manager');
mustNot(client, 'client-detail-missing-window-dialog-simple', 'old local client missing dialog class');

must(manager, 'STAGE232I4_R16Z_R4_MISSING_MANAGER_FINAL_VISUAL_FIT_NO_ZIP', 'R16Z_R4 final visual marker');
must(manager, 'data-stage232i4-r16-manager-wide-readable="true"', 'shared manager legacy wide-readable marker retained only as historical marker');
must(manager, '!w-[760px]', 'R16Z final viewport-safe manager width');
must(manager, 'sm:!max-w-[760px]', 'R16Z final max width');
must(manager, 'flex w-full min-w-0 items-center gap-2 overflow-visible', 'R16Z final flex no-clipping row');
must(manager, 'data-stage232i4-r16z-r4-manager-blocker-text="readable"', 'visible blocker text marker');
must(manager, 'data-stage232i4-r16z-r4-manager-delete-visible="true"', 'visible delete action marker');
must(manager, 'managerItemTitle', 'manager title fallback helper');
must(manager, 'payload?.title', 'manager payload title fallback');
must(manager, 'payload?.content', 'manager payload content fallback');
must(manager, 'payload?.note', 'manager payload note fallback');
must(manager, 'Brak bez nazwy', 'manager default title fallback');
mustNot(manager, 'xl:w-[1100px]', 'obsolete R16O 1100px width requirement');
mustNot(manager, 'grid w-full min-w-0 grid-cols-[92px_minmax(120px,1fr)_88px_66px] items-center gap-2 overflow-hidden', 'obsolete clipped fixed grid');

must(lead, '<MissingItemsManagerDialog', 'LeadDetail shared manager still used');
must(lead, 'open={leadMissingManagerOpen}', 'LeadDetail manager open state');
must(lead, 'scopeLabel="Lead"', 'LeadDetail manager Lead scope');
must(lead, 'items={leadMissingManagerItemsStage232I4R14}', 'LeadDetail manager items');
must(lead, 'onDelete={handleDeleteLeadMissingItemStage228R15}', 'LeadDetail delete handler');
mustNot(client, 'owner-control', 'Owner Control rewrite in ClientDetail scope');

if (errors.length) {
  console.error(JSON.stringify({ ok: false, stage: 'STAGE232I4_R16O_CONSOLIDATED_WITH_R16Z_R4', errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16O_CONSOLIDATED_WITH_R16Z_R4',
  contract: 'ClientDetail active missing list uses shared MissingItemsManagerDialog; old local simple dialog removed; obsolete 1100px R16O requirement replaced by final R16Z_R4 760px/flex visual source truth.'
}, null, 2));
