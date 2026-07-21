#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const sourcePath = path.join(root, 'src/components/ContextActionDialogs.tsx');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(sourcePath)) fail('missing ContextActionDialogs.tsx');
const source = fs.readFileSync(sourcePath, 'utf8');

function count(value) {
  return source.split(value).length - 1;
}

if (!source.startsWith("import { useEffect, useMemo, useState } from 'react';")) {
  fail('React hooks import must remain exact without synthetic MouseEvent');
}
if (/^import \{[^\n]*type MouseEvent[^\n]*\} from 'react';/m.test(source)) {
  fail('React synthetic MouseEvent import remains');
}
if (count('const capture = (event: globalThis.MouseEvent) => {') !== 1) {
  fail('native capture listener must use exactly one globalThis.MouseEvent annotation');
}
if (count('const capture = (event: MouseEvent) => {') !== 0) {
  fail('ambiguous MouseEvent annotation remains');
}
for (const required of [
  "document.addEventListener('click', capture, true);",
  "document.removeEventListener('click', capture, true);",
  'event.preventDefault();',
  'event.stopPropagation();',
  'event.stopImmediatePropagation?.();',
  'const target = event.target instanceof Element ? event.target : null;',
  'setRequest({ ...context, kind });',
]) {
  if (count(required) !== 1) fail(`required preserved listener contract missing or duplicated: ${required}`);
}
if (!source.includes("request.recordType === 'case'")) fail('later TS2367 context must remain for the next stage');
if (!source.includes('item: createdMissingTaskRecordStage232N,')) fail('later no-flicker item debt must remain untouched');
if (!source.includes('record: createdMissingTaskRecordStage232N,')) fail('existing no-flicker record contract must remain untouched');

console.log('PASS: R23C uses the native DOM MouseEvent type for the document capture listener and preserves behavior.');
