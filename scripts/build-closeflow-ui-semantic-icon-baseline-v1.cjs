#!/usr/bin/env node
/* CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1_BASELINE */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDir = path.join(root, 'src');
const outJson = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_SEMANTIC_ICON_BASELINE.generated.json');

const criticalRoles = ['add', 'ai', 'case', 'copy', 'delete', 'edit', 'event', 'risk_alert', 'task_status', 'time'];
const skipDirs = new Set(['node_modules', 'dist', '.git', '.vercel', 'coverage', 'tmp', 'temp']);
const codeExt = new Set(['.ts', '.tsx', '.js', '.jsx']);

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name), acc);
      continue;
    }
    if (codeExt.has(path.extname(entry.name))) acc.push(path.join(dir, entry.name));
  }
  return acc;
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function parseLucideImports(text) {
  const result = [];
  const re = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/g;
  let match;
  while ((match = re.exec(text))) {
    const block = match[1] || '';
    for (const raw of block.split(',')) {
      const item = raw.trim();
      if (!item) continue;
      const parts = item.split(/\s+as\s+/i).map((x) => x.trim()).filter(Boolean);
      const imported = parts[0];
      const local = parts[1] || parts[0];
      if (/^[A-Za-z][A-Za-z0-9_]*$/.test(imported) && /^[A-Za-z][A-Za-z0-9_]*$/.test(local)) {
        result.push({ imported, local, importLine: lineOf(text, match.index) });
      }
    }
  }
  return result;
}

function roleForIcon(name) {
  const n = String(name || '').toLowerCase();
  if (/creditcard|wallet|dollar|coin|payment|bank/.test(n)) return 'finance';
  if (/externallink/.test(n)) return 'navigation';
  if (/trash|delete|remove/.test(n)) return 'delete';
  if (/phone|call/.test(n)) return 'phone';
  if (/mail|email|inbox/.test(n)) return 'email';
  if (/copy|clipboard/.test(n)) return 'copy';
  if (/pencil|edit/.test(n)) return 'edit';
  if (/plus|add|create/.test(n)) return 'add';
  if (/file|note|text|stickynote/.test(n)) return 'note';
  if (/calendar|event/.test(n)) return 'event';
  if (/clock|timer/.test(n)) return 'time';
  if (/check|circlecheck|checkcircle|task|list|shieldcheck|badgecheck/.test(n)) return 'task_status';
  if (/user|users|person/.test(n)) return 'person';
  if (/briefcase|case/.test(n)) return 'case';
  if (/building|home|house/.test(n)) return 'company_property';
  if (/alert|warning|triangle|shieldalert/.test(n)) return 'risk_alert';
  if (/sparkle|bot|brain|ai/.test(n)) return 'ai';
  if (/target|goal/.test(n)) return 'goal';
  if (/loader|spinner/.test(n)) return 'loading';
  if (/eye|view/.test(n)) return 'view';
  if (/pin/.test(n)) return 'pin';
  if (/arrow|chevron/.test(n)) return 'navigation';
  if (/x|close|octagonx/.test(n)) return 'close';
  if (/bell/.test(n)) return 'notification';
  if (/search/.test(n)) return 'search';
  if (/send/.test(n)) return 'send';
  if (/settings|sliders/.test(n)) return 'settings';
  if (/filter/.test(n)) return 'filter';
  if (/refresh|rotate/.test(n)) return 'refresh';
  if (/log(in|out)/.test(n)) return 'auth';
  return 'unclassified';
}

function collectCriticalPageImports() {
  const entries = [];
  for (const file of walk(srcDir)) {
    const relative = rel(file);
    if (!relative.startsWith('src/pages/')) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const icon of parseLucideImports(text)) {
      const role = roleForIcon(icon.imported);
      if (!criticalRoles.includes(role)) continue;
      entries.push({
        file: relative,
        imported: icon.imported,
        local: icon.local,
        role,
        importLine: icon.importLine,
        key: [relative, icon.imported, icon.local, role].join('|'),
      });
    }
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

const mapPath = path.join(root, 'docs', 'ui', 'CLOSEFLOW_UI_MAP.generated.json');
let sourceScanner = 'unknown';
if (fs.existsSync(mapPath)) {
  try {
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    sourceScanner = map.scannerVersion || map.sourceScanner || 'CLEAN_SCANNER_V4';
  } catch {
    sourceScanner = 'unreadable';
  }
}

const baseline = {
  version: 'CLOSEFLOW_UI2_SEMANTIC_ICON_GUARD_V1',
  generatedAt: new Date().toISOString(),
  sourceScanner,
  mode: 'baseline_existing_direct_page_icon_imports',
  policy: 'Existing critical direct lucide-react imports in src/pages/* are temporarily allowed. New critical direct imports must go through SemanticIcon or be added as a reviewed exception.',
  criticalRoles,
  criticalPageIconImports: collectCriticalPageImports(),
};

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(baseline, null, 2) + '\n', 'utf8');

console.log('CLOSEFLOW_UI2_SEMANTIC_ICON_BASELINE_V1_OK');
console.log('criticalRoles=' + criticalRoles.join(','));
console.log('criticalPageIconImports=' + baseline.criticalPageIconImports.length);
console.log('written=' + rel(outJson));
