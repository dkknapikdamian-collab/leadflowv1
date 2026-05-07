const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const packageOnly = process.argv.includes('--package-only');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, content) {
  fs.writeFileSync(path.join(repo, rel), content, 'utf8');
}

function patchPackage() {
  const rel = 'package.json';
  const file = path.join(repo, rel);
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:today-refresh-tiles-match-lists'] = 'node scripts/check-today-refresh-tiles-match-lists.cjs';
  pkg.scripts['test:today-refresh-tiles-match-lists'] = 'node --test tests/today-refresh-tiles-match-lists.test.cjs';
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('OK package.json scripts patched');
}

function findMatchingSectionEnd(src, startIndex) {
  const tokenRe = /<section\b|<\/section>/g;
  tokenRe.lastIndex = startIndex;
  let depth = 0;
  let match;
  while ((match = tokenRe.exec(src))) {
    if (match[0].startsWith('</')) {
      depth -= 1;
      if (depth === 0) return tokenRe.lastIndex;
    } else {
      depth += 1;
    }
  }
  return -1;
}

function replaceFirst(src, needle, replacement, label) {
  if (!src.includes(needle)) throw new Error('Missing block: ' + label);
  return src.replace(needle, replacement);
}

function replaceRegex(src, regex, replacement, label) {
  if (!regex.test(src)) throw new Error('Missing pattern: ' + label);
  return src.replace(regex, replacement);
}

function patchRefresh(src) {
  if (!src.includes('const STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE')) {
    src = src.replace(
      "const STAGE82_TODAY_NEXT_7_DAYS = 'STAGE82_TODAY_NEXT_7_DAYS';",
      "const STAGE82_TODAY_NEXT_7_DAYS = 'STAGE82_TODAY_NEXT_7_DAYS';\nconst STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE = 'STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE';\nconst STAGE16AI_TODAY_TILES_MATCH_LISTS = 'STAGE16AI_TODAY_TILES_MATCH_LISTS';"
    );
    src = src.replace(
      'void STAGE82_TODAY_NEXT_7_DAYS;',
      'void STAGE82_TODAY_NEXT_7_DAYS;\nvoid STAGE16AI_TODAY_REFRESH_BUTTON_MANUAL_STATE;\nvoid STAGE16AI_TODAY_TILES_MATCH_LISTS;'
    );
  }

  if (!src.includes('const [manualRefreshing, setManualRefreshing]')) {
    src = replaceFirst(
      src,
      "  const [lastLoadedAt, setLastLoadedAt] = useState<string>('');\n",
      "  const [lastLoadedAt, setLastLoadedAt] = useState<string>('');\n  const [manualRefreshing, setManualRefreshing] = useState(false);\n",
      'manual refreshing state anchor'
    );
  }

  const start = src.indexOf('  const refreshData = useCallback(async');
  if (start < 0) throw new Error('Could not find refreshData callback');
  const endToken = '\n  }, []);';
  const end = src.indexOf(endToken, start);
  if (end < 0) throw new Error('Could not find refreshData callback end');

  const replacement = `  const refreshData = useCallback(async (options?: { manual?: boolean }) => {
    const manual = Boolean(options?.manual);
    if (manual) setManualRefreshing(true);
    setStatus((current) => (current === 'ready' ? 'ready' : 'loading'));
    setErrorMessage('');

    try {
      const nextData = await loadStableTodayData();
      setData(nextData);
      setLastLoadedAt(new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }));
      setStatus('ready');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Nie udało się pobrać danych.');
      setStatus('error');
    } finally {
      if (manual) setManualRefreshing(false);
    }
  }, []);`;

  src = src.slice(0, start) + replacement + src.slice(end + endToken.length);

  src = src.replace(
    '<Button type="button" variant="outline" onClick={() => void refreshData()} disabled={loading}>\n                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}\n                Odśwież dane\n              </Button>',
    '<Button type="button" variant="outline" onClick={() => void refreshData({ manual: true })} disabled={loading || manualRefreshing}>\n                {manualRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}\n                {manualRefreshing ? \'Odświeżanie...\' : \'Odśwież dane\'}\n              </Button>'
  );

  if (!src.includes('refreshData({ manual: true })')) {
    src = src.replace(
      /<Button type="button" variant="outline" onClick=\{\(\) => void refreshData\(\)\} disabled=\{loading\}>[\s\S]*?Odśwież dane\s*<\/Button>/,
      '<Button type="button" variant="outline" onClick={() => void refreshData({ manual: true })} disabled={loading || manualRefreshing}>\n                {manualRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}\n                {manualRefreshing ? \'Odświeżanie...\' : \'Odśwież dane\'}\n              </Button>'
    );
  }

  if (!src.includes('refreshData({ manual: true })')) throw new Error('Manual refresh button was not patched');
  return src;
}

