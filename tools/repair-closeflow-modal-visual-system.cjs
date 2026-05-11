#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_REPAIR
 * Purpose: one visual source of truth for all operator dialogs/modals.
 * Scope: DialogContent base component + global modal stylesheet + mapping evidence.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const posix = (p) => p.split(path.sep).join('/');
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function write(rel, content) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), content, 'utf8');
  console.log('updated ' + posix(rel));
}
function ensureFile(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) throw new Error('Missing required file: ' + rel);
}
function ensureContains(rel, needle) {
  const text = read(rel);
  if (!text.includes(needle)) throw new Error(`${rel} is missing expected marker: ${needle}`);
}

const filesToCheck = [
  'src/App.tsx',
  'src/components/ui/dialog.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/components/QuickAiCapture.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Templates.tsx',
  'src/pages/ResponseTemplates.tsx',
  'src/pages/AiDrafts.tsx',
  'src/components/EntityConflictDialog.tsx',
];
for (const rel of filesToCheck) ensureFile(rel);

// 1) Dialog primitive becomes the single entry point for modal styling.
{
  const rel = 'src/components/ui/dialog.tsx';
  let text = read(rel);
  if (!text.includes('CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1')) {
    text = '/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1: all operator DialogContent surfaces use one visual contract. */\n' + text;
  }
  if (!text.includes('data-closeflow-modal-visual-system="true"')) {
    text = text.replace('ref={ref}\n      aria-describedby={ariaDescribedBy ?? undefined}', 'ref={ref}\n      data-closeflow-modal-visual-system="true"\n      aria-describedby={ariaDescribedBy ?? undefined}');
  }
  if (!text.includes('cf-modal-surface fixed left-[50%]')) {
    text = text.replace('"fixed left-[50%] top-[50%]', '"cf-modal-surface fixed left-[50%] top-[50%]');
  }
  if (!text.includes('cf-modal-close absolute right-4 top-4')) {
    text = text.replace('className="absolute right-4 top-4', 'className="cf-modal-close absolute right-4 top-4');
  }
  if (!text.includes('"cf-modal-header flex flex-col')) {
    text = text.replace('"flex flex-col space-y-1.5 text-center sm:text-left"', '"cf-modal-header flex flex-col space-y-1.5 text-center sm:text-left"');
  }
  if (!text.includes('"cf-modal-footer flex flex-col-reverse')) {
    text = text.replace('"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"', '"cf-modal-footer flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"');
  }
  if (!text.includes('"cf-modal-title text-lg')) {
    text = text.replace('"text-lg font-semibold leading-none tracking-tight"', '"cf-modal-title text-lg font-semibold leading-none tracking-tight"');
  }
  write(rel, text);
}

// 2) Global import for the modal visual contract.
{
  const rel = 'src/App.tsx';
  let text = read(rel);
  const importLine = "import './styles/closeflow-modal-visual-system.css';";
  if (!text.includes(importLine)) {
    const anchor = "import './styles/closeflow-surface-tokens.css';";
    if (text.includes(anchor)) {
      text = text.replace(anchor, anchor + "\n" + importLine);
    } else {
      text = text.replace("import './styles/closeflow-action-tokens.css';", "import './styles/closeflow-action-tokens.css';\n" + importLine);
    }
    write(rel, text);
  }
}

