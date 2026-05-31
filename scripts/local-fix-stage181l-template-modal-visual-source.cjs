const fs = require('fs');

const templatesPath = 'src/pages/Templates.tsx';
const cssPath = 'src/styles/closeflow-template-modal-source-truth-stage181l.css';

let src = fs.readFileSync(templatesPath, 'utf8');
const before = src;

// 1. Import the existing shared modal source + new template-modal adapter.
if (!src.includes("../styles/visual-stage22-event-form-vnext.css")) {
  src = src.replace(
    "import '../styles/closeflow-record-list-source-truth.css';",
    "import '../styles/closeflow-record-list-source-truth.css';\nimport '../styles/visual-stage22-event-form-vnext.css';"
  );
}

if (!src.includes("../styles/closeflow-template-modal-source-truth-stage181l.css")) {
  src = src.replace(
    "import '../styles/visual-stage22-event-form-vnext.css';",
    "import '../styles/visual-stage22-event-form-vnext.css';\nimport '../styles/closeflow-template-modal-source-truth-stage181l.css';"
  );
}

// 2. Put Templates modal on the shared visual contract.
src = src.replace(
  /<DialogContent className="max-h-\[90vh\] overflow-hidden border-slate-200 bg-white text-slate-900 shadow-2xl sm:max-w-4xl">/,
  '<DialogContent className="event-form-vnext-content cf-template-modal-content max-h-[92vh] overflow-hidden border-slate-200 bg-white text-slate-900 shadow-2xl sm:max-w-4xl" data-cf-template-modal-source="event-form-vnext" data-template-modal-stage181l="true">'
);

src = src.replace(
  /<DialogDescription>Uzupełnij dane szablonu i zapisz zmiany w bibliotece szablonów\.<\/DialogDescription>/,
  '<DialogDescription className="event-form-vnext-description">Uzupełnij dane szablonu i zapisz zmiany w bibliotece szablonów.</DialogDescription>'
);

src = src.replace(
  /<div className="grid gap-6 overflow-y-auto py-2 pr-1 md:grid-cols-\[280px_minmax\(0,1fr\)\]">/,
  '<div className="event-form-vnext-grid cf-template-modal-grid grid gap-6 overflow-y-auto py-2 pr-1 md:grid-cols-[300px_minmax(0,1fr)]">'
);

src = src.replace(
  /<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">/,
  '<div className="event-form-card cf-template-modal-help-card rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">'
);

src = src.replace(
  /className="cf-readable-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"/g,
  'className="event-form-card cf-template-modal-item-card cf-readable-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"'
);

src = src.replace(
  /<div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">/g,
  '<div className="cf-template-modal-required-row flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">'
);

src = src.replace(
  /<DialogFooter>/,
  '<DialogFooter className="event-form-footer cf-template-modal-footer">'
);

src = src.replace(
  /<Button variant="outline" className="border-slate-200 bg-white text-slate-800 hover:bg-slate-50" onClick=\{\(\) => setDialogOpen\(false\)\}>Anuluj<\/Button>/,
  '<Button variant="outline" className="cf-template-modal-cancel border-slate-200 bg-white text-slate-800 hover:bg-slate-50" onClick={() => setDialogOpen(false)}>Anuluj</Button>'
);

src = src.replace(
  /<Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick=\{\(\) => void handleSaveTemplate\(\)\} disabled=\{saving\}>/,
  '<Button className="cf-template-modal-submit bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => void handleSaveTemplate()} disabled={saving}>'
);

fs.writeFileSync(templatesPath, src, 'utf8');

