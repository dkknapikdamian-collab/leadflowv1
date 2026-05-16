#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
function read(p){ return fs.readFileSync(path.join(root,p), 'utf8'); }
function fail(m){ console.error('\u2716 ' + m); process.exit(1); }
function assert(c,m){ if(!c) fail(m); }
const entity = read('src/components/entity-actions.tsx');
const css = read('src/styles/closeflow-action-tokens.css');
const cases = read('src/pages/Cases.tsx');
const detail = read('src/pages/CaseDetail.tsx');
const pkg = JSON.parse(read('package.json').replace(/^\uFEFF/, ''));
const quiet = read('scripts/closeflow-release-check-quiet.cjs');

assert(entity.includes('CLOSEFLOW_TRASH_ACTION_SOURCE_OF_TRUTH'), 'Brak source of truth dla kosza w entity-actions');
assert(entity.includes('EntityTrashButton'), 'Brak EntityTrashButton');
assert(entity.includes('trashActionButtonClass'), 'Brak trashActionButtonClass');
assert(entity.includes('trashActionIconClass'), 'Brak trashActionIconClass');
assert(css.includes('--cf-trash-icon-color'), 'Brak tokena koloru kosza');
assert(css.includes('.cf-trash-action-button'), 'Brak klasy przycisku kosza');
assert(css.includes('.cf-trash-action-icon'), 'Brak klasy ikony kosza');

assert(cases.includes('EntityTrashButton'), 'Lista spraw nie u\u017Cywa EntityTrashButton');
assert(cases.includes('data-case-row-delete-action="true"'), 'Brak ikony kosza przy sprawie na li\u015Bcie');
assert(cases.includes('setCaseToDelete(record)'), 'Kosz na li\u015Bcie nie otwiera potwierdzenia dla konkretnej sprawy');
assert(cases.includes('ConfirmDialog'), 'Lista spraw nie ma ConfirmDialog');
assert(cases.includes('data-case-list-delete-confirm="true"') || cases.includes('open={Boolean(caseToDelete)}'), 'ConfirmDialog listy spraw nie jest podpi\u0119ty do caseToDelete');
assert(cases.includes('deleteCaseWithRelations'), 'Lista spraw nie usuwa przez deleteCaseWithRelations');

assert(detail.includes('EntityTrashButton'), 'Szczeg\u00F3\u0142 sprawy nie u\u017Cywa EntityTrashButton');
assert(detail.includes('data-case-detail-delete-action="true"'), 'Brak kosza w widoku sprawy');
assert(detail.includes('data-case-detail-delete-confirm="true"'), 'Brak potwierdzenia usuwania w widoku sprawy');
assert(detail.includes('deleteCaseWithRelations'), 'Szczeg\u00F3\u0142 sprawy nie usuwa przez deleteCaseWithRelations');
assert(detail.includes("navigate('/cases')") || detail.includes('navigate("/cases")'), 'Po usuni\u0119ciu sprawy trzeba wr\u00F3ci\u0107 do listy spraw');
assert(!/wymaga potwierdzenia widoku sprawy/i.test(detail), 'Stary komunikat potwierdzenia widoku sprawy nie mo\u017Ce zosta\u0107');
assert(!/Usuwanie spraw wymaga potwierdzenia/i.test(detail), 'Stary toast usuwania spraw nie mo\u017Ce zosta\u0107');

assert(pkg.scripts && pkg.scripts['check:case-trash-actions'] === 'node scripts/check-closeflow-case-trash-actions.cjs', 'Brak package script check:case-trash-actions');
assert(pkg.scripts['verify:closeflow:quiet'] === 'node scripts/closeflow-release-check-quiet.cjs', 'verify:closeflow:quiet nie mo\u017Ce \u0142ama\u0107 kontraktu');
assert(quiet.includes('case trash actions'), 'Quiet gate nie uruchamia case trash actions');
console.log('\u2714 Case delete trash actions use shared source of truth and confirm dialog');
