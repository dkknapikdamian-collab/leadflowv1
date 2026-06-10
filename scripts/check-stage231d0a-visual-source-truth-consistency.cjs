#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const MARKER = 'STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY';
const repoRoot = process.cwd();
const failures = [];
const warnings = [];

function relPath(...parts) {
  return path.join(repoRoot, ...parts);
}

function exists(rel) {
  return fs.existsSync(relPath(...rel.split('/')));
}

function read(rel) {
  const full = relPath(...rel.split('/'));
  if (!fs.existsSync(full)) {
    failures.push(`missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function mustContain(rel, tokens, reason) {
  const content = read(rel);
  for (const token of tokens) {
    if (!content.includes(token)) {
      failures.push(`${rel}: missing token ${JSON.stringify(token)} (${reason})`);
    }
  }
  return content;
}

function warnIfContains(rel, patterns, reason) {
  const content = read(rel);
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      warnings.push(`${rel}: ${reason}: ${pattern}`);
    }
  }
}

function failIfContains(rel, patterns, reason) {
  const content = read(rel);
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      failures.push(`${rel}: ${reason}: ${pattern}`);
    }
  }
}

function literalFromCodes(codes) {
  return String.fromCharCode(...codes);
}

const mojibakeTokens = [
  literalFromCodes([0x0102]),
  literalFromCodes([0x0139]),
  literalFromCodes([0x00c4]),
  literalFromCodes([0x00c5]),
  literalFromCodes([0x00c2]),
  literalFromCodes([0xfffd]),
  'd' + literalFromCodes([0x00ef, 0x00bf, 0x00bd]) + 'z' + literalFromCodes([0x00ef, 0x00bf, 0x00bd]),
].filter(Boolean);

function checkNoMojibake(rel) {
  const content = read(rel);
  for (const token of mojibakeTokens) {
    if (content.includes(token)) {
      failures.push(`${rel}: contains mojibake/replacement token`);
    }
  }
}

function checkPackageScripts() {
  const pkgRaw = read('package.json');
  let pkg;
  try {
    pkg = JSON.parse(pkgRaw);
  } catch (error) {
    failures.push(`package.json: invalid JSON: ${error.message}`);
    return;
  }
  const scripts = pkg.scripts || {};
  const expected = {
    'check:stage231d0a-visual-source-truth-consistency': 'node scripts/check-stage231d0a-visual-source-truth-consistency.cjs',
    'test:stage231d0a-visual-source-truth-consistency': 'node --test tests/stage231d0a-visual-source-truth-consistency.test.cjs',
  };
  for (const [name, command] of Object.entries(expected)) {
    if (scripts[name] !== command) {
      failures.push(`package.json: missing or changed script ${name}`);
    }
  }
}

function checkInventoryReport() {
  const report = '_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md';
  const map = '_project/VISUAL_SOURCE_OF_TRUTH.md';
  for (const rel of [report, map]) {
    mustContain(rel, [
      MARKER,
      'VISUAL SOURCE OF TRUTH MAP',
      'Cards:',
      'Buttons:',
      'Badges:',
      'Icons:',
      'Finance rows:',
      'Typography:',
      'Spacing:',
      'Colors:',
      'Ryzyka:',
    ], 'D0A report must include the visual source of truth map');
    checkNoMojibake(rel);
  }
}

function checkExistingVisualSources() {
  mustContain('src/components/ui/button.tsx', [
    'buttonVariants',
    'data-cf-vst-button',
    'cf-vst-button',
    'cf-vst-button-primary',
    'cf-vst-button-delete',
  ], 'button source of truth');

  mustContain('src/components/entity-actions.tsx', [
    'CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6',
    'ENTITY_DETAIL_ACTION_PLACEMENT_CONTRACT',
    'CLOSEFLOW_TRASH_ACTION_SOURCE_OF_TRUTH',
    'EntityActionButton',
    'EntityTrashButton',
    'actionButtonClass',
    'trashActionButtonClass',
    'trashActionIconClass',
  ], 'entity action source of truth');

  mustContain('src/components/ui-system/index.ts', [
    "export * from './SurfaceCard'",
    "export * from './StatusPill'",
    "export * from './MetricTile'",
    "export * from './EntityIcon'",
    "export * from './icon-registry'",
    "export * from './OperatorMetricTiles'",
  ], 'ui-system registry exports');

  mustContain('src/components/ui-system/icon-registry.ts', [
    'CLOSEFLOW_ENTITY_ICON_REGISTRY_VS2B',
    'ENTITY_ICON_MAP',
    'client:',
    'lead:',
    'case:',
    'task:',
    'event:',
    'payment:',
    'commission:',
    'ai:',
    'CLOSEFLOW_ENTITY_ICON_MAP_SINGLE_SOURCE_OF_TRUTH',
  ], 'entity icon map source of truth');

  mustContain('src/components/ui-system/EntityIcon.tsx', [
    'resolveEntityIcon',
    'data-cf-entity-icon',
    'data-cf-entity-icon-size',
    'data-cf-entity-icon-tone',
    'ClientEntityIcon',
    'LeadEntityIcon',
    'CaseEntityIcon',
  ], 'EntityIcon component contract');

  mustContain('src/components/ui-system/SurfaceCard.tsx', [
    'data-cf-ui-component="SurfaceCard"',
    'data-standard-surface-card="true"',
    'data-cf-surface-card-contract',
  ], 'card surface source of truth');

  mustContain('src/components/ui-system/StatusPill.tsx', [
    'data-cf-ui-component="StatusPill"',
    'data-cf-status-tone',
    'data-cf-status-pill-contract',
    'StatusPillTone',
  ], 'badge/status source of truth');

  mustContain('src/components/ui-system/MetricTile.tsx', [
    'data-cf-ui-component="MetricTile"',
    'data-cf-metric-tile-contract',
    'OperatorMetricTile',
  ], 'metric tile source of truth');

  mustContain('src/components/finance/FinanceMiniSummary.tsx', [
    'SurfaceCard',
    'StatusPill',
    'cf-finance-metric',
    'Prowizja należna',
    'Wpłacono prowizji',
    'Do zapłaty prowizji',
  ], 'finance rows source of truth');

  mustContain('src/styles/closeflow-record-list-source-truth.css', [
    'CLOSEFLOW_RECORD_LIST_SOURCE_TRUTH_2026_05_12',
    'owner: CloseFlow Visual System',
    'goal: one visual source of truth for operator record cards',
    'main-leads-html',
    'main-clients-html',
  ], 'record list visual source of truth');

  mustContain('src/styles/closeflow-unified-page-canvas-stage211c.css', [
    'STAGE211C_UNIFIED_APP_CANVAS',
    '--cf-page-canvas-full-width',
    '--cf-page-canvas-padding-x',
    '.cf-page-canvas',
    'data-cf-page-canvas',
  ], 'page canvas source of truth');

  mustContain('src/pages/ClientDetail.tsx', [
    "import { EntityIcon } from '../components/ui-system'",
    "import { actionButtonClass } from '../components/entity-actions'",
    "import { Button } from '../components/ui/button'",
    "import { ClientFinanceRelationSummary } from '../components/finance/FinanceMiniSummary'",
    "import '../styles/closeflow-unified-page-canvas-stage211c.css'",
    'data-cf-page-canvas="full"',
  ], 'ClientDetail must consume shared visual sources');

  mustContain('src/pages/Cases.tsx', [
    "import { EntityIcon } from '../components/ui-system/EntityIcon'",
    'EntityTrashButton',
    'trashActionIconClass',
    "import '../styles/closeflow-record-list-source-truth.css'",
    "import '../styles/closeflow-unified-page-canvas-stage211c.css'",
  ], 'Cases must consume shared visual sources');

  mustContain('src/pages/Clients.tsx', [
    "from '../components/ui-system'",
    'actionIconClass',
    'StatShortcutCard',
    'SimpleFiltersCard',
    "import '../styles/closeflow-record-list-source-truth.css'",
    "import '../styles/closeflow-unified-page-canvas-stage211c.css'",
  ], 'Clients must consume shared visual sources');
}

function checkD0ADoesNotIntroduceRuntimeLocalStyles() {
  const d0aFiles = [
    'scripts/check-stage231d0a-visual-source-truth-consistency.cjs',
    'tests/stage231d0a-visual-source-truth-consistency.test.cjs',
    '_project/VISUAL_SOURCE_OF_TRUTH.md',
    '_project/runs/STAGE231D0A_VISUAL_SOURCE_TRUTH_INVENTORY_RUN.md',
  ];
  for (const rel of d0aFiles) {
    if (!exists(rel)) {
      failures.push(`missing D0A file: ${rel}`);
      continue;
    }
    checkNoMojibake(rel);
  }

  // D0A is inventory/guard only. It must not add a runtime CSS file that becomes a new local card style source.
  const suspiciousD0ARuntimeCss = 'src/styles/visual-source-truth.css';
  if (exists(suspiciousD0ARuntimeCss)) {
    failures.push(`${suspiciousD0ARuntimeCss}: D0A must not add a runtime style file unless a later UI stage proves it is needed`);
  }

  const localStylePatterns = [
    /width\s*:\s*7\d\dpx/i,
    /height\s*:\s*1\d\dpx/i,
    /font-size\s*:\s*(13|17|19)px/i,
    /border-radius\s*:\s*(23|27|29)px/i,
  ];
  for (const rel of d0aFiles) {
    warnIfContains(rel, localStylePatterns, 'D0A artifact contains a suspicious hard-coded visual value');
  }
}

function checkRoadmapOrder() {
  const next = read('_project/07_NEXT_STEPS.md');
  const stage = read('_project/03_CURRENT_STAGE.md');
  const combined = `${next}\n${stage}`;
  const required = [
    'STAGE231D0A',
    'Visual Source of Truth Inventory + UI Consistency Guard',
    'R10',
    'D0A',
    'D0',
    'D1',
    'D2',
    'D3',
    'D4',
    'D5',
  ];
  for (const token of required) {
    if (!combined.includes(token)) {
      failures.push(`roadmap docs: missing ${JSON.stringify(token)} in _project/07_NEXT_STEPS.md or _project/03_CURRENT_STAGE.md`);
    }
  }
}

function checkObsidianPayload() {
  const rel = '_project/obsidian_payloads/STAGE231D0A_VISUAL_SOURCE_TRUTH_OBSIDIAN_PAYLOAD.md';
  mustContain(rel, [
    MARKER,
    'Zapis do Obsidiana',
    'CloseFlow / LeadFlow',
    '10_PROJEKTY/CloseFlow_Lead_App',
    'STAGE231D0A',
    'Visual Source of Truth',
    'audyt ryzyk',
    'następny krok',
  ], 'Obsidian payload must exist in repo for later copy');
  checkNoMojibake(rel);
}

function main() {
  console.log(`${MARKER}: start`);
  checkPackageScripts();
  checkInventoryReport();
  checkExistingVisualSources();
  checkD0ADoesNotIntroduceRuntimeLocalStyles();
  checkRoadmapOrder();
  checkObsidianPayload();

  for (const warning of warnings) {
    console.warn(`WARN: ${warning}`);
  }

  if (failures.length) {
    console.error(`${MARKER}: FAIL`);
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log(`${MARKER}: PASS`);
}

main();
