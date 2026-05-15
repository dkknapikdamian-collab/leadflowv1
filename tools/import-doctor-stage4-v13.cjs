#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const mode = process.argv.includes('--check') ? 'check' : 'fix';
const writeEnabled = mode === 'fix';

function readText(file) {
  let text = fs.readFileSync(file, 'utf8');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.replace(/\r\n/g, '\n'), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function listFiles(startRel, predicate = () => true) {
  const start = path.join(root, startRel);
  if (!fs.existsSync(start)) return [];
  const out = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (predicate(full)) out.push(full);
    }
  };
  walk(start);
  return out;
}

function staleTokens() {
  return [
    ['Leady do ', 'spi', 'ęcia'].join(''),
    ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
    ['data-clients-lead-', 'attention-rail'].join(''),
    ['clients-lead-', 'attention-card'].join(''),
    ['lead', '-attention'].join(''),
    ['leadsNeedingClient', 'OrCaseLink'].join(''),
    ['STAGE74_CLIENTS_LEADS_TO_LINK_', 'EMPTY_COPY'].join(''),
    ['STALE_CLIENTS_LEAD_LINKING_', 'COPY_REMOVED'].join(''),
  ];
}

const textFileRe = /\.(ts|tsx|js|jsx|cjs|mjs|css|json|md)$/i;
const sourceFileRe = /\.(ts|tsx|js|jsx)$/i;
const operatorRailAllowed = new Set(['OperatorSideCard', 'SimpleFiltersCard', 'TopValueRecordsCard']);

const leadsHeader = `// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
// CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP
// STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent
} from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronRight,
  Clock3,
  Filter,
  Loader2,
  Mail,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  TrendingUp
} from 'lucide-react';
import {
  CaseEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  TemplateEntityIcon
} from '../components/ui-system';
import { consumeGlobalQuickAction, subscribeGlobalQuickAction } from '../components/GlobalQuickActions';
import { actionIconClass, modalFooterClass } from '../components/entity-actions';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { SimpleFiltersCard, TopValueRecordsCard } from '../components/operator-rail';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchTasksFromSupabase,
  findEntityConflictsInSupabase,
  insertLeadToSupabase,
  isSupabaseConfigured,
  updateClientInSupabase,
  updateLeadInSupabase
} from '../lib/supabase-fallback';
import { format, isPast, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import { useWorkspace } from '../hooks/useWorkspace';
import { isActiveSalesLead, isLeadMovedToService } from '../lib/lead-health';
import { getNearestPlannedAction } from '../lib/nearest-action';
import { buildRelationFunnelValue, buildRelationValueEntries, formatRelationValue } from '../lib/relation-value';
import '../styles/visual-stage20-lead-form-vnext.css';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-record-list-source-truth.css';
import '../styles/closeflow-leads-right-rail-layout-lock.css';
`;

const clientsHeader = `// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER
import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Trash2
} from 'lucide-react';
import {
  CaseEntityIcon,
  EntityIcon,
  LeadEntityIcon,
  PaymentEntityIcon
} from '../components/ui-system';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import {
  EntityConflictDialog,
  type EntityConflictCandidate
} from '../components/EntityConflictDialog';
import { actionIconClass, modalFooterClass } from '../components/entity-actions';
import { StatShortcutCard } from '../components/StatShortcutCard';
import { OperatorSideCard, SimpleFiltersCard, TopValueRecordsCard } from '../components/operator-rail';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useWorkspace } from '../hooks/useWorkspace';
import { requireWorkspaceId } from '../lib/workspace-context';
import {
  createClientInSupabase,
  findEntityConflictsInSupabase,
  fetchCasesFromSupabase,
  fetchClientsFromSupabase,
  fetchEventsFromSupabase,
  fetchLeadsFromSupabase,
  fetchPaymentsFromSupabase,
  fetchTasksFromSupabase,
  updateClientInSupabase,
  updateLeadInSupabase
} from '../lib/supabase-fallback';
import { getNearestPlannedAction } from '../lib/work-items/planned-actions';
import { buildTopClientValueEntries } from '../lib/client-value';
import { CloseFlowPageHeaderV2 } from '../components/CloseFlowPageHeaderV2';
import '../styles/visual-stage23-client-case-forms-vnext.css';
import '../styles/clients-next-action-layout.css';
import '../styles/closeflow-page-header-v2.css';
import '../styles/closeflow-record-list-source-truth.css';
`;

function firstIndex(text, needles) {
  const indexes = needles.map((needle) => text.indexOf(needle)).filter((idx) => idx >= 0);
  return indexes.length ? Math.min(...indexes) : -1;
}

