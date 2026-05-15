const fs = require('fs');
const path = require('path');
function exists(p){ return fs.existsSync(path.join(process.cwd(), p)); }
function read(p){ return fs.readFileSync(path.join(process.cwd(), p), 'utf8'); }
function fail(msg){ console.error('FAIL stage4h-context-action-tool-syntax-fixed: ' + msg); process.exit(1); }
const client = exists('src/pages/ClientDetail.tsx') ? read('src/pages/ClientDetail.tsx') : '';
const uses = /\bContextActionButton\b/.test(client);
if (uses) {
  if (!exists('src/components/ContextActionButton.tsx')) fail('ClientDetail uzywa ContextActionButton, ale brak komponentu');
  if (!exists('src/styles/context-action-button-source-truth.css')) fail('ClientDetail uzywa ContextActionButton, ale brak CSS source truth');
  const component = read('src/components/ContextActionButton.tsx');
  if (!/export function ContextActionButton/.test(component)) fail('komponent nie eksportuje ContextActionButton');
}
if (exists('tools/repair-stage4g-context-action-residue-stabilize.cjs')) fail('pozostal zepsuty tool Stage 4G');
if (exists('tests/stage4e-no-partial-context-action-artifacts.test.cjs')) fail('pozostal stary guard Stage 4E sprzeczny ze stabilizacja');
if (exists('tests/stage4f-no-clientdetail-context-action-residue.test.cjs')) fail('pozostal stary guard Stage 4F sprzeczny ze stabilizacja');
console.log('OK tests/stage4h-context-action-tool-syntax-fixed.test.cjs');
