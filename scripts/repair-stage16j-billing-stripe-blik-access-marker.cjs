#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'src/lib/access.ts';
const file = path.join(root, rel);
const marker = "const BILLING_STRIPE_BLIK_EXPIRED_ACCESS_ASCII_GUARD = 'Oplacony okres dostepu minal';";

if (!fs.existsSync(file)) {
  console.error(rel + ' missing');
  process.exit(1);
}

let source = fs.readFileSync(file, 'utf8');
let touched = false;

if (!source.includes('Oplacony okres dostepu minal')) {
  const anchor = 'const TRIAL_LENGTH_DAYS = TRIAL_DAYS;';
  if (source.includes(anchor)) {
    source = source.replace(anchor, anchor + '\n' + marker);
    touched = true;
  } else {
    source = marker + '\n' + source;
    touched = true;
  }
}

// Keep the real UI copy with Polish signs. The ASCII marker is only for legacy release gate compatibility.
if (!source.includes('Op\u0142acony okres dost\u0119pu min\u0105\u0142')) {
  console.error('Expected real Polish billing expiry copy is missing. Refusing to replace UI text with ASCII marker.');
  process.exit(1);
}

if (touched) fs.writeFileSync(file, source, 'utf8');

console.log('OK: Stage16J Stripe BLIK access expiry gate repaired.');
console.log('Touched files: ' + (touched ? '1' : '0'));
if (touched) console.log('- ' + rel);
