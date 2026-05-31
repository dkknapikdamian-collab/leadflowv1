const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage176-top-value-records-card-duplicate-import-hotfix.cjs <repo>');

const rel = 'src/components/operator-rail/TopValueRecordsCard.tsx';
const file = path.join(repo, rel);

if (!fs.existsSync(file)) {
  throw new Error(`Missing file: ${rel}`);
}

let source = fs.readFileSync(file, 'utf8');
const original = source;

source = source
  .split(/\r?\n/)
  .filter((line) => !/from ['"]\.\.\/components\/operator-rail['"];?$/.test(line.trim()))
  .join('\n');

if (!source.includes("import { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';")) {
  source = source.replace(
    "import { Link } from 'react-router-dom';\n",
    "import { Link } from 'react-router-dom';\nimport { OperatorSideCard, type OperatorRailDataAttrs } from './OperatorSideCard';\n"
  );
}

if (source === original) {
  console.log('SKIPPED TopValueRecordsCard.tsx: duplicate barrel import was already removed');
} else {
  fs.writeFileSync(file, source, 'utf8');
  console.log('UPDATED TopValueRecordsCard.tsx: removed duplicate/self barrel import');
}
