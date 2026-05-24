const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage179b-tasks-polish-guard-alignment.cjs <repo>');

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
function replaceAllText(text, replacements) {
  let out = text;
  for (const [from, to] of replacements) out = out.split(from).join(to);
  return out;
}

const commonMojibakeFixes = [
  ['ZalegÅ‚e', 'Zaległe'],
  ['ZalegĹ‚e', 'Zaległe'],
  ['DziÅ›', 'Dziś'],
  ['DziĹ›', 'Dziś'],
  ['Filtry zadaÅ„', 'Filtry zadań'],
  ['Filtry zadaĹ„', 'Filtry zadań'],
  ['Bez powiÄ…zania', 'Bez powiązania'],
  ['Bez powiÄ…zania', 'Bez powiązania'],
  ['NadchodzÄ…ce', 'Nadchodzące'],
  ['do uporzÄ…dkowania', 'do uporządkowania'],
  ['zamkniÄ™te dziaÅ‚ania', 'zamknięte działania'],
  ['zamkniÄ™te dziaĹ‚ania', 'zamknięte działania'],
  ['najbliÅ¼sze terminy', 'najbliższe terminy'],
  ['najbliĹĽsze terminy', 'najbliższe terminy'],
  ['Bez klikania po zakÅ‚adkach', 'Bez klikania po zakładkach'],
  ['Bez klikania po zakĹ‚adkach', 'Bez klikania po zakładkach'],
  ['5 zadaÅ„', '5 zadań'],
  ['5 zadaĹ„', '5 zadań'],
  ['zadaÅ„', 'zadań'],
  ['zadaĹ„', 'zadań'],
  ['zadaÅ', 'zadań'],
  ['zadaĹ', 'zadań'],
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

function patchTasksStable() {
  const rel = 'src/pages/TasksStable.tsx';
  if (!exists(rel)) throw new Error(`Missing ${rel}`);

  let source = read(rel);
  const original = source;

  source = replaceAllText(source, commonMojibakeFixes);

  // Extra broad cleanup for partial mojibake tokens that survived previous replacements.
  source = source
    .replace(/zada[ÅĹ][^'"`<>\s,.)]*/g, 'zadań')
    .replace(/Zaleg[ÅĹ][^'"`<>\s,.)]*/g, 'Zaległe')
    .replace(/Dzi[ÅĹ][^'"`<>\s,.)]*/g, 'Dziś')
    .replace(/powi[ÄĂ][^'"`<>\s,.)]*/g, 'powiązania')
    .replace(/zak[ÅĹ][^'"`<>\s,.)]*/g, 'zakładkach');

  // Normalize group labels and hints to unicode-escaped strings so source survives PowerShell encoding issues.
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

  // Normalize visible rail headings/descriptions. Literal headings are preserved for older Stage178 guards.
  source = source.replace(/<h2>\{?'?Filtry zada(?:ń|\\u0144)'?\}?<\/h2>/g, `<h2>Filtry zadań</h2>`);
  source = source.replace(/<h2>Filtry zada[ÅĹ][^<]*<\/h2>/g, `<h2>Filtry zadań</h2>`);
  source = source.replace(/<h3>\{?'?Najpilniejsze zadania'?\}?<\/h3>/g, `<h3>Najpilniejsze zadania</h3>`);

  source = source.replace(/\{?'?Bez klikania po zak(?:ł|\\u0142)adkach\. Najpierw to, co wymaga ruchu\.'?\}?/g, `Bez klikania po zakładkach. Najpierw to, co wymaga ruchu.`);
  source = source.replace(/\{?'?5 zada(?:ń|\\u0144), kt(?:ó|\\u00f3)re naj(?:ł|\\u0142)atwiej zgubi(?:ć|\\u0107) w pracy operacyjnej\.'?\}?/g, `5 zadań, które najłatwiej zgubić w pracy operacyjnej.`);
  source = source.replace(/\{?'?Brak aktywnych pilnych zada(?:ń|\\u0144)\.'?\}?/g, `Brak aktywnych pilnych zadań.`);

  // Remove Szybki fokus card and any leftover focus rows/classes.
  source = source.replace(
    /\n\s*<section className="tasks-stage178-rail-card" data-stage178-tasks-focus-card="true">[\s\S]*?<\/section>\n\s*(?=<\/aside>)/,
    '\n'
  );
  source = source.replace(/\n\s*const nextTaskMoment = urgentTasks\[0\] \? formatTaskMoment\(urgentTasks\[0\]\) : 'Brak';\n/g, '\n');

  // Final cleanup pass.
  source = replaceAllText(source, commonMojibakeFixes)
    .replace(/zada[ÅĹ][^'"`<>\s,.)]*/g, 'zadań')
    .replace(/Zaleg[ÅĹ][^'"`<>\s,.)]*/g, 'Zaległe')
    .replace(/Dzi[ÅĹ][^'"`<>\s,.)]*/g, 'Dziś');

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/pages/TasksStable.tsx: Stage179B Polish text aligned, Szybki fokus removed, literal guard headings restored');
  } else {
    console.log('SKIPPED src/pages/TasksStable.tsx: no Stage179B change needed');
  }
}

function patchStage178Guards() {
  for (const rel of [
    'scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs',
    'scripts/check-stage178b-tasks-rail-guard-repair.cjs',
  ]) {
    if (!exists(rel)) continue;
    let source = read(rel);
    const original = source;
    source = replaceAllText(source, commonMojibakeFixes);

    // Focus card is intentionally removed in Stage179.
    source = source
      .replace(/\n\s*'Szybki fokus',/g, '')
      .replace(/\n\s*'data-stage178-tasks-focus-card="true"',/g, '');

    // Keep the old text markers valid now that TasksStable has literal headings.
    if (source !== original) {
      write(rel, source);
      console.log(`UPDATED ${rel}: Stage179B guard alignment`);
    }
  }
}

function addStage179BFilesMarkerDocs() {
  // No-op placeholder: docs are copied by PowerShell before this script.
}

patchTasksStable();
patchStage178Guards();
addStage179BFilesMarkerDocs();
