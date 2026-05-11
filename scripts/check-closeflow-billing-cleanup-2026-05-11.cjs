#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const billingPath = path.join(root, 'src', 'pages', 'Billing.tsx');

function fail(message) {
  console.error(`✘ ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`✔ ${message}`);
}

if (!fs.existsSync(billingPath)) {
  fail(`Missing ${path.relative(root, billingPath)}`);
  process.exit(1);
}

const billing = fs.readFileSync(billingPath, 'utf8');

const forbidden = [
  'Plan aktywny.',
  'Co masz w planie',
  'Co jest dostępne teraz',
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
  'Następna płatność',
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
  console.log('✔ Billing cleanup guard passed');
}
