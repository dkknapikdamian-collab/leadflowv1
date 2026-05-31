const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

function mustNotInclude(rel, marker) {
  if (read(rel).includes(marker)) throw new Error(`${rel} must not contain marker: ${marker}`);
}

const rel = 'src/components/operator-rail/TopValueRecordsCard.tsx';
mustInclude(rel, "import { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';");
mustNotInclude(rel, "from '../components/operator-rail'");
mustNotInclude(rel, "import { OperatorSideCard, TopValueRecordsCard }");

const operatorRailDir = path.join(root, 'src', 'components', 'operator-rail');
const offenders = [];
for (const name of fs.readdirSync(operatorRailDir)) {
  if (!/\.(tsx|ts)$/.test(name)) continue;
  const file = path.join(operatorRailDir, name);
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes("from '../components/operator-rail'") || text.includes('from "../components/operator-rail"')) {
    offenders.push(path.relative(root, file));
  }
}

if (offenders.length) {
  throw new Error('Operator rail components must not import their own barrel via ../components/operator-rail:\n' + offenders.join('\n'));
}

[
  'scripts/apply-stage176-top-value-records-card-duplicate-import-hotfix.cjs',
  'scripts/check-stage176-top-value-records-card-duplicate-import-hotfix.cjs',
  'docs/ui/CLOSEFLOW_STAGE176_TOP_VALUE_RECORDS_CARD_DUPLICATE_IMPORT_HOTFIX.md',
  '_project/STAGE176_TOP_VALUE_RECORDS_CARD_DUPLICATE_IMPORT_HOTFIX_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage176 TopValueRecordsCard duplicate import hotfix.md',
].forEach((required) => {
  if (!fs.existsSync(path.join(root, required))) throw new Error(`Missing Stage176 file: ${required}`);
});

console.log('OK: Stage176 duplicate TopValueRecordsCard import hotfix guard passed.');