// 3. Template-modal adapter CSS. It consumes event-form-vnext visual source and fixes this modal.
const css = `/* CLOSEFLOW_STAGE181L_TEMPLATE_MODAL_VISUAL_SOURCE_TRUTH
   LOCAL ONLY
   Scope: Templates.tsx create/edit case-template modal.
   Source: event-form-vnext visual modal contract.
   Goal: one readable light modal style, no dark surface, no mixed white-on-dark/gray-on-dark form islands.
*/

#root .cf-template-modal-content[data-template-modal-stage181l="true"] {
  width: min(860px, calc(100vw - 20px)) !important;
  max-width: 860px !important;
  max-height: min(92vh, 900px) !important;
  overflow: hidden !important;
  border: 1px solid #e4e7ec !important;
  border-radius: 28px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 24px 70px rgba(16, 24, 40, 0.18) !important;
  padding: 0 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] > button {
  top: 14px !important;
  right: 14px !important;
  width: 38px !important;
  height: 38px !important;
  border-radius: 999px !important;
  background: #f1f5f9 !important;
  color: #334155 !important;
  opacity: 1 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] > button:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] [data-radix-dialog-header],
#root .cf-template-modal-content[data-template-modal-stage181l="true"] > div:first-child {
  border-bottom: 1px solid #e4e7ec !important;
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.10), transparent 34%),
    #ffffff !important;
  padding: 22px 24px 18px !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] h2 {
  color: #111827 !important;
  font-size: 22px !important;
  line-height: 1.12 !important;
  letter-spacing: -0.03em !important;
  font-weight: 950 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .event-form-vnext-description {
  margin-top: 6px !important;
  color: #667085 !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  font-weight: 650 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-grid {
  max-height: calc(92vh - 150px) !important;
  overflow-y: auto !important;
  padding: 18px 24px 22px !important;
  background: #f9fafb !important;
  color: #111827 !important;
  gap: 16px !important;
  scrollbar-width: thin !important;
  scrollbar-color: #cbd5e1 transparent !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-grid::-webkit-scrollbar {
  width: 10px !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-grid::-webkit-scrollbar-thumb {
  border: 3px solid #f9fafb !important;
  border-radius: 999px !important;
  background: #cbd5e1 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-help-card,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-item-card,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-required-row {
  border: 1px solid #e4e7ec !important;
  border-radius: 22px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05) !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-help-card {
  background:
    linear-gradient(180deg, rgba(236, 253, 245, 0.74), rgba(255, 255, 255, 0.96)) !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] p,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] small,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] span,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] label {
  -webkit-text-fill-color: currentColor !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] label {
  color: #475467 !important;
  font-size: 12px !important;
  font-weight: 850 !important;
  line-height: 1.2 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] p {
  color: inherit !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .text-slate-950,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] .font-bold {
  color: #111827 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .text-slate-500,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] .text-slate-600 {
  color: #64748b !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] input,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] textarea,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] [role="combobox"] {
  width: 100% !important;
  min-height: 42px !important;
  border: 1px solid #e4e7ec !important;
  border-radius: 18px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.03) !important;
  caret-color: #2563eb !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] input::placeholder,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] textarea::placeholder {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] input:focus,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] textarea:focus,
#root .cf-template-modal-content[data-template-modal-stage181l="true"] [role="combobox"]:focus {
  border-color: #93c5fd !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
  outline: none !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] textarea {
  min-height: 86px !important;
  resize: vertical !important;
  line-height: 1.45 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-required-row {
  background: #f8fafc !important;
  box-shadow: none !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-item-card > div:first-child {
  align-items: flex-start !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-item-card button[data-cf-trash-action="true"],
#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-item-card .cf-entity-action-danger {
  border: 1px solid rgba(220, 38, 38, 0.20) !important;
  background: #ffffff !important;
  color: #dc2626 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-item-card .cf-entity-action-danger:hover {
  background: #fef2f2 !important;
  border-color: rgba(220, 38, 38, 0.34) !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer {
  position: sticky !important;
  bottom: 0 !important;
  border-top: 1px solid #e4e7ec !important;
  background: rgba(255, 255, 255, 0.98) !important;
  padding: 14px 24px 18px !important;
  gap: 10px !important;
  box-shadow: 0 -10px 24px rgba(16, 24, 40, 0.05) !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer button {
  min-height: 42px !important;
  border-radius: 16px !important;
  font-weight: 850 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-cancel {
  background: #ffffff !important;
  color: #334155 !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-submit {
  background: #059669 !important;
  color: #ffffff !important;
}

#root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-submit:hover {
  background: #047857 !important;
}

@media (max-width: 760px) {
  #root .cf-template-modal-content[data-template-modal-stage181l="true"] {
    width: calc(100vw - 14px) !important;
    max-height: 94vh !important;
    border-radius: 24px !important;
  }

  #root .cf-template-modal-content[data-template-modal-stage181l="true"] [data-radix-dialog-header],
  #root .cf-template-modal-content[data-template-modal-stage181l="true"] > div:first-child {
    padding: 18px 16px 14px !important;
  }

  #root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-grid {
    max-height: calc(94vh - 142px) !important;
    grid-template-columns: 1fr !important;
    padding: 14px !important;
    gap: 14px !important;
  }

  #root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer {
    display: grid !important;
    grid-template-columns: 1fr !important;
    padding: 14px !important;
  }

  #root .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer button {
    width: 100% !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const next = fs.readFileSync(templatesPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "visual-stage22-event-form-vnext.css",
  "closeflow-template-modal-source-truth-stage181l.css",
  "event-form-vnext-content cf-template-modal-content",
  'data-template-modal-stage181l="true"',
  "event-form-vnext-grid cf-template-modal-grid",
  "event-form-footer cf-template-modal-footer",
]) {
  if (!next.includes(token)) failures.push('Templates.tsx missing token: ' + token);
}

for (const token of [
  "CLOSEFLOW_STAGE181L_TEMPLATE_MODAL_VISUAL_SOURCE_TRUTH",
  ".cf-template-modal-content",
  "background: #ffffff",
  "color: #111827",
  "cf-template-modal-grid",
  "cf-template-modal-footer",
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181L local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (before === next) {
  console.log('Templates.tsx already had Stage181L bindings.');
} else {
  console.log('Patched Templates.tsx Stage181L locally.');
}

console.log('OK Stage181L local: template modal uses shared readable visual source truth.');
