const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const clientPath = path.join(repo, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text.trimEnd() + '\n', 'utf8');
}

function fail(message) {
  console.error(`STAGE232I4_R13G_PATCH_FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(clientPath)) fail(`missing ${clientPath}`);
if (!fs.existsSync(cssPath)) fail(`missing ${cssPath}`);

let client = read(clientPath);
let css = read(cssPath);

// Fix mojibake in the exact inline modal area and related labels while we are touching the visual source.
const mojibakeFixes = new Map([
  ['brakĂłw', 'braków'],
  ['sprawÄ™', 'sprawę'],
  ['uzupeĹ‚niony', 'uzupełniony'],
  ['uzupeĹ‚nione', 'uzupełnione'],
  ['UzupeĹ‚nione', 'Uzupełnione'],
  ['usuĹ„', 'usuń'],
  ['UsuĹ„', 'Usuń'],
  ['powyĹĽej', 'powyżej'],
  ['notatkÄ™', 'notatkę'],
]);
for (const [bad, good] of mojibakeFixes) {
  client = client.split(bad).join(good);
}

const replacements = [
  [
    '<DialogContent className="client-detail-missing-window-dialog client-detail-missing-window-dialog-simple" data-stage232i4-r12-missing-window="true" data-stage232i4-r13f-simple-missing-window="true">',
    '<DialogContent className="client-detail-missing-window-dialog client-detail-missing-window-dialog-r13g" data-stage232i4-r13g-client-inline-missing-window="true" data-closeflow-dialog-shell="true" data-closeflow-dialog-card="true">',
  ],
  [
    '<DialogDescription>Prosta lista braków klienta. Dodaj brak, ustaw czy blokuje sprawę, oznacz jako uzupełniony albo usuń.</DialogDescription>',
    '<DialogDescription data-closeflow-dialog-description="true">Prosta lista braków klienta. Dodaj brak, ustaw czy blokuje sprawę, oznacz jako uzupełniony albo usuń.</DialogDescription>',
  ],
  [
    'className="client-detail-missing-window-add-form client-detail-missing-window-add-form-simple"\n                  data-stage232i4-r13f-simple-missing-add-form="true"',
    'className="client-detail-missing-window-add-form client-detail-missing-window-add-form-r13g"\n                  data-stage232i4-r13g-missing-add-form="true"',
  ],
  [
    '<label className="client-detail-missing-window-checkbox" data-stage232i4-r13f-add-blocker-checkbox="true">',
    '<label className="client-detail-missing-window-checkbox client-detail-missing-window-add-checkbox-r13g" data-stage232i4-r13g-add-blocker-checkbox="true">',
  ],
  [
    'data-stage232i4-r13f-simple-missing-title-input="true"',
    'data-stage232i4-r13g-missing-title-input="true"',
  ],
  [
    'data-stage232i4-r13f-simple-missing-add-action="true"',
    'data-stage232i4-r13g-missing-add-action="true"',
  ],
  [
    '<div className="client-detail-missing-window-list client-detail-missing-window-list-simple" data-stage232i4-r12-missing-window-list="true" data-stage232i4-r13f-simple-missing-list="true">',
    '<div className="client-detail-missing-window-list client-detail-missing-window-list-r13g" data-stage232i4-r13g-missing-window-list="true" data-closeflow-dialog-body="true">',
  ],
];

for (const [from, to] of replacements) {
  if (!client.includes(from)) fail(`expected ClientDetail token not found: ${from.slice(0, 120)}`);
  client = client.replace(from, to);
}

const oldRow = `                      <article key={String(item?.id || item?.title)} className="client-detail-missing-window-row client-detail-missing-window-row-simple" data-stage232i4-r12-missing-window-row="true" data-stage232i4-r13f-simple-missing-row="true">
                        <strong className="client-detail-missing-window-row-title">{String(item?.title || 'Brak bez nazwy')}</strong>
                        <label className="client-detail-missing-window-checkbox client-detail-missing-window-row-checkbox" data-stage232i4-r13f-row-blocker-checkbox="true">
                          <input
                            type="checkbox"
                            checked={Boolean(item.stage232i2IsBlocker)}
                            onChange={(event) => void handleToggleClientMissingBlockerStage232I4R13F(item, event.target.checked)}
                            disabled={!hasAccess || isDoneStatus(item?.status)}
                          />
                          <span>Blokuje sprawę</span>
                        </label>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleResolveClientMissingItemStage228R13(item)} disabled={!hasAccess || isDoneStatus(item?.status)} data-stage232i2-resolve-source-item="true">
                          Uzupełnione
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => handleDeleteClientMissingItemStage228R15(item)} disabled={!hasAccess || isDoneStatus(item?.status)} data-stage232i2-delete-source-item="true">
                          Usuń
                        </Button>
                      </article>`;

const newRow = `                      <article
                        key={String(item?.id || item?.title)}
                        className="client-detail-missing-window-row client-detail-missing-window-row-r13g"
                        data-missing-item-card="true"
                        data-stage232i4-r13g-missing-item-card="true"
                      >
                        <div className="client-detail-missing-window-row-title-block" data-missing-item-title-block="true">
                          <span className="client-detail-missing-window-row-eyebrow">Nazwa braku</span>
                          <strong className="client-detail-missing-window-row-title">{String(item?.title || 'Brak bez nazwy')}</strong>
                        </div>
                        <label
                          className="client-detail-missing-window-checkbox client-detail-missing-window-row-checkbox"
                          data-missing-item-blocker-row="true"
                          data-stage232i4-r13g-row-blocker-checkbox="true"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(item.stage232i2IsBlocker)}
                            onChange={(event) => void handleToggleClientMissingBlockerStage232I4R13F(item, event.target.checked)}
                            disabled={!hasAccess || isDoneStatus(item?.status)}
                          />
                          <span>Blokuje sprawę</span>
                        </label>
                        <div className="client-detail-missing-window-row-actions" data-missing-item-actions-row="true" data-stage232i4-r13g-missing-actions-row="true">
                          <Button type="button" size="sm" variant="outline" onClick={() => handleResolveClientMissingItemStage228R13(item)} disabled={!hasAccess || isDoneStatus(item?.status)} data-stage232i2-resolve-source-item="true">
                            Uzupełnione
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => handleDeleteClientMissingItemStage228R15(item)} disabled={!hasAccess || isDoneStatus(item?.status)} data-stage232i2-delete-source-item="true">
                            Usuń
                          </Button>
                        </div>
                      </article>`;

if (!client.includes(oldRow)) {
  fail('expected flat R13F inline missing item row block not found in ClientDetail.tsx');
}
client = client.replace(oldRow, newRow);

const oldEmpty = `<div className="client-detail-light-empty client-detail-action-empty client-detail-action-empty-compact" data-stage232i4-r12-empty-missing-window="true" data-stage232i4-r13f-simple-empty-missing-window="true">
                      <strong>Brak otwartych braków.</strong>
                      <p>Dodaj brak po nazwie powyżej.</p>
                    </div>`;
const newEmpty = `<div className="client-detail-light-empty client-detail-action-empty client-detail-action-empty-compact" data-stage232i4-r13g-empty-missing-window="true">
                      <strong>Brak otwartych braków.</strong>
                      <p>Dodaj brak po nazwie powyżej.</p>
                    </div>`;
if (!client.includes(oldEmpty)) fail('expected R13F empty state block not found in ClientDetail.tsx');
client = client.replace(oldEmpty, newEmpty);

// Keep the DialogFooter, but mark it as the shared footer contract for this inline runtime.
client = client.replace(
  '<DialogFooter className={modalFooterClass()}>',
  '<DialogFooter className={modalFooterClass()} data-closeflow-dialog-footer="true" data-stage232i4-r13g-missing-footer="true">'
);

// Remove the R13F/simple visual layer and replace it with a title-first card contract for ClientDetail inline runtime.
const cssStart = css.indexOf('/* STAGE232I4_R13F_SIMPLE_MISSING_MODAL_ROWS');
const cssEnd = css.indexOf('/* STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX */');
if (cssStart === -1 || cssEnd === -1 || cssEnd <= cssStart) {
  fail('expected R13F CSS block boundary not found');
}

const newCssBlock = `/* STAGE232I4_R13G_CLIENT_DETAIL_MISSING_INLINE_TO_SHARED_VISUAL_SOURCE
   ClientDetail inline Braki / Blokady uses the same title-first card contract as shared missing managers.
   Do not reintroduce client-detail-missing-window-*-simple classes here.
*/
#root .client-detail-missing-window-dialog-r13g {
  max-width: min(860px, calc(100vw - 32px)) !important;
}

