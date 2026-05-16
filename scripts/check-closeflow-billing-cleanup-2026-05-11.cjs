#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const billingPath = path.join(root, 'src', 'pages', 'Billing.tsx');

function fail(message) {
  console.error(`\u2718 ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`\u2714 ${message}`);
}

if (!fs.existsSync(billingPath)) {
  fail(`Missing ${path.relative(root, billingPath)}`);
  process.exit(1);
}

const billing = fs.readFileSync(billingPath, 'utf8');

const forbidden = [
  'Plan aktywny.',
  'Co masz w planie',
  'Co jest dost\u0119pne teraz',
  'Rozliczenia lead/case',
  'billing-limits-card',
];

for (const text of forbidden) {
  if (billing.includes(text)) {
    fail(`Billing.tsx still contains forbidden text/class: ${text}`);
  } else {
    pass(`Removed forbidden text/class: ${text}`);
  }
}

const required = [
  'Nast\u0119pna p\u0142atno\u015B\u0107',
  'billing-status-card',
];

for (const text of required) {
  if (billing.includes(text)) {
    pass(`Billing.tsx contains required text/class: ${text}`);
  } else {
    fail(`Billing.tsx is missing required text/class: ${text}`);
  }
}

if (!process.exitCode) {
  console.log('\u2714 Billing cleanup guard passed');
}
