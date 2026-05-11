#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2_REPAIR
 * Purpose: replace the split dark/light modal look with one readable light operator dialog contract.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const relPath = (rel) => path.join(root, rel);
const read = (rel) => fs.readFileSync(relPath(rel), 'utf8');
const write = (rel, text) => {
  fs.mkdirSync(path.dirname(relPath(rel)), { recursive: true });
  fs.writeFileSync(relPath(rel), text, 'utf8');
  console.log('updated ' + rel.replace(/\\/g, '/'));
};
const exists = (rel) => fs.existsSync(relPath(rel));
const fail = (msg) => { console.error('✖ ' + msg); process.exit(1); };

const dialogRel = 'src/components/ui/dialog.tsx';
if (!exists(dialogRel)) fail('missing ' + dialogRel);
let dialog = read(dialogRel);
if (!dialog.includes('CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1')) {
  dialog = '/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1: all operator DialogContent surfaces use one visual contract. */\n' + dialog;
}
if (!dialog.includes('data-closeflow-modal-visual-system="true"')) {
  const pattern = /ref=\{ref\}(\r?\n\s*)aria-describedby=\{ariaDescribedBy \?\? undefined\}/;
  if (pattern.test(dialog)) {
    dialog = dialog.replace(pattern, 'ref={ref}$1data-closeflow-modal-visual-system="true"$1aria-describedby={ariaDescribedBy ?? undefined}');
  } else {
    const fallback = /(<DialogPrimitive\.Content[\s\S]*?ref=\{ref\})/;
    if (!fallback.test(dialog)) fail('cannot locate DialogPrimitive.Content ref marker');
    dialog = dialog.replace(fallback, '$1\n      data-closeflow-modal-visual-system="true"');
  }
}
if (!dialog.includes('cf-modal-surface')) {
  dialog = dialog.replace('"fixed left-[50%] top-[50%]', '"cf-modal-surface fixed left-[50%] top-[50%]');
}
if (!dialog.includes('cf-modal-header')) {
  dialog = dialog.replace('"flex flex-col space-y-1.5 text-center sm:text-left"', '"cf-modal-header flex flex-col space-y-1.5 text-center sm:text-left"');
}
if (!dialog.includes('cf-modal-footer')) {
  dialog = dialog.replace('"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"', '"cf-modal-footer flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"');
}
if (!dialog.includes('cf-modal-title')) {
  dialog = dialog.replace('"text-lg font-semibold leading-none tracking-tight"', '"cf-modal-title text-lg font-semibold leading-none tracking-tight"');
}
if (!dialog.includes('cf-modal-close')) {
  dialog = dialog.replace('className="absolute right-4 top-4', 'className="cf-modal-close absolute right-4 top-4');
}
write(dialogRel, dialog);

const appRel = 'src/App.tsx';
if (!exists(appRel)) fail('missing ' + appRel);
let app = read(appRel);
const importLine = "import './styles/closeflow-modal-visual-system.css';";
if (!app.includes(importLine)) {
  const anchor = "import './styles/closeflow-surface-tokens.css';";
  app = app.includes(anchor)
    ? app.replace(anchor, anchor + "\n" + importLine)
    : app.replace("import './styles/closeflow-action-tokens.css';", "import './styles/closeflow-action-tokens.css';\n" + importLine);
  write(appRel, app);
}

