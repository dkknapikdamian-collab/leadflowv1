const fs = require('fs');
const path = require('path');
const marker = 'STAGE53_CLIENT_OPERATIONAL_RECENT_MOVES';
const forbidden = 'Klient jako centrum relacji';
function read(file){ return fs.readFileSync(path.join(process.cwd(), file), 'utf8'); }
function pass(label){ console.log('PASS ' + label); }
function fail(label){ console.error('FAIL ' + label); process.exit(1); }
function contains(file, needle, label){ const value = read(file); if(!value.includes(needle)) fail(file + ': missing ' + label); pass(file + ': contains ' + label); }
function notContains(file, needle, label){ const value = read(file); if(value.includes(needle)) fail(file + ': forbidden ' + label); pass(file + ': does not contain ' + label); }
contains('src/pages/ClientDetail.tsx', marker, 'Stage53 marker');
notContains('src/pages/ClientDetail.tsx', forbidden, 'marketing relation copy');
contains('src/pages/ClientDetail.tsx', 'recentClientMovements', 'recent moves memo');
contains('src/pages/ClientDetail.tsx', 'data-client-recent-moves-panel="true"', 'recent moves panel hook');
contains('src/pages/ClientDetail.tsx', 'Ostatnie ruchy', 'recent moves title');
contains('src/pages/ClientDetail.tsx', 'Zobacz całą aktywność', 'activity link copy');
contains('src/pages/ClientDetail.tsx', 'to="/activity"', 'activity route link');
contains('src/styles/visual-stage12-client-detail-vnext.css', marker, 'Stage53 CSS marker');
contains('src/styles/visual-stage12-client-detail-vnext.css', '.client-detail-recent-move-row', 'recent move row CSS');
contains('package.json', 'check:stage53-client-operational-recent-moves', 'package check script');
contains('tests/stage53-client-operational-recent-moves.test.cjs', marker, 'Stage53 test marker');
console.log('PASS ' + marker);