// 3) One visual stylesheet for every dialog/modal created through DialogContent.
const modalCss = `/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1
   owner: CloseFlow UI system
   reason: New lead/client/case/event/task/template/AI draft dialogs had divergent surfaces and unreadable dark inputs.
   source_of_truth: src/components/ui/dialog.tsx + this stylesheet
   scope: all Radix DialogContent surfaces in the operator app
*/

:root {
  --cf-modal-bg: #f8fafc;
  --cf-modal-panel: #ffffff;
  --cf-modal-ink: #0f172a;
  --cf-modal-muted: #475569;
  --cf-modal-soft: #eef2f7;
  --cf-modal-border: rgba(148, 163, 184, 0.34);
  --cf-modal-border-strong: rgba(15, 23, 42, 0.14);
  --cf-modal-header-bg: #0f172a;
  --cf-modal-header-bg-2: #12233f;
  --cf-modal-header-ink: #f8fafc;
  --cf-modal-accent: #22c55e;
  --cf-modal-accent-strong: #16a34a;
  --cf-modal-focus: rgba(34, 197, 94, 0.22);
  --cf-modal-danger: #dc2626;
}

.cf-modal-surface,
[data-closeflow-modal-visual-system="true"] {
  color: var(--cf-modal-ink) !important;
  background:
    radial-gradient(circle at 12% -10%, rgba(34, 197, 94, 0.12), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, var(--cf-modal-bg) 100%) !important;
  border: 1px solid var(--cf-modal-border) !important;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.36), 0 0 0 1px rgba(255, 255, 255, 0.72) inset !important;
  overflow-y: auto;
  max-height: min(92vh, 920px);
}

.cf-modal-surface::before,
[data-closeflow-modal-visual-system="true"]::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 0.38rem;
  background: linear-gradient(90deg, var(--cf-modal-accent), #38bdf8, var(--cf-modal-header-bg));
  pointer-events: none;
}

.cf-modal-header,
[data-closeflow-modal-visual-system="true"] .cf-modal-header,
[data-closeflow-modal-visual-system="true"] .client-case-form-header {
  margin: -1.5rem -1.5rem 0 !important;
  padding: 1.25rem 1.5rem 1.15rem !important;
  color: var(--cf-modal-header-ink) !important;
  background:
    radial-gradient(circle at 100% 0%, rgba(34, 197, 94, 0.22), transparent 32%),
    linear-gradient(135deg, var(--cf-modal-header-bg), var(--cf-modal-header-bg-2)) !important;
  border-bottom: 1px solid rgba(34, 197, 94, 0.28) !important;
  border-radius: inherit;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.cf-modal-title,
[data-closeflow-modal-visual-system="true"] .cf-modal-title,
[data-closeflow-modal-visual-system="true"] [data-radix-dialog-title],
[data-closeflow-modal-visual-system="true"] .client-case-form-header h2,
[data-closeflow-modal-visual-system="true"] .client-case-form-header h3 {
  color: var(--cf-modal-header-ink) !important;
  letter-spacing: -0.02em;
}

[data-closeflow-modal-visual-system="true"] .client-case-form-header p,
[data-closeflow-modal-visual-system="true"] .cf-modal-header p,
[data-closeflow-modal-visual-system="true"] .client-case-form-kicker {
  color: rgba(248, 250, 252, 0.82) !important;
  -webkit-text-fill-color: rgba(248, 250, 252, 0.82) !important;
}

[data-closeflow-modal-visual-system="true"] form,
[data-closeflow-modal-visual-system="true"] .client-case-form,
[data-closeflow-modal-visual-system="true"] .space-y-4 {
  color: var(--cf-modal-ink) !important;
}

[data-closeflow-modal-visual-system="true"] label,
[data-closeflow-modal-visual-system="true"] .client-case-form-field label,
[data-closeflow-modal-visual-system="true"] .client-case-form-section h3,
[data-closeflow-modal-visual-system="true"] .client-case-form-section-head h3 {
  color: var(--cf-modal-ink) !important;
  -webkit-text-fill-color: var(--cf-modal-ink) !important;
  font-weight: 750;
}

[data-closeflow-modal-visual-system="true"] .client-case-form-section-head p,
[data-closeflow-modal-visual-system="true"] p,
[data-closeflow-modal-visual-system="true"] .text-slate-500,
[data-closeflow-modal-visual-system="true"] .text-slate-600,
[data-closeflow-modal-visual-system="true"] .sub,
[data-closeflow-modal-visual-system="true"] .mini {
  color: var(--cf-modal-muted) !important;
  -webkit-text-fill-color: var(--cf-modal-muted) !important;
}

[data-closeflow-modal-visual-system="true"] input:not([type="checkbox"]):not([type="radio"]),
[data-closeflow-modal-visual-system="true"] textarea,
[data-closeflow-modal-visual-system="true"] select,
[data-closeflow-modal-visual-system="true"] .client-case-form-textarea {
  color: var(--cf-modal-ink) !important;
  -webkit-text-fill-color: var(--cf-modal-ink) !important;
  caret-color: var(--cf-modal-accent-strong) !important;
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05) !important;
}

[data-closeflow-modal-visual-system="true"] input::placeholder,
[data-closeflow-modal-visual-system="true"] textarea::placeholder,
[data-closeflow-modal-visual-system="true"] .client-case-form-textarea::placeholder {
  color: #64748b !important;
  -webkit-text-fill-color: #64748b !important;
  opacity: 1 !important;
}

[data-closeflow-modal-visual-system="true"] input:focus,
[data-closeflow-modal-visual-system="true"] textarea:focus,
[data-closeflow-modal-visual-system="true"] select:focus,
[data-closeflow-modal-visual-system="true"] input:focus-visible,
[data-closeflow-modal-visual-system="true"] textarea:focus-visible,
[data-closeflow-modal-visual-system="true"] select:focus-visible,
[data-closeflow-modal-visual-system="true"] .client-case-form-textarea:focus {
  border-color: var(--cf-modal-accent-strong) !important;
  outline: none !important;
  box-shadow: 0 0 0 3px var(--cf-modal-focus), 0 1px 2px rgba(15, 23, 42, 0.05) !important;
}

[data-closeflow-modal-visual-system="true"] input:disabled,
[data-closeflow-modal-visual-system="true"] textarea:disabled,
[data-closeflow-modal-visual-system="true"] select:disabled {
  background: #f1f5f9 !important;
  color: #64748b !important;
  -webkit-text-fill-color: #64748b !important;
}

[data-closeflow-modal-visual-system="true"] .client-case-form-section,
[data-closeflow-modal-visual-system="true"] .rounded-2xl.border,
[data-closeflow-modal-visual-system="true"] .rounded-xl.border {
  background-color: rgba(255, 255, 255, 0.88) !important;
  border-color: var(--cf-modal-border) !important;
  color: var(--cf-modal-ink) !important;
}

[data-closeflow-modal-visual-system="true"] .bg-slate-50,
[data-closeflow-modal-visual-system="true"] .bg-white {
  color: var(--cf-modal-ink) !important;
}

.cf-modal-footer,
[data-closeflow-modal-visual-system="true"] .cf-modal-footer,
[data-closeflow-modal-visual-system="true"] .client-case-form-footer,
[data-closeflow-modal-visual-system="true"] [class*="cf-modal-footer"],
[data-closeflow-modal-visual-system="true"] [class*="cf-form-actions"] {
  margin: 0 -1.5rem -1.5rem !important;
  padding: 0.9rem 1.5rem !important;
  background: rgba(248, 250, 252, 0.94) !important;
  border-top: 1px solid var(--cf-modal-border) !important;
  backdrop-filter: blur(10px);
}

[data-closeflow-modal-visual-system="true"] button[type="submit"],
[data-closeflow-modal-visual-system="true"] .btn.primary {
  background: linear-gradient(135deg, var(--cf-modal-accent), var(--cf-modal-accent-strong)) !important;
  border-color: rgba(22, 163, 74, 0.55) !important;
  color: #04130a !important;
  -webkit-text-fill-color: #04130a !important;
  box-shadow: 0 12px 24px rgba(22, 163, 74, 0.22) !important;
}

[data-closeflow-modal-visual-system="true"] button[type="button"].border,
[data-closeflow-modal-visual-system="true"] button[type="button"][class*="outline"],
[data-closeflow-modal-visual-system="true"] .cf-modal-footer button[type="button"] {
  border-color: #cbd5e1 !important;
}

.cf-modal-close,
[data-closeflow-modal-visual-system="true"] .cf-modal-close {
  color: rgba(248, 250, 252, 0.72) !important;
}

.cf-modal-close:hover,
[data-closeflow-modal-visual-system="true"] .cf-modal-close:hover {
  color: #ffffff !important;
}

@media (max-width: 640px) {
  .cf-modal-surface,
  [data-closeflow-modal-visual-system="true"] {
    width: calc(100vw - 1rem) !important;
    max-width: calc(100vw - 1rem) !important;
    max-height: calc(100dvh - 1rem) !important;
    border-radius: 1.25rem !important;
  }

  .cf-modal-footer,
  [data-closeflow-modal-visual-system="true"] .cf-modal-footer,
  [data-closeflow-modal-visual-system="true"] .client-case-form-footer {
    position: sticky;
    bottom: -1.5rem;
    z-index: 2;
  }
}
`;
write('src/styles/closeflow-modal-visual-system.css', modalCss);

