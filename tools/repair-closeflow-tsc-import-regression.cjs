#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = process.cwd();
const BASE_COMMIT_MARKER = 'e2babc52c6c7cb0961c83dcf2f766046e514303e';
const RESTORE_FILES = [
  'src/pages/Calendar.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Login.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Templates.tsx',
];

const ENTITY_ICONS = new Set([
  'EntityIcon',
  'ClientEntityIcon',
  'LeadEntityIcon',
  'CaseEntityIcon',
  'TaskEntityIcon',
  'EventEntityIcon',
  'ActivityEntityIcon',
  'PaymentEntityIcon',
  'CommissionEntityIcon',
  'AiEntityIcon',
  'TemplateEntityIcon',
  'NotificationEntityIcon',
]);

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupRoot = path.join(ROOT, '.closeflow-recovery-backups', `tsc-import-regression-repair-${stamp}`);
fs.mkdirSync(backupRoot, { recursive: true });

function runGit(args, options = {}) {
  return cp.execFileSync('git', args, {
    cwd: ROOT,
    encoding: options.encoding || 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
  });
}

function relPath(file) {
  return path.join(ROOT, file);
}

function ensureDirFor(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function backupFile(rel) {
  const src = relPath(rel);
  if (!fs.existsSync(src)) return;
  const dst = path.join(backupRoot, rel);
  ensureDirFor(dst);
  fs.copyFileSync(src, dst);
}

function cleanText(text) {
  return String(text || '')
    .replace(/^\uFEFF/, '')
    .replace(/\uFEFF/g, '')
    .split('ï»¿').join('')
    .split('´╗┐').join('');
}

function resolveBaseCommit() {
  try {
    return runGit(['rev-parse', `${BASE_COMMIT_MARKER}^`]).trim();
  } catch {
    return runGit(['rev-parse', 'HEAD~2']).trim();
  }
}

function restoreFromBase(rel, base) {
  backupFile(rel);
  const content = cp.execFileSync('git', ['show', `${base}:${rel}`], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  fs.writeFileSync(relPath(rel), cleanText(content), 'utf8');
  console.log(`restored-from-base: ${rel}`);
}

function parseSpec(raw) {
  let value = raw.trim();
  const isType = value.startsWith('type ');
  if (isType) value = value.slice(5).trim();
  const parts = value.split(/\s+as\s+/i).map((part) => part.trim()).filter(Boolean);
  const imported = parts[0] || '';
  const local = parts[1] || imported;
  return { raw: raw.trim(), imported, local, isType };
}

function splitImportList(block) {
  return block
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatNamedImport(names, modulePath) {
  const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b));
  if (!unique.length) return '';
  if (unique.length <= 3) return `import { ${unique.join(', ')} } from '${modulePath}';\n`;
  return `import {\n  ${unique.join(',\n  ')}\n} from '${modulePath}';\n`;
}

function removeEntityIconsFromLucide(text) {
  const foundEntityIcons = [];
  const next = text.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?\s*/m, (full, block) => {
    const kept = [];
    for (const item of splitImportList(block)) {
      const spec = parseSpec(item);
      if (ENTITY_ICONS.has(spec.local) || ENTITY_ICONS.has(spec.imported)) {
        foundEntityIcons.push(spec.local);
      } else {
        kept.push(item);
      }
    }
    return formatNamedImport(kept, 'lucide-react');
  });
  return { text: next, entityIcons: foundEntityIcons };
}

function addEntityIconsToUiSystem(text, names) {
  const uniqueNames = [...new Set(names)].filter(Boolean);
  if (!uniqueNames.length) return text;
  const uiRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\.\/components\/ui-system['"];?/m;
  if (uiRegex.test(text)) {
    return text.replace(uiRegex, (full, block) => {
      const existing = splitImportList(block).map((item) => parseSpec(item).raw);
      return formatNamedImport([...existing, ...uniqueNames], '../components/ui-system').trimEnd();
    });
  }
  const importMatch = text.match(/(?:import[^;]+;\s*)+/);
  const insertAt = importMatch ? importMatch[0].length : 0;
  return text.slice(0, insertAt) + formatNamedImport(uniqueNames, '../components/ui-system') + text.slice(insertAt);
}

function removeLocalEntityAliases(text) {
  return text
    .replace(/\n\s*const\s+(?:EntityIcon|[A-Z][A-Za-z]*EntityIcon)\s*=\s*\([^;]*?entity=[^;]*?;\s*/gs, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function patchEntityIconBoundary(rel) {
  const file = relPath(rel);
  let text = cleanText(fs.readFileSync(file, 'utf8'));
  const result = removeEntityIconsFromLucide(text);
  text = result.text;
  text = addEntityIconsToUiSystem(text, result.entityIcons);
  text = removeLocalEntityAliases(text);
  fs.writeFileSync(file, text, 'utf8');
  if (result.entityIcons.length) {
    console.log(`moved entity icons to ui-system: ${rel} :: ${[...new Set(result.entityIcons)].join(', ')}`);
  }
}

function removeBrokenTemporaryTools() {
  const toolsDir = relPath('tools');
  if (!fs.existsSync(toolsDir)) return;
  const names = fs.readdirSync(toolsDir).filter((name) => /repair-closeflow-fin5-.*bom.*cleanup.*\.cjs$/i.test(name));
  for (const name of names) {
    const rel = `tools/${name}`;
    const tracked = runGit(['ls-files', '--', rel]).trim();
    if (!tracked) {
      fs.rmSync(relPath(rel), { force: true });
      console.log(`removed broken untracked tool: ${rel}`);
    }
  }
}

const base = resolveBaseCommit();
console.log(`CLOSEFLOW_TSC_IMPORT_REGRESSION_BASE ${base}`);
console.log(`CLOSEFLOW_TSC_IMPORT_REGRESSION_BACKUP ${backupRoot}`);
removeBrokenTemporaryTools();
for (const rel of RESTORE_FILES) restoreFromBase(rel, base);
for (const rel of RESTORE_FILES) patchEntityIconBoundary(rel);

console.log('CLOSEFLOW_TSC_IMPORT_REGRESSION_REPAIR_OK');
