const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
function fail(msg){ console.error('FAIL clientdetail-p1-functional-contract: ' + msg); process.exit(1); }
function read(p){ return fs.readFileSync(path.join(process.cwd(), p), 'utf8'); }
const tabCheck = spawnSync(process.execPath, ['tests/clientdetail-tabs-order.test.cjs'], { cwd: process.cwd(), encoding: 'utf8' });
if (tabCheck.status !== 0) fail('kolejnosc zakladek nie przeszla testu bazowego: ' + (tabCheck.stderr || tabCheck.stdout));
const src = read('src/pages/ClientDetail.tsx');
if (!/client-detail-note-card|data-client-notes-list|data-client-notes-right-panel/.test(src)) fail('brak prawego panelu notatek');
if (!/getClientVisibleNotes/.test(src)) fail('brak normalizacji widocznych notatek');
if (!/Edytuj|edit/i.test(src)) fail('brak akcji edycji notatek');
if (!/Usu\u0144|Usun|delete|remove/i.test(src)) fail('brak akcji usuwania notatek');
console.log('OK tests/clientdetail-p1-functional-contract.test.cjs');
