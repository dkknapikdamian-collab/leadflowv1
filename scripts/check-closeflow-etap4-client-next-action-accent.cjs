#!/usr/bin/env node
/* CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT_GUARD */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (message) => {
  console.error('\u2716 ' + message);
  process.exit(1);
};

const clients = read('src/pages/Clients.tsx');
const css = read('src/styles/clients-next-action-layout.css');

if (!clients.includes('client-card-next-action-block')) fail('client next action block class missing');
if (!clients.includes('cf-client-next-action-panel')) fail('cf-client-next-action-panel class missing in Clients.tsx');
if (!css.includes('CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT')) fail('ETAP4 CSS marker missing');
if (!css.includes('.main-clients-html .client-row > .cf-client-next-action-panel')) fail('scoped next action panel selector missing');
if (!css.includes('rgba(37, 99, 235, 0.18)')) fail('subtle slate-blue border missing');
if (!css.includes('rgba(239, 246, 255, 0.92)')) fail('subtle light-blue background missing');
if (!css.includes('rgba(248, 250, 252, 0.98)')) fail('neutral background fade missing');
if (!css.includes('color: #475569')) fail('muted text color missing');
if (!css.includes('@media (max-width: 520px)')) fail('mobile padding guard missing');

const blockMatch = css.match(/\/\* CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT[\s\S]*?(?=\n\/\*|\s*$)/);
if (!blockMatch) fail('cannot extract ETAP4 block');
const blockWithoutComments = blockMatch[0].replace(/\/\*[\s\S]*?\*\//g, '').toLowerCase();

['#dc2626', '#ef4444', '#be123c', '#b91c1c', 'rgb(220, 38, 38)', 'rgb(239, 68, 68)'].forEach((forbidden) => {
  if (blockWithoutComments.includes(forbidden)) fail('ETAP4 CSS declarations contain forbidden alert color: ' + forbidden);
});

console.log('\u2714 CLOSEFLOW_ETAP4_CLIENT_NEXT_ACTION_ACCENT guard passed');