function replaceHeaderByAnchor(rel, header, anchors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  const text = readText(file);
  const idx = firstIndex(text, anchors);
  assert.ok(idx >= 0, `${rel}: cannot locate body anchor. Refusing blind rewrite.`);
  const body = text.slice(idx).replace(/^\s+/, '');
  const next = header.trimEnd() + '\n\n' + body;
  if (writeEnabled && next !== text) writeText(file, next);
}

function ensureClientsTopValueBlock() {
  const rel = 'src/pages/Clients.tsx';
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  let text = readText(file);
  if (!text.includes('TopValueRecordsCard')) {
    throw new Error(`${rel}: missing TopValueRecordsCard after header normalization.`);
  }
  // If previous stage used helper naming, preserve it. If the card is missing, insert a safe card after SimpleFiltersCard block.
  if (!text.includes('clients-top-value-records-card')) {
    const railMarker = /(<SimpleFiltersCard[\s\S]*?\/>)\s*/;
    const match = text.match(railMarker);
    assert.ok(match, `${rel}: cannot find SimpleFiltersCard to place top value card.`);
    const helperName = text.includes('mostValuableClients') ? 'mostValuableClients' : 'buildTopClientValueEntries({ clients, clientValueByClientId })';
    const card = `\n\n              <TopValueRecordsCard\n                title="Najcenniejsi klienci"\n                description="5 klientów z największą wartością."\n                dataTestId="clients-top-value-records-card"\n                items={(${helperName}).map(({ client, value }: any) => ({\n                  key: client.id,\n                  href: \`/clients/\${client.id}\`,\n                  label: client.name || 'Klient',\n                  valueLabel: formatClientMoney(value),\n                  description: client.company || client.email || client.phone || 'Klient',\n                  title: \`${client.name || 'Klient'} - ${'${formatClientMoney(value)}'}\`,\n                }))}\n              />`;
    text = text.replace(railMarker, match[1] + card + '\n');
    if (writeEnabled) writeText(file, text);
  }
}

function normalizeTargetPages() {
  replaceHeaderByAnchor('src/pages/Leads.tsx', leadsHeader, [
    'const STAGE_PANEL_DELETE_LEADS_TRASH_EMPTY_GUARD',
    'const STATUS_OPTIONS',
    'type LeadStatusTone',
    'export default function Leads',
  ]);
  replaceHeaderByAnchor('src/pages/Clients.tsx', clientsHeader, [
    'const CLIENT_CASE_FORMS_VISUAL_REBUILD_STAGE23_CLIENTS',
    'type ClientRecord',
    'export default function Clients',
  ]);
  ensureClientsTopValueBlock();
}

function guardFileText() {
  return `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function tokens(){return [
  ['Leady do ', 'spi', 'ęcia'].join(''),
  ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
  ['data-clients-lead-', 'attention-rail'].join(''),
  ['clients-lead-', 'attention-card'].join(''),
  ['lead', '-attention'].join(''),
  ['leadsNeedingClient', 'OrCaseLink'].join(''),
  ['STAGE74_CLIENTS_LEADS_TO_LINK_', 'EMPTY_COPY'].join(''),
  ['STALE_CLIENTS_LEAD_LINKING_', 'COPY_REMOVED'].join(''),
];}
function walk(dir,out=[]){if(!fs.existsSync(dir))return out;for(const name of fs.readdirSync(dir)){if(['node_modules','dist','.git'].includes(name))continue;const full=path.join(dir,name);const st=fs.statSync(full);if(st.isDirectory())walk(full,out);else if(/\\.(ts|tsx|js|jsx|cjs|mjs|css|json)$/.test(name))out.push(full);}return out;}
function scan(){const bad=[];for(const area of ['src','tests','scripts']){for(const file of walk(path.join(root,area))){const body=fs.readFileSync(file,'utf8');for(const token of tokens()){if(body.includes(token))bad.push(path.relative(root,file)+' :: '+token);}}}return bad;}
test('legacy clients lead-linking rail markers stay removed',()=>{assert.equal(scan().length,0,scan().join('\\n'));});
`;
}

function stage81Text() {
  return `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function tokens(){return [
  ['Leady do ', 'spi', 'ęcia'].join(''),
  ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
  ['data-clients-lead-', 'attention-rail'].join(''),
  ['clients-lead-', 'attention-card'].join(''),
  ['leadsNeedingClient', 'OrCaseLink'].join(''),
  ['STAGE74_CLIENTS_LEADS_TO_LINK_', 'EMPTY_COPY'].join(''),
];}
test('stage81 /clients renders top value clients card instead of legacy lead-linking rail',()=>{
  const src=fs.readFileSync(path.join(root,'src/pages/Clients.tsx'),'utf8');
  assert.match(src,/TopValueRecordsCard/,'Clients.tsx must render TopValueRecordsCard.');
  assert.match(src,/Najcenniejsi klienci/,'Clients.tsx must render top value clients title.');
  assert.match(src,/clients-top-value-records-card/,'Clients.tsx must expose top value card test id.');
  assert.ok(src.includes('mostValuableClients')||src.includes('buildTopClientValueEntries'),'Clients.tsx must compute top value clients entries.');
  for(const token of tokens()) assert.equal(src.includes(token),false,'Clients.tsx still contains stale token: '+token);
});
`;
}

