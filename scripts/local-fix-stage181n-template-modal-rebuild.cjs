const fs = require('fs');

const templatesPath = 'src/pages/Templates.tsx';
const cssPath = 'src/styles/closeflow-template-modal-source-truth-stage181n.css';

let src = fs.readFileSync(templatesPath, 'utf8');

// 1. Ensure CSS import is last, so it wins over older broken local attempts.
if (!src.includes("../styles/visual-stage22-event-form-vnext.css")) {
  src = src.replace(
    "import '../styles/closeflow-record-list-source-truth.css';",
    "import '../styles/closeflow-record-list-source-truth.css';\nimport '../styles/visual-stage22-event-form-vnext.css';"
  );
}

if (!src.includes("../styles/closeflow-template-modal-source-truth-stage181n.css")) {
  const importAnchor = src.includes("../styles/closeflow-template-modal-source-truth-stage181l.css")
    ? "import '../styles/closeflow-template-modal-source-truth-stage181l.css';"
    : "import '../styles/visual-stage22-event-form-vnext.css';";

  src = src.replace(
    importAnchor,
    importAnchor + "\nimport '../styles/closeflow-template-modal-source-truth-stage181n.css';"
  );
}

// 2. Replace whole DialogContent with rebuilt readable layout.
// This removes the "Jak tego używać" tile and makes items full-width under template name.
const rebuiltDialogContent = `<DialogContent className="cf-template-modal-v2" data-template-modal-stage181n="true">
          <DialogHeader className="cf-template-modal-v2-header">
            <DialogTitle className="cf-template-modal-v2-title">{editingTemplateId ? 'Edytuj szablon sprawy' : 'Nowy szablon sprawy'}</DialogTitle>
            <DialogDescription className="cf-template-modal-v2-description">Uzupełnij dane szablonu i zapisz zmiany w bibliotece szablonów.</DialogDescription>
          </DialogHeader>

          <div className="cf-template-modal-v2-body">
            <section className="cf-template-modal-v2-name-card">
              <Label htmlFor="template-name" className="cf-template-modal-v2-label">Nazwa szablonu</Label>
              <Input
                id="template-name"
                value={draft.name}
                onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Np. Strona internetowa + formularz"
                className="cf-template-modal-v2-input"
              />
            </section>

            <section className="cf-template-modal-v2-items" aria-label="Pozycje szablonu">
              {draft.items.map((item, index) => (
                <div key={\`draft-item-\${index}\`} className="cf-template-modal-v2-item-card">
                  <div className="cf-template-modal-v2-item-head">
                    <div>
                      <p className="cf-template-modal-v2-item-title">Pozycja {index + 1}</p>
                      <p className="cf-template-modal-v2-item-subtitle">To zobaczy operator i klient w dalszym flow.</p>
                    </div>
                    <EntityActionButton
                      type="button"
                      variant="ghost"
                      size="icon"
                      tone="danger"
                      iconOnly
                      className="cf-template-modal-v2-delete"
                      onClick={() => removeDraftItem(index)}
                      aria-label="Usuń pozycję"
                      title="Usuń pozycję"
                    >
                      <Trash2 className="h-4 w-4" />
                    </EntityActionButton>
                  </div>

                  <div className="cf-template-modal-v2-fields">
                    <div className="cf-template-modal-v2-field">
                      <Label className="cf-template-modal-v2-label cf-template-modal-v2-label-on-dark">Tytuł pozycji</Label>
                      <Input
                        value={item.title}
                        onChange={(event) => updateDraftItem(index, { title: event.target.value })}
                        placeholder="Np. Dostęp do hostingu"
                        className="cf-template-modal-v2-input"
                      />
                    </div>

                    <div className="cf-template-modal-v2-field">
                      <Label className="cf-template-modal-v2-label cf-template-modal-v2-label-on-dark">Opis / instrukcja</Label>
                      <Textarea
                        value={item.description}
                        onChange={(event) => updateDraftItem(index, { description: event.target.value })}
                        placeholder="Dopisz, co dokładnie klient ma przygotować albo zatwierdzić."
                        rows={3}
                        className="cf-template-modal-v2-textarea"
                      />
                    </div>

                    <div className="cf-template-modal-v2-bottom-row">
                      <div className="cf-template-modal-v2-field">
                        <Label className="cf-template-modal-v2-label cf-template-modal-v2-label-on-dark">Typ pozycji</Label>
                        <Select value={item.type} onValueChange={(value) => updateDraftItem(index, { type: value as TemplateItemType })}>
                          <SelectTrigger className="cf-template-modal-v2-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ITEM_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="cf-template-modal-v2-required">
                        <div>
                          <p className="cf-template-modal-v2-required-title">Obowiązkowe</p>
                          <p className="cf-template-modal-v2-required-text">Brak tej pozycji będzie blokował sprawę.</p>
                        </div>
                        <Checkbox checked={item.isRequired} onCheckedChange={(checked) => updateDraftItem(index, { isRequired: checked === true })} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" className="cf-template-modal-v2-add" onClick={addDraftItem}>
                <Plus className="h-4 w-4" /> Dodaj następną pozycję
              </Button>
            </section>
          </div>

          <DialogFooter className="cf-template-modal-v2-footer">
            <Button type="button" variant="outline" className="cf-template-modal-v2-cancel" onClick={() => setDialogOpen(false)}>Anuluj</Button>
            <Button type="button" className="cf-template-modal-v2-submit" onClick={() => void handleSaveTemplate()} disabled={saving}>
              {saving ? 'Zapisywanie...' : editingTemplateId ? 'Zapisz zmiany' : 'Utwórz szablon'}
            </Button>
          </DialogFooter>
        </DialogContent>`;

