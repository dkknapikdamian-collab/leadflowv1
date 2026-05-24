const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage179-tasks-polish-copy-remove-focus.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function replaceAllText(text, replacements) {
  let out = text;
  for (const [from, to] of replacements) out = out.split(from).join(to);
  return out;
}

const mojibakeFixes = [
  ['ZalegÅ‚e', 'Zaległe'],
  ['ZalegĹ‚e', 'Zaległe'],
  ['DziÅ›', 'Dziś'],
  ['DziĹ›', 'Dziś'],
  ['Najpilniejsze zadania', 'Najpilniejsze zadania'],
  ['Filtry zadaÅ„', 'Filtry zadań'],
  ['Filtry zadaĹ„', 'Filtry zadań'],
  ['Bez powiÄ…zania', 'Bez powiązania'],
  ['Bez powiÄ…zania', 'Bez powiązania'],
  ['Wysoki priorytet', 'Wysoki priorytet'],
  ['Zrobione', 'Zrobione'],
  ['NadchodzÄ…ce', 'Nadchodzące'],
  ['NadchodzÄ…ce', 'Nadchodzące'],
  ['Bez terminu', 'Bez terminu'],
  ['do uporzÄ…dkowania', 'do uporządkowania'],
  ['do uporzÄ…dkowania', 'do uporządkowania'],
  ['zamkniÄ™te dziaĹ‚ania', 'zamknięte działania'],
  ['zamkniÄ™te dziaÅ‚ania', 'zamknięte działania'],
  ['zadania na teraz', 'zadania na teraz'],
  ['najbliÅ¼sze terminy', 'najbliższe terminy'],
  ['najbliĹĽsze terminy', 'najbliższe terminy'],
  ['najpierw odblokuj ryzyko', 'najpierw odblokuj ryzyko'],
  ['Bez klikania po zakĹ‚adkach', 'Bez klikania po zakładkach'],
  ['Bez klikania po zakÅ‚adkach', 'Bez klikania po zakładkach'],
  ['Najpierw to, co wymaga ruchu.', 'Najpierw to, co wymaga ruchu.'],
  ['5 zadaĹ„', '5 zadań'],
  ['5 zadaÅ„', '5 zadań'],
  ['ktÃ³re', 'które'],
  ['ktĂłre', 'które'],
  ['zgubiÄ‡', 'zgubić'],
  ['zgubiÄ‡', 'zgubić'],
  ['aktywne', 'aktywne'],
  ['Brak aktywnych pilnych zadaĹ„', 'Brak aktywnych pilnych zadań'],
  ['Brak aktywnych pilnych zadaÅ„', 'Brak aktywnych pilnych zadań'],
  ['Szybki fokus', 'Szybki fokus'],
  ['KrÃ³tki radar wÅ‚aÅ›ciciela.', 'Krótki radar właściciela.'],
  ['KrĂłtki radar wĹ‚aĹ›ciciela.', 'Krótki radar właściciela.'],
];

