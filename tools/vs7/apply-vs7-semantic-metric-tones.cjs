#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const marker = 'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH';
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const write = (rel, text) => fs.writeFileSync(path.join(root, rel), text, 'utf8');
const fail = (msg) => { throw new Error(msg); };
const ensureIncludes = (text, needle, rel) => {
  if (!text.includes(needle)) fail(`Missing anchor in ${rel}: ${needle}`);
};

function patchOperatorMetricTiles() {
  const rel = 'src/components/ui-system/OperatorMetricTiles.tsx';
  let text = read(rel);

  if (!text.includes("./operator-metric-tone-contract")) {
    text = text.replace(
      "import { Link } from 'react-router-dom';\n",
      "import { Link } from 'react-router-dom';\nimport { resolveOperatorMetricTone, type OperatorMetricTone } from './operator-metric-tone-contract';\n",
    );
  }

  text = text.replace(
    "export type OperatorMetricTone = 'neutral' | 'blue' | 'amber' | 'red' | 'green' | 'purple';\n",
    '',
  );

  const normalizeBlock = /function normalizeTone\(tone\?: OperatorMetricTone \| string\): OperatorMetricTone \{[\s\S]*?\n\}\n/;
  if (normalizeBlock.test(text)) {
    text = text.replace(normalizeBlock, '');
  }

  if (text.includes('const tone = normalizeTone(item.tone);')) {
    text = text.replace(
      '  const tone = normalizeTone(item.tone);\n  const metricId = String(item.id || item.label);',
      '  const metricId = String(item.id || item.label);\n  const tone = resolveOperatorMetricTone({ id: metricId, label: item.label, tone: item.tone });\n  const semanticKey = String(metricId || item.label).toLowerCase();',
    );
  } else if (!text.includes('resolveOperatorMetricTone({ id: metricId')) {
    fail('OperatorMetricTiles tone anchor not found');
  }

  if (!text.includes('data-cf-semantic-tone={tone}')) {
    text = text.replace(
      '      data-cf-operator-metric-id={metricId}\n    >',
      '      data-cf-operator-metric-id={metricId}\n      data-cf-semantic-tone={tone}\n      data-cf-semantic-key={semanticKey}\n    >',
    );
  }

  if (!text.includes('data-cf-operator-metric-icon-tone={tone}')) {
    text = text.replace(
      '<span className="cf-operator-metric-icon" aria-hidden="true">',
      '<span className="cf-operator-metric-icon" aria-hidden="true" data-cf-operator-metric-icon-tone={tone}>',
    );
  }

  if (!text.includes("'data-cf-semantic-tone': tone")) {
    text = text.replace(
      "    'data-cf-operator-metric-active': active ? 'true' : 'false',\n  } as const;",
      "    'data-cf-operator-metric-active': active ? 'true' : 'false',\n    'data-cf-semantic-tone': tone,\n    'data-cf-semantic-key': semanticKey,\n  } as const;",
    );
  }

  if (!text.includes('CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH')) {
    text = text.replace(
      "const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3: OperatorMetricTile is the shared final renderer for StatShortcutCard and OperatorMetricTiles';\n",
      "const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3: OperatorMetricTile is the shared final renderer for StatShortcutCard and OperatorMetricTiles';\nconst CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT = 'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH: OperatorMetricTiles resolves tones from semantic id/label before local screen colors';\n",
    );
    text = text.replace(
      'void CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3;\n',
      'void CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3;\nvoid CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT;\n',
    );
  }

  write(rel, text);
}

function patchUiSystemIndex() {
  const rel = 'src/components/ui-system/index.ts';
  let text = read(rel);
  if (!text.includes("./operator-metric-tone-contract")) {
    text = text.replace("export * from './semantic-visual-registry';\n", "export * from './semantic-visual-registry';\nexport * from './operator-metric-tone-contract';\nexport { OperatorMetricToneRuntime } from './OperatorMetricToneRuntime';\n");
  }
  write(rel, text);
}

function patchLayout() {
  const rel = 'src/components/Layout.tsx';
  let text = read(rel);
  if (!text.includes('OperatorMetricToneRuntime')) {
    text = text.replace(
      "import AdminDebugToolbar from './admin-tools/AdminDebugToolbar';\n",
      "import AdminDebugToolbar from './admin-tools/AdminDebugToolbar';\nimport { OperatorMetricToneRuntime } from './ui-system';\n",
    );
    text = text.replace(
      '          <ContextActionDialogsHost />\n',
      '          <ContextActionDialogsHost />\n          <OperatorMetricToneRuntime />\n',
    );
  }
  write(rel, text);
}

function patchIndexCss() {
  const rel = 'src/index.css';
  let text = read(rel);
  if (!text.includes("closeflow-operator-metric-tiles.css")) {
    if (text.includes("@import './styles/closeflow-metric-tiles.css';")) {
      text = text.replace(
        "@import './styles/closeflow-metric-tiles.css';\n",
        "@import './styles/closeflow-metric-tiles.css';\n@import './styles/closeflow-operator-metric-tiles.css';\n",
      );
    } else {
      ensureIncludes(text, '/* 4. component contracts */', rel);
      text = text.replace('/* 4. component contracts */\n', "/* 4. component contracts */\n@import './styles/closeflow-operator-metric-tiles.css';\n");
    }
  }
  if (!text.includes("closeflow-operator-semantic-tones.css")) {
    if (text.includes("@import './styles/closeflow-operator-metric-tiles.css';")) {
      text = text.replace(
        "@import './styles/closeflow-operator-metric-tiles.css';\n",
        "@import './styles/closeflow-operator-metric-tiles.css';\n@import './styles/closeflow-operator-semantic-tones.css';\n",
      );
    } else {
      ensureIncludes(text, '/* 4. component contracts */', rel);
      text = text.replace('/* 4. component contracts */\n', "/* 4. component contracts */\n@import './styles/closeflow-operator-semantic-tones.css';\n");
    }
  }
  write(rel, text);
}

function patchPackageJson() {
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:vs7-semantic-metric-tones'] = 'node scripts/check-vs7-semantic-metric-tones.cjs';
  const guard = 'npm.cmd run check:vs7-semantic-metric-tones';
  if (pkg.scripts.lint && !pkg.scripts.lint.includes('check:vs7-semantic-metric-tones')) {
    pkg.scripts.lint = `${guard} && ${pkg.scripts.lint}`;
  } else if (!pkg.scripts.lint) {
    pkg.scripts.lint = guard;
  }
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
}

patchOperatorMetricTiles();
patchUiSystemIndex();
patchLayout();
patchIndexCss();
patchPackageJson();

console.log('CLOSEFLOW_VS7_SEMANTIC_METRIC_TONES_PATCH_APPLIED');
console.log(marker);
