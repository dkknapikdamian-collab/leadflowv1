const fs = require('fs');

const file = 'src/pages/Activity.tsx';
let src = fs.readFileSync(file, 'utf8');
const before = src;

// Alias lucide icon Activity so it does not collide with export default function Activity().
const lucideImportRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/m;
const match = src.match(lucideImportRe);

if (!match) {
  throw new Error('No lucide-react named import found in Activity.tsx.');
}

const importBlock = match[0];

if (!/\bActivity\s+as\s+ActivityIcon\b/.test(importBlock)) {
  if (!/\bActivity\b/.test(importBlock)) {
    throw new Error('lucide-react import does not contain Activity.');
  }

  const patchedImport = importBlock.replace(/\bActivity\b(?!\s+as)/, 'Activity as ActivityIcon');
  src = src.replace(importBlock, patchedImport);
}

// Replace common JSX/value usages of the icon if present.
src = src.replace(/<Activity(?=[\s/>])/g, '<ActivityIcon');
src = src.replace(/<\/Activity(?=>)/g, '</ActivityIcon');
src = src.replace(/icon=\{Activity\}/g, 'icon={ActivityIcon}');
src = src.replace(/Icon:\s*Activity\b/g, 'Icon: ActivityIcon');

fs.writeFileSync(file, src, 'utf8');

const next = fs.readFileSync(file, 'utf8');

const failures = [];

const nextLucide = next.match(lucideImportRe)?.[0] || '';
if (!nextLucide.includes('Activity as ActivityIcon')) {
  failures.push('Activity icon is not aliased in lucide-react import.');
}

if (/import\s*\{[\s\S]*\bActivity\b(?!\s+as\s+ActivityIcon)[\s\S]*\}\s*from\s*['"]lucide-react['"]/.test(nextLucide)) {
  failures.push('Unaliased Activity remains in lucide-react import.');
}

const componentDecls = (next.match(/export\s+default\s+function\s+Activity\s*\(/g) || []).length;
if (componentDecls !== 1) {
  failures.push('Expected exactly one export default function Activity(), found: ' + componentDecls);
}

if (failures.length) {
  console.error('Stage181T local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (before === next) {
  console.log('No changes needed. Stage181T already present.');
} else {
  console.log('Patched Stage181T locally.');
}

console.log('OK Stage181T local: Activity icon alias removes duplicate declaration.');
