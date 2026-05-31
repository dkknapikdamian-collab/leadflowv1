const fs = require('fs');

const file = 'src/pages/Settings.tsx';
let src = fs.readFileSync(file, 'utf8');
const before = src;

// CLOSEFLOW_STAGE181AB_SETTINGS_DUPLICATE_DECLARATION
// Alias lucide Settings icon so it does not collide with export default function Settings().
const lucideImportRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/m;
const match = src.match(lucideImportRe);

if (!match) {
  throw new Error('No lucide-react named import found in Settings.tsx.');
}

const importBlock = match[0];

if (!/\bSettings\s+as\s+SettingsIcon\b/.test(importBlock)) {
  if (!/\bSettings\b/.test(importBlock)) {
    throw new Error('lucide-react import does not contain Settings.');
  }

  const patchedImport = importBlock.replace(/\bSettings\b(?!\s+as)/, 'Settings as SettingsIcon');
  src = src.replace(importBlock, patchedImport);
}

// Replace common icon usages, but do not touch "export default function Settings()".
src = src.replace(/<Settings(?=[\s/>])/g, '<SettingsIcon');
src = src.replace(/<\/Settings(?=>)/g, '</SettingsIcon');
src = src.replace(/icon=\{Settings\}/g, 'icon={SettingsIcon}');
src = src.replace(/Icon:\s*Settings\b/g, 'Icon: SettingsIcon');
src = src.replace(/icon:\s*Settings\b/g, 'icon: SettingsIcon');

fs.writeFileSync(file, src, 'utf8');

const next = fs.readFileSync(file, 'utf8');

const failures = [];

const nextLucide = next.match(lucideImportRe)?.[0] || '';

if (!nextLucide.includes('Settings as SettingsIcon')) {
  failures.push('Settings icon is not aliased in lucide-react import.');
}

if (/\bSettings\b(?!\s+as\s+SettingsIcon)/.test(nextLucide)) {
  failures.push('Unaliased Settings remains in lucide-react import.');
}

const componentDecls = (next.match(/export\s+default\s+function\s+Settings\s*\(/g) || []).length;
if (componentDecls !== 1) {
  failures.push('Expected exactly one export default function Settings(), found: ' + componentDecls);
}

if (/<Settings(?=[\s/>])/.test(next)) {
  failures.push('JSX <Settings usage remains.');
}

if (/icon=\{Settings\}/.test(next) || /Icon:\s*Settings\b/.test(next) || /icon:\s*Settings\b/.test(next)) {
  failures.push('Settings icon value usage remains.');
}

if (failures.length) {
  console.error('Stage181AB local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (before === next) {
  console.log('No changes needed. Stage181AB already present.');
} else {
  console.log('Patched Stage181AB locally.');
}

console.log('OK Stage181AB local: Settings icon alias removes duplicate declaration.');
