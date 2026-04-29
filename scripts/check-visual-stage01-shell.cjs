const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(relativePath) {
  const target = path.join(repo, relativePath);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(target, 'utf8');
}

function expectIncludes(file, text, label) {
  if (!file.content.includes(text)) {
    throw new Error(`${file.path}: missing ${label || text}`);
  }
  console.log(`OK: ${file.path} contains ${label || text}`);
}

function chars() {
  return String.fromCharCode.apply(String, arguments);
}

const badPatterns = [
  chars(0x0139),
  chars(0x00c4),
  chars(0x0102),
  chars(0x00e2, 0x20ac),
  chars(0x00c5, 0x00bc),
  chars(0x00c5, 0x00ba),
  chars(0x00c5, 0x201a),
  chars(0x00c5, 0x201e),
  chars(0x00c5, 0x203a),
  chars(0x00c3, 0x00b3),
];

const files = [
  { path: 'src/components/Layout.tsx', content: read('src/components/Layout.tsx') },
  { path: 'src/components/GlobalQuickActions.tsx', content: read('src/components/GlobalQuickActions.tsx') },
  { path: 'src/styles/visual-stage01-shell.css', content: read('src/styles/visual-stage01-shell.css') },
  { path: 'src/index.css', content: read('src/index.css') },
];

expectIncludes(files[0], 'VISUAL_STAGE_01_SHELL_SIDEBAR', 'visual stage marker');
expectIncludes(files[0], 'className="app closeflow-visual-stage01"', 'root visual shell class');
expectIncludes(files[0], 'data-visual-stage="01-shell-sidebar"', 'visual stage data attribute');
expectIncludes(files[0], "caption: 'Start pracy'", 'Start pracy nav group');
expectIncludes(files[0], "caption: 'Czas i obowiązki'", 'Czas i obowiązki nav group');
expectIncludes(files[0], "caption: 'System'", 'System nav group');
expectIncludes(files[0], 'className="global-bar"', 'global-bar shell');
expectIncludes(files[0], 'className="mobile-top"', 'mobile-top shell');
expectIncludes(files[0], 'className="mobile-nav"', 'mobile-nav shell');
expectIncludes(files[0], "label: 'Dziś'", 'Dziś navigation');
expectIncludes(files[0], "label: 'Leady'", 'Leady navigation');
expectIncludes(files[0], "label: 'Klienci'", 'Klienci navigation');
expectIncludes(files[0], "label: 'Sprawy'", 'Sprawy navigation');
expectIncludes(files[0], "label: 'Zadania'", 'Zadania navigation');
expectIncludes(files[0], "label: 'Kalendarz'", 'Kalendarz navigation');
expectIncludes(files[0], "label: 'Aktywność'", 'Aktywność navigation');
expectIncludes(files[0], "label: 'Szkice AI'", 'Szkice AI navigation');
expectIncludes(files[0], "label: 'Powiadomienia'", 'Powiadomienia navigation');
expectIncludes(files[0], "label: 'Rozliczenia'", 'Rozliczenia navigation');
expectIncludes(files[0], "label: 'Pomoc'", 'Pomoc navigation');
expectIncludes(files[0], "label: 'Ustawienia'", 'Ustawienia navigation');

expectIncludes(files[1], 'VISUAL_STAGE_01_GLOBAL_BAR_ACTIONS', 'global actions visual marker');
expectIncludes(files[1], 'data-global-quick-actions-contract="v97"', 'global quick actions contract');
expectIncludes(files[1], 'className="global-actions"', 'global-actions class');
expectIncludes(files[1], 'GlobalAiAssistant', 'existing AI assistant trigger');
expectIncludes(files[1], 'QuickAiCapture', 'existing quick draft trigger');
expectIncludes(files[1], "rememberGlobalQuickAction('lead')", 'lead quick action bridge');
expectIncludes(files[1], "rememberGlobalQuickAction('task')", 'task quick action bridge');
expectIncludes(files[1], "rememberGlobalQuickAction('event')", 'event quick action bridge');

expectIncludes(files[2], 'VISUAL_STAGE_01_SHELL_CSS', 'visual CSS marker');
expectIncludes(files[2], '.closeflow-visual-stage01.app', 'scoped app class');
expectIncludes(files[2], '.closeflow-visual-stage01 .sidebar', 'scoped sidebar class');
expectIncludes(files[2], '.closeflow-visual-stage01 .global-bar', 'scoped global-bar class');
expectIncludes(files[2], '.closeflow-visual-stage01 .mobile-nav', 'scoped mobile-nav class');
expectIncludes(files[2], '@media (max-width: 760px)', 'mobile breakpoint');

expectIncludes(files[3], '@import "./styles/visual-stage01-shell.css";', 'stage01 CSS import');

for (const file of files) {
  for (const pattern of badPatterns) {
    if (file.content.includes(pattern)) {
      throw new Error(`${file.path}: mojibake pattern detected`);
    }
  }
}

console.log('OK: Visual Stage 01 shell guard passed.');