// 4) Evidence doc: map every known dialog/panel target.
const evidence = `# CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1 — mapowanie okienek operatora

Data: 2026-05-11
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel

Wszystkie okienka typu modal/dialog mają korzystać z jednego źródła prawdy:

- \`src/components/ui/dialog.tsx\` — wspólny komponent \`DialogContent\`, \`DialogHeader\`, \`DialogFooter\`, \`DialogTitle\`.
- \`src/styles/closeflow-modal-visual-system.css\` — wspólne tło, header, footer, inputy, selecty, textarea i focus ring.

## Problem zgłoszony

Modal \`Nowy lead\` miał białą kartę, czarne pola wpisywania i słabą czytelność etykiet. To tworzyło rozjazd względem lepiej wyglądających okienek, np. zadania albo szablonu.

## Mapowanie okienek do jednego stylu

| Obszar | Plik | Typ okienka | Status po tym etapie |
|---|---|---|---|
| Szybkie akcje operatora | \`src/components/GlobalQuickActions.tsx\` | Lead / Zadanie / Wydarzenie / Szybki szkic | przez wspólne DialogContent |
| Szybki szkic | \`src/components/QuickAiCapture.tsx\` | Dialog AI draft | przez wspólne DialogContent |
| Nowe zadanie | \`src/components/TaskCreateDialog.tsx\` | Dialog task | przez wspólne DialogContent |
| Nowy lead | \`src/pages/Leads.tsx\` | Dialog lead | przez wspólne DialogContent + override pól formularza |
| Nowy klient | \`src/pages/Clients.tsx\` | Dialog client | przez wspólne DialogContent + override pól formularza |
| Nowa sprawa | \`src/pages/Cases.tsx\` | Dialog case | przez wspólne DialogContent |
| Nowe wydarzenie | \`src/pages/Calendar.tsx\` | Dialog event | przez wspólne DialogContent |
| Szablony spraw | \`src/pages/Templates.tsx\` | Dialog template | przez wspólne DialogContent |
| Szablony odpowiedzi | \`src/pages/ResponseTemplates.tsx\` | Dialog response template | przez wspólne DialogContent |
| Szkice AI | \`src/pages/AiDrafts.tsx\` | dialogi/akcje szkiców | przez wspólne DialogContent, jeśli używają komponentu bazowego |
| Konflikty/duplikaty | \`src/components/EntityConflictDialog.tsx\` | Dialog konfliktu | przez wspólne DialogContent |

## Zasada od teraz

Nie stylować każdego modala osobno. Jeżeli powstaje nowe okienko, ma używać \`DialogContent\`. Jeżeli formularz wymaga wyjątkowego układu, można dodać klasę lokalną, ale kolory pól, czytelność, focus i footer mają zostać ze wspólnego systemu.

## Czego nie robić

- Nie przywracać ciemnego tła w inputach i textarea w modalach.
- Nie ustawiać lokalnie białych etykiet na jasnym tle.
- Nie robić osobnego systemu dla \`Nowy lead\`, \`Nowy klient\`, \`Nowa sprawa\`.
- Nie przepinać danych ani logiki zapisu. To jest etap UI contract, nie etap CRUD.

## Test ręczny

1. Otwórz z górnych szybkich akcji: \`Lead\`, \`Zadanie\`, \`Wydarzenie\`, \`Szybki szkic\`.
2. Wejdź w \`/clients\` i kliknij \`Dodaj klienta\`.
3. Wejdź w \`/cases\` i kliknij dodanie sprawy.
4. Wejdź w \`/templates\` oraz \`/response-templates\` i sprawdź dodawanie/edycję.
5. Pola tekstowe mają być jasne, czytelne, z ciemnym tekstem i zielonym focusem.
6. Header i footer modala mają wyglądać spójnie.
7. Mobile: brak poziomego scrolla, stopka z przyciskami jest dostępna.
`;
write('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_2026-05-11.md', evidence);

