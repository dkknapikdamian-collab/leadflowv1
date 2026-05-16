import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const now = new Date();
const stamp = now.toISOString().replace(/[:.]/g, '-');

function rel(...parts) { return path.join(root, ...parts); }
function exists(file) { return fs.existsSync(rel(file)); }
function read(file) { return exists(file) ? fs.readFileSync(rel(file), 'utf8').replace(/^\uFEFF/, '') : ''; }
function write(file, content) {
  const full = rel(file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}
function lineOf(source, index) {
  if (index < 0) return 1;
  return source.slice(0, index).split(/\r?\n/).length;
}
function excerpt(source, index, span = 220) {
  if (index < 0) return '';
  return source.slice(Math.max(0, index - 80), Math.min(source.length, index + span)).replace(/\s+/g, ' ').trim();
}
function addFinding(findings, severity, category, file, line, title, evidence, recommendation) {
  findings.push({ severity, category, file, line, title, evidence, recommendation });
}
function walk(dir, predicate = () => true) {
  const full = rel(dir);
  if (!fs.existsSync(full)) return [];
  const out = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const item = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) out.push(...walk(item, predicate));
    if (entry.isFile() && predicate(item)) out.push(item);
  }
  return out;
}
function findButtonBlocks(source) {
  const blocks = [];
  let index = 0;
  while (true) {
    const start = source.indexOf('<Button', index);
    if (start < 0) break;
    const endRaw = source.indexOf('</Button>', start);
    if (endRaw < 0) break;
    const end = endRaw + '</Button>'.length;
    blocks.push({ start, end, block: source.slice(start, end) });
    index = end;
  }
  index = 0;
  while (true) {
    const start = source.indexOf('<button', index);
    if (start < 0) break;
    const endRaw = source.indexOf('</button>', start);
    if (endRaw < 0) break;
    const end = endRaw + '</button>'.length;
    blocks.push({ start, end, block: source.slice(start, end) });
    index = end;
  }
  return blocks.sort((a, b) => a.start - b.start);
}
function fileLine(file, source, pattern) {
  const index = typeof pattern === 'string' ? source.indexOf(pattern) : source.search(pattern);
  return { index, line: index >= 0 ? lineOf(source, index) : 1 };
}

