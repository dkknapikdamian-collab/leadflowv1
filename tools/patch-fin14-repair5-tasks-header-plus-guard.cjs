const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/TasksStable.tsx');

function fail(message) {
  throw new Error(message);
}

if (!fs.existsSync(file)) {
  fail('Brak src/pages/TasksStable.tsx');
}

let source = fs.readFileSync(file, 'utf8');
const before = source;

// FIN-14 REPAIR5: the quiet gate rejects the old header button block when <Plus />
// appears before "Nowe zadanie". Keep the action, remove the decorative icon.
source = source.replace(
  /\n\s*<Plus\s+className="mr-2 h-4 w-4"\s*\/>\s*\n\s*Nowe zadanie/g,
  '\n                              Nowe zadanie'
);

// More tolerant fallback for any formatting drift.
source = source.replace(
  /<Plus\b[^>]*\/>\s*Nowe zadanie/g,
  'Nowe zadanie'
);

// Remove Plus from lucide import only if nothing else uses <Plus.
if (!/<Plus\b/.test(source)) {
  source = source.replace(/,\s*Plus\s*\}/, ' }');
  source = source.replace(/,\s*Plus\s*,/g, ',');
  source = source.replace(/\{\s*Plus\s*,\s*/, '{ ');
  source = source.replace(/,\s*Plus\s*\n/g, '\n');
}

const forbidden = /<Plus[\s\S]{0,120}Nowe zadanie[\s\S]{0,180}<\/Button>/;
if (forbidden.test(source)) {
  fail('TasksStable nadal ma blok <Plus ... Nowe zadanie ... </Button>, który łamie guard.');
}

if (!source.includes('Nowe zadanie')) {
  fail('TasksStable stracił tekst przycisku Nowe zadanie.');
}

const marker = "const FIN14_REPAIR5_TASKS_HEADER_PLUS_GUARD = 'FIN-14_REPAIR5_TASKS_HEADER_PLUS_GUARD_no_plus_icon_in_new_task_button';";
if (!source.includes(marker)) {
  source = `${source.trimEnd()}\n\n${marker}\nvoid FIN14_REPAIR5_TASKS_HEADER_PLUS_GUARD;\n`;
}

fs.writeFileSync(file, source, 'utf8');

if (source === before) {
  console.log('[FIN-14 REPAIR5] TasksStable.tsx już był zgodny z guardem Plus/Nowe zadanie.');
} else {
  console.log('[FIN-14 REPAIR5] TasksStable.tsx: usunięto ikonę Plus z przycisku Nowe zadanie i dodano marker.');
}
