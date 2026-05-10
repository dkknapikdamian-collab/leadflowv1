const fs = require('fs');
const path = require('path');

const root = process.cwd();
const TARGETS = [
  'src/components/EventCreateDialog.tsx',
  'src/pages/Activity.tsx',
  'src/pages/AiDrafts.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/Clients.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/Leads.tsx',
  'src/pages/Login.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/Settings.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Templates.tsx',
  'src/pages/Today.tsx',
  'src/lib/reminders.ts',
].filter((rel) => fs.existsSync(path.join(root, rel)));
const REACT = new Set(['useEffect','useMemo','useState','useRef','useCallback','useLayoutEffect','FormEvent','ChangeEvent','MouseEvent','KeyboardEvent','FocusEvent','ReactNode','ComponentType','HTMLAttributes','CSSProperties','ComponentProps','ComponentPropsWithoutRef']);
const ROUTER = new Set(['Link','NavLink','Navigate','useNavigate','useParams','useSearchParams','useLocation']);
const GLOBAL = new Set(['consumeGlobalQuickAction','subscribeGlobalQuickAction','publishGlobalQuickAction']);
const UI = new Set(['EntityIcon','ClientEntityIcon','LeadEntityIcon','CaseEntityIcon','TaskEntityIcon','EventEntityIcon','ActivityEntityIcon','PaymentEntityIcon','CommissionEntityIcon','AiEntityIcon','TemplateEntityIcon','NotificationEntityIcon','OperatorMetricTiles','OperatorMetricTile','OperatorMetricTileItem','OperatorMetricTone']);
const LUCIDE = new Set(['AlertCircle','AlertTriangle','ArrowLeft','ArrowRight','Building2','CalendarClock','CalendarDays','Check','CheckCircle','CheckCircle2','CheckSquare','ChevronDown','ChevronLeft','ChevronRight','ChevronUp','Clipboard','Clock','Copy','Database','ExternalLink','Filter','History','KeyRound','Link2','ListChecks','Loader2','LockKeyhole','LogOut','Mail','MessageSquare','MonitorCog','Paperclip','Pencil','Plus','RefreshCw','Repeat','Save','Search','Send','Shield','SlidersHorizontal','Smartphone','StickyNote','Trash2','User','Users','WalletCards','X']);
const LOCAL_COMPONENT_NAMES = new Set(['Calendar','Activity','Settings','Clients','Tasks','Today','Login','Templates']);
function split(raw){return raw.split(',').map(x=>x.trim()).filter(Boolean)}
function parse(raw, importType){let x=raw.trim(); if(x.startsWith('type ')) x=x.slice(5).trim(); const p=x.split(/\s+as\s+/i).map(y=>y.trim()).filter(Boolean); return {imported:p[0]||'', local:p[1]||p[0]||''};}
function target(name){ if(REACT.has(name)) return 'react'; if(ROUTER.has(name)) return 'react-router-dom'; if(GLOBAL.has(name)) return '../components/GlobalQuickActions'; if(UI.has(name)) return '../components/ui-system'; if(LUCIDE.has(name) && !LOCAL_COMPONENT_NAMES.has(name)) return 'lucide-react'; return null; }
const failures=[];
let pass=0;
for(const rel of TARGETS){
  const text=fs.readFileSync(path.join(root,rel),'utf8');
  const imports=[]; const re=/import\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+['"]([^'"]+)['"];?/g; let m;
  while((m=re.exec(text))){ for(const raw of split(m[2])){ const s=parse(raw,!!m[1]); imports.push({module:m[3], local:s.local}); }}
  const seen=new Map();
  for(const item of imports){ const expected=target(item.local); if(!expected) continue; if(item.module!==expected){ failures.push(`${rel}: ${item.local} imported from ${item.module}, expected ${expected}`); continue; } if(seen.has(item.local)&&seen.get(item.local)!==item.module) failures.push(`${rel}: duplicate ${item.local} from ${seen.get(item.local)}, ${item.module}`); seen.set(item.local,item.module); }
  if(/const\s+(?:EntityIcon|[A-Z][A-Za-z]*EntityIcon)\s*=\s*\([^;]*?EntityIcon\s+entity=/s.test(text)) failures.push(`${rel}: local EntityIcon alias remains`);
  pass++;
}
if(!fs.readFileSync(path.join(root,'src/components/ui-system/OperatorMetricTiles.tsx'),'utf8').includes("export type { OperatorMetricTone } from './operator-metric-tone-contract';")) failures.push('OperatorMetricTiles: missing OperatorMetricTone re-export');
if(failures.length){ console.log('FAIL CLOSEFLOW_FIN5_IMPORT_BOUNDARIES_FINAL_FAILED'); for(const f of failures) console.log('FAIL '+f); process.exit(1); }
console.log(`CLOSEFLOW_FIN5_IMPORT_BOUNDARIES_FINAL_OK files=${pass}`);
