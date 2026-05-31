const fs = require('fs');

const file = 'src/pages/Calendar.tsx';
let src = fs.readFileSync(file, 'utf8');

const before = src;

const lucideImportRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/m;
const match = src.match(lucideImportRe);

if (!match) {
  console.log('No lucide-react named import found. Nothing changed.');
  process.exit(0);
}

const importBlock = match[0];

if (/\bCalendar\s+as\s+CalendarIcon\b/.test(importBlock)) {
  console.log('Calendar icon is already aliased.');
} else if (/\bCalendar\b/.test(importBlock)) {
  const patchedImport = importBlock.replace(/\bCalendar\b(?!\s+as)/, 'Calendar as CalendarIcon');
  src = src.replace(importBlock, patchedImport);

  // Common JSX icon usages.
  src = src.replace(/<Calendar(?=[\s/>])/g, '<CalendarIcon');
  src = src.replace(/<\/Calendar(?=>)/g, '</CalendarIcon');

  // Common prop/object usages.
  src = src.replace(/icon=\{Calendar\}/g, 'icon={CalendarIcon}');
  src = src.replace(/Icon:\s*Calendar\b/g, 'Icon: CalendarIcon');

  fs.writeFileSync(file, src, 'utf8');
  console.log('Patched Calendar icon import to CalendarIcon.');
} else {
  console.log('lucide-react import does not include Calendar.');
}

const next = fs.readFileSync(file, 'utf8');

const functionDecls = (next.match(/export\s+default\s+function\s+Calendar\s*\(/g) || []).length;
if (functionDecls !== 1) {
  console.error('Expected exactly one export default function Calendar(), found: ' + functionDecls);
  process.exit(1);
}

const nextLucide = next.match(lucideImportRe)?.[0] || '';
if (/\bCalendar\b/.test(nextLucide) && !/\bCalendar\s+as\s+CalendarIcon\b/.test(nextLucide)) {
  console.error('Unaliased Calendar still exists in lucide-react import.');
  process.exit(1);
}

if (before === next) {
  console.log('No file changes were needed.');
}

console.log('OK local Calendar duplicate declaration guard.');
