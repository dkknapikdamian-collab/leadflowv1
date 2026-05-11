const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  "api/cases.ts",
  "api/clients.ts",
  "src/lib/data-contract.ts",
  "src/lib/supabase-fallback.ts",
  "src/lib/client-cases.ts",
  "docs/clients/CLOSEFLOW_CLIENT_PRIMARY_CASE_2026-05-10.md",
  "docs/quality/CLOSEFLOW_STAGE_POLISH_COPY_GUARD_2026-05-11.md",
  "scripts/check-closeflow-client-primary-case.cjs",
  "scripts/check-closeflow-stage-polish-guard.cjs",
  "supabase/migrations/20260510_add_primary_case_to_clients.sql"
];
const badMarkers = ['Ĺ', 'Ä', 'Ă', 'Â', 'â', '�'];
const bad = [];
for (const rel of files) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, 'utf8');
  for (const marker of badMarkers) {
    if (content.includes(marker)) bad.push(rel + ' zawiera marker mojibake: ' + marker);
  }
}
if (bad.length) {
  console.error('CLOSEFLOW_STAGE_POLISH_GUARD_FAILED');
  console.error(bad.join('
'));
  process.exit(1);
}
console.log('CLOSEFLOW_STAGE_POLISH_GUARD_OK');
console.log('files_checked=' + files.length);