function patchTileLabelsAndSectionHeaders(src) {
  if (!src.includes('const todaySectionLabels = {')) {
    const anchor = "  const sectionVisible = (key: 'no_action' | 'risk' | 'waiting' | 'leads' | 'tasks' | 'events' | 'drafts' | 'upcoming') =>\n    expandedSection === 'all' || expandedSection === key;\n";
    const block = `${anchor}
  const todaySectionLabels = {
    no_action: 'Leady bez najbliższej akcji',
    risk: 'Wysoka wartość / ryzyko',
    waiting: 'Leady czekające',
    leads: 'Leady do obsługi dziś',
    tasks: 'Zadania do wykonania dziś',
    events: 'Wydarzenia dziś',
    upcoming: 'Najbliższe 7 dni',
    drafts: 'Szkice AI do sprawdzenia',
  } as const;

  const todayTiles: Array<{
    key: 'no_action' | 'risk' | 'waiting' | 'leads' | 'tasks' | 'events' | 'drafts' | 'upcoming';
    title: string;
    count: number;
    tone: string;
    activeTone: string;
    icon: ReactNode;
  }> = [
    { key: 'no_action', title: todaySectionLabels.no_action, count: noActionLeads.length, tone: 'text-amber-700', activeTone: 'hover:border-amber-200', icon: <AlertTriangle className="h-4 w-4" /> },
    { key: 'risk', title: todaySectionLabels.risk, count: highValueAtRiskRows.length, tone: 'text-rose-700', activeTone: 'hover:border-rose-200', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'waiting', title: todaySectionLabels.waiting, count: waitingLeadRows.length, tone: 'text-orange-700', activeTone: 'hover:border-orange-200', icon: <UserRound className="h-4 w-4" /> },
    { key: 'leads', title: todaySectionLabels.leads, count: operatorLeads.length, tone: 'text-blue-700', activeTone: 'hover:border-blue-200', icon: <UserRound className="h-4 w-4" /> },
    { key: 'tasks', title: todaySectionLabels.tasks, count: operatorTasks.length, tone: 'text-emerald-700', activeTone: 'hover:border-emerald-200', icon: <CheckSquare className="h-4 w-4" /> },
    { key: 'events', title: todaySectionLabels.events, count: todayEvents.length, tone: 'text-violet-700', activeTone: 'hover:border-violet-200', icon: <CalendarDays className="h-4 w-4" /> },
    { key: 'upcoming', title: todaySectionLabels.upcoming, count: upcomingRows.length, tone: 'text-slate-700', activeTone: 'hover:border-slate-300', icon: <CalendarDays className="h-4 w-4" /> },
    { key: 'drafts', title: todaySectionLabels.drafts, count: pendingDrafts.length, tone: 'text-indigo-700', activeTone: 'hover:border-indigo-200', icon: <FileText className="h-4 w-4" /> },
  ];
`;
    src = replaceFirst(src, anchor, block, 'section labels/tile model anchor');
  }

  const gridStartNeedle = '<section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">';
  const gridStart = src.indexOf(gridStartNeedle);
  if (gridStart < 0) throw new Error('Could not find Today tile grid section');
  const gridEnd = findMatchingSectionEnd(src, gridStart);
  if (gridEnd < 0) throw new Error('Could not find Today tile grid section end');

  const tileSection = `        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-stage16ai-today-tiles-match-lists="true">
          {todayTiles.map((tile) => {
            const active = expandedSection === tile.key;
            return (
              <button key={tile.key} type="button" onClick={() => setExpandedSection(active ? 'all' : tile.key)} className="text-left">
                <Card className={
                  'border-slate-100 transition hover:shadow-md ' +
                  tile.activeTone +
                  (active ? ' ring-2 ring-slate-200' : '')
                }>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{tile.title}</p>
                      <span className={'rounded-full bg-slate-50 p-2 ' + tile.tone}>{tile.icon}</span>
                    </div>
                    <p className={'mt-2 text-3xl font-black ' + tile.tone}>{tile.count}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">Tyle samo co w sekcji poniżej</p>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </section>`;
  src = src.slice(0, gridStart) + tileSection + src.slice(gridEnd);

  const headerMap = [
    ['noActionLeads.length', 'no_action'],
    ['highValueAtRiskRows.length', 'risk'],
    ['waitingLeadRows.length', 'waiting'],
    ['operatorLeads.length', 'leads'],
    ['operatorTasks.length', 'tasks'],
    ['todayEvents.length', 'events'],
    ['upcomingRows.length', 'upcoming'],
    ['pendingDrafts.length', 'drafts'],
  ];

  for (const [countExpr, key] of headerMap) {
    const escaped = countExpr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(<SectionHeader\\s+title=)(?:"[^"]*"|\\{todaySectionLabels\\.[a-z_]+\\})(\\s+count=\\{' + escaped + '\\})', 'g');
    src = src.replace(re, '$1{todaySectionLabels.' + key + '}$2');
  }

  for (const [, key] of headerMap) {
    if (!src.includes('title={todaySectionLabels.' + key + '}')) {
      throw new Error('SectionHeader was not wired to todaySectionLabels.' + key);
    }
  }

  return src;
}

function patchTodayFile() {
  const rel = 'src/pages/TodayStable.tsx';
  let src = read(rel);
  src = patchRefresh(src);
  src = patchTileLabelsAndSectionHeaders(src);
  write(rel, src);
  console.log('OK TodayStable refresh and tile counters patched');
}

patchPackage();
if (!packageOnly) patchTodayFile();