const findings = [];
const app = read('src/App.tsx');
const appNoComments = stripComments(app);
const imports = new Map();
for (const match of appNoComments.matchAll(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]\.\/pages\/([^'"]+)['"]\)\)/g)) {
  imports.set(match[1], `src/pages/${match[2]}.tsx`);
}
const routes = [];
for (const match of appNoComments.matchAll(/<Route\s+path=["']([^"']+)["'][\s\S]{0,220}?<([A-Z][A-Za-z0-9_]*)\s*\/>/g)) {
  routes.push({ path: match[1], component: match[2], file: imports.get(match[2]) || null });
}
const tasksRoute = routes.find((route) => route.path === '/tasks');

if (!tasksRoute) {
  addFinding(findings, 'HIGH', 'routing', 'src/App.tsx', 1, 'Nie znaleziono route /tasks', 'App.tsx nie zawiera czytelnej trasy /tasks.', 'Najpierw ustali\u0107 realny komponent ekranu zada\u0144, zanim cokolwiek \u0142ata\u0107.');
} else {
  if (tasksRoute.file !== 'src/pages/TasksStable.tsx') {
    const { line } = fileLine('src/App.tsx', app, '/tasks');
    addFinding(findings, 'MEDIUM', 'routing', 'src/App.tsx', line, `Route /tasks wskazuje na ${tasksRoute.file}`, `Komponent: ${tasksRoute.component}, plik: ${tasksRoute.file}`, 'Wszystkie testy i guardy musz\u0105 celowa\u0107 w faktyczny plik route, nie w starszy ekran.');
  }
}

const allCodeFiles = walk('src', (file) => /\.(tsx|ts|css)$/.test(file));
const allTestScriptFiles = [...walk('tests', (file) => /\.(cjs|mjs|js|ts|tsx)$/.test(file)), ...walk('scripts', (file) => /\.(cjs|mjs|js|ts|tsx)$/.test(file))];

// 1. Detect tests and guards checking non-routed Tasks.tsx while route uses TasksStable.tsx.
if (tasksRoute?.file === 'src/pages/TasksStable.tsx') {
  for (const file of allTestScriptFiles) {
    const source = read(file);
    const noComments = stripComments(source);
    const idx = noComments.indexOf('src/pages/Tasks.tsx');
    if (idx >= 0) {
      addFinding(
        findings,
        'HIGH',
        'dead-guard',
        file,
        lineOf(source, source.indexOf('src/pages/Tasks.tsx')),
        'Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx',
        excerpt(source, source.indexOf('src/pages/Tasks.tsx')),
        'Przepi\u0105\u0107 guard/test na src/pages/TasksStable.tsx albo sprawdza\u0107 komponent z mapowania App.tsx.'
      );
    }
  }
}

// 2. Real Tasks screen checks.
const tasksFile = tasksRoute?.file || 'src/pages/TasksStable.tsx';
const tasksSource = read(tasksFile);
const tasksNoComments = stripComments(tasksSource);
if (tasksSource) {
  const techPatterns = [
    /Stabilny widok Supabase bez bramki Firebase/i,
    /Dane (\u0142aduj\u0105|laduja) si\u0119 od razu po wej\u015Bciu w zak\u0142adk\u0119/i,
    /Stable Tasks screen avoids the legacy Firebase auth\.currentUser load gate/i,
    /Supabase API helpers used by the rest of the app/i,
  ];
  for (const pattern of techPatterns) {
    const index = tasksNoComments.search(pattern);
    if (index >= 0) {
      addFinding(findings, 'HIGH', 'ui-copy', tasksFile, lineOf(tasksSource, tasksSource.search(pattern)), 'Widoczny techniczny tekst na ekranie Zada\u0144', excerpt(tasksSource, tasksSource.search(pattern)), 'Usun\u0105\u0107 techniczne copy z UI. U\u017Cytkownik nie powinien widzie\u0107 Firebase/Supabase/Stable.');
    }
  }

  for (const item of findButtonBlocks(tasksNoComments)) {
    const block = item.block;
    if (/(Nowe|Dodaj)\s+zadanie/i.test(block) && /openNewTask|setIsDialogOpen\(true\)|setIsNewTaskOpen\(true\)/.test(block)) {
      addFinding(findings, 'HIGH', 'duplicate-action', tasksFile, lineOf(tasksNoComments, item.start), 'Lokalny przycisk dodawania zadania jest nadal w realnym ekranie', block.replace(/\s+/g, ' ').trim(), 'Usun\u0105\u0107 lokalny CTA z nag\u0142\u00F3wka. Dodawanie ma i\u015B\u0107 z globalnego panelu operatora.');
    }
  }

  for (const item of findButtonBlocks(tasksNoComments)) {
    const block = item.block;
    if (/Od\u015Bwie\u017C|Odswiez/i.test(block) && !/className=/.test(block)) {
      addFinding(findings, 'MEDIUM', 'visual-contrast', tasksFile, lineOf(tasksNoComments, item.start), 'Przycisk Od\u015Bwie\u017C nie ma jawnej klasy kontrastu', block.replace(/\s+/g, ' ').trim(), 'Doda\u0107 jawne klasy text/background/border dla czytelno\u015Bci na jasnym tle.');
    }
  }
}

// 3. Global quick action task behavior.
const globalFile = 'src/components/GlobalQuickActions.tsx';
const globalSource = read(globalFile);
const globalNoComments = stripComments(globalSource);
if (globalSource) {
  const taskButton = findButtonBlocks(globalNoComments).find((item) => /data-global-quick-action=["']task["']/.test(item.block));
  if (!taskButton) {
    addFinding(findings, 'HIGH', 'global-action', globalFile, 1, 'Nie znaleziono globalnego przycisku Zadanie', 'Brak data-global-quick-action="task".', 'Doda\u0107 globalny przycisk, kt\u00F3ry otwiera modal dodawania zadania.');
  } else {
    if (/\basChild\b|<Link\b|to=["']\/tasks/.test(taskButton.block)) {
      addFinding(findings, 'HIGH', 'global-action', globalFile, lineOf(globalNoComments, taskButton.start), 'Globalny + Zadanie u\u017Cywa Link/routingu zamiast otwiera\u0107 modal', taskButton.block.replace(/\s+/g, ' ').trim(), 'Zamieni\u0107 na zwyk\u0142y Button z onClick otwieraj\u0105cym TaskCreateDialog bez przej\u015Bcia do /tasks.');
    }
    if (!/TaskCreateDialog/.test(globalNoComments)) {
      addFinding(findings, 'HIGH', 'global-action', globalFile, 1, 'GlobalQuickActions nie renderuje wsp\u00F3lnego TaskCreateDialog', 'Brak TaskCreateDialog w pliku globalnego panelu.', 'Doda\u0107 wsp\u00F3lny komponent modala tworzenia zadania do GlobalQuickActions.');
    }
  }
}

// 4. Scan visible technical copy in all route components.
const technicalCopyPatterns = [
  { pattern: /Firebase/i, label: 'Firebase' },
  { pattern: /Supabase/i, label: 'Supabase' },
  { pattern: /hotfix/i, label: 'hotfix' },
  { pattern: /guard/i, label: 'guard' },
  { pattern: /stable/i, label: 'stable' },
];
for (const route of routes) {
  if (!route.file || !exists(route.file)) continue;
  const source = read(route.file);
  const noComments = stripComments(source);
  for (const { pattern, label } of technicalCopyPatterns) {
    let match;
    const regex = new RegExp(pattern.source, 'ig');
    while ((match = regex.exec(noComments)) !== null) {
      const around = excerpt(noComments, match.index, 160);
      // Reduce false positives: imports/function names are not UI copy.
      if (/import |from |function |const |type |interface |await |Supabase\(|Firebase\(/.test(around)) continue;
      addFinding(findings, 'LOW', 'possible-tech-copy', route.file, lineOf(noComments, match.index), `Mo\u017Cliwy techniczny tekst w routowanym ekranie: ${label}`, around, 'Sprawdzi\u0107, czy to nie jest tekst widoczny dla u\u017Cytkownika. Je\u015Bli widoczny, usun\u0105\u0107 albo przepisa\u0107 na j\u0119zyk produktowy.');
    }
  }
}

// 5. Duplicate/legacy task modal files and components.
for (const file of allCodeFiles) {
  const source = read(file);
  const noComments = stripComments(source);
  if (file !== tasksFile && /DialogTitle>[\s\S]{0,80}Nowe zadanie|setIsNewTaskOpen\(true\)|openNewTask/.test(noComments)) {
    addFinding(findings, 'MEDIUM', 'duplicate-modal-surface', file, lineOf(source, source.search(/Nowe zadanie|setIsNewTaskOpen|openNewTask/)), 'Inny plik poza realnym route zawiera modal/otwieranie zadania', excerpt(source, source.search(/Nowe zadanie|setIsNewTaskOpen|openNewTask/)), 'Ustali\u0107, czy to aktywny ekran, czy martwy legacy. Dla aktywnych powierzchni u\u017Cy\u0107 wsp\u00F3lnego TaskCreateDialog.');
  }
}

const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
findings.sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99) || a.file.localeCompare(b.file) || a.line - b.line);

const summary = {
  generatedAt: now.toISOString(),
  routeMap: routes,
  tasksRoute,
  counts: {
    total: findings.length,
    high: findings.filter((item) => item.severity === 'HIGH').length,
    medium: findings.filter((item) => item.severity === 'MEDIUM').length,
    low: findings.filter((item) => item.severity === 'LOW').length,
  },
  findings,
};

const md = [
  '# CloseFlow UI Surface Audit Stage45',
  '',
  `Generated: ${summary.generatedAt}`,
  '',
  '## Werdykt',
  '',
  summary.counts.high > 0
    ? `NIE WDRA\u017BA\u0106 kolejnych punktowych patchy. Jest ${summary.counts.high} wysokich problem\u00F3w powierzchni UI/guard\u00F3w.`
    : 'Brak wysokich problem\u00F3w w tym audycie.',
  '',
  '## Route map',
  '',
  '| route | component | file |',
  '|---|---|---|',
  ...routes.map((route) => `| ${route.path} | ${route.component} | ${route.file || '?'} |`),
  '',
  '## Findings',
  '',
  findings.length ? findings.map((item, index) => [
    `### ${index + 1}. [${item.severity}] ${item.title}`,
    '',
    `- Category: ${item.category}`,
    `- File: ${item.file}:${item.line}`,
    `- Evidence: \`${String(item.evidence || '').replace(/`/g, '\\`').slice(0, 700)}\``,
    `- Recommendation: ${item.recommendation}`,
    '',
  ].join('\n')).join('\n') : 'No findings.',
  '',
  '## Nast\u0119pny krok',
  '',
  'Najpierw naprawi\u0107 wszystkie HIGH w jednym patchu. Dopiero potem uruchamia\u0107 pe\u0142ny release gate.',
  '',
].join('\n');

write('reports/ui-surface-audit-stage45.json', JSON.stringify(summary, null, 2));
write(`docs/audits/UI_SURFACE_AUDIT_STAGE45_${stamp}.md`, md);

console.log(`UI surface audit complete: ${summary.counts.high} HIGH, ${summary.counts.medium} MEDIUM, ${summary.counts.low} LOW.`);
console.log(`Report: docs/audits/UI_SURFACE_AUDIT_STAGE45_${stamp}.md`);
console.log('JSON: reports/ui-surface-audit-stage45.json');
if (summary.counts.high > 0) {
  console.log('HIGH findings exist. This audit intentionally exits 0 so the report can be committed.');
}
