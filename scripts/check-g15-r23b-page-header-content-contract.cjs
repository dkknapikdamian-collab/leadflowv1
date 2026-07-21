#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const componentPath = path.join(root, 'src/components/CloseFlowPageHeaderV2.tsx');
const contentPath = path.join(root, 'src/lib/page-header-content.ts');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`missing file: ${path.relative(root, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

function count(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

const component = read(componentPath);
const content = read(contentPath);
const expectedDescription = 'Lista aktywnych tematów sprzedażowych. Tu zapisujesz kontakty, pilnujesz wartości i szybko widzisz, które leady wymagają ruchu.';

const exactLeadsBlock = new RegExp(
  String.raw`leads:\s*\{\s*kicker:\s*'LEADY',\s*title:\s*'Leady',\s*description:\s*'${expectedDescription.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\s*\}`,
  'm',
);

if (!exactLeadsBlock.test(component)) fail('component leads copy does not contain the exact required kicker contract');
if (!exactLeadsBlock.test(content)) fail('central page-header leads copy does not contain the exact required kicker contract');

if (count(component, /kicker:\s*'LEADY'/g) !== 1) fail('component must contain exactly one LEADY kicker');
if (count(content, /kicker:\s*'LEADY'/g) !== 1) fail('central content must contain exactly one LEADY kicker');

if (!/export type CloseFlowPageHeaderContent\s*=\s*\{[\s\S]*?kicker:\s*string;[\s\S]*?title:\s*string;[\s\S]*?description:\s*string;[\s\S]*?\};/.test(content)) {
  fail('CloseFlowPageHeaderContent must continue to require kicker: string');
}
if (/kicker\s*\?:/.test(content)) fail('optional kicker is forbidden');
if (!/\{content\.kicker\}/.test(component)) fail('page header must continue to render content.kicker');
if (!/const CLOSEFLOW_PAGE_HEADER_COPY: Record<CloseFlowPageHeaderKey, CloseFlowPageHeaderContent>/.test(component)) {
  fail('component-local typed page-header copy contract is missing');
}
if (!/export const PAGE_HEADER_CONTENT: Record<CloseFlowPageHeaderKey, CloseFlowPageHeaderContent>/.test(content)) {
  fail('central typed page-header content contract is missing');
}

console.log('PASS: R23B adds the exact LEADY kicker to both typed page-header maps without weakening the contract.');
