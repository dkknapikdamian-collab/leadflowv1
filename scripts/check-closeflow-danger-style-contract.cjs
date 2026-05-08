const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = path.join(root, 'src');
const exts = new Set(['.tsx', '.ts', '.jsx', '.js']);
const stage8DocPath = path.join(root, 'docs/ui/CLOSEFLOW_UI_CONTRACT_AUDIT_STAGE8_2026-05-08.md');
const stage15DocPath = path.join(root, 'docs/ui/CLOSEFLOW_LEGACY_TODAY_ROUTE_STAGE15_2026-05-08.md');
const stage16DocPath = path.join(root, 'docs/ui/CLOSEFLOW_ACTIVE_LEGACY_COLOR_STAGE16_2026-05-08.md');
const STAGE8_DOCUMENTED_LEGACY_EXCEPTIONS = 'STAGE8_DOCUMENTED_LEGACY_EXCEPTIONS';
const LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15 = 'LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15';
const ACTIVE_LEGACY_COLOR_STAGE16 = 'CLOSEFLOW_ACTIVE_LEGACY_COLOR_STAGE16';

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (exts.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function lineNo(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

function isLegacyInactiveTodaySurface(file) {
  if (file !== 'src/pages/Today.tsx') return false;
  const todayPath = path.join(root, 'src/pages/Today.tsx');
  const appPath = path.join(root, 'src/App.tsx');
  if (!fs.existsSync(todayPath) || !fs.existsSync(appPath) || !fs.existsSync(stage15DocPath)) return false;

  const todayText = fs.readFileSync(todayPath, 'utf8');
  const appText = fs.readFileSync(appPath, 'utf8');
  const docText = fs.readFileSync(stage15DocPath, 'utf8');

  return todayText.includes(LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15)
    && docText.includes(LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15)
    && appText.includes("const Today = lazy(() => import('./pages/TodayStable'))")
    && appText.includes('<Route path="/" element={isLoggedIn ? <Today />')
    && appText.includes('<Route path="/today" element={isLoggedIn ? <Today />')
    && !appText.includes("import('./pages/Today')");
}

function categorizeFinding(file, className) {
  if (isLegacyInactiveTodaySurface(file)) return 'legacy inactive Today.tsx exception';
  if (file === 'src/pages/Dashboard.tsx') return 'UI action color exception or alert/severity surface';
  if (file === 'src/pages/Activity.tsx') return 'alert/severity or metric tile surface';
  if (file === 'src/pages/NotificationsCenter.tsx') return 'alert/severity or notification status surface';
  if (file === 'src/pages/Calendar.tsx') return 'status/progress or entity type color surface';
  if (file === 'src/pages/Leads.tsx') return 'status/progress or entity action surface';
  if (file === 'src/pages/TasksStable.tsx') return 'status/progress surface';
  if (/AppChunkErrorBoundary/.test(file)) return 'real system alert/error';
  if (/TodayStable/.test(file)) return 'real system alert/error or schedule/status surface';
  if (/Templates/.test(file)) return 'status/progress';
  return 'unrelated legacy visual style do później';
}

const actionPattern = /(Trash2|Usuń|UsuĹ„|delete|Delete|destructive)/;
const blockingActionPattern = /(Trash2|Usuń|UsuĹ„)/;
const localDangerPattern = /(text|bg|border|ring)-(red|rose)-[0-9]{2,3}/;
const localDangerGlobalPattern = /(text|bg|border|ring)-(red|rose)-[0-9]{2,3}/g;
const allowedSharedFiles = new Set(['src/components/entity-actions.tsx']);
const findings = [];
const blockingFindings = [];

for (const file of walk(src)) {
  const text = fs.readFileSync(file, 'utf8');
  if (!actionPattern.test(text)) continue;

  let match;
  while ((match = localDangerGlobalPattern.exec(text))) {
    const relative = rel(file);
    findings.push({
      file: relative,
      line: lineNo(text, match.index),
      className: match[0],
      category: categorizeFinding(relative, match[0]),
    });
  }

  if (allowedSharedFiles.has(rel(file))) continue;

  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!blockingActionPattern.test(line)) return;
    const start = Math.max(0, index - 3);
    const end = Math.min(lines.length, index + 4);
    const windowText = lines.slice(start, end).join('\n');
    const localDanger = windowText.match(localDangerPattern);
    if (localDanger) {
      blockingFindings.push({ file: rel(file), line: index + 1, className: localDanger[0] });
    }
  });
}

const requiredFiles = [
  'src/components/entity-actions.tsx',
  'src/styles/closeflow-action-tokens.css',
];

for (const required of requiredFiles) {
  if (!fs.existsSync(path.join(root, required))) {
    blockingFindings.push({ file: required, line: 1, className: 'missing shared danger contract file' });
  }
}

const actionTokensPath = path.join(root, 'src/styles/closeflow-action-tokens.css');
const actionTokens = fs.existsSync(actionTokensPath) ? fs.readFileSync(actionTokensPath, 'utf8') : '';

for (const token of ['--cf-action-danger-text', '--cf-action-danger-bg', '--cf-action-danger-border', '.cf-entity-action-danger']) {
  if (!actionTokens.includes(token)) {
    blockingFindings.push({ file: 'src/styles/closeflow-action-tokens.css', line: 1, className: `missing ${token}` });
  }
}

if (blockingFindings.length) {
  console.error('FAIL: local danger/red styling is too close to delete/trash/destructive actions.');
  for (const finding of blockingFindings) console.error(`- ${finding.file}:${finding.line} ${finding.className}`);
  process.exit(1);
}

if (findings.length) {
  const hasStage8Doc = fs.existsSync(stage8DocPath) && fs.readFileSync(stage8DocPath, 'utf8').includes(STAGE8_DOCUMENTED_LEGACY_EXCEPTIONS);
  const hasStage16Doc = fs.existsSync(stage16DocPath) && fs.readFileSync(stage16DocPath, 'utf8').includes(ACTIVE_LEGACY_COLOR_STAGE16);
  if (hasStage16Doc) console.warn('AUDIT: Stage16 active legacy color classification document present.');
  if (!hasStage8Doc) {
    console.warn('AUDIT: legacy local danger/red classes still exist, but Stage8 exception document is missing or incomplete.');
  } else {
    console.warn('AUDIT: Stage8 documented legacy local danger/red classes still exist outside delete/trash action context.');
  }

  const categoryCounts = new Map();
  for (const finding of findings) categoryCounts.set(finding.category, (categoryCounts.get(finding.category) || 0) + 1);
  for (const [category, count] of categoryCounts) console.warn(`- ${category}: ${count}`);
  for (const finding of findings.slice(0, 80)) console.warn(`- ${finding.file}:${finding.line} ${finding.className} [${finding.category}]`);
} else {
  console.log('OK: no local danger/red classes found in files that mention delete/destructive.');
}

console.log('OK: danger style contract audit completed.');
