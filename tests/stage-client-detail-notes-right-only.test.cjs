const fs = require('fs');
const path = require('path');
function read(p){ return fs.readFileSync(path.join(process.cwd(), p), 'utf8'); }
function fail(msg){ console.error('FAIL stage-client-detail-notes-right-only: ' + msg); process.exit(1); }
const src = read('src/pages/ClientDetail.tsx');
if (!/client-detail-note-card|data-client-notes-list|data-client-notes-right-panel/.test(src)) fail('brak prawego panelu/listy notatek klienta');
if (!/getClientVisibleNotes/.test(src)) fail('brak getClientVisibleNotes');
const noteSources = ['payload?.note','payload.note','payload?.content','payload.content','activity.note','activity?.note','activity.content','activity?.content'];
const matchedSources = noteSources.filter(s => src.includes(s)).length;
if (matchedSources < 2) fail('getClientVisibleNotes nie czyta wystarczajaco wielu zrodel notatki');
if (!/Edytuj|edit/i.test(src)) fail('brak sygnalu edycji notatek');
if (!/Usu\u0144|Usun|delete|remove/i.test(src)) fail('brak sygnalu usuwania notatek');
console.log('OK tests/stage-client-detail-notes-right-only.test.cjs');
