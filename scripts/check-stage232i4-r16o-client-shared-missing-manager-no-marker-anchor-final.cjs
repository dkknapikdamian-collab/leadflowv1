const fs = require('fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');

function must(source, needle, label = needle) {
  if (!source.includes(needle)) throw new Error('Missing ' + label);
}
function mustNot(source, needle, label = needle) {
  if (source.includes(needle)) throw new Error('Forbidden ' + label);
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
mustNot(client, 'client-detail-missing-window-dialog-simple', 'old local client missing dialog class');
must(manager, 'data-stage232i4-r16-manager-wide-readable="true"', 'wide readable marker');
must(manager, 'xl:w-[1100px]', 'wide manager width');
must(manager, 'data-missing-item-title-block="true"', 'visible title block');
must(lead, '<MissingItemsManagerDialog', 'LeadDetail shared manager still used');
mustNot(client, 'owner-control', 'Owner Control rewrite in ClientDetail scope');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL',
  contract: 'ClientDetail active missing list uses shared MissingItemsManagerDialog; old local simple dialog removed; manager wide; no fragile R14/R6 marker anchor required'
}, null, 2));
