const fs = require('fs');

const templatesPath = 'src/pages/Templates.tsx';
const cssPath = 'src/styles/closeflow-template-modal-source-truth-stage181l.css';

let tsx = fs.readFileSync(templatesPath, 'utf8');

// Ensure CSS imports exist. Templates modal already has its own DialogContent and form fields in this file.
if (!tsx.includes("../styles/visual-stage22-event-form-vnext.css")) {
  tsx = tsx.replace(
    "import '../styles/closeflow-record-list-source-truth.css';",
    "import '../styles/closeflow-record-list-source-truth.css';\nimport '../styles/visual-stage22-event-form-vnext.css';"
  );
}

if (!tsx.includes("../styles/closeflow-template-modal-source-truth-stage181l.css")) {
  tsx = tsx.replace(
    "import '../styles/visual-stage22-event-form-vnext.css';",
    "import '../styles/visual-stage22-event-form-vnext.css';\nimport '../styles/closeflow-template-modal-source-truth-stage181l.css';"
  );
}

// Ensure modal has stable selectors.
tsx = tsx.replace(
  /<DialogContent className="max-h-\[90vh\] overflow-hidden border-slate-200 bg-white text-slate-900 shadow-2xl sm:max-w-4xl">/,
  '<DialogContent className="event-form-vnext-content cf-template-modal-content max-h-[92vh] overflow-hidden border-slate-200 bg-white text-slate-900 shadow-2xl sm:max-w-4xl" data-cf-template-modal-source="event-form-vnext" data-template-modal-stage181m="true">'
);

tsx = tsx.replace(
  /data-template-modal-stage181l="true"/g,
  'data-template-modal-stage181m="true"'
);

tsx = tsx.replace(
  /<DialogDescription>Uzupełnij dane szablonu i zapisz zmiany w bibliotece szablonów\.<\/DialogDescription>/,
  '<DialogDescription className="event-form-vnext-description">Uzupełnij dane szablonu i zapisz zmiany w bibliotece szablonów.</DialogDescription>'
);

tsx = tsx.replace(
  /<div className="grid gap-6 overflow-y-auto py-2 pr-1 md:grid-cols-\[280px_minmax\(0,1fr\)\]">/,
  '<div className="event-form-vnext-grid cf-template-modal-grid grid gap-6 overflow-y-auto py-2 pr-1 md:grid-cols-[300px_minmax(0,1fr)]">'
);

tsx = tsx.replace(
  /<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">/,
  '<div className="event-form-card cf-template-modal-help-card rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">'
);

tsx = tsx.replace(
  /className="cf-readable-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"/g,
  'className="event-form-card cf-template-modal-item-card cf-readable-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"'
);

tsx = tsx.replace(
  /<div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">/g,
  '<div className="cf-template-modal-required-row flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">'
);

tsx = tsx.replace(
  /<DialogFooter>/,
  '<DialogFooter className="event-form-footer cf-template-modal-footer">'
);

fs.writeFileSync(templatesPath, tsx, 'utf8');

