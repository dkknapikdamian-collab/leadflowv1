const fs = require('node:fs');
const path = require('node:path');

const STAGE = 'STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX';
const NOW = '2026-06-06 15:05 Europe/Warsaw';

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.replace(/\s+$/u, '') + '\n');
}
function appendSection(file, heading, lines) {
  const current = read(file);
  if (current.includes(heading)) return;
  const section = ['','',heading,'',...lines].join('\n');
  write(file, current.replace(/\s+$/u, '') + section);
}
function mustExist(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

mustExist('src/lib/calendar-timezone-contract.ts');
mustExist('src/server/google-calendar-sync.ts');
mustExist('src/server/google-calendar-inbound.ts');
mustExist('tests/stage226r11-gcal-timezone-reminder-truth.test.cjs');

const testFile = read('tests/stage226r11-gcal-timezone-reminder-truth.test.cjs');
if (!testFile.includes('function plain(value)')) {
  throw new Error('R11B test fix was not copied: missing plain(value) cross-realm normalizer');
}
if (!testFile.includes('assert.deepStrictEqual(plain(')) {
  throw new Error('R11B test fix was not copied: missing deepStrictEqual(plain(...)) assertions');
}

appendSection('_project/04_DECISIONS.md', `## ${STAGE} — decyzja`, [
  `- data i godzina: ${NOW}`,
  '- decyzja: R11 code path is kept; only the Node test assertion was fixed because vm.runInNewContext returns objects from a different realm/prototype.',
  '- status: fix testu wdrożeniowego po czerwonym teście o identycznej strukturze obiektu.',
]);
appendSection('_project/06_GUARDS_AND_TESTS.md', `## ${STAGE} — guardy/testy`, [
  `- data i godzina: ${NOW}`,
  '- test: npm run test:stage226r11-gcal-timezone-reminder-truth',
  '- powód: assert z node:assert/strict porównywał obiekt z VM realm do zwykłego obiektu i raportował false negative mimo identycznej struktury.',
]);
appendSection('_project/07_NEXT_STEPS.md', `## ${STAGE} — next step`, [
  `- data i godzina: ${NOW}`,
  '- po PASS R11B wykonać push R11/R11B, potem ręczny smoke Google Calendar: godzina + przypomnienie.',
  '- nie przechodzić do Stage227 bez smoke Google Calendar.',
]);
appendSection('_project/08_CHANGELOG_AI.md', `## ${STAGE} — changelog`, [
  `- data i godzina: ${NOW}`,
  '- poprawiono test R11: wynik z VM jest serializowany do plain object przed deepStrictEqual.',
  '- logika aplikacji R11 nie została zmieniona w R11B.',
]);
appendSection('_project/12_IMPLEMENTATION_LEDGER.md', `## ${STAGE} — ledger`, [
  `- data i godzina: ${NOW}`,
  '- typ: test-fix po apply R11.',
  '- zakres: tests/stage226r11-gcal-timezone-reminder-truth.test.cjs + project memory/report/run/obsidian update.',
]);
appendSection('_project/13_TEST_HISTORY.md', `## ${STAGE} — historia testów`, [
  `- data i godzina: ${NOW}`,
  '- poprzedni FAIL: Google outbound returns wall-clock dateTime plus timeZone, not shifted Z time — false negative przez cross-realm object prototype.',
  '- oczekiwane po R11B: R11 guard/test PASS, regresje R10D2/R10C2/R10B/R10 PASS, build PASS, verify PASS, diff check clean.',
]);

const report = `# ${STAGE} — report

- data i godzina: ${NOW}
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ: test-fix po Stage226R11 apply

## Diagnoza

R11 apply poprawnie przepisał kod i guard R11 przeszedł, ale test padł na assert.deepEqual/deepStrictEqual mimo identycznej struktury obiektu:

- actual: { dateTime: '2026-06-15T12:00:00', timeZone: 'Europe/Warsaw' }
- expected: { dateTime: '2026-06-15T12:00:00', timeZone: 'Europe/Warsaw' }

Powód: kontrakt TS był ładowany przez vm.runInNewContext, więc zwracany object miał inny realm/prototype niż literal expected w teście.

## Zmiana

Test normalizuje wynik przez JSON.parse(JSON.stringify(value)) przed deepStrictEqual.

## Ryzyko

Niskie. Nie zmienia logiki aplikacji. Ryzyko pozostaje po stronie ręcznego smoke Google Calendar po deployu.
`;
write(`_project/reports/${STAGE}_REPORT.md`, report);

const run = `# ${STAGE} — run

- data i godzina: ${NOW}
- status: local ZIP apply, bez commita i bez pushu
- wymagane testy: R11 guard/test, R10D2/R10C2/R10B/R10, build, verify, diff check
`;
write(`_project/runs/${STAGE}_RUN.md`, run);

const obs = `# ${STAGE} — aktualizacja Obsidiana

- data i godzina: ${NOW}
- nazwa / alias wejściowy: Stage226R11B — Google Calendar timezone test cross-realm fix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
- report_id: ${STAGE}_REPORT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: test-fix po R11 apply
- docelowa ścieżka: centralne testy/ryzyka/historia/kierunek projektu
- status zapisu: przygotowane w ZIP i _project/obsidian_updates
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- testy: R11 guard/test, regresje R10, build, verify, diff check
- audyt ryzyk po etapie: false negative testu; logika R11 nadal wymaga ręcznego smoke Google Calendar po deployu
- czego nie ruszano: Stage227, finanse, RLS, schema, AI Drafts
- następny krok: push po PASS, potem ręczny smoke Google Calendar
`;
write(`_project/obsidian_updates/${STAGE}_OBSIDIAN_UPDATE.md`, obs);

console.log(JSON.stringify({ ok: true, stage: STAGE, changed: ['tests/stage226r11-gcal-timezone-reminder-truth.test.cjs', '_project/*'] }, null, 2));
