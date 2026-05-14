#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const calendarPath = path.join(repo, 'src', 'pages', 'Calendar.tsx');
const packagePath = path.join(repo, 'package.json');
const guardSourcePath = path.join(repo, 'scripts', 'check-calendar-selected-day-handler-scope.cjs');

const marker = 'CLOSEFLOW_CALENDAR_SELECTED_DAY_HANDLER_SCOPE_FIX_V12_2026_05_14';

function fail(message) {
  console.error('ERROR: ' + message);
  process.exit(1);
}

function readFileRequired(filePath) {
  if (!fs.existsSync(filePath)) fail('Nie znaleziono pliku: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8');
}

function writeBackup(filePath, content) {
  const backupDir = path.join(repo, '.closeflow-repair-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = path.basename(filePath).replace(/[^a-zA-Z0-9._-]/g, '_');
  const backupPath = path.join(backupDir, base + '.' + stamp + '.bak');
  fs.writeFileSync(backupPath, content, 'utf8');
  return backupPath;
}

function ensureGuardScript() {
  const guardContent = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const calendarPath = path.join(repo, 'src', 'pages', 'Calendar.tsx');
const packagePath = path.join(repo, 'package.json');

function fail(message) {
  console.error('ERROR: ' + message);
  process.exit(1);
}

function ok(message) {
  console.log('OK ' + message);
}

if (!fs.existsSync(calendarPath)) {
  fail('Brak src/pages/Calendar.tsx');
}

const source = fs.readFileSync(calendarPath, 'utf8');

const requiredAnchors = [
  'CalendarSelectedDayTileV9',
  'ScheduleEntryCard',
  'buildEditDraft',
  'const [editEntry, setEditEntry]',
  'const [editDraft, setEditDraft]',
];

for (const anchor of requiredAnchors) {
  if (!source.includes(anchor)) {
    fail('Calendar.tsx nie zawiera wymaganego elementu: ' + anchor);
  }
}

const jsxHandlerRefs = [...source.matchAll(/\\b(onEdit|onShift|onShiftHours|onComplete|onDelete)=\\{([A-Za-z_$][\\w$]*)\\}/g)]
  .map((match) => ({ prop: match[1], name: match[2], index: match.index || 0 }))
  .filter((item) => /^handle[A-Z]/.test(item.name));

const uniqueNames = [...new Set(jsxHandlerRefs.map((item) => item.name))];

for (const name of uniqueNames) {
  const declaration = new RegExp('(?:const|function)\\\\s+' + name + '\\\\b');
  if (!declaration.test(source)) {
    const locations = jsxHandlerRefs
      .filter((item) => item.name === name)
      .map((item) => item.prop + '={' + name + '}@' + item.index)
      .join(', ');
    fail('Calendar.tsx przekazuje ' + name + ', ale handler nie jest zdefiniowany. Miejsca: ' + locations);
  }
}

if (source.includes('onEdit={handleEditEntry}') && !/(?:const|function)\\s+handleEditEntry\\b/.test(source)) {
  fail('onEdit={handleEditEntry} istnieje, ale brakuje const/function handleEditEntry. To powoduje runtime ReferenceError.');
}

if (!fs.existsSync(packagePath)) {
  fail('Brak package.json');
}

const pkgText = fs.readFileSync(packagePath, 'utf8');
if (!/"build"\\s*:\\s*"[^"]*vite build[^"]*"/.test(pkgText)) {
  fail('package.json nie ma rozpoznawalnego skryptu build z vite build. Nie dokładam fałszywego sukcesu.');
}
if (!pkgText.includes('check:calendar-selected-day-handler-scope')) {
  fail('package.json nie ma check:calendar-selected-day-handler-scope. Guard nie jest podpięty.');
}
if (!pkgText.includes('prebuild') || !pkgText.includes('check-calendar-selected-day-handler-scope.cjs')) {
  fail('prebuild nie uruchamia check-calendar-selected-day-handler-scope.cjs. Vercel/build może przepuścić ten sam błąd.');
}

ok('Calendar handler scope guard passed');
`;

  fs.mkdirSync(path.dirname(guardSourcePath), { recursive: true });
  fs.writeFileSync(guardSourcePath, guardContent, 'utf8');
}

function updatePackageJson() {
  if (!fs.existsSync(packagePath)) fail('Brak package.json');
  const original = fs.readFileSync(packagePath, 'utf8');
  const pkg = JSON.parse(original);
  pkg.scripts = pkg.scripts || {};

  const guardCmd = 'node scripts/check-calendar-selected-day-handler-scope.cjs';
  pkg.scripts['check:calendar-selected-day-handler-scope'] = guardCmd;

  if (!pkg.scripts.prebuild) {
    pkg.scripts.prebuild = guardCmd;
  } else if (!pkg.scripts.prebuild.includes('check-calendar-selected-day-handler-scope.cjs')) {
    pkg.scripts.prebuild = pkg.scripts.prebuild + ' && ' + guardCmd;
  }

  const next = JSON.stringify(pkg, null, 2) + '\n';
  if (next !== original) {
    writeBackup(packagePath, original);
    fs.writeFileSync(packagePath, next, 'utf8');
    return true;
  }
  return false;
}

function insertMarker(source) {
  if (source.includes(marker)) return source;
  const anchor = "const CLOSEFLOW_CALENDAR_SKIN_ONLY_V1 = 'CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12';";
  if (source.includes(anchor)) {
    return source.replace(anchor, anchor + '\nconst ' + marker + " = '" + marker + "';");
  }
  return source;
}

function insertHandleEditEntry(source) {
  const referencesHandle = source.includes('handleEditEntry');
  const hasDefinition = /(?:const|function)\s+handleEditEntry\b/.test(source);

  if (hasDefinition) {
    return { source, changed: false, reason: 'handleEditEntry już istnieje' };
  }

  if (!referencesHandle) {
    return { source, changed: false, reason: 'brak referencji handleEditEntry w źródle; możliwy stary bundle albo inny branch/deployment' };
  }

  const block = [
    '',
    '  // ' + marker,
    '  const handleEditEntry = (entry: ScheduleEntry) => {',
    '    if (!entry) return;',
    "    const entryId = String(entry.id || entry.raw?.id || 'entry');",
    '',
    "    setActionPendingId(entryId + ':edit');",
    '    try {',
    '      setIsNewEventOpen(false);',
    '      setIsNewTaskOpen(false);',
    '      setEditEntry(entry);',
    '      setEditDraft(buildEditDraft(entry));',
    '    } finally {',
    '      setActionPendingId(null);',
    '    }',
    '  };',
    '',
  ].join('\n');

  const anchors = [
    /  const \[eventSubmitting, setEventSubmitting\] = useState\(false\);\r?\n/,
    /  const \[taskSubmitting, setTaskSubmitting\] = useState\(false\);\r?\n/,
    /  const editEntrySubmitLockRef = useRef\(false\);\r?\n/,
  ];

  for (const anchor of anchors) {
    if (anchor.test(source)) {
      return {
        source: source.replace(anchor, (match) => match + block),
        changed: true,
        reason: 'wstawiono handleEditEntry po znanym bloku stanu Calendar()'
      };
    }
  }

  const returnIndex = findTopLevelReturnIndex(source);
  if (returnIndex > -1) {
    return {
      source: source.slice(0, returnIndex) + block + '\n' + source.slice(returnIndex),
      changed: true,
      reason: 'wstawiono handleEditEntry przed głównym return Calendar()'
    };
  }

  fail('Nie znalazłem bezpiecznego miejsca na wstawienie handleEditEntry. Nie robię ślepego patcha.');
}

function findTopLevelReturnIndex(source) {
  const start = source.indexOf('export default function Calendar()');
  if (start < 0) return -1;
  const braceStart = source.indexOf('{', start);
  if (braceStart < 0) return -1;

  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;

    if (depth === 1 && source.startsWith('return (', i)) {
      return i;
    }
  }
  return -1;
}

function main() {
  const original = readFileRequired(calendarPath);
  let next = insertMarker(original);
  const result = insertHandleEditEntry(next);
  next = result.source;

  const calendarChanged = next !== original;
  if (calendarChanged) {
    writeBackup(calendarPath, original);
    fs.writeFileSync(calendarPath, next, 'utf8');
  }

  ensureGuardScript();
  const packageChanged = updatePackageJson();

  console.log('== closeflow calendar handler runtime fix v12 ==');
  console.log('Calendar.tsx: ' + (calendarChanged ? 'zmieniony' : 'bez zmian') + ' (' + result.reason + ')');
  console.log('Guard: scripts/check-calendar-selected-day-handler-scope.cjs zapisany');
  console.log('package.json: ' + (packageChanged ? 'zaktualizowany' : 'bez zmian'));
}

main();
