#!/usr/bin/env node
const fs = require('fs');

const FILES = [
  'src/pages/Leads.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/Login.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Templates.tsx',
];

const EXPECTED = new Map();
function add(moduleName, names) {
  for (const name of names) EXPECTED.set(name, moduleName);
}

add('react', ['useState', 'useEffect', 'useMemo', 'useRef', 'useCallback', 'FormEvent', 'MouseEvent']);
add('react-router-dom', ['Link', 'useSearchParams', 'useNavigate', 'useParams']);
add('lucide-react', ['AlertTriangle', 'Loader2', 'Mail', 'RotateCcw', 'Search', 'Trash2', 'TrendingUp', 'CheckSquare', 'CheckCircle2', 'Clock', 'Clock3', 'Link2', 'MoreVertical', 'Repeat', 'CalendarClock', 'Filter', 'ShieldAlert', 'FolderKanban', 'Plus', 'Copy', 'Mic', 'MicOff', 'Pin', 'LogIn']);
add('../components/ui-system', ['EntityIcon', 'ClientEntityIcon', 'LeadEntityIcon', 'CaseEntityIcon', 'TaskEntityIcon', 'TemplateEntityIcon', 'NotificationEntityIcon', 'OperatorMetricTiles', 'OperatorMetricTileItem']);
add('../components/GlobalQuickActions', ['consumeGlobalQuickAction', 'subscribeGlobalQuickAction']);
add('../lib/calendar-items', ['fetchCalendarBundleFromSupabase', 'CalendarBundle']);

function importedName(spec) {
  return String(spec || '').trim().replace(/^type\s+/, '').trim().split(/\s+as\s+/i)[0].trim();
}

function parseSpecifiers(body) {
  return String(body || '').split(',').map((part) => part.trim()).filter(Boolean);
}

function namedImports(text) {
  const imports = [];
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    for (const spec of parseSpecifiers(match[1])) {
      imports.push({ moduleName: match[2], spec, imported: importedName(spec) });
    }
  }
  return imports;
}

let failed = 0;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed += 1; console.log(`FAIL ${message}`); }

for (const file of FILES) {
  if (!fs.existsSync(file)) {
    fail(`${file}: exists`);
    continue;
  }

  const text = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const imports = namedImports(text);

  for (const [symbol, expectedModule] of EXPECTED.entries()) {
    const matches = imports.filter((entry) => entry.imported === symbol);
    if (!matches.length) continue;

    const wrong = matches.filter((entry) => entry.moduleName !== expectedModule);
    wrong.length === 0
      ? pass(`${file}: ${symbol} imports from ${expectedModule}`)
      : fail(`${file}: ${symbol} imported from wrong module(s): ${wrong.map((entry) => entry.moduleName).join(', ')}`);

    const expectedCount = matches.filter((entry) => entry.moduleName === expectedModule).length;
    expectedCount <= 1
      ? pass(`${file}: ${symbol} has no duplicate import from ${expectedModule}`)
      : fail(`${file}: ${symbol} duplicate import count=${expectedCount} from ${expectedModule}`);
  }
}

if (failed) {
  console.error(`FAIL CLOSEFLOW_VERCEL_IMPORT_SOURCE_FINAL_FAILED problem_count=${failed}`);
  process.exit(1);
}
console.log('CLOSEFLOW_VERCEL_IMPORT_SOURCE_FINAL_OK');