const css = `/* CLOSEFLOW_STAGE181M_TEMPLATE_MODAL_LIGHT_PORTAL_FIX
   LOCAL ONLY
   Reason: Radix DialogContent can be portaled outside #root, so #root-prefixed rules do not reliably apply.
   Rule: template modal is a light modal. Cards, labels, input zones and footer stay readable.
*/

.cf-template-modal-content[data-template-modal-stage181m="true"],
.cf-template-modal-content[data-template-modal-stage181l="true"] {
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

.cf-template-modal-content[data-template-modal-stage181m="true"] *,
.cf-template-modal-content[data-template-modal-stage181l="true"] * {
  -webkit-text-fill-color: currentColor !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] > button,
.cf-template-modal-content[data-template-modal-stage181l="true"] > button {
  top: 14px !important;
  right: 14px !important;
  width: 38px !important;
  height: 38px !important;
  border-radius: 999px !important;
  background: #f1f5f9 !important;
  color: #334155 !important;
  opacity: 1 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] > button:hover,
.cf-template-modal-content[data-template-modal-stage181l="true"] > button:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] [data-radix-dialog-header],
.cf-template-modal-content[data-template-modal-stage181l="true"] [data-radix-dialog-header],
.cf-template-modal-content[data-template-modal-stage181m="true"] > div:first-child,
.cf-template-modal-content[data-template-modal-stage181l="true"] > div:first-child {
  border-bottom: 1px solid #e4e7ec !important;
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.10), transparent 34%),
    #ffffff !important;
  color: #111827 !important;
  padding: 22px 24px 18px !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] h2,
.cf-template-modal-content[data-template-modal-stage181l="true"] h2 {
  color: #111827 !important;
  font-size: 22px !important;
  line-height: 1.12 !important;
  letter-spacing: -0.03em !important;
  font-weight: 950 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .event-form-vnext-description,
.cf-template-modal-content[data-template-modal-stage181l="true"] .event-form-vnext-description {
  color: #667085 !important;
  font-size: 13px !important;
  line-height: 1.5 !important;
  font-weight: 650 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-grid,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-grid {
  max-height: calc(92vh - 150px) !important;
  overflow-y: auto !important;
  padding: 18px 24px 22px !important;
  background: #f9fafb !important;
  color: #111827 !important;
  gap: 16px !important;
  scrollbar-width: thin !important;
  scrollbar-color: #cbd5e1 transparent !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-help-card,
.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-item-card,
.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-required-row,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-help-card,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-item-card,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-required-row {
  border: 1px solid #e4e7ec !important;
  border-radius: 22px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05) !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-help-card,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-help-card {
  background: #ffffff !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-required-row,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-required-row {
  background: #f8fafc !important;
  box-shadow: none !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] label,
.cf-template-modal-content[data-template-modal-stage181l="true"] label {
  color: #475467 !important;
  font-size: 12px !important;
  font-weight: 850 !important;
  line-height: 1.2 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] p,
.cf-template-modal-content[data-template-modal-stage181m="true"] span,
.cf-template-modal-content[data-template-modal-stage181m="true"] small,
.cf-template-modal-content[data-template-modal-stage181l="true"] p,
.cf-template-modal-content[data-template-modal-stage181l="true"] span,
.cf-template-modal-content[data-template-modal-stage181l="true"] small {
  color: inherit !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .text-slate-950,
.cf-template-modal-content[data-template-modal-stage181m="true"] .font-bold,
.cf-template-modal-content[data-template-modal-stage181l="true"] .text-slate-950,
.cf-template-modal-content[data-template-modal-stage181l="true"] .font-bold {
  color: #111827 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .text-slate-500,
.cf-template-modal-content[data-template-modal-stage181m="true"] .text-slate-600,
.cf-template-modal-content[data-template-modal-stage181l="true"] .text-slate-500,
.cf-template-modal-content[data-template-modal-stage181l="true"] .text-slate-600 {
  color: #64748b !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] input,
.cf-template-modal-content[data-template-modal-stage181m="true"] textarea,
.cf-template-modal-content[data-template-modal-stage181m="true"] [role="combobox"],
.cf-template-modal-content[data-template-modal-stage181l="true"] input,
.cf-template-modal-content[data-template-modal-stage181l="true"] textarea,
.cf-template-modal-content[data-template-modal-stage181l="true"] [role="combobox"] {
  width: 100% !important;
  min-height: 42px !important;
  border: 1px solid #d0d5dd !important;
  border-radius: 16px !important;
  background: #ffffff !important;
  color: #111827 !important;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.03) !important;
  caret-color: #2563eb !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] input::placeholder,
.cf-template-modal-content[data-template-modal-stage181m="true"] textarea::placeholder,
.cf-template-modal-content[data-template-modal-stage181l="true"] input::placeholder,
.cf-template-modal-content[data-template-modal-stage181l="true"] textarea::placeholder {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] input:focus,
.cf-template-modal-content[data-template-modal-stage181m="true"] textarea:focus,
.cf-template-modal-content[data-template-modal-stage181m="true"] [role="combobox"]:focus,
.cf-template-modal-content[data-template-modal-stage181l="true"] input:focus,
.cf-template-modal-content[data-template-modal-stage181l="true"] textarea:focus,
.cf-template-modal-content[data-template-modal-stage181l="true"] [role="combobox"]:focus {
  border-color: #93c5fd !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) !important;
  outline: none !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] textarea,
.cf-template-modal-content[data-template-modal-stage181l="true"] textarea {
  min-height: 86px !important;
  resize: vertical !important;
  line-height: 1.45 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-footer,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer {
  position: sticky !important;
  bottom: 0 !important;
  border-top: 1px solid #e4e7ec !important;
  background: rgba(255, 255, 255, 0.98) !important;
  padding: 14px 24px 18px !important;
  gap: 10px !important;
  box-shadow: 0 -10px 24px rgba(16, 24, 40, 0.05) !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-footer button,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer button {
  min-height: 42px !important;
  border-radius: 16px !important;
  font-weight: 850 !important;
}

.cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-submit,
.cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-submit,
.cf-template-modal-content[data-template-modal-stage181m="true"] button.bg-emerald-600,
.cf-template-modal-content[data-template-modal-stage181l="true"] button.bg-emerald-600 {
  background: #059669 !important;
  color: #ffffff !important;
}

@media (max-width: 760px) {
  .cf-template-modal-content[data-template-modal-stage181m="true"],
  .cf-template-modal-content[data-template-modal-stage181l="true"] {
    width: calc(100vw - 14px) !important;
    max-height: 94vh !important;
    border-radius: 24px !important;
  }

  .cf-template-modal-content[data-template-modal-stage181m="true"] [data-radix-dialog-header],
  .cf-template-modal-content[data-template-modal-stage181l="true"] [data-radix-dialog-header],
  .cf-template-modal-content[data-template-modal-stage181m="true"] > div:first-child,
  .cf-template-modal-content[data-template-modal-stage181l="true"] > div:first-child {
    padding: 18px 16px 14px !important;
  }

  .cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-grid,
  .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-grid {
    max-height: calc(94vh - 142px) !important;
    grid-template-columns: 1fr !important;
    padding: 14px !important;
    gap: 14px !important;
  }

  .cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-footer,
  .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer {
    display: grid !important;
    grid-template-columns: 1fr !important;
    padding: 14px !important;
  }

  .cf-template-modal-content[data-template-modal-stage181m="true"] .cf-template-modal-footer button,
  .cf-template-modal-content[data-template-modal-stage181l="true"] .cf-template-modal-footer button {
    width: 100% !important;
  }
}
`;

fs.writeFileSync(cssPath, css, 'utf8');

const nextTsx = fs.readFileSync(templatesPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  'cf-template-modal-content',
  'data-template-modal-stage181m="true"',
  'cf-template-modal-grid',
  'cf-template-modal-footer',
  "closeflow-template-modal-source-truth-stage181l.css",
]) {
  if (!nextTsx.includes(token)) failures.push('Templates.tsx missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181M_TEMPLATE_MODAL_LIGHT_PORTAL_FIX',
  '.cf-template-modal-content[data-template-modal-stage181m="true"]',
  'background: #ffffff',
  'color: #111827',
  'input',
  'textarea',
  '.cf-template-modal-footer',
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181M local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181M local: template modal is forced to readable light portal-safe style.');
