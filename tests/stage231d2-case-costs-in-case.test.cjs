const assert=require('assert');
const {spawnSync}=require('child_process');
const test=require('node:test');
test('STAGE231D2_CASE_COSTS_IN_CASE guard passes',()=>{ const r=spawnSync(process.execPath,['scripts/check-stage231d2-case-costs-in-case.cjs'],{encoding:'utf8'}); assert.strictEqual(r.status,0, r.stdout+'\n'+r.stderr); });
