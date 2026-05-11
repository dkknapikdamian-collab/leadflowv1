#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const ENTITY_ICON_DENYLIST = ['UserRound', 'Target', 'Briefcase', 'FileText', 'Bell'];
function file(rel) { return path.join(repo, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8'); }
function exists(rel) { return fs.existsSync(file(rel)); }
function fail(message) { console.error('CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B_FAIL: ' + message); process.exit(1); }
function assert(condition, message) { if (!condition) fail(message); }
function walk(dir, out = []) {
  const abs = file(dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}
function parseLucideImports(text) {
  const found = [];
  const regex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/g;
  let match;
  while ((match = regex.exec(text))) {
    for (const raw of match[1].split(',')) {
      const item = raw.trim();
      if (!item) continue;
      found.push(item.split(/\s+as\s+/i)[0].trim());
    }
  }
  return found;
}

const required = [
  'src/components/ui-system/EntityIcon.tsx',
  'src/components/ui-system/icon-registry.ts',
  'src/styles/design-system/closeflow-icons.css',
  'docs/ui/CLOSEFLOW_ENTITY_ICON_REGISTRY_2026-05-09.md',
  'scripts/check-closeflow-entity-icon-registry.cjs',
];
for (const rel of required) assert(exists(rel), 'Missing file: ' + rel);

const registry = read('src/components/ui-system/icon-registry.ts');
for (const entity of ["client","lead","case","task","event","activity","payment","commission","ai","template","notification"]) {
  assert(registry.includes(entity + ':'), 'Registry missing entity: ' + entity);
  assert(read('docs/ui/CLOSEFLOW_ENTITY_ICON_REGISTRY_2026-05-09.md').includes(entity), 'Docs missing entity: ' + entity);
}

const entityIcon = read('src/components/ui-system/EntityIcon.tsx');
assert(entityIcon.includes('data-cf-entity-icon={entity}'), 'EntityIcon missing data marker');
assert(entityIcon.includes('ClientEntityIcon'), 'EntityIcon missing client adapter');
assert(entityIcon.includes('LeadEntityIcon'), 'EntityIcon missing lead adapter');

const uiIndex = read('src/components/ui-system/index.ts');
assert(uiIndex.includes("export * from './EntityIcon';"), 'ui-system index missing EntityIcon export');
assert(uiIndex.includes("export * from './icon-registry';"), 'ui-system index missing icon-registry export');

const dsIndex = read('src/styles/design-system/index.css');
assert(dsIndex.includes('closeflow-icons.css'), 'design-system index missing closeflow-icons import');

const iconCss = read('src/styles/design-system/closeflow-icons.css');
assert(iconCss.includes('.cf-entity-icon-client'), 'icon css missing client class');
assert(iconCss.includes('.cf-entity-icon-notification'), 'icon css missing notification class');

const bannedEntityIconImports = new Set(["UserRound","Target","Briefcase","ClipboardList","ListTodo","Calendar","Activity","Wallet","CreditCard","BadgeDollarSign","HandCoins","Sparkles","Bot","FileText","LayoutTemplate","Bell","BellRing"]);
const activeFiles = walk('src/pages').filter((rel) => /\.(tsx|jsx)$/.test(rel));
const violations = [];
for (const rel of activeFiles) {
  const text = read(rel);
  const lucide = parseLucideImports(text).filter((name) => bannedEntityIconImports.has(name));
  if (lucide.length) violations.push(rel + ': ' + lucide.join(', '));
}
assert(!violations.length, 'Active screens import entity icons directly from lucide-react:\n' + violations.join('\n'));

const actionIcons = ['Plus', 'Search', 'Trash2', 'Pencil', 'Save'];
for (const actionIcon of actionIcons) {
  assert(!registry.includes(actionIcon + ','), 'Action icon leaked into entity registry: ' + actionIcon);
}

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:closeflow-entity-icon-registry'] === 'node scripts/check-closeflow-entity-icon-registry.cjs', 'package.json missing check:closeflow-entity-icon-registry');

console.log('CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B_CHECK_OK');
console.log('entity_count=11');
console.log('active_files_checked=' + activeFiles.length);