function stage83Text() {
  return `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function tokens(){return [
  ['Leady do ', 'spi', 'ęcia'].join(''),
  ['Brak klienta albo sprawy przy aktywnym ', 'temacie'].join(''),
  ['data-clients-lead-', 'attention-rail'].join(''),
  ['clients-lead-', 'attention-card'].join(''),
  ['lead', '-attention'].join(''),
  ['leadsNeedingClient', 'OrCaseLink'].join(''),
  ['STAGE74_CLIENTS_LEADS_TO_LINK_', 'EMPTY_COPY'].join(''),
  ['STALE_CLIENTS_LEAD_LINKING_', 'COPY_REMOVED'].join(''),
];}
function walk(dir,out=[]){if(!fs.existsSync(dir))return out;for(const name of fs.readdirSync(dir)){if(['node_modules','dist','.git'].includes(name))continue;const full=path.join(dir,name);const st=fs.statSync(full);if(st.isDirectory())walk(full,out);else if(/\\.(ts|tsx|js|jsx|cjs|mjs|css|json)$/.test(name))out.push(full);}return out;}
test('old clients lead-linking rail copy and attributes are not present in active source, guards or scripts',()=>{
  const offenders=[];
  for(const area of ['src','tests','scripts']) for(const file of walk(path.join(root,area))){const body=fs.readFileSync(file,'utf8'); if(tokens().some((t)=>body.includes(t))) offenders.push(path.relative(root,file));}
  assert.deepEqual([...new Set(offenders)],[]);
});
`;
}

function stage84Text() {
  return `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const allowed = new Set(['OperatorSideCard','SimpleFiltersCard','TopValueRecordsCard']);
function walk(dir,out=[]){if(!fs.existsSync(dir))return out;for(const name of fs.readdirSync(dir)){if(['node_modules','dist','.git'].includes(name))continue;const full=path.join(dir,name);const st=fs.statSync(full);if(st.isDirectory())walk(full,out);else if(/\\.(ts|tsx|js|jsx)$/.test(name))out.push(full);}return out;}
function importsFromOperatorRail(body){const matches=[];const re=/import\\s+([\\s\\S]*?)\\s+from\\s+['\"]([^'\"]*components\\/operator-rail|[^'\"]*components\\/operator-rail\\/index)['\"]\\s*;/g;let m;while((m=re.exec(body))){matches.push(m[1]);}return matches;}
function named(spec){const inner=(spec.match(/\\{([\\s\\S]*?)\\}/)||[])[1]||'';return inner.split(',').map((s)=>s.trim().replace(/^type\\s+/, '').split(/\\s+as\\s+/)[0].trim()).filter(Boolean);}
test('operator-rail imports only rail components and import headers are not smashed',()=>{
  const bad=[];
  for(const file of walk(path.join(root,'src'))){const rel=path.relative(root,file);const body=fs.readFileSync(file,'utf8');if(body.includes('; import ')) bad.push(rel+' :: smashed semicolon import');for(const spec of importsFromOperatorRail(body)){for(const n of named(spec)){if(!allowed.has(n)) bad.push(rel+' :: non-rail import '+n);}}}
  assert.deepEqual(bad,[]);
});
`;
}

function writeGuards() {
  const files = {
    'tests/stage79-clients-no-lead-attention-rail.test.cjs': guardFileText(),
    'tests/stage81-clients-top-value-records-card.test.cjs': stage81Text(),
    'tests/stage83-right-rail-stale-cleanup.test.cjs': stage83Text(),
    'tests/stage84-import-doctor-right-rail.test.cjs': stage84Text(),
  };
  for (const [rel, body] of Object.entries(files)) {
    if (writeEnabled) writeText(path.join(root, rel), body);
  }
}

function rewriteCompatScript(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  const body = `#!/usr/bin/env node
const fs=require('fs');const path=require('path');const root=process.cwd();
function tokens(){return [['Leady do ','spi','ęcia'].join(''),['data-clients-lead-','attention-rail'].join(''),['clients-lead-','attention-card'].join(''),['leadsNeedingClient','OrCaseLink'].join('')];}
function read(rel){return fs.existsSync(path.join(root,rel))?fs.readFileSync(path.join(root,rel),'utf8'):'';}
const checked=['src/pages/Clients.tsx','src/pages/Leads.tsx'];const bad=[];for(const rel of checked){const src=read(rel);for(const t of tokens()) if(src.includes(t)) bad.push(rel+' :: '+t);}if(bad.length){console.error(bad.join('\\n'));process.exit(1);}console.log('OK: legacy clients lead-linking rail compatibility guard passed.');
`;
  if (writeEnabled) writeText(file, body);
}

