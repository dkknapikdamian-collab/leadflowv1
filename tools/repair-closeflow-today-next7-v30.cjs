const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const todayPath = path.join(root, 'src/pages/TodayStable.tsx');
const packagePath = path.join(root, 'package.json');

function fail(message) {
  console.error('V30_REPAIR_FAIL:', message);
  process.exit(1);
}

let source = fs.readFileSync(todayPath, 'utf8');
const before = source;

const helper = String.raw`
function formatUpcomingDayName(date: Date, index: number) {
  if (index === 0) return 'Dzisiaj';
  const label = date.toLocaleDateString('pl-PL', { weekday: 'long' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatUpcomingDayDate(date: Date) {
  return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
}

function formatUpcomingCountLabel(count: number) {
  if (count === 1) return '1 rzecz';
  return count + ' rzeczy';
}

function buildUpcomingDayCards(rows: UpcomingRow[]) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateKey = localDateKey(date);
    const dayRows = rows.filter((row) => getDateKey(row.momentRaw) === dateKey);

    return {
      dateKey,
      title: formatUpcomingDayName(date, index),
      dateLabel: formatUpcomingDayDate(date),
      count: dayRows.length,
      countLabel: formatUpcomingCountLabel(dayRows.length),
      rows: dayRows,
    };
  });
}
`;

if (!source.includes('function buildUpcomingDayCards(rows: UpcomingRow[])')) {
  const anchor = 'function getTaskTitle(task: any) {';
  if (!source.includes(anchor)) fail('Cannot find helper insertion anchor: getTaskTitle');
  source = source.replace(anchor, helper + '\n' + anchor);
}

if (!source.includes('const upcomingDayCards = useMemo(() => buildUpcomingDayCards(upcomingRows), [upcomingRows]);')) {
  const anchor = '  const pendingDrafts = useMemo(() => {';
  if (!source.includes(anchor)) fail('Cannot find upcomingDayCards insertion anchor: pendingDrafts');
  source = source.replace(anchor, '  const upcomingDayCards = useMemo(() => buildUpcomingDayCards(upcomingRows), [upcomingRows]);\n\n' + anchor);
}

const renderStart = source.indexOf('        <div hidden={!sectionVisible(\'upcoming\')}>');
if (renderStart < 0) fail('Cannot find upcoming render start');
const loadingStart = source.indexOf('        {loading ? (', renderStart);
if (loadingStart < 0) fail('Cannot find upcoming render end marker before loading');

const next7Render = String.raw`        <div hidden={!sectionVisible('upcoming')}>
          <StableCard>
            <SectionHeader title={todaySectionLabels.upcoming} count={upcomingRows.length} icon={<CalendarDays className="h-5 w-5" />} tone="bg-indigo-50 text-indigo-700" collapsed={isCollapsed('upcoming')} onToggle={() => toggleSectionCollapse('upcoming')} />
            <div hidden={isCollapsed('upcoming')}>
              {upcomingDayCards.length ? (
                <div data-today-next7-v30="true" className="grid gap-3 p-4">
                  {upcomingDayCards.map((day) => (
                    <div key={day.dateKey} data-today-next7-day-card="true" className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900">{day.title}</p>
                          <p className="text-xs font-semibold text-slate-500">{day.dateLabel}</p>
                        </div>
                        <span data-today-next7-count-badge="true" className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {day.countLabel}
                        </span>
                      </div>

                      {day.rows.length ? (
                        <div className="mt-3 space-y-2" data-today-next7-day-items="true">
                          {day.rows.map((row) => (
                            <Link key={row.id} to={row.to} className="block rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm transition hover:border-blue-200 hover:bg-blue-50">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900">{row.title}</p>
                                  <p className="mt-1 text-xs font-medium text-slate-500">{row.meta}</p>
                                </div>
                                <span className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600">
                                  {row.badge}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : <EmptyState text="Brak zaplanowanych akcji w kolejnych 7 dniach." />}
            </div>
          </StableCard>
        </div>

`;

source = source.slice(0, renderStart) + next7Render + source.slice(loadingStart);

// Remove accidental duplicate blank old upcoming map if any previous failed patch left it around.
source = source.replace(/\n\s*\{upcomingRows\.length \? upcomingRows\.map\(\(row\) => \([\s\S]*?<EmptyState text="Brak zaplanowanych akcji w kolejnych 7 dniach\." \/>\}\s*\n/g, '\n');

if (source === before) fail('TodayStable was not changed');
fs.writeFileSync(todayPath, source, 'utf8');

const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:todaystable-next7-v30'] = 'node tools/check-todaystable-next7-v30.cjs';
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('OK repaired TodayStable next7 v30');
