const fs = require('fs');
const path = require('path');

const root = process.cwd();
const sourceTruthPath = path.join(root, 'src', 'styles', 'closeflow-right-rail-source-truth.css');
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const mainPath = path.join(root, 'src', 'main.tsx');
const appPath = path.join(root, 'src', 'App.tsx');

const railTokens = [
  'right-card',
  'lead-right-card',
  'lead-top-relations',
  'cases-shortcuts-rail-card',
  'cases-risk-rail-card',
  'clients-right-rail',
  'client-right-rail',
  'lead-right-rail',
  'cases-right-rail',
  'right-list-row',
  'right-list-empty',
];

const sourceTruthSelectors = [
  '.right-card',
  '.lead-right-card',
  '.lead-top-relations',
  '.cases-shortcuts-rail-card',
  '.cases-risk-rail-card',
  '.clients-right-rail',
  '.lead-right-rail',
  '.cases-right-rail',
];

const darkCssBackgroundPatterns = [
  /background(?:-color)?\s*:\s*(?:#000(?:000)?|#0f172a|#111827|#020617|black)\b/i,
  /background(?:-color)?\s*:\s*rgb\s*\(\s*0\s*,\s*0\s*,\s*0\s*\)/i,
  /background(?:-color)?\s*:\s*rgb\s*\(\s*15(?:\s*,\s*|\s+)23(?:\s*,\s*|\s+)42\s*\)/i,
  /background(?:-color)?\s*:\s*rgb\s*\(\s*17(?:\s*,\s*|\s+)24(?:\s*,\s*|\s+)39\s*\)/i,
  /background(?:-color)?\s*:\s*rgb\s*\(\s*2(?:\s*,\s*|\s+)6(?:\s*,\s*|\s+)23\s*\)/i,
  /background(?:-color)?\s*:\s*rgba\s*\(\s*0\s*,\s*0\s*,\s*0\s*,\s*(?:0\.[6-9]|1(?:\.0+)?)\s*\)/i,
];

const forbiddenRailClassTokens = [
  'bg-black',
  'bg-zinc-950',
  'bg-slate-950',
  'bg-gray-950',
  'bg-neutral-950',
  'bg-stone-950',
  'from-black',
  'from-zinc-950',
  'from-slate-950',
  'from-gray-950',
  'from-neutral-950',
  'to-black',
  'to-zinc-950',
  'to-slate-950',
  'to-gray-950',
  'to-neutral-950',
];

function fail(message) {
  console.error('RIGHT_RAIL_CARD_SOURCE_OF_TRUTH_STAGE75_FAIL:', message);
  process.exit(1);
}

function read(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) fail('missing file: ' + relativePath);
  return fs.readFileSync(file, 'utf8');
}

function walkFiles(dir, extensions, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      walkFiles(full, extensions, out);
    } else if (extensions.includes(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function relative(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function selectorLooksLikeRail(selector) {
  return railTokens.some((token) => selector.includes(token));
}

function textLooksLikeRail(text) {
  return railTokens.some((token) => text.includes(token));
}

function hasDarkBackgroundDeclaration(body) {
  return darkCssBackgroundPatterns.some((pattern) => pattern.test(body));
}

function lineNumberForIndex(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function scanCssRailBlocks() {
  const cssFiles = walkFiles(path.join(root, 'src'), ['.css']);
  const blockPattern = /([^{}]+)\{([^{}]*)\}/g;
  for (const file of cssFiles) {
    const text = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = blockPattern.exec(text))) {
      const selector = match[1].trim();
      const body = match[2];
      if (!selectorLooksLikeRail(selector)) continue;
      if (hasDarkBackgroundDeclaration(body)) {
        fail('dark background declaration in rail CSS block at ' + relative(file) + ':' + lineNumberForIndex(text, match.index) + ' selector: ' + selector.replace(/\s+/g, ' ').slice(0, 220));
      }
    }
  }
}

function scanTsxRailClassNames() {
  const codeFiles = [
    ...walkFiles(path.join(root, 'src', 'pages'), ['.tsx', '.jsx', '.ts', '.js']),
    ...walkFiles(path.join(root, 'src', 'components'), ['.tsx', '.jsx', '.ts', '.js']),
  ];

  for (const file of codeFiles) {
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const localWindow = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join(' ');
      if (!textLooksLikeRail(localWindow)) continue;
      const darkClass = forbiddenRailClassTokens.find((token) => localWindow.includes(token));
      if (darkClass) {
        fail('dark Tailwind class near rail markup at ' + relative(file) + ':' + (i + 1) + ' token: ' + darkClass);
      }
      if (/style\s*=\s*\{\{[^}]*background(?:Color)?\s*:\s*['\"](?:#000(?:000)?|#0f172a|#111827|#020617|black)['\"]/i.test(localWindow)) {
        fail('dark inline background near rail markup at ' + relative(file) + ':' + (i + 1));
      }
    }
  }
}

function checkSourceTruthContract() {
  const css = read('src/styles/closeflow-right-rail-source-truth.css');
  const requiredTokens = [
    'CLOSEFLOW_RIGHT_RAIL_SOURCE_TRUTH_STAGE70_2026_05_14',
    '--cf-right-rail-card-bg: #ffffff',
    '--cf-right-rail-card-text: #0f172a',
    'background: var(--cf-right-rail-card-bg) !important',
    'color: var(--cf-right-rail-card-text) !important',
    'CLOSEFLOW_RIGHT_RAIL_LIST_ROW_VISUAL_STAGE72_2026_05_14',
    '.right-list-row',
    '.right-list-empty',
  ];
  for (const token of requiredTokens) {
    if (!css.includes(token)) fail('source truth CSS missing token: ' + token);
  }
  for (const selector of sourceTruthSelectors) {
    if (!css.includes(selector)) fail('source truth CSS missing selector/token: ' + selector);
  }
}

function checkImportOrder() {
  const main = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
  const app = fs.existsSync(appPath) ? fs.readFileSync(appPath, 'utf8') : '';
  const combined = main + '\n' + app;
  if (!combined.includes('closeflow-right-rail-source-truth.css')) {
    fail('right rail source truth CSS is not imported by app entry files');
  }
}

function checkClientsLeadOnlyPanel() {
  const clients = read('src/pages/Clients.tsx');
  const requiredTokens = [
    'STAGE74_CLIENTS_LEADS_TO_LINK_PANEL',
    'const leadsNeedingClientOrCaseLink = useMemo',
    'return (leads as Record<string, unknown>[])',
    'Leady do spięcia',
    'Brak klienta albo sprawy przy aktywnym temacie.',
    'Brak leadów wymagających spięcia.',
    "to={leadId ? '/leads/' + leadId : '/leads'}",
  ];
  for (const token of requiredTokens) {
    if (!clients.includes(token)) fail('Clients.tsx lead-only panel missing token: ' + token);
  }
  const forbiddenText = [
    'Klienci do uwagi',
    'Relacje bez pełnego spięcia lead/sprawa.',
    'const followupCandidates = useMemo',
    'followupCandidates.length ? followupCandidates.map',
  ];
  for (const token of forbiddenText) {
    if (clients.includes(token)) fail('Clients.tsx still contains legacy client-attention panel token: ' + token);
  }
}

checkSourceTruthContract();
checkImportOrder();
scanCssRailBlocks();
scanTsxRailClassNames();
checkClientsLeadOnlyPanel();

console.log('OK right rail card source truth stage75 regression guard');
