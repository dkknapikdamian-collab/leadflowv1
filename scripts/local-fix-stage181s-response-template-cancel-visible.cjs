const fs = require('fs');

const cssPath = 'src/styles/closeflow-response-template-modal-source-truth-stage181r.css';
let css = fs.readFileSync(cssPath, 'utf8');

const block = `

/* CLOSEFLOW_STAGE181S_RESPONSE_TEMPLATE_CANCEL_ALWAYS_VISIBLE
   LOCAL ONLY
   Fix: global button styles made "Anuluj" white until hover.
   Rule: cancel button is always visible, black text on white background.
*/
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel,
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel:not(:hover),
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel:not(:focus),
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel:not(:active),
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel[variant="outline"] {
  background: #ffffff !important;
  color: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
  border: 1px solid #cbd5e1 !important;
  opacity: 1 !important;
}

.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel *,
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel span,
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel svg {
  color: #111827 !important;
  stroke: #111827 !important;
  -webkit-text-fill-color: #111827 !important;
}

.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel:hover,
.cf-response-template-modal-v2[data-response-template-modal-stage181r="true"] .cf-response-template-modal-v2-cancel:focus-visible {
  background: #f1f5f9 !important;
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
  border-color: #94a3b8 !important;
  box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.16) !important;
}
`;

if (!css.includes('CLOSEFLOW_STAGE181S_RESPONSE_TEMPLATE_CANCEL_ALWAYS_VISIBLE')) {
  css += block;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Patched Stage181S locally.');
} else {
  console.log('Stage181S already present.');
}

const next = fs.readFileSync(cssPath, 'utf8');

const failures = [];
for (const token of [
  'CLOSEFLOW_STAGE181S_RESPONSE_TEMPLATE_CANCEL_ALWAYS_VISIBLE',
  '.cf-response-template-modal-v2-cancel:not(:hover)',
  '-webkit-text-fill-color: #111827',
  'background: #ffffff',
  'color: #111827',
]) {
  if (!next.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181S local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK Stage181S local: Anuluj button is always visible.');
