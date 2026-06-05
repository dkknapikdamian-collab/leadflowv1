const fs = require('fs');

const layoutPath = 'src/components/Layout.tsx';
if (!fs.existsSync(layoutPath)) {
  throw new Error(`Missing ${layoutPath}`);
}

let text = fs.readFileSync(layoutPath, 'utf8');

const markers = [
  '\n/* STAGE16M_LAYOUT_AI_DRAFTS_COMPAT',
  '\r\n/* STAGE16M_LAYOUT_AI_DRAFTS_COMPAT',
  '/* STAGE16M_LAYOUT_AI_DRAFTS_COMPAT'
];

let cutAt = -1;
for (const marker of markers) {
  const idx = text.lastIndexOf(marker);
  if (idx !== -1) {
    cutAt = idx;
    break;
  }
}

if (cutAt !== -1) {
  text = text.slice(0, cutAt).trimEnd() + '\n';
}

const forbiddenTailImports = [
  "import '../styles/closeflow-canvas-layer-source-truth-stage211h.css';",
  "import '../styles/closeflow-canvas-runtime-source-truth-stage211j.css';",
  "import '../styles/closeflow-canvas-final-source-truth-stage211k.css';",
  "import VisualFoundationRuntimeStage212B from './VisualFoundationRuntimeStage212B';",
  "import VisualFoundationRuntime from './VisualFoundationRuntime';"
];

for (const bad of forbiddenTailImports) {
  text = text.split(bad).join('');
}

fs.writeFileSync(layoutPath, text, 'utf8');

const repaired = fs.readFileSync(layoutPath, 'utf8');

const openComments = (repaired.match(/\/\*/g) || []).length;
const closeComments = (repaired.match(/\*\//g) || []).length;

console.log('STAGE212L_LAYOUT_TAIL_COMMENT_REPAIR');
console.log(`commentOpen=${openComments}`);
console.log(`commentClose=${closeComments}`);

if (openComments !== closeComments) {
  console.log('COMMENT_BALANCE_FAIL');
  process.exit(2);
}

if (repaired.includes('STAGE16M_LAYOUT_AI_DRAFTS_COMPAT')) {
  console.log('TAIL_MARKER_REMAINS');
  process.exit(3);
}

console.log('STAGE212L_LAYOUT_TAIL_COMMENT_REPAIR_PASS');
