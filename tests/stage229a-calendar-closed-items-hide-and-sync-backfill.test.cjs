const test=require('node:test');const assert=require('node:assert/strict');const {spawnSync}=require('node:child_process');
test('Stage229A closed/deleted calendar visibility guard passes',()=>{const r=spawnSync(process.execPath,['scripts/check-stage229a-calendar-closed-items-hide-and-sync-backfill.cjs'],{cwd:process.cwd(),encoding:'utf8'});assert.equal(r.status,0,r.stderr||r.stdout);});
