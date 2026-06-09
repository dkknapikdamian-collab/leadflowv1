const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const STAGE = 'STAGE228R42_RUNTIME_DELETE_STATUS_CONTRACT';
function file(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message) { throw new Error(STAGE + ' FAIL: ' + message); }
function blockOfConstArray(source, name) {
  const token = 'export const ' + name + ' = [';
  const start = source.indexOf(token);
  if (start < 0) fail('missing const array ' + name);
  const bodyStart = start + token.length;
  const end = source.indexOf('] as const;', bodyStart);
  if (end < 0) fail('missing const array end for ' + name);
  return source.slice(bodyStart, end);
}
function objectBlock(source, name) {
  const token = 'export const ' + name + ':';
  const start = source.indexOf(token);
  if (start < 0) fail('missing object ' + name);
  const brace = source.indexOf('{', start);
  const end = source.indexOf('};', brace);
  if (brace < 0 || end < 0) fail('missing object body for ' + name);
  return source.slice(brace + 1, end);
}
function mustInclude(source, token, label) {
  if (!source.includes(token)) fail(label + ' missing token: ' + token);
}

const domain = file('src/lib/domain-statuses.ts');
const workItems = file('api/work-items.ts');

mustInclude(blockOfConstArray(domain, 'TASK_STATUS_VALUES'), "'deleted'", 'TASK_STATUS_VALUES');
mustInclude(blockOfConstArray(domain, 'EVENT_STATUS_VALUES'), "'deleted'", 'EVENT_STATUS_VALUES');
mustInclude(objectBlock(domain, 'TASK_STATUS_LABELS'), 'deleted:', 'TASK_STATUS_LABELS');
mustInclude(objectBlock(domain, 'EVENT_STATUS_LABELS'), 'deleted:', 'EVENT_STATUS_LABELS');
mustInclude(domain, 'normalizeTaskStatus(value', 'domain normalizer');
mustInclude(domain, 'normalizeEventStatus(value', 'domain normalizer');
mustInclude(workItems, 'normalizeTaskStatus', 'work-items route');
mustInclude(workItems, 'normalizeEventStatus', 'work-items route');

console.log(STAGE + ' PASS');
