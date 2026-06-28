const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

function extractExportedArrayBody(source, constName) {
  const declaration = `export const ${constName}`;
  const start = source.indexOf(declaration);
  assert.notEqual(start, -1, `${constName} export not found`);

  const equals = source.indexOf('=', start);
  assert.notEqual(equals, -1, `${constName} assignment not found`);

  const open = source.indexOf('[', equals);
  assert.notEqual(open, -1, `${constName} array open bracket not found`);

  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }

  throw new Error(`${constName} array close bracket not found`);
}

function extractArrayValues(source, constName) {
  const body = extractExportedArrayBody(source, constName);
  const objectValues = [...body.matchAll(/value:\s*['"]([^'"]+)['"]/g)].map((entry) => entry[1]);
  if (objectValues.length) return objectValues;
  return [...body.matchAll(/['"]([^'"]+)['"]/g)].map((entry) => entry[1]);
}

function extractFunctionBody(source, fnName) {
  const start = source.indexOf(`export function ${fnName}`);
  assert.notEqual(start, -1, `${fnName} not found`);
  return source.slice(start, source.indexOf('\n}', start) + 2);
}

test('CZ2-002 canonical lead options SOT is wired to domain statuses', () => {
  const domain = read('src/lib/domain-statuses.ts');
  const sot = read('src/lib/source-of-truth/lead-options.ts');

  for (const status of extractArrayValues(domain, 'LEAD_STATUS_VALUES')) {
    assert.match(sot, new RegExp(`${status}:`), `missing status meta for ${status}`);
  }
  assert.match(sot, /LEAD_STATUS_VALUES\.map/, 'LEAD_STATUS_OPTIONS must derive from LEAD_STATUS_VALUES');
  assert.match(sot, /normalizeLeadStatus/, 'status helpers must use normalizeLeadStatus');
});

test('CZ2-002 canonical lead source options are complete', () => {
  const sot = read('src/lib/source-of-truth/lead-options.ts');
  const values = extractArrayValues(sot, 'LEAD_SOURCE_OPTIONS');
  assert.deepEqual(values, [
    'instagram',
    'facebook',
    'messenger',
    'whatsapp',
    'email',
    'form',
    'phone',
    'referral',
    'cold_outreach',
    'other',
  ]);
  assert.match(sot, /\{ value: 'instagram', label: 'Instagram' \}/);
  assert.match(sot, /\{ value: 'other', label: 'Inne' \}/);
});

test('CZ2-002 canonical helpers preserve expected decisions', () => {
  const sot = read('src/lib/source-of-truth/lead-options.ts');
  assert.match(extractFunctionBody(sot, 'getLeadSourceLabel'), /getLeadSourceMeta\(source\)\.label/);
  assert.match(extractFunctionBody(sot, 'normalizeLeadSource'), /: 'other'/);
  assert.match(sot, /'lost',[\s\S]*'moved_to_service',[\s\S]*'archived'/);
  assert.match(sot, /'won'/);
  assert.match(sot, /waiting_response/);
});

test('CZ2-002 compatibility wrappers keep old exports without local lead arrays', () => {
  const config = read('src/lib/config/lead-status.ts');
  const options = read('src/lib/options.ts');

  assert.match(config, /LEAD_STATUS_META_BY_VALUE as LEAD_STATUS_CONFIG/);
  assert.match(config, /getLeadStatusMeta as getLeadStatusConfig/);
  assert.match(config, /getLeadStatusLabel/);
  assert.match(config, /getLeadStatusTone/);
  assert.match(config, /getLeadStatusPillClass/);
  assert.doesNotMatch(config, /const\s+LEAD_STATUS_TONES/);

  assert.match(options, /LEAD_SOURCE_OPTIONS as SOURCE_OPTIONS/);
  assert.match(options, /LEAD_STATUS_OPTIONS as STATUS_OPTIONS/);
  assert.doesNotMatch(options, /export\s+const\s+SOURCE_OPTIONS\s*=\s*\[/);
});
