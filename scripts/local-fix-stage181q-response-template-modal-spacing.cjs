const fs = require('fs');

const tsxPath = 'src/pages/ResponseTemplates.tsx';
const cssPath = 'src/styles/closeflow-response-template-modal-source-truth-stage181q.css';

let src = fs.readFileSync(tsxPath, 'utf8');

// 1. Ensure shared modal CSS and adapter CSS are imported.
if (!src.includes("../styles/visual-stage22-event-form-vnext.css")) {
  src = src.replace(
    "import '../styles/closeflow-page-header-v2.css';",
    "import '../styles/closeflow-page-header-v2.css';\nimport '../styles/visual-stage22-event-form-vnext.css';"
  );
}

if (!src.includes("../styles/closeflow-response-template-modal-source-truth-stage181q.css")) {
  src = src.replace(
    "import '../styles/visual-stage22-event-form-vnext.css';",
    "import '../styles/visual-stage22-event-form-vnext.css';\nimport '../styles/closeflow-response-template-modal-source-truth-stage181q.css';"
  );
}

// 2. Bind modal to source truth classes.
src = src.replace(
  /<DialogContent className="max-h-\[90vh\] overflow-y-auto sm:max-w-3xl">/,
  '<DialogContent className="event-form-vnext-content cf-response-template-modal-content max-h-[92vh] overflow-hidden sm:max-w-3xl" data-response-template-modal-stage181q="true">'
);

src = src.replace(
  /<DialogHeader>/,
  '<DialogHeader className="cf-response-template-modal-header">'
);

src = src.replace(
  /<DialogTitle>\{editingId \? 'Edytuj szablon odpowiedzi' : 'Nowy szablon odpowiedzi'\}<\/DialogTitle>/,
  '<DialogTitle className="cf-response-template-modal-title">{editingId ? \\'Edytuj szablon odpowiedzi\\' : \\'Nowy szablon odpowiedzi\\'}</DialogTitle>'
);

src = src.replace(
  /<div className="grid gap-4 py-2 md:grid-cols-2">/,
  '<div className="event-form-vnext cf-response-template-modal-grid grid gap-5 md:grid-cols-2">'
);

src = src.replace(
  /<div className="grid gap-2">\s*<Label>Nazwa<\/Label>\s*<Input value=\{name\} onChange=\{\(event\) => setName\(event\.target\.value\)\} placeholder="Np\. Przypomnienie po braku odpowiedzi" \/>\s*<\/div>/,
  '<div className="event-form-field cf-response-template-modal-field"><Label>Nazwa</Label><Input className="cf-response-template-modal-input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Np. Przypomnienie po braku odpowiedzi" /></div>'
);

src = src.replace(
  /<div className="grid gap-2">\s*<Label>Kategoria<\/Label>\s*<Input value=\{category\} onChange=\{\(event\) => setCategory\(event\.target\.value\)\} placeholder="Np\. Follow-up" \/>\s*<\/div>/,
  '<div className="event-form-field cf-response-template-modal-field"><Label>Kategoria</Label><Input className="cf-response-template-modal-input" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Np. Follow-up" /></div>'
);

src = src.replace(
  /<div className="grid gap-2">\s*<Label>Tagi \(po przecinku\)<\/Label>\s*<Input value=\{tags\} onChange=\{\(event\) => setTags\(event\.target\.value\)\} placeholder="np\. lead, oferta, przypomnienie" \/>\s*<\/div>/,
  '<div className="event-form-field cf-response-template-modal-field"><Label>Tagi (po przecinku)</Label><Input className="cf-response-template-modal-input" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="np. lead, oferta, przypomnienie" /></div>'
);

src = src.replace(
  /<div className="grid gap-2">\s*<Label>Zmienne \(po przecinku\)<\/Label>\s*<Input value=\{variables\} onChange=\{\(event\) => setVariables\(event\.target\.value\)\} placeholder="np\. client_name, case_title, my_name" \/>\s*<\/div>/,
  '<div className="event-form-field cf-response-template-modal-field"><Label>Zmienne (po przecinku)</Label><Input className="cf-response-template-modal-input" value={variables} onChange={(event) => setVariables(event.target.value)} placeholder="np. client_name, case_title, my_name" /></div>'
);

src = src.replace(
  /<div className="grid gap-2 md:col-span-2">\s*<Label>Treść<\/Label>\s*<Textarea rows=\{10\} value=\{body\} onChange=\{\(event\) => setBody\(event\.target\.value\)\} placeholder="Wpisz treść odpowiedzi\. Możesz używać zmiennych typu \{\{client_name\}\}\." \/>\s*<\/div>/,
  '<div className="event-form-field cf-response-template-modal-field cf-response-template-modal-body-field md:col-span-2"><Label>Treść</Label><Textarea className="cf-response-template-modal-textarea" rows={10} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Wpisz treść odpowiedzi. Możesz używać zmiennych typu {{client_name}}." /></div>'
);

src = src.replace(
  /<DialogFooter>/,
  '<DialogFooter className="event-form-footer cf-response-template-modal-footer">'
);

src = src.replace(
  /<Button variant="outline" onClick=\{\(\) => setOpen\(false\)\}>Anuluj<\/Button>/,
  '<Button variant="outline" className="cf-response-template-modal-cancel" onClick={() => setOpen(false)}>Anuluj</Button>'
);

src = src.replace(
  /<Button onClick=\{\(\) => void save\(\)\} disabled=\{saving\}><Save className="h-4 w-4" \/> \{saving \? 'Zapisywanie\.\.\.' : 'Zapisz'\}<\/Button>/,
  '<Button className="cf-response-template-modal-submit" onClick={() => void save()} disabled={saving}><Save className="h-4 w-4" /> {saving ? \\'Zapisywanie...\\' : \\'Zapisz\\'}</Button>'
);

