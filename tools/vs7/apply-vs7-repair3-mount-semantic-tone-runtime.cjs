#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const layoutPath = path.join(root, 'src/pages/..', 'components/Layout.tsx');
const rel = 'src/components/Layout.tsx';

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(layoutPath)) fail('Missing ' + rel);

let file = fs.readFileSync(layoutPath, 'utf8');
const before = file;

const importLine = "import { OperatorMetricToneRuntime } from './ui-system';";
if (!file.includes('OperatorMetricToneRuntime')) {
  const anchors = [
    "import AdminDebugToolbar from './admin-tools/AdminDebugToolbar';",
    "import ContextActionDialogsHost from './ContextActionDialogs';",
    "import GlobalQuickActions from './GlobalQuickActions';",
  ];
  const anchor = anchors.find((candidate) => file.includes(candidate));
  if (!anchor) fail('Cannot find safe import anchor in ' + rel);
  file = file.replace(anchor, anchor + '\n' + importLine);
}

if (!file.includes('<OperatorMetricToneRuntime />')) {
  const sidebarAnchor = '      <aside className="sidebar" data-shell-sidebar="true">';
  if (!file.includes(sidebarAnchor)) fail('Cannot find sidebar anchor for OperatorMetricToneRuntime mount in ' + rel);
  file = file.replace(sidebarAnchor, '      <OperatorMetricToneRuntime />\n' + sidebarAnchor);
}

const guard = "CLOSEFLOW_VS7_REPAIR3_OPERATOR_METRIC_TONE_RUNTIME_MOUNT";
if (!file.includes(guard)) {
  file = file.replace(
    "/* PHASE0_AI_ADMIN_NAV_GUARD isAdmin AI admin /settings/ai */",
    "/* " + guard + " Layout mounts OperatorMetricToneRuntime once for legacy semantic card repair */\n\n/* PHASE0_AI_ADMIN_NAV_GUARD isAdmin AI admin /settings/ai */",
  );
}

if (file === before) {
  console.log('CLOSEFLOW_VS7_REPAIR3_OPERATOR_METRIC_TONE_RUNTIME_ALREADY_OK');
} else {
  fs.writeFileSync(layoutPath, file);
  console.log('CLOSEFLOW_VS7_REPAIR3_OPERATOR_METRIC_TONE_RUNTIME_PATCHED');
}

const next = fs.readFileSync(layoutPath, 'utf8');
for (const needle of [importLine, '<OperatorMetricToneRuntime />', guard]) {
  if (!next.includes(needle)) fail('Repair3 validation failed: missing ' + needle);
}
