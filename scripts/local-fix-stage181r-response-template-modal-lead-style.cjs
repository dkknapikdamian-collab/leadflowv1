const fs = require('fs');

const tsxPath = 'src/pages/ResponseTemplates.tsx';
const cssPath = 'src/styles/closeflow-response-template-modal-source-truth-stage181r.css';

let src = fs.readFileSync(tsxPath, 'utf8');

// 1. Ensure final adapter CSS is imported after older adapters, so it wins.
if (!src.includes("../styles/visual-stage22-event-form-vnext.css")) {
  src = src.replace(
    "import '../styles/closeflow-page-header-v2.css';",
    "import '../styles/closeflow-page-header-v2.css';\nimport '../styles/visual-stage22-event-form-vnext.css';"
  );
}

if (!src.includes("../styles/closeflow-response-template-modal-source-truth-stage181r.css")) {
  const anchors = [
    "import '../styles/closeflow-response-template-modal-source-truth-stage181q.css';",
    "import '../styles/visual-stage22-event-form-vnext.css';",
    "import '../styles/closeflow-page-header-v2.css';",
  ];

  const anchor = anchors.find((candidate) => src.includes(candidate));
  if (!anchor) throw new Error('Could not find CSS import anchor.');

  src = src.replace(
    anchor,
    anchor + "\nimport '../styles/closeflow-response-template-modal-source-truth-stage181r.css';"
  );
}

// 2. Rebuild ResponseTemplates DialogContent to match the lead-modal rhythm.
// One inner dark card, fields padded away from edges, white inputs.
const rebuilt = `<DialogContent className="cf-response-template-modal-v2" data-response-template-modal-stage181r="true">
            <DialogHeader className="cf-response-template-modal-v2-header">
              <DialogTitle className="cf-response-template-modal-v2-title">{editingId ? 'Edytuj szablon odpowiedzi' : 'Nowy szablon odpowiedzi'}</DialogTitle>
            </DialogHeader>

            <div className="cf-response-template-modal-v2-body">
              <section className="cf-response-template-modal-v2-card" aria-label="Dane szablonu odpowiedzi">
                <div className="cf-response-template-modal-v2-card-head">
                  <h3 className="cf-response-template-modal-v2-card-title">Podstawowe dane</h3>
                  <p className="cf-response-template-modal-v2-card-subtitle">Uzupełnij nazwę, kategorię, tagi i treść gotowej odpowiedzi.</p>
                </div>

                <div className="cf-response-template-modal-v2-grid">
                  <div className="cf-response-template-modal-v2-field">
                    <Label>Nazwa</Label>
                    <Input className="cf-response-template-modal-v2-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Np. Przypomnienie po braku odpowiedzi" />
                  </div>

                  <div className="cf-response-template-modal-v2-field">
                    <Label>Kategoria</Label>
                    <Input className="cf-response-template-modal-v2-input" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Np. Follow-up" />
                  </div>

                  <div className="cf-response-template-modal-v2-field">
                    <Label>Tagi (po przecinku)</Label>
                    <Input className="cf-response-template-modal-v2-input" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="np. lead, oferta, przypomnienie" />
                  </div>

                  <div className="cf-response-template-modal-v2-field">
                    <Label>Zmienne (po przecinku)</Label>
                    <Input className="cf-response-template-modal-v2-input" value={variables} onChange={(event) => setVariables(event.target.value)} placeholder="np. client_name, case_title, my_name" />
                  </div>

                  <div className="cf-response-template-modal-v2-field cf-response-template-modal-v2-body-field">
                    <Label>Treść</Label>
                    <Textarea className="cf-response-template-modal-v2-textarea" rows={10} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Wpisz treść odpowiedzi. Możesz używać zmiennych typu {{client_name}}." />
                  </div>
                </div>
              </section>
            </div>

            <DialogFooter className="cf-response-template-modal-v2-footer">
              <Button variant="outline" className="cf-response-template-modal-v2-cancel" onClick={() => setOpen(false)}>Anuluj</Button>
              <Button className="cf-response-template-modal-v2-submit" onClick={() => void save()} disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Zapisywanie...' : 'Zapisz'}</Button>
            </DialogFooter>
          </DialogContent>`;

const dialogRe = /<DialogContent[\s\S]*?<\/DialogContent>/m;
if (!dialogRe.test(src)) {
  throw new Error('Could not find ResponseTemplates DialogContent block.');
}

src = src.replace(dialogRe, rebuilt);

fs.writeFileSync(tsxPath, src, 'utf8');

