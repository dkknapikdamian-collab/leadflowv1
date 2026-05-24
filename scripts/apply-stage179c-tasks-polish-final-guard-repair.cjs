const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage179c-tasks-polish-final-guard-repair.cjs <repo>');

function file(rel) {
  return path.join(repo, rel);
}
function exists(rel) {
  return fs.existsSync(file(rel));
}
function read(rel) {
  return fs.readFileSync(file(rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(file(rel), text, 'utf8');
}

const mojibakePairs = [
  ['Ä…', 'ą'], ['Ä„', 'Ą'],
  ['Ä‡', 'ć'], ['Ä†', 'Ć'],
  ['Ä™', 'ę'], ['ÄĘ', 'Ę'],
  ['Ĺ‚', 'ł'], ['Å‚', 'ł'], ['Ĺ�', 'Ł'], ['Å�', 'Ł'],
  ['Ĺ„', 'ń'], ['Å„', 'ń'], ['ĹŃ', 'Ń'], ['ÅŃ', 'Ń'],
  ['Ĺ›', 'ś'], ['Å›', 'ś'], ['Ĺš', 'Ś'], ['Åš', 'Ś'],
  ['Ĺş', 'ź'], ['Åş', 'ź'], ['ĹŹ', 'Ź'], ['ÅŹ', 'Ź'],
  ['Ĺ¼', 'ż'], ['Å¼', 'ż'], ['Ĺ»', 'Ż'], ['Å»', 'Ż'],
  ['Ã³', 'ó'], ['Ăł', 'ó'], ['Ã“', 'Ó'], ['Ă“', 'Ó'],
  ['â€“', '–'], ['â€”', '—'], ['â€ž', '„'], ['â€ť', '”'],
];

const targetedPairs = [
  ['Filtry zadaÅ„', 'Filtry zadań'],
  ['Filtry zadaĹ„', 'Filtry zadań'],
  ['Najpilniejsze zadaÅ„', 'Najpilniejsze zadań'],
  ['Najpilniejsze zadaĹ„', 'Najpilniejsze zadań'],
  ['ZalegÅ‚e', 'Zaległe'],
  ['ZalegĹ‚e', 'Zaległe'],
  ['DziÅ›', 'Dziś'],
  ['DziĹ›', 'Dziś'],
  ['Bez powiÄ…zania', 'Bez powiązania'],
  ['NadchodzÄ…ce', 'Nadchodzące'],
  ['do uporzÄ…dkowania', 'do uporządkowania'],
  ['zamkniÄ™te dziaĹ‚ania', 'zamknięte działania'],
  ['zamkniÄ™te dziaÅ‚ania', 'zamknięte działania'],
  ['najbliÅ¼sze terminy', 'najbliższe terminy'],
  ['najbliĹĽsze terminy', 'najbliższe terminy'],
  ['Bez klikania po zakÅ‚adkach', 'Bez klikania po zakładkach'],
  ['Bez klikania po zakĹ‚adkach', 'Bez klikania po zakładkach'],
  ['5 zadaÅ„', '5 zadań'],
  ['5 zadaĹ„', '5 zadań'],
  ['zadaÅ„', 'zadań'],
  ['zadaĹ„', 'zadań'],
  ['ktÃ³re', 'które'],
  ['ktĂłre', 'które'],
  ['najÅ‚atwiej', 'najłatwiej'],
  ['najĹ‚atwiej', 'najłatwiej'],
  ['zgubiÄ‡', 'zgubić'],
  ['wÅ‚aÅ›ciciela', 'właściciela'],
  ['wĹ‚aĹ›ciciela', 'właściciela'],
  ['KrÃ³tki', 'Krótki'],
  ['KrĂłtki', 'Krótki'],
  ['Brak aktywnych pilnych zadaÅ„', 'Brak aktywnych pilnych zadań'],
  ['Brak aktywnych pilnych zadaĹ„', 'Brak aktywnych pilnych zadań'],
];

function replacePairs(text) {
  let out = text;
  for (const [from, to] of [...targetedPairs, ...mojibakePairs]) {
    out = out.split(from).join(to);
  }
  return out;
}

function patchTasksStable() {
  const rel = 'src/pages/TasksStable.tsx';
  if (!exists(rel)) throw new Error(`Missing ${rel}`);

  let source = read(rel);
  const original = source;

  source = replacePairs(source);

  // Normalize fragments that may be partially cut by previous encodings.
  source = source
    .replace(/zada[ÅĹ][^'"`<>\s,.)]*/g, 'zadań')
    .replace(/Zaleg[ÅĹ][^'"`<>\s,.)]*/g, 'Zaległe')
    .replace(/Dzi[ÅĹ][^'"`<>\s,.)]*/g, 'Dziś')
    .replace(/powi[ÄĂ][^'"`<>\s,.)]*/g, 'powiązania')
    .replace(/zak[ÅĹ][^'"`<>\s,.)]*/g, 'zakładkach');

  // Use unicode escapes for array labels and hints, which protects source from local encoding quirks.
  source = source.replace(
    /const groups: Array<\{ id: TaskGroupId; label: string; hint: string; tasks: any\[\] \}> = \[[\s\S]*?\n  \];/,
    `const groups: Array<{ id: TaskGroupId; label: string; hint: string; tasks: any[] }> = [
    { id: 'overdue', label: 'Zaleg\\u0142e', hint: 'najpierw odblokuj ryzyko', tasks: [] },
    { id: 'today', label: 'Dzi\\u015b', hint: 'zadania na teraz', tasks: [] },
    { id: 'upcoming', label: 'Nadchodz\\u0105ce', hint: 'najbli\\u017csze terminy', tasks: [] },
    { id: 'no_due', label: 'Bez terminu', hint: 'do uporz\\u0105dkowania', tasks: [] },
    { id: 'done', label: 'Zrobione', hint: 'zamkni\\u0119te dzia\\u0142ania', tasks: [] },
  ];`
  );

  source = source.replace(
    /const taskScopeFilters = useMemo\(\(\) => \(\[[\s\S]*?\n  \]\), \[stats, tasks\]\);/,
    `const taskScopeFilters = useMemo(() => ([
    { id: 'active' as TaskScope, label: 'Aktywne', count: stats.active, tone: 'blue' },
    { id: 'today' as TaskScope, label: 'Dzi\\u015b', count: stats.today, tone: 'blue' },
    { id: 'overdue' as TaskScope, label: 'Zaleg\\u0142e', count: stats.overdue, tone: 'red' },
    { id: 'high' as TaskScope, label: 'Wysoki priorytet', count: tasks.filter((task) => !isTaskDone(task) && isTaskHighPriority(task)).length, tone: 'amber' },
    { id: 'unlinked' as TaskScope, label: 'Bez powi\\u0105zania', count: tasks.filter((task) => !isTaskDone(task) && isTaskUnlinked(task)).length, tone: 'neutral' },
    { id: 'done' as TaskScope, label: 'Zrobione', count: stats.done, tone: 'green' },
  ]), [stats, tasks]);`
  );

  // Keep literal headings for Stage178/178B guards.
  source = source.replace(/<h2>\{?'?Filtry zada(?:ń|\\u0144)'?\}?<\/h2>/g, '<h2>Filtry zadań</h2>');
  source = source.replace(/<h2>Filtry zada[ÅĹ][^<]*<\/h2>/g, '<h2>Filtry zadań</h2>');
  source = source.replace(/<h3>\{?'?Najpilniejsze zadania'?\}?<\/h3>/g, '<h3>Najpilniejsze zadania</h3>');

  // Literal Polish UI copy, not escaped JSX expressions.
  source = source.replace(/\{?'?Bez klikania po zak(?:ł|\\u0142)adkach\. Najpierw to, co wymaga ruchu\.'?\}?/g, 'Bez klikania po zakładkach. Najpierw to, co wymaga ruchu.');
  source = source.replace(/\{?'?5 zada(?:ń|\\u0144), kt(?:ó|\\u00f3)re naj(?:ł|\\u0142)atwiej zgubi(?:ć|\\u0107) w pracy operacyjnej\.'?\}?/g, '5 zadań, które najłatwiej zgubić w pracy operacyjnej.');
  source = source.replace(/\{?'?Brak aktywnych pilnych zada(?:ń|\\u0144)\.'?\}?/g, 'Brak aktywnych pilnych zadań.');

  // Remove Szybki fokus card and leftovers.
  source = source.replace(
    /\n\s*<section className="tasks-stage178-rail-card" data-stage178-tasks-focus-card="true">[\s\S]*?<\/section>\n\s*(?=<\/aside>)/,
    '\n'
  );
  source = source.replace(/\n\s*const nextTaskMoment = urgentTasks\[0\] \? formatTaskMoment\(urgentTasks\[0\]\) : 'Brak';\n/g, '\n');

  source = replacePairs(source)
    .replace(/zada[ÅĹ][^'"`<>\s,.)]*/g, 'zadań')
    .replace(/Zaleg[ÅĹ][^'"`<>\s,.)]*/g, 'Zaległe')
    .replace(/Dzi[ÅĹ][^'"`<>\s,.)]*/g, 'Dziś');

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/pages/TasksStable.tsx: final Polish cleanup and focus card removal');
  } else {
    console.log('SKIPPED src/pages/TasksStable.tsx: no final cleanup needed');
  }
}

function patchGuard(rel, content) {
  if (!exists(rel)) return;
  write(rel, content);
  console.log(`UPDATED ${rel}: Stage179C guard reconciled`);
}

const stage179Guard = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(\\\`\${rel} missing marker: \${marker}\\\`);
}
function mustNotInclude(rel, marker) {
  if (read(rel).includes(marker)) throw new Error(\\\`\${rel} must not contain marker: \${marker}\\\`);
}

const tasks = 'src/pages/TasksStable.tsx';

[
  "label: 'Zaleg\\\\u0142e'",
  "label: 'Dzi\\\\u015b'",
  "label: 'Nadchodz\\\\u0105ce'",
  "hint: 'do uporz\\\\u0105dkowania'",
  "hint: 'zamkni\\\\u0119te dzia\\\\u0142ania'",
  "label: 'Bez powi\\\\u0105zania'",
  '<h2>Filtry zadań</h2>',
  '<h3>Najpilniejsze zadania</h3>',
  'Bez klikania po zakładkach. Najpierw to, co wymaga ruchu.',
  '5 zadań, które najłatwiej zgubić w pracy operacyjnej.',
  'Brak aktywnych pilnych zadań.',
  'data-stage178-tasks-filter-card="true"',
  'data-stage178-tasks-urgent-card="true"',
].forEach((marker) => mustInclude(tasks, marker));

[
  'Szybki fokus',
  'data-stage178-tasks-focus-card="true"',
  'tasks-stage178-focus-row',
  'nextTaskMoment',
  'ZalegÅ',
  'ZalegĹ',
  'DziÅ',
  'DziĹ',
  'zadaÅ',
  'zadaĹ',
  'powiÄ',
  'zakÅ',
  'zakĹ',
  'Å‚',
  'Ĺ‚',
  'Å›',
  'Ĺ›',
  'Ä…',
  'Ä™',
  'Ă',
  'Ã',
].forEach((marker) => mustNotInclude(tasks, marker));

console.log('OK: Stage179 tasks Polish copy fixed and Szybki fokus removed.');
`;

const stage179BGuard = stage179Guard.replace(
  "OK: Stage179 tasks Polish copy fixed and Szybki fokus removed.",
  "OK: Stage179B tasks Polish text and guard alignment passed."
);

const stage179CGuard = stage179Guard.replace(
  "OK: Stage179 tasks Polish copy fixed and Szybki fokus removed.",
  "OK: Stage179C final Polish guard repair passed."
);

patchTasksStable();
patchGuard('scripts/check-stage179-tasks-polish-copy-remove-focus.cjs', stage179Guard);
patchGuard('scripts/check-stage179b-tasks-polish-guard-alignment.cjs', stage179BGuard);
patchGuard('scripts/check-stage179c-tasks-polish-final-guard-repair.cjs', stage179CGuard);
