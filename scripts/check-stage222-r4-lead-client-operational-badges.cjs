const fs=require('node:fs'), path=require('node:path'); const root=path.resolve(__dirname,'..'); const read=f=>fs.readFileSync(path.join(root,f),'utf8'); const exists=f=>fs.existsSync(path.join(root,f)); function fail(m){console.error('STAGE222_R4_LEAD_CLIENT_OPERATIONAL_BADGES_FAIL: '+m); process.exit(1)}
for (const f of ['src/lib/record-operational-badges.ts','src/pages/Leads.tsx','src/pages/Clients.tsx']) if(!exists(f)) fail('missing '+f);
const helper=read('src/lib/record-operational-badges.ts'), leads=read('src/pages/Leads.tsx'), clients=read('src/pages/Clients.tsx'), pkg=JSON.parse(read('package.json'));
for (const t of ['buildRecordOperationalBadges','missing-contact','missing-next-step','silent-7','silent-14','brak kontaktu','brak akcji','7+ dni bez ruchu','14+ dni bez ruchu']) if(!helper.includes(t)) fail('helper missing '+t);
if(!leads.includes("import { buildRecordOperationalBadges } from '../lib/record-operational-badges';")) fail('Leads missing helper import');
if(!clients.includes("import { buildRecordOperationalBadges } from '../lib/record-operational-badges';")) fail('Clients missing helper import');
if(!leads.includes('data-stage222-r4-lead-operational-badge="true"')) fail('Leads missing badge marker');
if(!clients.includes('data-stage222-r4-client-operational-badge="true"')) fail('Clients missing badge marker');
if(!leads.includes('const operationalBadges = buildRecordOperationalBadges')) fail('Leads missing operational calculation');
if(!clients.includes('const operationalBadges = buildRecordOperationalBadges')) fail('Clients missing operational calculation');
if(!clients.includes('const operationalRecordsByClientId = useMemo')) fail('Clients missing related map');
if(!clients.includes('const nearestActionLabel = nearestActionByClientId.get(client.id)')) fail('Clients missing nearestActionLabel');
if(/stage222.*\.css/i.test(leads+clients)||exists('src/styles/closeflow-stage222-r4-operational-badges.css')) fail('one-off css detected');
if(clients.includes("Ostatni kontakt: {counters.payments > 0 ? 'jest' : 'brak'}")) fail('fake last-contact label still present');
if(pkg.scripts['check:stage222-r4-lead-client-operational-badges']!=='node scripts/check-stage222-r4-lead-client-operational-badges.cjs') fail('package missing check script');
if(pkg.scripts['test:stage222-r4-lead-client-operational-badges']!=='node --test tests/stage222-r4-lead-client-operational-badges.test.cjs') fail('package missing test script');
console.log('STAGE222_R4_LEAD_CLIENT_OPERATIONAL_BADGES: OK');
