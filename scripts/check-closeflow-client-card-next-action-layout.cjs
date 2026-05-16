const fs = require('fs');
const path = require('path');

const root = process.cwd();
const required = [
  'src/pages/Clients.tsx',
  'src/styles/clients-next-action-layout.css',
  'docs/clients/CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_2026-05-11.md',
  'scripts/check-closeflow-client-card-next-action-layout.cjs',
];

const fail = (message) => {
  console.error('CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_ETAP10_CHECK_FAILED');
  console.error(message);
  process.exit(1);
};

for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) fail(`Missing required file: ${rel}`);
}

const clients = fs.readFileSync(path.join(root, 'src/pages/Clients.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/clients-next-action-layout.css'), 'utf8');
const doc = fs.readFileSync(path.join(root, 'docs/clients/CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_2026-05-11.md'), 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const checks = [
  [clients.includes("import '../styles/clients-next-action-layout.css';"), 'Clients.tsx must import clients-next-action-layout.css'],
  [clients.includes('client-card-next-action-block'), 'nearest action cell must have client-card-next-action-block'],
  [clients.includes('Najbli\u017Csza akcja'), 'UI label must be Najbli\u017Csza akcja'],
  [clients.includes('Brak zaplanowanej akcji'), 'empty fallback must be Brak zaplanowanej akcji'],
  [!clients.includes('Brak zaplanowanych dzia\u0142a\u0144'), 'old fallback Brak zaplanowanych dzia\u0142a\u0144 must not remain in Clients.tsx'],
  [css.includes('grid-area: next'), 'CSS must assign nearest action to grid-area next'],
  [css.includes('grid-area: actions'), 'CSS must assign actions to grid-area actions'],
  [css.includes('client-card-next-action-block'), 'CSS must style client-card-next-action-block'],
  [css.includes('grid-template-areas') && css.indexOf('next next') < css.indexOf('actions actions'), 'CSS grid must place next action before actions'],
  [css.includes('flex-wrap: wrap'), 'Actions must wrap on small width'],
  [doc.includes('Najbli\u017Csza akcja') && doc.includes('Akcje na dole'), 'Doc must describe final card order'],
  [pkg.scripts && pkg.scripts['check:closeflow-client-card-next-action-layout'] === 'node scripts/check-closeflow-client-card-next-action-layout.cjs', 'package.json must expose check:closeflow-client-card-next-action-layout'],
];

const failed = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (failed.length) fail(failed.join('\n'));

console.log('CLOSEFLOW_CLIENT_CARD_NEXT_ACTION_LAYOUT_ETAP10_CHECK_OK');
console.log('layout_order=name_contact_metrics_next_action_buttons');
console.log('nearest_action_block=full_width_before_buttons');
console.log('mobile_actions=wrap');