const css = "/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1\n   CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2\n   owner: CloseFlow UI system\n   reason: unified, readable, light operator dialogs without dark header/body split.\n   source_of_truth: src/components/ui/dialog.tsx + this stylesheet\n   scope: all Radix DialogContent surfaces in the operator app\n*/\n\n:root {\n  --cf-modal-bg: #f8fafc;\n  --cf-modal-panel: #ffffff;\n  --cf-modal-ink: #0f172a;\n  --cf-modal-muted: #475569;\n  --cf-modal-soft: #eef2f7;\n  --cf-modal-border: rgba(148, 163, 184, 0.38);\n  --cf-modal-border-strong: rgba(15, 23, 42, 0.14);\n  --cf-modal-accent: #16a34a;\n  --cf-modal-accent-soft: rgba(22, 163, 74, 0.10);\n  --cf-modal-accent-strong: #15803d;\n  --cf-modal-focus: rgba(22, 163, 74, 0.20);\n  --cf-modal-danger: #dc2626;\n  --cf-modal-shadow: 0 28px 80px rgba(15, 23, 42, 0.26), 0 0 0 1px rgba(255, 255, 255, 0.86) inset;\n}\n\n.cf-modal-surface,\n[data-closeflow-modal-visual-system=\"true\"] {\n  color: var(--cf-modal-ink) !important;\n  background: linear-gradient(180deg, var(--cf-modal-panel) 0%, var(--cf-modal-bg) 100%) !important;\n  border: 1px solid var(--cf-modal-border) !important;\n  box-shadow: var(--cf-modal-shadow) !important;\n  overflow-y: auto;\n  max-height: min(92vh, 920px);\n}\n\n.cf-modal-surface::before,\n[data-closeflow-modal-visual-system=\"true\"]::before {\n  content: \"\";\n  position: absolute;\n  inset: 0 0 auto 0;\n  height: 0.26rem;\n  background: linear-gradient(90deg, var(--cf-modal-accent), rgba(22, 163, 74, 0.22), transparent);\n  pointer-events: none;\n}\n\n.cf-modal-header,\n[data-closeflow-modal-visual-system=\"true\"] .cf-modal-header,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-header {\n  margin: -1.5rem -1.5rem 0 !important;\n  padding: 1.25rem 1.5rem 1.05rem !important;\n  color: var(--cf-modal-ink) !important;\n  background: linear-gradient(180deg, #ffffff 0%, rgba(248, 250, 252, 0.96) 100%) !important;\n  border-bottom: 1px solid var(--cf-modal-border) !important;\n  border-radius: inherit;\n  border-bottom-left-radius: 0 !important;\n  border-bottom-right-radius: 0 !important;\n}\n\n.cf-modal-title,\n[data-closeflow-modal-visual-system=\"true\"] .cf-modal-title,\n[data-closeflow-modal-visual-system=\"true\"] [data-radix-dialog-title],\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-header h2,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-header h3 {\n  color: var(--cf-modal-ink) !important;\n  -webkit-text-fill-color: var(--cf-modal-ink) !important;\n  letter-spacing: -0.02em;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-header p,\n[data-closeflow-modal-visual-system=\"true\"] .cf-modal-header p,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-kicker {\n  color: var(--cf-modal-muted) !important;\n  -webkit-text-fill-color: var(--cf-modal-muted) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-kicker {\n  display: inline-flex;\n  width: fit-content;\n  align-items: center;\n  border-radius: 999px;\n  background: var(--cf-modal-accent-soft) !important;\n  color: var(--cf-modal-accent-strong) !important;\n  -webkit-text-fill-color: var(--cf-modal-accent-strong) !important;\n  padding: 0.18rem 0.55rem;\n  font-weight: 800;\n  letter-spacing: 0.04em;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] form,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form,\n[data-closeflow-modal-visual-system=\"true\"] .space-y-4 {\n  color: var(--cf-modal-ink) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] label,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-field label,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-section h3,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-section-head h3 {\n  color: var(--cf-modal-ink) !important;\n  -webkit-text-fill-color: var(--cf-modal-ink) !important;\n  font-weight: 750;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-section-head p,\n[data-closeflow-modal-visual-system=\"true\"] p,\n[data-closeflow-modal-visual-system=\"true\"] .text-slate-500,\n[data-closeflow-modal-visual-system=\"true\"] .text-slate-600,\n[data-closeflow-modal-visual-system=\"true\"] .sub,\n[data-closeflow-modal-visual-system=\"true\"] .mini {\n  color: var(--cf-modal-muted) !important;\n  -webkit-text-fill-color: var(--cf-modal-muted) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] input:not([type=\"checkbox\"]):not([type=\"radio\"]),\n[data-closeflow-modal-visual-system=\"true\"] textarea,\n[data-closeflow-modal-visual-system=\"true\"] select,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-textarea {\n  color: var(--cf-modal-ink) !important;\n  -webkit-text-fill-color: var(--cf-modal-ink) !important;\n  caret-color: var(--cf-modal-accent-strong) !important;\n  background: #ffffff !important;\n  border: 1px solid #cbd5e1 !important;\n  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] input::placeholder,\n[data-closeflow-modal-visual-system=\"true\"] textarea::placeholder,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-textarea::placeholder {\n  color: #64748b !important;\n  -webkit-text-fill-color: #64748b !important;\n  opacity: 1 !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] input:focus,\n[data-closeflow-modal-visual-system=\"true\"] textarea:focus,\n[data-closeflow-modal-visual-system=\"true\"] select:focus,\n[data-closeflow-modal-visual-system=\"true\"] input:focus-visible,\n[data-closeflow-modal-visual-system=\"true\"] textarea:focus-visible,\n[data-closeflow-modal-visual-system=\"true\"] select:focus-visible,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-textarea:focus {\n  border-color: var(--cf-modal-accent-strong) !important;\n  outline: none !important;\n  box-shadow: 0 0 0 3px var(--cf-modal-focus), 0 1px 2px rgba(15, 23, 42, 0.05) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] input:disabled,\n[data-closeflow-modal-visual-system=\"true\"] textarea:disabled,\n[data-closeflow-modal-visual-system=\"true\"] select:disabled {\n  background: #f1f5f9 !important;\n  color: #64748b !important;\n  -webkit-text-fill-color: #64748b !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-section,\n[data-closeflow-modal-visual-system=\"true\"] .rounded-2xl.border,\n[data-closeflow-modal-visual-system=\"true\"] .rounded-xl.border {\n  background-color: rgba(255, 255, 255, 0.92) !important;\n  border-color: var(--cf-modal-border) !important;\n  color: var(--cf-modal-ink) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] .bg-slate-50,\n[data-closeflow-modal-visual-system=\"true\"] .bg-white {\n  color: var(--cf-modal-ink) !important;\n}\n\n.cf-modal-footer,\n[data-closeflow-modal-visual-system=\"true\"] .cf-modal-footer,\n[data-closeflow-modal-visual-system=\"true\"] .client-case-form-footer,\n[data-closeflow-modal-visual-system=\"true\"] [class*=\"cf-modal-footer\"],\n[data-closeflow-modal-visual-system=\"true\"] [class*=\"cf-form-actions\"] {\n  margin: 0 -1.5rem -1.5rem !important;\n  padding: 0.9rem 1.5rem !important;\n  background: rgba(248, 250, 252, 0.98) !important;\n  border-top: 1px solid var(--cf-modal-border) !important;\n  backdrop-filter: blur(8px);\n}\n\n[data-closeflow-modal-visual-system=\"true\"] button[type=\"submit\"],\n[data-closeflow-modal-visual-system=\"true\"] .btn.primary {\n  background: var(--cf-modal-accent) !important;\n  border-color: var(--cf-modal-accent-strong) !important;\n  color: #ffffff !important;\n  -webkit-text-fill-color: #ffffff !important;\n  box-shadow: 0 10px 20px rgba(22, 163, 74, 0.20) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] button[type=\"submit\"]:hover,\n[data-closeflow-modal-visual-system=\"true\"] .btn.primary:hover {\n  background: var(--cf-modal-accent-strong) !important;\n}\n\n[data-closeflow-modal-visual-system=\"true\"] button[type=\"button\"].border,\n[data-closeflow-modal-visual-system=\"true\"] button[type=\"button\"][class*=\"outline\"],\n[data-closeflow-modal-visual-system=\"true\"] .cf-modal-footer button[type=\"button\"] {\n  border-color: #cbd5e1 !important;\n  background: #ffffff !important;\n  color: var(--cf-modal-ink) !important;\n  -webkit-text-fill-color: var(--cf-modal-ink) !important;\n}\n\n.cf-modal-close,\n[data-closeflow-modal-visual-system=\"true\"] .cf-modal-close {\n  color: #64748b !important;\n  background: rgba(255, 255, 255, 0.84) !important;\n  border: 1px solid rgba(148, 163, 184, 0.32) !important;\n}\n\n.cf-modal-close:hover,\n[data-closeflow-modal-visual-system=\"true\"] .cf-modal-close:hover {\n  color: var(--cf-modal-ink) !important;\n  background: #ffffff !important;\n}\n\n@media (max-width: 640px) {\n  .cf-modal-surface,\n  [data-closeflow-modal-visual-system=\"true\"] {\n    width: calc(100vw - 1rem) !important;\n    max-width: calc(100vw - 1rem) !important;\n    max-height: calc(100dvh - 1rem) !important;\n    border-radius: 1.25rem !important;\n  }\n\n  .cf-modal-footer,\n  [data-closeflow-modal-visual-system=\"true\"] .cf-modal-footer,\n  [data-closeflow-modal-visual-system=\"true\"] .client-case-form-footer {\n    position: sticky;\n    bottom: -1.5rem;\n    z-index: 2;\n  }\n}\n";
write('src/styles/closeflow-modal-visual-system.css', css);

