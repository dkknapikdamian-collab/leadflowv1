const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

assert.ok(source.includes('function buildUpcomingDayCards(rows: UpcomingRow[])'), 'missing next7 day card builder');
assert.ok(source.includes('const upcomingDayCards = useMemo(() => buildUpcomingDayCards(upcomingRows), [upcomingRows]);'), 'missing upcomingDayCards memo');
assert.ok(source.includes('data-today-next7-v30="true"'), 'missing v30 next7 DOM marker');
assert.ok(source.includes('data-today-next7-day-card="true"'), 'missing day card marker');
assert.ok(source.includes('data-today-next7-count-badge="true"'), 'missing light count badge marker');
assert.ok(source.includes('border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700'), 'count badge must be light/readable');
assert.ok(!source.includes('upcomingRows.length ? upcomingRows.map((row) => ('), 'old duplicate upcoming row renderer is still present');
assert.ok(!source.includes('data-today-next7-count-badge="true" className="inline-flex shrink-0 items-center rounded-full bg-slate-950'), 'next7 count badge must not be black');
assert.equal(pkg.scripts['check:todaystable-next7-v30'], 'node tools/check-todaystable-next7-v30.cjs', 'missing package check script');
console.log('OK todaystable next7 v30 cards are readable and deduped');
