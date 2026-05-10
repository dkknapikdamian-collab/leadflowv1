const fs = require('fs');
const rel = 'src/components/finance/FinanceSnapshot.tsx';
const text = fs.readFileSync(rel, 'utf8');
let fail = 0;
function check(ok, msg) {
  if (ok) console.log(`PASS ${msg}`);
  else { console.log(`FAIL ${msg}`); fail++; }
}
const imports = text.match(/import\s*\{[^}]*\bSurfaceCard\b[^}]*\}\s*from\s*['"]\.\.\/ui-system['"]/g) || [];
check(imports.length === 1, `${rel}: exactly one SurfaceCard import from ui-system`);
check(!/SurfaceCard\s*,\s*SurfaceCard/.test(text), `${rel}: no duplicate SurfaceCard specifier`);
check(text.includes('SurfaceCard'), `${rel}: SurfaceCard referenced`);
check(!/from ['"]\.\.\/ui-system\/SurfaceCard['"]/.test(text), `${rel}: no direct SurfaceCard subpath import`);
if (fail) {
  console.log(`FAIL CLOSEFLOW_FIN8_SURFACECARD_DEDUP_REPAIR3_FAILED failed=${fail}`);
  process.exit(1);
}
console.log('CLOSEFLOW_FIN8_SURFACECARD_DEDUP_REPAIR3_OK');
