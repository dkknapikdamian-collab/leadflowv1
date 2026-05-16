const test = require('node:test');
const assert = require('assert');

const { buildTodaySections, dedupeTodaySectionEntries } = require('../dist-test-today-sections.cjs');

test('buildTodaySections returns required decision-center sections', () => {
  const sections = buildTodaySections({
    reviewCount: 1,
    overdueCount: 2,
    moveTodayCount: 3,
    noActionCount: 4,
    waitingTooLongCount: 5,
    nextDaysCount: 6,
    highValueRiskCount: 7,
    completedTodayCount: 8,
  });
  const titles = sections.map((s) => s.title);
  assert.deepEqual(titles, [
    'Do sprawdzenia',
    'Zaleg\u0142e',
    'Do ruchu dzi\u015B',
    'Bez zaplanowanej akcji',
    'Waiting za d\u0142ugo',
    'Najbli\u017Csze dni',
    'Wysoka warto\u015B\u0107 / ryzyko',
    'Dzisiaj zako\u0144czone',
  ]);
});

test('dedupeTodaySectionEntries removes duplicates by id', () => {
  const rows = [
    { id: 'a', label: 'first' },
    { id: 'a', label: 'dupe' },
    { id: 'b', label: 'second' },
  ];
  const deduped = dedupeTodaySectionEntries(rows);
  assert.equal(deduped.length, 2);
  assert.equal(deduped[0].id, 'a');
  assert.equal(deduped[1].id, 'b');
});
