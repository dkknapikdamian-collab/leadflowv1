const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const repoArgIndex = args.indexOf('--repo');
const repo = repoArgIndex >= 0 && args[repoArgIndex + 1] ? args[repoArgIndex + 1] : process.cwd();
const casePath = path.join(repo, 'src', 'pages', 'CaseDetail.tsx');
const backupPath = path.join(repo, '_project', 'backups', 'STAGE217R4_CaseDetail_before_utf8_note_summary_repair_2026-06-02.tsx');
const SUMMARY = 'Notatka zapisana przy sprawie. Pełna treść jest w panelu Notatki.';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function writeUtf8(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.replace(/\r\n/g, '\n'), 'utf8');
}

assert(fs.existsSync(casePath), `Brak CaseDetail.tsx: ${casePath}`);
let text = fs.readFileSync(casePath, 'utf8').replace(/\r\n/g, '\n');

assert(text.includes('STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX'), 'Nie widzę markerów Stage217 R2 w CaseDetail.tsx. Nie nakładam R4 na niepełny etap.');
assert(text.includes('data-stage217-case-notes-panel="true"'), 'Nie widzę panelu Notatki sprawy z R2. Najpierw musi wejść R2.');

if (!fs.existsSync(backupPath)) {
  writeUtf8(backupPath, text);
}

const constLine = `const STAGE217_CASE_NOTE_HISTORY_SUMMARY = ${JSON.stringify(SUMMARY)};`;
if (/const\s+STAGE217_CASE_NOTE_HISTORY_SUMMARY\s*=\s*(['"`])[\s\S]*?\1\s*;/.test(text)) {
  text = text.replace(/const\s+STAGE217_CASE_NOTE_HISTORY_SUMMARY\s*=\s*(['"`])[\s\S]*?\1\s*;/, constLine);
} else {
  const markerRe = /(const\s+STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX\s*=\s*['"][\s\S]*?['"];\s*\nvoid\s+STAGE217_CASE_DETAIL_OPERATION_WORKSPACE_UX;)/;
  assert(markerRe.test(text), 'Nie znaleziono markera Stage217 do dopięcia stałej summary.');
  text = text.replace(markerRe, `$1\n${constLine}\nvoid STAGE217_CASE_NOTE_HISTORY_SUMMARY;`);
}
if (!text.includes('void STAGE217_CASE_NOTE_HISTORY_SUMMARY;')) {
  text = text.replace(constLine, `${constLine}\nvoid STAGE217_CASE_NOTE_HISTORY_SUMMARY;`);
}

let changedHistorySemantics = false;
const noteBranchRe = /if\s*\(\s*lowerType\.includes\('note'\)\s*\|\|\s*lowerType\s*===\s*'operator_note'\s*\)\s*\{[\s\S]*?return\s+body\s*\?\s*\{[\s\S]*?\}\s*:\s*null;\s*\}/m;
if (noteBranchRe.test(text)) {
  text = text.replace(noteBranchRe, `if (lowerType.includes('note') || lowerType === 'operator_note') {
    return body ? {
      id: 'activity-' + id,
      kind: 'note',
      title: 'Notatka',
      body: STAGE217_CASE_NOTE_HISTORY_SUMMARY,
      occurredAt,
    } : null;
  }`);
  changedHistorySemantics = true;
}

const rowVariants = [
  {
    from: '<p title={item.body}>{item.body}</p>',
    to: '<p title={item.kind === \'note\' ? item.body : undefined}>{item.kind === \'note\' ? STAGE217_CASE_NOTE_HISTORY_SUMMARY : item.body}</p>',
  },
  {
    from: '<p>{item.body}</p>',
    to: '<p>{item.kind === \'note\' ? STAGE217_CASE_NOTE_HISTORY_SUMMARY : item.body}</p>',
  },
];
for (const variant of rowVariants) {
  if (text.includes(variant.from)) {
    text = text.split(variant.from).join(variant.to);
    changedHistorySemantics = true;
  }
}

// If the earlier PowerShell patch inserted mojibake text, normalize any source strings that mention the panel marker but not the clean UTF-8 phrase.
text = text.replace(/Notatka zapisana przy sprawie\.[^'"`\n]*panelu Notatki\./g, SUMMARY);

assert(text.includes(SUMMARY), 'Po patchu dalej nie ma poprawnego UTF-8 summary notatki w CaseDetail.tsx.');
assert(text.includes('STAGE217_CASE_NOTE_HISTORY_SUMMARY'), 'Brak stałej STAGE217_CASE_NOTE_HISTORY_SUMMARY po patchu.');
assert(changedHistorySemantics || text.includes('body: STAGE217_CASE_NOTE_HISTORY_SUMMARY'), 'Nie udało się potwierdzić, że historia notatek używa summary.');

writeUtf8(casePath, text);
console.log('OK Stage217 R4 UTF-8 note history summary repaired');
