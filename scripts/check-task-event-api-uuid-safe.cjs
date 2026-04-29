const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

function checkApi(rel, label) {
  const source = read(rel);
  assert(source.includes("import { deleteById, insertWithVariants, isUuid, selectFirstAvailable, updateById }") || source.includes("isUuid"), label + ': brakuje importu isUuid');
  assert(source.includes('function asNullableUuid(value: unknown)'), label + ': brakuje helpera asNullableUuid');
  assert(source.includes('return isUuid(normalized) ? normalized : null;'), label + ': asNullableUuid nie filtruje nie-UUID');
  assert(source.includes('payload.created_by_user_id = asNullableUuid(body.ownerId || body.owner_id);'), label + ': created_by_user_id nie uzywa asNullableUuid');
  assert(!source.includes('payload.created_by_user_id = asNullableText(body.ownerId || body.owner_id);'), label + ': created_by_user_id dalej uzywa asNullableText');
  for (const field of ['lead_id', 'case_id', 'client_id']) {
    assert(source.includes('payload.' + field + ' = asNullableUuid(body.' + field.replace('_id', 'Id') + ');'), label + ': ' + field + ' nie uzywa asNullableUuid');
    assert(!source.includes('payload.' + field + ' = asNullableText(body.' + field.replace('_id', 'Id') + ');'), label + ': ' + field + ' dalej uzywa asNullableText');
  }
}

checkApi('api/tasks.ts', 'tasks API');
checkApi('api/events.ts', 'events API');

console.log('OK: task/event API filtruje Firebase UID i inne nie-UUID przed kolumnami uuid.');