#root .client-detail-missing-window-add-form-r13g {
  display: grid !important;
  grid-template-columns: minmax(240px, 1fr) auto auto !important;
  gap: 12px !important;
  align-items: end !important;
}

#root .client-detail-missing-window-add-checkbox-r13g,
#root .client-detail-missing-window-row-checkbox {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  min-height: 38px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  white-space: normal !important;
}

#root .client-detail-missing-window-add-checkbox-r13g {
  color: rgba(226, 232, 240, 0.88) !important;
}

#root .client-detail-missing-window-checkbox input {
  width: 16px !important;
  height: 16px !important;
  accent-color: #f59e0b !important;
}

#root .client-detail-missing-window-list-r13g {
  display: grid !important;
  gap: 12px !important;
  max-height: min(52vh, 460px) !important;
  overflow: auto !important;
  padding-right: 2px !important;
}

#root .client-detail-missing-window-row-r13g {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 12px !important;
  align-items: stretch !important;
  border: 1px solid rgba(148, 163, 184, 0.28) !important;
  border-radius: 14px !important;
  padding: 14px !important;
  background: rgba(15, 23, 42, 0.72) !important;
}

#root .client-detail-missing-window-row-title-block {
  display: grid !important;
  gap: 4px !important;
  min-width: 0 !important;
}

#root .client-detail-missing-window-row-eyebrow {
  display: block !important;
  font-size: 11px !important;
  line-height: 1.2 !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  color: rgba(148, 163, 184, 0.92) !important;
}

#root .client-detail-missing-window-row-r13g .client-detail-missing-window-row-title {
  display: block !important;
  min-width: 0 !important;
  overflow: visible !important;
  text-overflow: unset !important;
  white-space: normal !important;
  overflow-wrap: anywhere !important;
  color: #f8fafc !important;
  font-size: 15px !important;
  line-height: 1.35 !important;
}

#root .client-detail-missing-window-row-r13g .client-detail-missing-window-row-checkbox {
  justify-content: flex-start !important;
  color: rgba(253, 230, 138, 0.96) !important;
}

#root .client-detail-missing-window-row-actions {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: flex-end !important;
  gap: 10px !important;
  padding-top: 2px !important;
}

@media (max-width: 780px) {
  #root .client-detail-missing-window-add-form-r13g {
    grid-template-columns: 1fr !important;
    align-items: stretch !important;
  }
  #root .client-detail-missing-window-row-actions {
    justify-content: flex-start !important;
  }
}

`;
css = css.slice(0, cssStart) + newCssBlock + css.slice(cssEnd);

write(clientPath, client);
write(cssPath, css);
console.log('STAGE232I4_R13G patch applied: ClientDetail inline missing modal now uses title-first card contract.');