const doc = `# CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2 — 2026-05-11

## Cel

Wycofać zły kierunek V1: ciemny nagłówek + jasne pola + niespójne stopki.

## Nowy kierunek

Modal ma być spokojny, jasny, czytelny i podobny w każdym miejscu:

- jasna karta,
- ciemny tekst,
- białe pola wpisywania,
- zielony akcent tylko jako focus, cienki pasek i główny przycisk,
- bez dużego ciemnego headera,
- bez ciemnego body w jednym modalu i jasnego body w drugim.

## Dotyczy

- Nowy lead,
- Nowy klient,
- Nowa sprawa,
- Nowe wydarzenie,
- Nowe zadanie,
- Szybki szkic,
- Szablony,
- Szkice AI i konflikty, jeśli korzystają ze wspólnego DialogContent.

## Kryterium ręczne

Otwórz minimum: Lead, Zadanie, Wydarzenie, Klient, Szybki szkic.
Wszystkie mają wyglądać jak ten sam produkt, bez czarnego bloku treści i bez białych napisów na jasnym tle.
`;
write('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2_2026-05-11.md', doc);

const guard = `#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (msg) => { console.error('✖ ' + msg); process.exit(1); };
const css = read('src/styles/closeflow-modal-visual-system.css');
const dialog = read('src/components/ui/dialog.tsx');

[
  'CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2',
  'background: linear-gradient(180deg, var(--cf-modal-panel) 0%, var(--cf-modal-bg) 100%) !important;',
  'background: linear-gradient(180deg, #ffffff 0%, rgba(248, 250, 252, 0.96) 100%) !important;',
  'color: var(--cf-modal-ink) !important;',
  'background: #ffffff !important;',
  'color: #ffffff !important;',
  '[data-closeflow-modal-visual-system="true"] input:not([type="checkbox"]):not([type="radio"])',
  '[data-closeflow-modal-visual-system="true"] textarea',
  '[data-closeflow-modal-visual-system="true"] select',
].forEach((needle) => {
  if (!css.includes(needle)) fail('modal readable v2 CSS missing: ' + needle);
});

[
  '--cf-modal-header-bg',
  '--cf-modal-header-bg-2',
  '--cf-modal-header-ink',
  'radial-gradient(circle at 100% 0%',
  'linear-gradient(135deg, var(--cf-modal-header-bg)',
  '-webkit-text-fill-color: #04130a',
].forEach((needle) => {
  if (css.includes(needle)) fail('modal readable v2 still contains dark/split V1 token: ' + needle);
});

if (!dialog.includes('data-closeflow-modal-visual-system="true"')) fail('dialog marker missing');
if (!dialog.includes('cf-modal-surface')) fail('dialog surface class missing');
console.log('✔ CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2 guard passed');
`;
write('scripts/check-closeflow-modal-visual-system-readable-v2.cjs', guard);

const pkgRel = 'package.json';
if (!exists(pkgRel)) fail('missing package.json');
const pkg = JSON.parse(read(pkgRel));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:modal-visual-system-readable-v2'] = 'node scripts/check-closeflow-modal-visual-system-readable-v2.cjs';
write(pkgRel, JSON.stringify(pkg, null, 2) + '\n');

const repairScript = `#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_REPAIR
 * CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2
 * CRLF/LF-safe idempotent repair. This script delegates to the readable V2 repair contract.
 */
require('./repair-closeflow-modal-visual-system-readable-v2.cjs');
`;
write('tools/repair-closeflow-modal-visual-system.cjs', repairScript);

const finalCss = read('src/styles/closeflow-modal-visual-system.css');
if (finalCss.includes('--cf-modal-header-bg')) fail('dark header token still present');
if (!finalCss.includes('CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2')) fail('readable v2 marker missing');
console.log('✔ CLOSEFLOW_MODAL_VISUAL_SYSTEM_READABLE_V2 repair applied');