fs.writeFileSync(tsxPath, src, 'utf8');

// 3. Adapter CSS. Portal-safe, no #root dependency.
const css = `/* CLOSEFLOW_STAGE181Q_RESPONSE_TEMPLATE_MODAL_SOURCE_TRUTH
   LOCAL ONLY
   Scope: ResponseTemplates create/edit modal.
   Goal: use the same readable modal rhythm as other small dialogs.
   Fix: body textarea and fields must not sit too close to modal edges.
*/

.cf-response-template-modal-content[data-response-template-modal-stage181q="true"] {
  width: min(780px, calc(100vw - 20px)) !important;
  max-width: 780px !important;
  max-height: min(92vh, 900px) !important;
  overflow: hidden !important;
  border: 1px solid #e4e7ec !important;
  border-radius: 28px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 24px 70px rgba(16, 24, 40, 0.18) !important;
  padding: 0 !important;
}

.cf-response-template-modal-content[data-response-template-modal-stage181q="true"] * {
  -webkit-text-fill-color: currentColor !important;
}

.cf-response-template-modal-content[data-response-template-modal-stage181q="true"] > button {
  top: 14px !important;
  right: 14px !important;
  width: 38px !important;
  height: 38px !important;
  border-radius: 999px !important;
  background: #f1f5f9 !important;
  color: #111827 !important;
  opacity: 1 !important;
}

.cf-response-template-modal-header {
  padding: 22px 24px 18px !important;
  border-bottom: 1px solid #e4e7ec !important;
  background: #ffffff !important;
  color: #111827 !important;
}

.cf-response-template-modal-title {
  margin: 0 !important;
  color: #111827 !important;
  font-size: 22px !important;
  font-weight: 950 !important;
  line-height: 1.12 !important;
  letter-spacing: -0.03em !important;
}

.cf-response-template-modal-grid {
  max-height: calc(92vh - 150px) !important;
  overflow-y: auto !important;
  padding: 22px 24px 24px !important;
  background: #0f172a !important;
  color: #ffffff !important;
  gap: 16px !important;
  scrollbar-width: thin !important;
  scrollbar-color: #64748b transparent !important;
}

.cf-response-template-modal-field {
  display: grid !important;
  gap: 8px !important;
}

.cf-response-template-modal-field label {
  color: #e5e7eb !important;
  font-size: 12px !important;
  font-weight: 900 !important;
  line-height: 1.2 !important;
}

.cf-response-template-modal-input,
.cf-response-template-modal-textarea {
  width: 100% !important;
  border: 1px solid #d0d5dd !important;
  border-radius: 16px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.08) !important;
  caret-color: #2563eb !important;
}

.cf-response-template-modal-input {
  min-height: 44px !important;
  padding: 10px 13px !important;
}

.cf-response-template-modal-textarea {
  min-height: 150px !important;
  padding: 14px 14px !important;
  line-height: 1.5 !important;
  resize: vertical !important;
}

.cf-response-template-modal-input::placeholder,
.cf-response-template-modal-textarea::placeholder {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

.cf-response-template-modal-input:focus,
.cf-response-template-modal-textarea:focus {
  border-color: #93c5fd !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.16) !important;
  outline: none !important;
}

.cf-response-template-modal-body-field {
  padding-top: 2px !important;
}

.cf-response-template-modal-footer {
  padding: 14px 24px 18px !important;
  border-top: 1px solid #e4e7ec !important;
  background: #ffffff !important;
  gap: 12px !important;
  box-shadow: 0 -10px 28px rgba(15, 23, 42, 0.08) !important;
}

.cf-response-template-modal-cancel,
.cf-response-template-modal-submit {
  min-height: 44px !important;
  border-radius: 16px !important;
  font-weight: 900 !important;
}

.cf-response-template-modal-cancel {
  border: 1px solid #cbd5e1 !important;
  background: #ffffff !important;
  color: #111827 !important;
}

.cf-response-template-modal-cancel:hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
}

.cf-response-template-modal-submit {
  border: 1px solid #2563eb !important;
  background: #2563eb !important;
  color: #ffffff !important;
}

.cf-response-template-modal-submit:hover {
  background: #1d4ed8 !important;
}

@media (max-width: 760px) {
  .cf-response-template-modal-content[data-response-template-modal-stage181q="true"] {
    width: calc(100vw - 14px) !important;
    max-height: 94vh !important;
    border-radius: 24px !important;
  }

  .cf-response-template-modal-header {
    padding: 18px 16px 14px !important;
  }

  .cf-response-template-modal-grid {
    max-height: calc(94vh - 146px) !important;
    grid-template-columns: 1fr !important;
    padding: 16px !important;
    gap: 14px !important;
  }

  .cf-response-template-modal-footer {
    display: grid !important;
    grid-template-columns: 1fr !important;
    padding: 14px !important;
  }

  .cf-response-template-modal-footer button {
    width: 100% !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const nextTsx = fs.readFileSync(tsxPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "closeflow-response-template-modal-source-truth-stage181q.css",
  "cf-response-template-modal-content",
  "data-response-template-modal-stage181q=\"true\"",
  "cf-response-template-modal-grid",
  "cf-response-template-modal-textarea",
  "cf-response-template-modal-footer",
]) {
  if (!nextTsx.includes(token)) failures.push('ResponseTemplates.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181Q_RESPONSE_TEMPLATE_MODAL_SOURCE_TRUTH",
  ".cf-response-template-modal-grid",
  "padding: 22px 24px 24px",
  ".cf-response-template-modal-textarea",
  "padding: 14px 14px",
  ".cf-response-template-modal-footer",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181Q local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181Q local: response template modal uses shared readable spacing source truth.');
