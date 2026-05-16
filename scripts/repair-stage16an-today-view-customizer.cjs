const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const todayPath = path.join(repo, 'src/pages/TodayStable.tsx');
const packagePath = path.join(repo, 'package.json');

function fail(message) {
  throw new Error(message);
}
function replaceOnce(source, needle, replacement, label) {
  if (!source.includes(needle)) fail(`Missing needle for ${label}`);
  return source.replace(needle, replacement);
}
function replaceRegex(source, regex, replacement, label) {
  if (!regex.test(source)) fail(`Missing pattern for ${label}`);
  return source.replace(regex, replacement);
}
function patchPackageJson() {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:today-view-customizer'] = 'node scripts/check-today-view-customizer.cjs';
  pkg.scripts['test:today-view-customizer'] = 'node --test tests/today-view-customizer.test.cjs';
  fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

function patchImports(source) {
  if (!source.includes('SlidersHorizontal,')) {
    source = replaceOnce(
      source,
      '  RefreshCcw,\n',
      '  RefreshCcw,\n  SlidersHorizontal,\n',
      'SlidersHorizontal icon import',
    );
  }
  return source;
}

function patchMarkers(source) {
  if (!source.includes("STAGE16AN_TODAY_VIEW_CUSTOMIZER")) {
    source = replaceOnce(
      source,
      "const STAGE16AI_TODAY_TILES_MATCH_LISTS = 'STAGE16AI_TODAY_TILES_MATCH_LISTS';\n",
      "const STAGE16AI_TODAY_TILES_MATCH_LISTS = 'STAGE16AI_TODAY_TILES_MATCH_LISTS';\nconst STAGE16AN_TODAY_VIEW_CUSTOMIZER = 'STAGE16AN_TODAY_VIEW_CUSTOMIZER';\nconst TODAY_VIEW_STORAGE_KEY = 'closeflow:today:view-sections:v1';\n",
      'Stage16AN constants',
    );
    source = replaceOnce(
      source,
      'void STAGE16AI_TODAY_TILES_MATCH_LISTS;\n',
      'void STAGE16AI_TODAY_TILES_MATCH_LISTS;\nvoid STAGE16AN_TODAY_VIEW_CUSTOMIZER;\n',
      'Stage16AN void marker',
    );
  }
  return source;
}

const helperBlock = `
type TodaySectionKey = 'no_action' | 'risk' | 'waiting' | 'leads' | 'tasks' | 'events' | 'drafts' | 'upcoming';

const TODAY_SECTION_KEYS: TodaySectionKey[] = [
  'no_action',
  'risk',
  'waiting',
  'leads',
  'tasks',
  'events',
  'upcoming',
  'drafts',
];

function sanitizeTodayVisibleSections(value: unknown): TodaySectionKey[] {
  if (!Array.isArray(value)) return [...TODAY_SECTION_KEYS];
  const unique = new Set<TodaySectionKey>();
  for (const item of value) {
    if (TODAY_SECTION_KEYS.includes(item as TodaySectionKey)) unique.add(item as TodaySectionKey);
  }
  return [...unique];
}

function readTodayVisibleSections(): TodaySectionKey[] {
  if (typeof window === 'undefined') return [...TODAY_SECTION_KEYS];
  try {
    const raw = window.localStorage.getItem(TODAY_VIEW_STORAGE_KEY);
    if (!raw) return [...TODAY_SECTION_KEYS];
    return sanitizeTodayVisibleSections(JSON.parse(raw));
  } catch {
    return [...TODAY_SECTION_KEYS];
  }
}

function writeTodayVisibleSections(keys: TodaySectionKey[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TODAY_VIEW_STORAGE_KEY, JSON.stringify(sanitizeTodayVisibleSections(keys)));
  } catch {
    // Local storage is only a view preference. The Today screen must keep working without it.
  }
}
`;

function patchHelpers(source) {
  if (source.includes('function readTodayVisibleSections()')) return source;
  return replaceOnce(
    source,
    '\nconst emptyData: DashboardData = {\n',
    `${helperBlock}\nconst emptyData: DashboardData = {\n`,
    'Today view helper block',
  );
}

function patchState(source) {
  if (source.includes('todayViewOpen')) return source;
  return replaceRegex(
    source,
    /const \[expandedSection, setExpandedSection\]\s*=\s*useState<[\s\S]*?>\('all'\);/,
    "const [expandedSection, setExpandedSection] = useState<'all' | TodaySectionKey>('all');\n  const [todayViewOpen, setTodayViewOpen] = useState(false);\n  const [visibleTodaySections, setVisibleTodaySections] = useState<TodaySectionKey[]>(() => readTodayVisibleSections());",
    'Today view state',
  );
}

function patchVisibilityLogic(source) {
  if (!source.includes('const visibleTodaySectionSet = useMemo(() => new Set(visibleTodaySections), [visibleTodaySections]);')) {
    source = replaceOnce(
      source,
      "  const pendingDrafts = useMemo(() => {\n    return data.drafts.filter((draft: any) => String(draft?.status || '').toLowerCase() === 'draft');\n  }, [data.drafts]);\n\n  const loading = status === 'loading' || status === 'idle';\n",
      "  const pendingDrafts = useMemo(() => {\n    return data.drafts.filter((draft: any) => String(draft?.status || '').toLowerCase() === 'draft');\n  }, [data.drafts]);\n\n  const visibleTodaySectionSet = useMemo(() => new Set(visibleTodaySections), [visibleTodaySections]);\n\n  const loading = status === 'loading' || status === 'idle';\n",
      'visible section set',
    );
  }

  if (!source.includes("visibleTodaySectionSet.has(key) && (expandedSection === 'all' || expandedSection === key)")) {
    source = replaceRegex(
      source,
      /const sectionVisible\s*=\s*\(key:\s*[\s\S]*?\)\s*=>\s*\r?\n\s*expandedSection\s*===\s*'all'\s*\|\|\s*expandedSection\s*===\s*key;/,
      "const sectionVisible = (key: TodaySectionKey) =>\n    visibleTodaySectionSet.has(key) && (expandedSection === 'all' || expandedSection === key);",
      'sectionVisible respects Today view',
    );
  }

  source = source.replace(
    /key:\s*'no_action' \| 'risk' \| 'waiting' \| 'leads' \| 'tasks' \| 'events' \| 'drafts' \| 'upcoming';/,
    'key: TodaySectionKey;',
  );
  return source;
}

const actionBlock = `
  const visibleTodayTiles = todayTiles.filter((tile) => visibleTodaySectionSet.has(tile.key));
  const hiddenTodaySectionsCount = todayTiles.length - visibleTodayTiles.length;

  const toggleTodaySectionVisibility = useCallback((key: TodaySectionKey) => {
    setVisibleTodaySections((current) => {
      const currentSet = new Set(current);
      if (currentSet.has(key)) {
        currentSet.delete(key);
      } else {
        currentSet.add(key);
      }
      const next = TODAY_SECTION_KEYS.filter((entry) => currentSet.has(entry));
      writeTodayVisibleSections(next);
      if (!next.includes(key) && expandedSection === key) setExpandedSection('all');
      return next;
    });
  }, [expandedSection]);

  const showAllTodaySections = useCallback(() => {
    const next = [...TODAY_SECTION_KEYS];
    writeTodayVisibleSections(next);
    setVisibleTodaySections(next);
  }, []);
`;

function patchTileActions(source) {
  if (source.includes('const visibleTodayTiles = todayTiles.filter')) return source;
  return replaceOnce(
    source,
    '  ];\n\n  const handleArchiveLead = useCallback(async (lead: any) => {\n',
    `  ];\n${actionBlock}\n  const handleArchiveLead = useCallback(async (lead: any) => {\n`,
    'visible tiles and toggle actions',
  );
}

const panelMarkup = `        <div className="col-span-full rounded-2xl border border-slate-100 bg-white p-3 shadow-sm" data-today-view-customizer="true">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Widok</p>
              <p className="text-xs font-medium text-slate-500">Wybierz, kt\u00F3re kafelki i listy w sekcji Dzi\u015B s\u0105 widoczne.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700">
                {visibleTodayTiles.length}/{todayTiles.length} widoczne
              </Badge>
              <Button type="button" size="sm" variant="outline" onClick={() => setTodayViewOpen((value) => !value)} data-today-view-toggle="true">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Widok
              </Button>
              {hiddenTodaySectionsCount > 0 ? (
                <Button type="button" size="sm" variant="ghost" onClick={showAllTodaySections} data-today-view-show-all="true">
                  Poka\u017C wszystko
                </Button>
              ) : null}
            </div>
          </div>
          {todayViewOpen ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" data-today-view-options="true">
              {todayTiles.map((tile) => {
                const checked = visibleTodaySectionSet.has(tile.key);
                return (
                  <label key={tile.key} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" data-today-view-option={tile.key}>
                    <span className="flex min-w-0 items-center gap-2">
                      <span className={'rounded-lg bg-white p-1.5 ' + tile.tone}>{tile.icon}</span>
                      <span className="truncate">{tile.title}</span>
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                      checked={checked}
                      onChange={() => toggleTodaySectionVisibility(tile.key)}
                    />
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
`;

function patchRender(source) {
  if (!source.includes('visibleTodayTiles.map')) {
    source = source.replace(/\{todayTiles\.map\(\(tile\) => \(/g, '{visibleTodayTiles.map((tile) => (');
    source = source.replace(/\{todayTiles\.map\(\(tile\) => \{/g, '{visibleTodayTiles.map((tile) => {');
  }

  if (!source.includes('data-today-view-customizer="true"')) {
    const variants = [
      '{visibleTodayTiles.map((tile) => (',
      '{visibleTodayTiles.map((tile) => {',
    ];
    let idx = -1;
    for (const candidate of variants) {
      idx = source.indexOf(candidate);
      if (idx >= 0) break;
    }
    if (idx < 0) fail('Could not find visibleTodayTiles render block');
    const lineStart = source.lastIndexOf('\n', idx) + 1;
    source = source.slice(0, lineStart) + panelMarkup + source.slice(lineStart);
  }

  return source;
}

function main() {
  let source = fs.readFileSync(todayPath, 'utf8');
  source = patchImports(source);
  source = patchMarkers(source);
  source = patchHelpers(source);
  source = patchState(source);
  source = patchVisibilityLogic(source);
  source = patchTileActions(source);
  source = patchRender(source);
  fs.writeFileSync(todayPath, source, 'utf8');
  patchPackageJson();
  console.log('OK: Stage16AN Today view customizer patched with CRLF-safe patternless repair.');
  console.log('- src/pages/TodayStable.tsx');
  console.log('- package.json');
}

main();
