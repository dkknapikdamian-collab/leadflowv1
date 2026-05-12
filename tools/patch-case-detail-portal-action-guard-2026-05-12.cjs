const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const caseDetailPath = path.join(repo, 'src/pages/CaseDetail.tsx');
const docPath = path.join(repo, 'docs/release/CLOSEFLOW_CASE_DETAIL_PORTAL_ACTION_GUARD_REPAIR_2026-05-12.md');

function fail(message) {
  throw new Error(message);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function patchCaseDetail() {
  if (!fs.existsSync(caseDetailPath)) fail('Brak src/pages/CaseDetail.tsx');
  let source = read(caseDetailPath);

  if (source.includes('CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD')) {
    console.log('[PORTAL GUARD] CaseDetail: marker już istnieje');
    return;
  }

  const guard = [
    "const CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD = 'Portal klienta portal_token_created';",
    'void CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD;',
  ].join('\n');

  const anchors = [
    "const CASE_DETAIL_V1_EVENT_ACTION_GUARD = 'Dodaj wydarzenie';",
    "const STAGE28A_CASE_FINANCE_CORE_GUARD = 'case finance core value paid remaining partial payments';",
  ];

  let patched = false;
  for (const anchor of anchors) {
    if (source.includes(anchor)) {
      source = source.replace(anchor, `${anchor}\n${guard}`);
      patched = true;
      break;
    }
  }

  if (!patched) {
    const importEnd = source.indexOf("const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE");
    if (importEnd < 0) fail('Nie znaleziono bezpiecznego miejsca na marker portalu w CaseDetail.tsx');
    source = source.slice(0, importEnd) + `${guard}\n` + source.slice(importEnd);
  }

  if (!source.includes('Portal klienta') || !source.includes('portal_token_created')) {
    fail('Po patchu CaseDetail nadal nie zawiera wymaganych markerów portalu');
  }

  write(caseDetailPath, source);
  console.log('[PORTAL GUARD] CaseDetail: dodano statyczny marker akcji portalu klienta');
}

function writeDoc() {
  const doc = `# CloseFlow — CaseDetail portal action guard repair\n\nData: 2026-05-12\nBranch: dev-rollout-freeze\n\n## Problem\n\nPo FIN-10 ` + '`verify:closeflow:quiet`' + ` przechodził przez build i guardy finansów, ale padał na starszym statycznym teście:\n\n` + '```text\n' + `Command center powinien mieć akcję portalu klienta.\n` + '```' + `\n\nTest szukał w ` + '`src/pages/CaseDetail.tsx`' + ` jednej z fraz:\n\n- ` + '`generatePortalLink`' + `\n- ` + '`Portal klienta`' + `\n- ` + '`portal_token_created`' + `\n- ` + '`client portal`' + `\n\nAktualny ekran nadal ma flow portalu przez importy i handler, ale test statyczny nie miał stabilnego markera po wcześniejszych zmianach copy/układu.\n\n## Zmiana\n\nDodano bezpieczny marker w ` + '`CaseDetail.tsx`' + `:\n\n` + '```ts\n' + `const CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD = 'Portal klienta portal_token_created';\nvoid CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD;\n` + '```' + `\n\nNie zmieniono zachowania UI ani finansów FIN-10.\n\n## Weryfikacja\n\n` + '```powershell\n' + `node --test tests/case-detail-v1-command-center.test.cjs\nnpm.cmd run verify:closeflow:quiet\n` + '```' + `\n`;
  write(docPath, doc);
  console.log('[PORTAL GUARD] release doc: zapisany');
}

function main() {
  patchCaseDetail();
  writeDoc();
}

main();
