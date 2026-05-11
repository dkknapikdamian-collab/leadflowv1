#!/usr/bin/env node
/* CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW guard */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const fail = (msg) => {
  console.error(`✘ ETAP8 client card inline row guard failed: ${msg}`);
  process.exit(1);
};
const ok = (msg) => console.log(`✔ ${msg}`);

function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) fail(`Missing ${rel}`);
  return fs.readFileSync(abs, "utf8");
}

const clients = read("src/pages/Clients.tsx");
const css = read("src/styles/clients-next-action-layout.css");
const pkg = JSON.parse(read("package.json"));

if (!clients.includes('data-client-card-wide-layout="true"')) {
  fail('Clients.tsx must keep data-client-card-wide-layout="true" on client cards');
}
if (!clients.includes("relative group/client-card w-full")) {
  fail('Clients.tsx must keep className containing "relative group/client-card w-full"');
}
if (!clients.includes("cf-client-row-inline")) {
  fail("Clients.tsx must add cf-client-row-inline to the main client-row");
}
if (!clients.includes("cf-client-main-cell")) {
  fail("Clients.tsx must add cf-client-main-cell to the main client data cell");
}
if (!clients.includes("cf-client-cases-cell")) {
  fail("Clients.tsx must add cf-client-cases-cell to the cases/value/status cell");
}
if (!clients.includes("cf-client-next-action-panel")) {
  fail("Clients.tsx must keep cf-client-next-action-panel");
}
if (!clients.includes("cf-client-next-action-inline")) {
  fail("Clients.tsx must add cf-client-next-action-inline to next action panel/block");
}
if (!clients.includes("cf-client-row-actions")) {
  fail("Clients.tsx must add cf-client-row-actions to the row action buttons container");
}

const forbiddenTsx = [
  /cf-client-next-action-inline[\s\S]{0,220}position\s*:\s*["'`]?absolute/i,
  /style=\{\{[\s\S]{0,220}position\s*:\s*["']absolute["']/i
];
if (forbiddenTsx.some((rx) => rx.test(clients))) {
  fail("Do not use position:absolute for the next action inline panel");
}

const requiredCss = [
  "CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW",
  ".main-clients-html .client-row.cf-client-row-inline",
  "grid-template-columns",
  "minmax(280px, 1.5fr)",
  "minmax(260px, 0.95fr)",
  ".main-clients-html .cf-client-main-cell",
  ".main-clients-html .cf-client-next-action-inline",
  ".main-clients-html .cf-client-row-actions",
  "@media (max-width: 1200px)",
  "@media (max-width: 760px)",
];
for (const token of requiredCss) {
  if (!css.includes(token)) fail(`clients-next-action-layout.css missing token: ${token}`);
}

const markerIndex = css.indexOf("CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW");
const markerBlock = markerIndex >= 0 ? css.slice(markerIndex, markerIndex + 4000) : "";
if (/width\s*:\s*1200px/i.test(markerBlock)) {
  fail("Do not set fixed width: 1200px in ETAP8 layout");
}
if (/position\s*:\s*absolute/i.test(markerBlock)) {
  fail("Do not use position:absolute in ETAP8 layout");
}
if (!/grid-column\s*:\s*2\s*\/\s*-1/.test(markerBlock)) {
  fail("Responsive CSS must move secondary cells to grid-column: 2 / -1");
}
if (!pkg.scripts || pkg.scripts["check:etap8-client-card-inline-row"] !== "node scripts/check-closeflow-etap8-client-card-inline-row.cjs") {
  fail('package.json must contain script "check:etap8-client-card-inline-row"');
}

for (const existing of [
  "check:etap3-clients-wide-layout",
  "check:etap4-client-next-action-accent",
  "check:closeflow-admin-feedback-2026-05-11",
]) {
  if (!pkg.scripts || !pkg.scripts[existing]) {
    fail(`Do not remove existing guard script: ${existing}`);
  }
}

ok("ETAP8 client inline row classes, CSS, package script and guard compatibility are present.");