const dialogContentRe = /<DialogContent[\s\S]*?<\/DialogContent>/m;

if (!dialogContentRe.test(src)) {
  throw new Error('Could not find Templates DialogContent block.');
}

src = src.replace(dialogContentRe, rebuiltDialogContent);

fs.writeFileSync(templatesPath, src, 'utf8');

// 3. Source-truth CSS for the rebuilt modal.
const css = `/* CLOSEFLOW_STAGE181N_TEMPLATE_MODAL_REBUILD_SOURCE_TRUTH
   LOCAL ONLY
   Decision:
   - Name field is top/full-width.
   - Help card is removed.
   - Positions are full-width under the name.
   - Position section has dark background.
   - Inputs stay white with dark text.
   - Header and cancel button are black/readable.
*/

.cf-template-modal-v2[data-template-modal-stage181n="true"] {
  width: min(860px, calc(100vw - 20px)) !important;
  max-width: 860px !important;
  max-height: min(92vh, 900px) !important;
  overflow: hidden !important;
  padding: 0 !important;
  border: 1px solid #d7dde8 !important;
  border-radius: 28px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 26px 72px rgba(15, 23, 42, 0.28) !important;
}

.cf-template-modal-v2[data-template-modal-stage181n="true"] * {
  -webkit-text-fill-color: currentColor !important;
}

.cf-template-modal-v2[data-template-modal-stage181n="true"] > button {
  top: 14px !important;
  right: 14px !important;
  width: 38px !important;
  height: 38px !important;
  border-radius: 999px !important;
  background: #ffffff !important;
  color: #111827 !important;
  opacity: 1 !important;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.14) !important;
}

.cf-template-modal-v2-header {
  padding: 22px 24px 18px !important;
  border-bottom: 1px solid #e5e7eb !important;
  background: #ffffff !important;
  color: #111827 !important;
}

.cf-template-modal-v2-title {
  margin: 0 !important;
  color: #111827 !important;
  font-size: 22px !important;
  font-weight: 950 !important;
  line-height: 1.1 !important;
  letter-spacing: -0.03em !important;
}

.cf-template-modal-v2-description {
  margin: 7px 0 0 !important;
  color: #475467 !important;
  font-size: 13px !important;
  font-weight: 650 !important;
  line-height: 1.5 !important;
}

.cf-template-modal-v2-body {
  max-height: calc(92vh - 154px) !important;
  overflow-y: auto !important;
  padding: 20px 24px 22px !important;
  display: grid !important;
  gap: 18px !important;
  background: #0f172a !important;
  color: #ffffff !important;
  scrollbar-width: thin !important;
  scrollbar-color: #64748b transparent !important;
}

.cf-template-modal-v2-name-card {
  width: 100% !important;
  padding: 18px !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 22px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14) !important;
}

.cf-template-modal-v2-items {
  width: 100% !important;
  display: grid !important;
  gap: 14px !important;
}

.cf-template-modal-v2-item-card {
  width: 100% !important;
  padding: 18px !important;
  border: 1px solid rgba(148, 163, 184, 0.24) !important;
  border-radius: 22px !important;
  background: #111827 !important;
  color: #ffffff !important;
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.22) !important;
}

.cf-template-modal-v2-item-head {
  margin-bottom: 16px !important;
  display: flex !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  gap: 14px !important;
}

.cf-template-modal-v2-item-title {
  margin: 0 !important;
  color: #ffffff !important;
  font-size: 15px !important;
  font-weight: 950 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.02em !important;
}

.cf-template-modal-v2-item-subtitle {
  margin: 5px 0 0 !important;
  color: #cbd5e1 !important;
  font-size: 12px !important;
  font-weight: 650 !important;
  line-height: 1.35 !important;
}

.cf-template-modal-v2-delete {
  flex: 0 0 auto !important;
  border: 1px solid rgba(248, 113, 113, 0.24) !important;
  border-radius: 16px !important;
  background: rgba(127, 29, 29, 0.14) !important;
  color: #f87171 !important;
}

.cf-template-modal-v2-fields {
  display: grid !important;
  gap: 14px !important;
}

.cf-template-modal-v2-field {
  display: grid !important;
  gap: 7px !important;
}

.cf-template-modal-v2-label {
  color: #111827 !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  line-height: 1.2 !important;
}

.cf-template-modal-v2-label-on-dark {
  color: #e5e7eb !important;
}

.cf-template-modal-v2-input,
.cf-template-modal-v2-textarea,
.cf-template-modal-v2-select {
  width: 100% !important;
  min-height: 44px !important;
  border: 1px solid #d0d5dd !important;
  border-radius: 16px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.08) !important;
  caret-color: #2563eb !important;
}

.cf-template-modal-v2-input::placeholder,
.cf-template-modal-v2-textarea::placeholder {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

.cf-template-modal-v2-input:focus,
.cf-template-modal-v2-textarea:focus,
.cf-template-modal-v2-select:focus {
  border-color: #93c5fd !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.16) !important;
  outline: none !important;
}

.cf-template-modal-v2-textarea {
  min-height: 92px !important;
  line-height: 1.45 !important;
  resize: vertical !important;
}

.cf-template-modal-v2-bottom-row {
  display: grid !important;
  grid-template-columns: minmax(0, 240px) minmax(0, 1fr) !important;
  align-items: end !important;
  gap: 14px !important;
}

.cf-template-modal-v2-required {
  min-height: 56px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 14px !important;
  padding: 12px 14px !important;
  border: 1px solid rgba(148, 163, 184, 0.22) !important;
  border-radius: 18px !important;
  background: rgba(15, 23, 42, 0.86) !important;
  color: #ffffff !important;
}

.cf-template-modal-v2-required-title {
  margin: 0 !important;
  color: #ffffff !important;
  font-size: 13px !important;
  font-weight: 950 !important;
  line-height: 1.15 !important;
}

.cf-template-modal-v2-required-text {
  margin: 4px 0 0 !important;
  color: #cbd5e1 !important;
  font-size: 12px !important;
  font-weight: 650 !important;
  line-height: 1.35 !important;
}

.cf-template-modal-v2-add {
  width: 100% !important;
  min-height: 46px !important;
  border: 1px solid rgba(148, 163, 184, 0.32) !important;
  border-radius: 18px !important;
  background: #ffffff !important;
  color: #111827 !important;
  font-weight: 900 !important;
}

.cf-template-modal-v2-footer {
  padding: 14px 24px 18px !important;
  border-top: 1px solid #e5e7eb !important;
  background: #ffffff !important;
  box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.08) !important;
  gap: 12px !important;
}

.cf-template-modal-v2-cancel,
.cf-template-modal-v2-submit {
  min-height: 44px !important;
  border-radius: 16px !important;
  font-weight: 900 !important;
}

.cf-template-modal-v2-cancel {
  border: 1px solid #cbd5e1 !important;
  background: #ffffff !important;
  color: #111827 !important;
}

.cf-template-modal-v2-cancel:hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
}

.cf-template-modal-v2-submit {
  border: 1px solid #059669 !important;
  background: #059669 !important;
  color: #ffffff !important;
}

.cf-template-modal-v2-submit:hover {
  background: #047857 !important;
}

@media (max-width: 760px) {
  .cf-template-modal-v2[data-template-modal-stage181n="true"] {
    width: calc(100vw - 14px) !important;
    max-height: 94vh !important;
    border-radius: 24px !important;
  }

  .cf-template-modal-v2-header {
    padding: 18px 16px 14px !important;
  }

  .cf-template-modal-v2-body {
    max-height: calc(94vh - 152px) !important;
    padding: 14px !important;
  }

  .cf-template-modal-v2-name-card,
  .cf-template-modal-v2-item-card {
    padding: 14px !important;
  }

  .cf-template-modal-v2-bottom-row {
    grid-template-columns: 1fr !important;
  }

  .cf-template-modal-v2-footer {
    display: grid !important;
    grid-template-columns: 1fr !important;
    padding: 14px !important;
  }

  .cf-template-modal-v2-footer button {
    width: 100% !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const nextTsx = fs.readFileSync(templatesPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "closeflow-template-modal-source-truth-stage181n.css",
  "cf-template-modal-v2",
  "data-template-modal-stage181n=\"true\"",
  "cf-template-modal-v2-name-card",
  "cf-template-modal-v2-items",
  "cf-template-modal-v2-item-card",
  "cf-template-modal-v2-footer",
]) {
  if (!nextTsx.includes(token)) failures.push('Templates.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181N_TEMPLATE_MODAL_REBUILD_SOURCE_TRUTH",
  ".cf-template-modal-v2-body",
  "background: #0f172a",
  ".cf-template-modal-v2-name-card",
  ".cf-template-modal-v2-item-card",
  ".cf-template-modal-v2-cancel",
  "color: #111827",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (nextTsx.includes('Jak tego używać')) {
  failures.push('Removed help tile text still exists in modal.');
}

if (failures.length) {
  console.error('Stage181N local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181N local: template modal layout rebuilt, help tile removed, items full-width under name.');
