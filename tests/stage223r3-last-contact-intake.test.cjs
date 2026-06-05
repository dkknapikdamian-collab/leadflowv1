const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
const { buildSync } = require('esbuild');

const root = path.resolve(__dirname, '..');

function loadTs(entry) {
  const result = buildSync({
    entryPoints: [path.join(root, entry)],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    logLevel: 'silent',
  });

  const mod = new Module(entry, module);
  mod.filename = path.join(root, entry);
  mod.paths = Module._nodeModulePaths(path.dirname(mod.filename));
  mod._compile(result.outputFiles[0].text, mod.filename);
  return mod.exports;
}

test('Stage223R3 last contact date input converts date-only values to noon ISO', () => {
  const { dateInputToNoonIso, normalizeDateInputValue } = loadTs('src/lib/owner-control/last-contact-intake.ts');

  assert.equal(normalizeDateInputValue('2026-05-16'), '2026-05-16');
  assert.equal(normalizeDateInputValue('bad-date'), '');
  assert.equal(dateInputToNoonIso(''), null);

  const iso = dateInputToNoonIso('2026-05-16');
  assert.equal(typeof iso, 'string');
  assert.ok(iso.includes('2026-05-16') || iso.includes('2026-05-15') || iso.includes('2026-05-17'));
});

test('Stage223R3 last contact validation blocks future dates', () => {
  const {
    getTodayDateInputValue,
    getLastContactDateInputError,
    LAST_CONTACT_FUTURE_ERROR,
  } = loadTs('src/lib/owner-control/last-contact-intake.ts');

  const now = new Date('2026-06-05T10:00:00.000Z');

  assert.equal(getTodayDateInputValue(now), '2026-06-05');
  assert.equal(getLastContactDateInputError('2026-06-04', now), null);
  assert.equal(getLastContactDateInputError('2026-06-05', now), null);
  assert.equal(getLastContactDateInputError('2026-06-06', now), LAST_CONTACT_FUTURE_ERROR);
});

test('Stage223R3 last contact default date is safe for empty intake fallback', () => {
  const {
    getDefaultLastContactDateInput,
    getLastContactDateInputError,
    dateInputToNoonIso,
  } = loadTs('src/lib/owner-control/last-contact-intake.ts');

  const now = new Date('2026-06-05T21:15:00.000Z');
  const today = getDefaultLastContactDateInput(now);

  assert.equal(today, '2026-06-05');
  assert.equal(getLastContactDateInputError(today, now), null);
  assert.ok(dateInputToNoonIso(today));
});
