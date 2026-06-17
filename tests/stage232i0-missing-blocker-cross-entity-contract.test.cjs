const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const contract = fs.readFileSync('_project/contracts/STAGE232I0_MISSING_BLOCKER_CROSS_ENTITY_CONTRACT.md', 'utf8');
test('STAGE232I0 contains lead case client source map', () => { assert.match(contract, /\| Lead \|/); assert.match(contract, /\| Case \|/); assert.match(contract, /\| Client \|/); });
test('STAGE232I0 locks active source and history boundary', () => { assert.match(contract, /active missing item source/); assert.match(contract, /history is not source of active missing/); assert.match(contract, /work item \/ task typu missing_item/); });
test('STAGE232I0 records case_items and client aggregation decisions', () => { assert.match(contract, /case_items decision/); assert.match(contract, /client aggregation rule/); assert.match(contract, /directClientMissingItems/); assert.match(contract, /caseMissingItems/); });
test('STAGE232I0 remains audit-only and points to next runtime stages', () => { assert.match(contract, /runtime: NIE W TYM ETAPIE/); assert.match(contract, /SQL: NIE W TYM ETAPIE/); assert.match(contract, /STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME/); assert.match(contract, /STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_AGGREGATION_RUNTIME/); assert.match(contract, /STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION/); });