// 3. Portal-safe visual source truth.
const css = `/* CLOSEFLOW_STAGE181R_RESPONSE_TEMPLATE_MODAL_LEAD_STYLE_SOURCE_TRUTH
   LOCAL ONLY
   Source: lead create modal rhythm.
   Rule: form fields sit inside a padded dark card, not against modal edges.
*/

.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] {
  width: min(820px, calc(100vw - 20px)) !important;
  max-width: 820px !important;
  max-height: min(92vh, 900px) !important;
  overflow: hidden !important;
  padding: 0 !important;
  border: 1px solid rgba(148, 163, 184, 0.32) !important;
  border-radius: 28px !important;
  background: #0f172a !important;
  color: #ffffff !important;
  box-shadow: 0 28px 76px rgba(2, 6, 23, 0.42) !important;
}

.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] * {
  -webkit-text-fill-color: currentColor !important;
}

.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] > button {
  top: 14px !important;
  right: 14px !important;
  width: 38px !important;
  height: 38px !important;
  border-radius: 999px !important;
  background: #e5e7eb !important;
  color: #111827 !important;
  opacity: 1 !important;
  box-shadow: 0 10px 22px rgba(2, 6, 23, 0.24) !important;
}

.cf-response-template-modal-v2-header {
  padding: 20px 24px 18px !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.22) !important;
  background: #0f172a !important;
  color: #ffffff !important;
}

.cf-response-template-modal-v2-title {
  margin: 0 !important;
  color: #ffffff !important;
  font-size: 17px !important;
  font-weight: 950 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.02em !important;
}

.cf-response-template-modal-v2-body {
  max-height: calc(92vh - 150px) !important;
  overflow-y: auto !important;
  padding: 18px 24px 20px !important;
  background: #0f172a !important;
  color: #ffffff !important;
  scrollbar-width: thin !important;
  scrollbar-color: #64748b transparent !important;
}

.cf-response-template-modal-v2-card {
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 20px !important;
  border: 1px solid rgba(148, 163, 184, 0.30) !important;
  border-radius: 22px !important;
  background: #111827 !important;
  color: #ffffff !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 34px rgba(2, 6, 23, 0.22) !important;
}

.cf-response-template-modal-v2-card-head {
  margin-bottom: 18px !important;
}

.cf-response-template-modal-v2-card-title {
  margin: 0 !important;
  color: #ffffff !important;
  font-size: 21px !important;
  font-weight: 950 !important;
  line-height: 1.12 !important;
  letter-spacing: -0.03em !important;
}

.cf-response-template-modal-v2-card-subtitle {
  margin: 7px 0 0 !important;
  color: #cbd5e1 !important;
  font-size: 13px !important;
  font-weight: 650 !important;
  line-height: 1.45 !important;
}

.cf-response-template-modal-v2-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 16px !important;
}

.cf-response-template-modal-v2-field {
  display: grid !important;
  gap: 8px !important;
  min-width: 0 !important;
}

.cf-response-template-modal-v2-field label {
  color: #f8fafc !important;
  font-size: 12px !important;
  font-weight: 950 !important;
  line-height: 1.2 !important;
}

.cf-response-template-modal-v2-body-field {
  grid-column: 1 / -1 !important;
}

.cf-response-template-modal-v2-input,
.cf-response-template-modal-v2-textarea {
  width: 100% !important;
  box-sizing: border-box !important;
  border: 1px solid #d0d5dd !important;
  border-radius: 16px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.12) !important;
  caret-color: #2563eb !important;
}

.cf-response-template-modal-v2-input {
  min-height: 46px !important;
  padding: 10px 14px !important;
  font-size: 14px !important;
  line-height: 1.2 !important;
}

.cf-response-template-modal-v2-textarea {
  min-height: 150px !important;
  padding: 14px 15px !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  resize: vertical !important;
}

.cf-response-template-modal-v2-input::placeholder,
.cf-response-template-modal-v2-textarea::placeholder {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

.cf-response-template-modal-v2-input:focus,
.cf-response-template-modal-v2-textarea:focus {
  border-color: #93c5fd !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.20) !important;
  outline: none !important;
}

.cf-response-template-modal-v2-footer {
  padding: 14px 24px 18px !important;
  border-top: 1px solid rgba(148, 163, 184, 0.22) !important;
  background: #0f172a !important;
  gap: 12px !important;
}

.cf-response-template-modal-v2-cancel,
.cf-response-template-modal-v2-submit {
  min-height: 44px !important;
  border-radius: 16px !important;
  font-weight: 950 !important;
}

.cf-response-template-modal-v2-cancel {
  border: 1px solid #cbd5e1 !important;
  background: #ffffff !important;
  color: #111827 !important;
}

.cf-response-template-modal-v2-cancel:hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
}

.cf-response-template-modal-v2-submit {
  border: 1px solid #2563eb !important;
  background: #2563eb !important;
  color: #ffffff !important;
}

.cf-response-template-modal-v2-submit:hover {
  background: #1d4ed8 !important;
}

@media (max-width: 760px) {
  .cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] {
    width: calc(100vw - 14px) !important;
    max-height: 94vh !important;
    border-radius: 24px !important;
  }

  .cf-response-template-modal-v2-header {
    padding: 18px 16px 14px !important;
  }

  .cf-response-template-modal-v2-body {
    max-height: calc(94vh - 146px) !important;
    padding: 14px !important;
  }

  .cf-response-template-modal-v2-card {
    padding: 14px !important;
  }

  .cf-response-template-modal-v2-grid {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }

  .cf-response-template-modal-v2-footer {
    display: grid !important;
    grid-template-columns: 1fr !important;
    padding: 14px !important;
  }

  .cf-response-template-modal-v2-footer button {
    width: 100% !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const nextTsx = fs.readFileSync(tsxPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "closeflow-response-template-modal-source-truth-stage181r.css",
  "cf-response-template-modal-v2",
  "data-response-template-modal-stage181r=\"true\"",
  "cf-response-template-modal-v2-card",
  "cf-response-template-modal-v2-input",
  "cf-response-template-modal-v2-textarea",
  "cf-response-template-modal-v2-footer",
]) {
  if (!nextTsx.includes(token)) failures.push('ResponseTemplates.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181R_RESPONSE_TEMPLATE_MODAL_LEAD_STYLE_SOURCE_TRUTH",
  ".cf-response-template-modal-v2-card",
  "padding: 20px",
  ".cf-response-template-modal-v2-textarea",
  "padding: 14px 15px",
  "background: #111827",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181R local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181R local: response template modal now follows lead-modal spacing and field source truth.');