function writeCompatScripts() {
  [
    'scripts/check-stage74-clients-leads-to-link-panel.cjs',
    'scripts/check-clients-attention-rail-visual-stage72.cjs',
    'scripts/check-clients-leads-only-attention-stage71.cjs',
  ].forEach(rewriteCompatScript);
}

function updatePackageJson() {
  const rel = 'package.json';
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  const raw = readText(file);
  const pkg = JSON.parse(raw);
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:stage84-import-doctor-right-rail'] = 'node --test tests/stage84-import-doctor-right-rail.test.cjs';
  const next = JSON.stringify(pkg, null, 2) + '\n';
  if (writeEnabled && next !== raw) writeText(file, next);
}

function scanStaleTokens() {
  const bad = [];
  for (const area of ['src', 'tests', 'scripts']) {
    for (const file of listFiles(area, (f) => textFileRe.test(f))) {
      const body = readText(file);
      for (const token of staleTokens()) {
        if (body.includes(token)) bad.push(`${path.relative(root, file)} :: ${token}`);
      }
    }
  }
  return bad;
}

function scanOperatorRailImports() {
  const bad = [];
  const importRe = /import\s+([\s\S]*?)\s+from\s+['\"]([^'\"]*components\/operator-rail|[^'\"]*components\/operator-rail\/index)['\"]\s*;/g;
  for (const file of listFiles('src', (f) => sourceFileRe.test(f))) {
    const body = readText(file);
    const rel = path.relative(root, file);
    if (body.includes('; import ')) bad.push(`${rel} :: smashed semicolon import`);
    let m;
    while ((m = importRe.exec(body))) {
      const named = (m[1].match(/\{([\s\S]*?)\}/) || [])[1] || '';
      for (const raw of named.split(',')) {
        const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (!name) continue;
        if (!operatorRailAllowed.has(name)) bad.push(`${rel} :: non-rail import ${name}`);
      }
    }
  }
  return bad;
}

function validateExpectedUi() {
  const bad = [];
  const clients = exists('src/pages/Clients.tsx') ? readText(path.join(root, 'src/pages/Clients.tsx')) : '';
  const leads = exists('src/pages/Leads.tsx') ? readText(path.join(root, 'src/pages/Leads.tsx')) : '';
  if (clients) {
    if (!clients.includes('TopValueRecordsCard')) bad.push('Clients.tsx missing TopValueRecordsCard');
    if (!clients.includes('Najcenniejsi klienci')) bad.push('Clients.tsx missing Najcenniejsi klienci');
    if (!clients.includes('clients-top-value-records-card')) bad.push('Clients.tsx missing clients-top-value-records-card');
    if (!(clients.includes('buildTopClientValueEntries') || clients.includes('mostValuableClients'))) bad.push('Clients.tsx missing top value entries computation');
  }
  if (leads) {
    if (!leads.includes('SimpleFiltersCard')) bad.push('Leads.tsx missing SimpleFiltersCard');
    if (!leads.includes('Najcenniejsze leady')) bad.push('Leads.tsx missing Najcenniejsze leady');
    if (!leads.includes('leads-simple-filters-card')) bad.push('Leads.tsx missing leads-simple-filters-card');
  }
  return bad;
}

function main() {
  if (writeEnabled) {
    normalizeTargetPages();
    writeGuards();
    writeCompatScripts();
    updatePackageJson();
    fs.mkdirSync(path.join(root, 'docs/audits'), { recursive: true });
    writeText(path.join(root, 'docs/audits/right-rail-import-doctor-stage4-v13-2026-05-15.md'), [
      '# Right rail Import Doctor Stage 4 V13',
      '',
      '- Rebuilt import headers for Leads.tsx and Clients.tsx from trusted module ownership.',
      '- Kept guards active instead of deleting tests.',
      '- Stale clients lead-linking rail markers are scanned without keeping exact forbidden strings inside guards.',
      '- package.json is parsed with UTF-8 BOM stripped before JSON.parse.',
      '- No commit or push is performed by this package.',
      '',
    ].join('\n'));
  }
  const failures = [
    ...scanStaleTokens(),
    ...scanOperatorRailImports(),
    ...validateExpectedUi(),
  ];
  if (failures.length) {
    console.error('Import Doctor V13 found blocking issues:');
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log(writeEnabled ? 'OK: Import Doctor V13 fixed import headers, guards and stale right-rail markers.' : 'OK: Import Doctor V13 check passed.');
}

main();
