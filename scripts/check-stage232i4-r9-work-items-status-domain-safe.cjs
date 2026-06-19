const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'api', 'work-items.ts');
const text = fs.readFileSync(file, 'utf8');
const errors = [];
if (!text.includes('STAGE232I4_R9_WORK_ITEMS_STATUS_DOMAIN_SAFE')) errors.push('missing R9 marker');
if (!text.includes('normalizeMissingItemDbStatusStage232I4R9')) errors.push('missing R9 DB-safe status helper');
if (!/status:\s*isMissingItemStage232I4R8\s*\?\s*normalizeMissingItemDbStatusStage232I4R9\(body\)\s*:\s*normalizeTaskStatus\(body\.status\),/.test(text)) errors.push('POST missing_item status must use DB-safe mapping, not missing_item/blocking_missing_item');
if (/status:\s*isMissingItemStage232I4R8[\s\S]{0,260}'blocking_missing_item'/.test(text)) errors.push('POST status still writes blocking_missing_item into work_items.status');
if (!/priority:\s*isMissingItemStage232I4R8[\s\S]{0,180}isBlockingMissingItemStage232I4R9/.test(text)) errors.push('POST missing_item should preserve blocker signal through priority/high, not status');
if (!text.includes("type: body.type || (isMissingItemStage232I4R8 ? 'missing_item' : 'task')")) errors.push('POST must still preserve type=missing_item');
if (!text.includes('client_id: asNullableUuid(body.clientId)')) errors.push('POST must still write client_id for client missing items');
if (errors.length) {
  console.error('STAGE232I4_R9 status-domain guard FAIL');
  for (const err of errors) console.error('- ' + err);
  process.exit(1);
}
console.log('STAGE232I4_R9 work-items status-domain guard PASS');
