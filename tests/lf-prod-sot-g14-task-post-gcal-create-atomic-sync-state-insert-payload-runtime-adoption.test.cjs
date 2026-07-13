const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const taskPath = path.join(root,'src/server/task-route-stage124f.ts');
const helperPath = path.join(root,'src/lib/google-calendar-create-sync-state-insert-payload.ts');
const facadePath = path.join(root,'src/lib/google-calendar-mutation-sync-state-decision.ts');
const eventPath = path.join(root,'src/server/event-route-stage124f.ts');
const taskSource=fs.readFileSync(taskPath,'utf8');
const helperSource=fs.readFileSync(helperPath,'utf8');
const facadeSource=fs.readFileSync(facadePath,'utf8');
const eventSource=fs.readFileSync(eventPath,'utf8');
let tmp,handler,capture;
function transpile(source,target){ const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText; fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,output); }
test.before(async()=>{
 tmp=fs.mkdtempSync(path.join(os.tmpdir(),'g14-')); fs.mkdirSync(path.join(tmp,'server'),{recursive:true}); fs.mkdirSync(path.join(tmp,'lib'),{recursive:true}); fs.writeFileSync(path.join(tmp,'package.json'),'{"type":"module"}\n');
 transpile(facadeSource,path.join(tmp,'lib/google-calendar-mutation-sync-state-decision.js'));
 transpile(helperSource,path.join(tmp,'lib/google-calendar-create-sync-state-insert-payload.js'));
 transpile(taskSource,path.join(tmp,'server/task-route-stage124f.js'));
 fs.writeFileSync(path.join(tmp,'server/_supabase.js'),`
export async function insertWithVariants(tables,rows){globalThis.__g14Capture.inserts.push({tables,rows});return {data:[{id:'task-1',...rows[0]}]};}
export async function updateByIdScoped(table,id,workspaceId,payload){globalThis.__g14Capture.updates.push({table,id,workspaceId,payload});return [{id,...payload}];}
export async function updateById(){return [];} export async function selectFirstAvailable(){return {data:[]};} export async function deleteByIdScoped(){return [];}
`);
 fs.writeFileSync(path.join(tmp,'server/_request-scope.js'),`export async function resolveRequestWorkspaceId(){return 'workspace-1';} export async function requireRequestIdentity(){return {userId:globalThis.__g14Capture.userId};} export function withWorkspaceFilter(v){return v;}`);
 fs.writeFileSync(path.join(tmp,'lib/data-contract.js'),'export function normalizeTaskListContract(rows){return rows;}\n');
 fs.writeFileSync(path.join(tmp,'lib/calendar-timezone-contract.js'),`export function normalizeCloseFlowDateTimeToUtcIso(value){if(!value)return null;return new Date(value).toISOString();}`);
 fs.writeFileSync(path.join(tmp,'server/google-calendar-mutation-sync-state-marker.js'),`export async function markGoogleCalendarMutationSyncState(){globalThis.__g14Capture.markerCalls++;return {found:true};}`);
 handler=(await import(pathToFileURL(path.join(tmp,'server/task-route-stage124f.js')).href)).default;
});
test.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
async function post(body,userId='user-1'){capture=globalThis.__g14Capture={inserts:[],updates:[],markerCalls:0,userId};let statusCode=0,responseBody;const req={method:'POST',body};const res={status(c){statusCode=c;return this;},json(v){responseBody=v;return this;}};await handler(req,res);return {capture,statusCode,responseBody};}
test('01 real G12 helper is imported',()=>assert.match(taskSource,/google-calendar-create-sync-state-insert-payload\.js/));
test('02 helper called once',()=>assert.equal((taskSource.match(/\bbuildGoogleCalendarCreateSyncStateInsertPayload\s*\(/g)||[]).length,1));
test('03 helper after POST gate',()=>assert.ok(taskSource.indexOf('buildGoogleCalendarCreateSyncStateInsertPayload({')>taskSource.indexOf("if (req.method !== 'POST')")));
test('04 helper before INSERT',()=>assert.ok(taskSource.indexOf('buildGoogleCalendarCreateSyncStateInsertPayload({')<taskSource.indexOf("insertWithVariants(['work_items'], [payload])")));
test('05 scheduledAt gets pending',async()=>assert.equal((await post({title:'T',scheduledAt:'2026-07-13T10:00:00+02:00'})).capture.inserts[0].rows[0].google_calendar_sync_status,'pending'));
test('06 date gets pending',async()=>assert.equal((await post({title:'T',date:'2026-07-13'})).capture.inserts[0].rows[0].google_calendar_sync_status,'pending'));
test('07 scheduledAt normalized before decision',async()=>assert.equal((await post({title:'T',scheduledAt:'2026-07-13T10:00:00+02:00'})).capture.inserts[0].rows[0].scheduled_at,'2026-07-13T08:00:00.000Z'));
test('08 no time has no sync key',async()=>assert.equal('google_calendar_sync_status' in (await post({title:'T'})).capture.inserts[0].rows[0],false));
test('09 undated scheduled_at remains null',async()=>assert.equal((await post({title:'T'})).capture.inserts[0].rows[0].scheduled_at,null));
test('10 no owner has no sync key',async()=>assert.equal('google_calendar_sync_status' in (await post({title:'T',date:'2026-07-13'},'')).capture.inserts[0].rows[0],false));
for(const [n,status] of [['11','done'],['12','completed'],['13a','canceled'],['13b','cancelled']]) test(`${n} ${status} has no sync key`,async()=>assert.equal('google_calendar_sync_status' in (await post({title:'T',date:'2026-07-13',status})).capture.inserts[0].rows[0],false));
test('14 external_google_event has no sync key',async()=>assert.equal('google_calendar_sync_status' in (await post({title:'T',date:'2026-07-13',type:'external_google_event'})).capture.inserts[0].rows[0],false));
test('15 client sync status ignored',async()=>assert.equal((await post({title:'T',date:'2026-07-13',google_calendar_sync_status:'synced'})).capture.inserts[0].rows[0].google_calendar_sync_status,'pending'));
test('16 owner cannot be overwritten',async()=>assert.equal((await post({title:'T',date:'2026-07-13',created_by_user_id:'attacker'})).capture.inserts[0].rows[0].created_by_user_id,'user-1'));
test('17 record_type cannot be overwritten',async()=>assert.equal((await post({title:'T',record_type:'event'})).capture.inserts[0].rows[0].record_type,'task'));
test('18 googleCalendarEventId is null',()=>assert.match(taskSource,/googleCalendarEventId:\s*null/));
test('19 currentGoogleSyncStatus is null',()=>assert.match(taskSource,/currentGoogleSyncStatus:\s*null/));
test('20 final payload inserted once',async()=>assert.equal((await post({title:'T'})).capture.inserts.length,1));
test('21 no post insert sync status update',async()=>assert.equal((await post({title:'T'})).capture.updates.some(x=>x.table==='work_items'&&'google_calendar_sync_status' in x.payload),false));
test('22 Task POST no G9',async()=>assert.equal((await post({title:'T'})).capture.markerCalls,0));
test('23 Task PATCH keeps one G9',()=>assert.equal((taskSource.match(/markGoogleCalendarMutationSyncState\(\{/g)||[]).length,1));
test('24 Task DELETE unwired',()=>assert.doesNotMatch(taskSource.slice(taskSource.indexOf("if (req.method === 'DELETE')"),taskSource.indexOf("if (req.method !== 'POST')")),/buildGoogleCalendarCreateSyncStateInsertPayload/));
test('25 Event POST keeps helper',()=>assert.equal((eventSource.match(/\bbuildGoogleCalendarCreateSyncStateInsertPayload\s*\(/g)||[]).length,1));
test('26 Event PATCH keeps G9',()=>assert.equal((eventSource.match(/markGoogleCalendarMutationSyncState\(\{/g)||[]).length,1));
test('27 Event DELETE unwired',()=>assert.doesNotMatch(eventSource.slice(eventSource.indexOf("if (req.method === 'DELETE')"),eventSource.indexOf("if (req.method !== 'POST')")),/buildGoogleCalendarCreateSyncStateInsertPayload/));
test('28 lead next action remains',()=>assert.match(taskSource,/await syncLeadNextAction\(/));
test('29 missing_item does not promote',()=>assert.match(taskSource,/!isMissingItemTypeForLeadNextActionStage228R17/));
test('30 HTTP 200 remains',async()=>assert.equal((await post({title:'T'})).statusCode,200));
test('31 response keeps inserted id',async()=>assert.equal((await post({title:'T'})).responseBody.id,'task-1'));
test('32 no G15 artifact',()=>assert.equal(fs.readdirSync(path.join(root,'_project/runs')).some(x=>x.includes('G15')),false));