// 5) Guard script.
const guard = `#!/usr/bin/env node
/* CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function fail(msg) { console.error('✖ ' + msg); process.exit(1); }
function assertIncludes(rel, needle, label = needle) {
  if (!exists(rel)) fail('missing file: ' + rel);
  const text = read(rel);
  if (!text.includes(needle)) fail(rel + ' missing: ' + label);
}

assertIncludes('src/App.tsx', "import './styles/closeflow-modal-visual-system.css';", 'global modal visual CSS import');
assertIncludes('src/components/ui/dialog.tsx', 'CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1', 'dialog visual marker');
assertIncludes('src/components/ui/dialog.tsx', 'data-closeflow-modal-visual-system="true"', 'dialog content data attribute');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-surface', 'modal surface class');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-header', 'modal header class');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-footer', 'modal footer class');
assertIncludes('src/components/ui/dialog.tsx', 'cf-modal-title', 'modal title class');

const css = read('src/styles/closeflow-modal-visual-system.css');
[
  'CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1',
  '--cf-modal-accent',
  '[data-closeflow-modal-visual-system="true"] input:not([type="checkbox"]):not([type="radio"])',
  '[data-closeflow-modal-visual-system="true"] textarea',
  '[data-closeflow-modal-visual-system="true"] select',
  '-webkit-text-fill-color: var(--cf-modal-ink)',
  'caret-color: var(--cf-modal-accent-strong)',
  'client-case-form-textarea',
  'background: #ffffff !important',
  'border-color: var(--cf-modal-accent-strong)',
].forEach((needle) => {
  if (!css.includes(needle)) fail('modal CSS missing: ' + needle);
});

const mappedFiles = [
  'src/components/GlobalQuickActions.tsx',
  'src/components/QuickAiCapture.tsx',
  'src/components/TaskCreateDialog.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Cases.tsx',
  'src/pages/Templates.tsx',
  'src/pages/ResponseTemplates.tsx',
  'src/pages/AiDrafts.tsx',
  'src/components/EntityConflictDialog.tsx',
];
for (const rel of mappedFiles) {
  if (!exists(rel)) fail('mapped modal owner missing: ' + rel);
}

assertIncludes('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_2026-05-11.md', 'Nowy lead', 'modal mapping evidence');
assertIncludes('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_2026-05-11.md', 'Szybki szkic', 'quick draft mapping evidence');
assertIncludes('docs/feedback/CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1_2026-05-11.md', 'Nie przywracać ciemnego tła w inputach', 'dark input regression note');
console.log('✔ CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1 guard passed');
`;
write('scripts/check-closeflow-modal-visual-system.cjs', guard);

// 6) package.json script.
{
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:modal-visual-system'] = 'node scripts/check-closeflow-modal-visual-system.cjs';
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
}

// Final verification of expected markers.
ensureContains('src/App.tsx', "import './styles/closeflow-modal-visual-system.css';");
ensureContains('src/components/ui/dialog.tsx', 'data-closeflow-modal-visual-system="true"');
ensureContains('src/styles/closeflow-modal-visual-system.css', 'CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1');
console.log('✔ CLOSEFLOW_MODAL_VISUAL_SYSTEM_V1 repair applied');
