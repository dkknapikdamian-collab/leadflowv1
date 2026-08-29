const fs = require('fs');
const path = require('path');
const repo = process.cwd();

function read(relativePath) {
  const target = path.join(repo, relativePath);
  if (!fs.existsSync(target)) throw new Error(`Missing required file: ${relativePath}`);
  return fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, '');
}

function expect(file, text, label = text) {
  const content = read(file);
  if (!content.includes(text)) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}

function reject(file, text, label = text) {
  const content = read(file);
  if (content.includes(text)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

const badPatterns = [
  String.fromCharCode(0x0139),
  String.fromCharCode(0x00c4),
  String.fromCharCode(0x0102),
  String.fromCharCode(0x00e2, 0x20ac),
  String.fromCharCode(0x00c5, 0x00bc),
  String.fromCharCode(0x00c5, 0x00ba),
  String.fromCharCode(0x00c5, 0x201a),
  String.fromCharCode(0x00c5, 0x201e),
  String.fromCharCode(0x00c5, 0x203a),
  String.fromCharCode(0x00c3, 0x00b3),
];

expect('src/components/Layout.tsx', 'VISUAL_STAGE_01_SHELL_SIDEBAR', 'Stage01 shell trace marker');
expect('src/components/Layout.tsx', 'className={`app closeflow-visual-semantic01 cf-html-shell', 'current root shell classes');
expect('src/components/Layout.tsx', 'data-visual-stage="01-shell-sidebar"', 'Stage01 data attribute');
expect('src/components/Layout.tsx', "caption: 'Start pracy'", 'Start pracy group');
expect('src/components/Layout.tsx', "caption: 'Czas i obowiązki'", 'Czas i obowiązki group');
expect('src/components/Layout.tsx', "caption: 'System'", 'System group');
expect('src/components/Layout.tsx', 'className="global-bar"', 'global-bar shell');
expect('src/components/Layout.tsx', 'className="mobile-top"', 'mobile-top shell');
expect('src/components/Layout.tsx', 'className="mobile-nav"', 'mobile-nav shell');

for (const label of ['Dziś', 'Leady', 'Klienci', 'Sprawy', 'Lejek', 'Zadania', 'Kalendarz', 'Szablony', 'Odpowiedzi', 'Aktywność', 'Powiadomienia', 'Rozliczenia', 'Ustawienia']) {
  expect('src/components/Layout.tsx', `label: '${label}'`, `${label} navigation`);
}
expect('src/components/Layout.tsx', "label: 'Inbox szkiców'", 'plan-gated Inbox szkiców navigation');
expect('src/components/Layout.tsx', "label: 'Zgłoszenia'", 'current support navigation');
expect('src/components/Layout.tsx', 'canUseAiDraftsByPlan', 'AI drafts plan gate');
expect('src/components/Layout.tsx', "...(canUseAiDraftsByPlan ? [{ icon: CheckCircle2, label: 'Inbox szkiców', path: '/ai-drafts' }] : [])", 'plan-gated AI inbox item');
reject('src/components/Layout.tsx', "label: 'Szkice AI'", 'obsolete Szkice AI navigation item');
reject('src/components/Layout.tsx', "label: 'Pomoc'", 'obsolete Pomoc navigation item');

reject('src/index.css', 'visual-stage01-shell.css', 'inactive Stage01 shell CSS import');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'canonical visual source-truth entrypoint');
expect('src/styles/closeflow-visual-source-truth.css', './owners/closeflow-page-adapters.css', 'shell semantic owner');
expect('src/styles/closeflow-visual-source-truth.css', './owners/closeflow-page-header-responsive.css', 'header semantic owner');
expect('src/styles/closeflow-visual-source-truth.css', './owners/closeflow-responsive-adapters.css', 'responsive semantic owner');
reject('src/styles/closeflow-visual-source-truth.css', 'visual-stage01-shell.css', 'historical Stage01 CSS in active graph');
expect('src/components/Layout.tsx', 'OperatorTopBarRuntime', 'operator top bar runtime');
reject('src/components/Layout.tsx', 'VisualFoundationRuntimeStage212M', 'retired historical visual runtime');
expect('src/styles/owners/closeflow-page-shell.css', '.app.cf-html-shell', 'canonical HTML shell owner');
expect('src/components/Layout.tsx', 'ContextActionDialogsHost', 'shared context action host');

expect('src/components/GlobalQuickActions.tsx', 'VISUAL_STAGE_01_GLOBAL_BAR_ACTIONS', 'global actions visual marker');
expect('src/components/GlobalQuickActions.tsx', 'data-global-quick-actions-contract="v97"', 'global quick actions contract');
expect('src/components/GlobalQuickActions.tsx', 'className="global-actions sticky top-16 z-20 overflow-x-auto"', 'current global-actions toolbar class');
expect('src/components/GlobalQuickActions.tsx', 'QuickAiCapture', 'plan-gated quick AI capture');
expect('src/components/GlobalQuickActions.tsx', 'canUseQuickAiCaptureByPlan', 'quick AI capture plan gate');
expect('src/components/GlobalQuickActions.tsx', 'canUseAiDraftsByPlan', 'AI drafts action plan gate');
expect('src/components/GlobalQuickActions.tsx', 'to="/ai-drafts"', 'AI draft inbox action');
expect('src/components/GlobalQuickActions.tsx', 'Inbox szkiców', 'current AI inbox action copy');
expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('lead')", 'lead quick action bridge');
expect('src/components/GlobalQuickActions.tsx', 'data-global-client-direct-modal-trigger="true"', 'direct client modal trigger');
expect('src/components/GlobalQuickActions.tsx', 'data-global-task-direct-modal-trigger="true"', 'direct task modal trigger');
expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('event')", 'event quick action bridge');
expect('src/components/GlobalQuickActions.tsx', 'ClientCreateDialog', 'client create dialog host');
expect('src/components/GlobalQuickActions.tsx', 'TaskCreateDialog', 'task create dialog host');
expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'global command-actions entrypoint');
expect('src/styles/closeflow-visual-source-truth.css', './owners/closeflow-actions.css', 'command-actions semantic owner');

for (const file of ['src/components/Layout.tsx', 'src/components/GlobalQuickActions.tsx', 'src/index.css', 'src/styles/closeflow-visual-source-truth.css']) {
  const content = read(file);
  for (const pattern of badPatterns) {
    if (content.includes(pattern)) throw new Error(`${file}: mojibake pattern detected`);
  }
}

console.log('OK: Visual Stage01 shell guard reconciled with current navigation, shell and global-action source truth.');