// 1) Patch TasksStable.tsx.
{
  const rel = 'src/pages/TasksStable.tsx';
  let source = read(rel);
  const original = source;

  source = replaceAllText(source, mojibakeFixes);

  // Use unicode escapes in Stage178 labels so future PowerShell/encoding quirks cannot re-mojibake the UI copy.
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

  // Replace text nodes with expression strings using unicode escapes.
  source = source.replace(/<h2>Filtry zadań<\/h2>|<h2>Filtry zadaÅ„<\/h2>|<h2>Filtry zadaĹ„<\/h2>/g, `<h2>{'Filtry zada\\u0144'}</h2>`);
  source = source.replace(/<h3>Najpilniejsze zadania<\/h3>/g, `<h3>{'Najpilniejsze zadania'}</h3>`);
  source = source.replace(/Bez klikania po zakładkach\. Najpierw to, co wymaga ruchu\./g, `{'Bez klikania po zak\\u0142adkach. Najpierw to, co wymaga ruchu.'}`);
  source = source.replace(/5 zadań, które najłatwiej zgubić w pracy operacyjnej\./g, `{'5 zada\\u0144, kt\\u00f3re naj\\u0142atwiej zgubi\\u0107 w pracy operacyjnej.'}`);
  source = source.replace(/Brak aktywnych pilnych zadań\./g, `{'Brak aktywnych pilnych zada\\u0144.'}`);

  // Remove the whole Szybki fokus card.
  source = source.replace(
    /\n\s*<section className="tasks-stage178-rail-card" data-stage178-tasks-focus-card="true">[\s\S]*?<\/section>\n\s*(?=<\/aside>)/,
    '\n'
  );

  // Remove unused nextTaskMoment after removing Szybki fokus.
  source = source.replace(/\n\s*const nextTaskMoment = urgentTasks\[0\] \? formatTaskMoment\(urgentTasks\[0\]\) : 'Brak';\n/, '\n');

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/pages/TasksStable.tsx: fixed Polish copy and removed Szybki fokus');
  } else {
    console.log('SKIPPED src/pages/TasksStable.tsx: no Stage179 changes needed');
  }
}

// 2) Patch Stage178/178B guards so they no longer require Szybki fokus.
for (const rel of [
  'scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs',
  'scripts/check-stage178b-tasks-rail-guard-repair.cjs',
]) {
  if (!fs.existsSync(path.join(repo, rel))) continue;
  let source = read(rel);
  const original = source;

  source = replaceAllText(source, mojibakeFixes);
  source = source
    .replace(/\n\s*'Szybki fokus',/g, '')
    .replace(/\n\s*'data-stage178-tasks-focus-card="true"',/g, '');

  if (source !== original) {
    write(rel, source);
    console.log(`UPDATED ${rel}: removed focus-card requirement`);
  }
}

// 3) Patch Stage178 docs and Obsidian update copy to reflect removal of focus card and fix Polish mojibake if present.
for (const rel of [
  'docs/ui/CLOSEFLOW_STAGE178_TASKS_RIGHT_RAIL_GROUPED_LIST_SOURCE_TRUTH.md',
  'docs/ui/CLOSEFLOW_STAGE178B_TASKS_RAIL_GUARD_REPAIR.md',
  '_project/STAGE178_TASKS_RIGHT_RAIL_GROUPED_LIST_SOURCE_TRUTH_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage178 tasks right rail grouped list source truth.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage178B tasks rail guard repair.md',
]) {
  const abs = path.join(repo, rel);
  if (!fs.existsSync(abs)) continue;
  let source = fs.readFileSync(abs, 'utf8');
  const original = source;
  source = replaceAllText(source, mojibakeFixes);

  source = source
    .replace(/\n- `Szybki fokus`/g, '')
    .replace(/\n- `Szybki fokus`,/g, '')
    .replace(/, `Szybki fokus`/g, '')
    .replace(/, Szybki fokus/g, '')
    .replace(/`Filtry zadań`, `Najpilniejsze zadania`, `Szybki fokus`/g, '`Filtry zadań`, `Najpilniejsze zadania`')
    .replace(/`Filtry zadań`, `Najpilniejsze zadania` i `Szybki fokus`/g, '`Filtry zadań` i `Najpilniejsze zadania`')
    .replace(/, quick focus/g, '')
    .replace(/, quick focus/g, '');

  if (!source.includes('Stage179')) {
    source += `

## Stage179 update

- Poprawiono polskie znaki w tekstach panelu zadań.
- Usunięto kartę \`Szybki fokus\` z prawego panelu.
- Pozostają: \`Filtry zadań\` i \`Najpilniejsze zadania\`.
`;
  }

  if (source !== original) {
    fs.writeFileSync(abs, source, 'utf8');
    console.log(`UPDATED ${rel}: Stage179 copy update`);
  }
}
