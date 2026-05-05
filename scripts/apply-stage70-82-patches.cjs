const fs = require('fs');
const path = require('path');

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const todayPath = path.join(root, 'src', 'pages', 'TodayStable.tsx');
const pkgPath = path.join(root, 'package.json');
const gitignorePath = path.join(root, '.gitignore');

function fail(message) {
  console.error('FAIL APPLY_STAGE70_82_PATCHES: ' + message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('Missing file: ' + path.relative(root, file));
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

function write(file, value) {
  fs.writeFileSync(file, value.replace(/\r\n/g, '\n'), 'utf8');
}

function replaceOnce(text, needle, replacement, label) {
  if (!text.includes(needle)) fail('Patch point not found: ' + label);
  return text.replace(needle, replacement);
}

let today = read(todayPath);

function ensureLucideIcon(iconName, anchorLine) {
  const importStart = today.indexOf("import {\n  ArrowRight,");
  if (today.includes('  ' + iconName + ',')) return;
  if (!today.includes(anchorLine)) fail('Missing lucide anchor for ' + iconName + ': ' + anchorLine);
  today = today.replace(anchorLine, anchorLine + '\n  ' + iconName + ',');
}

ensureLucideIcon('AlertTriangle', 'import {\n  ArrowRight,');
ensureLucideIcon('Clock', '  CheckSquare,');
ensureLucideIcon('Target', '  RefreshCcw,');

if (!today.includes('STAGE70_TODAY_DECISION_ENGINE_STARTER')) {
  const helperNeedle = `function getTaskTitle(task: any) {\n`;
  const helperReplacement = `const STAGE70_TODAY_DECISION_ENGINE_STARTER = 'STAGE70_TODAY_DECISION_ENGINE_STARTER';\nvoid STAGE70_TODAY_DECISION_ENGINE_STARTER;\n\nfunction parseMoneyValue(value: unknown) {\n  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;\n  if (typeof value !== 'string') return 0;\n  const normalized = value\n    .replace(/\\s+/g, '')\n    .replace(/pln/gi, '')\n    .replace(/zł/gi, '')\n    .replace(',', '.')\n    .replace(/[^0-9.-]/g, '');\n  const parsed = Number(normalized);\n  return Number.isFinite(parsed) ? parsed : 0;\n}\n\nfunction getLeadValue(lead: any) {\n  const keys = ['dealValue', 'deal_value', 'estimatedValue', 'estimated_value', 'potentialValue', 'potential_value', 'value', 'budget', 'amount'];\n  for (const key of keys) {\n    const amount = parseMoneyValue(lead?.[key]);\n    if (amount > 0) return amount;\n  }\n  return 0;\n}\n\nfunction formatLeadValue(lead: any) {\n  const amount = getLeadValue(lead);\n  return amount > 0 ? amount.toLocaleString('pl-PL') + ' PLN' : 'Brak wartości';\n}\n\nfunction getLeadFreshnessDays(lead: any) {\n  const raw = readMomentRaw(lead, ['lastContactAt', 'last_contact_at', 'lastActivityAt', 'last_activity_at', 'updatedAt', 'updated_at', 'createdAt', 'created_at']);\n  if (!raw) return null;\n  const parsed = new Date(raw);\n  const time = parsed.getTime();\n  if (!Number.isFinite(time)) return null;\n  return Math.max(0, Math.floor((Date.now() - time) / 86_400_000));\n}\n\nfunction getLeadRiskReason(lead: any, momentRaw: string, todayKey: string) {\n  const dateKey = getDateKey(momentRaw);\n  if (!dateKey) return 'Brak następnego kroku';\n  if (dateKey < todayKey) return 'Zaległy follow-up';\n  if (getLeadValue(lead) > 0) return 'Wartościowy lead do ruchu';\n  return 'Do ruchu dziś';\n}\n\nfunction getTaskTitle(task: any) {\n`;
  today = replaceOnce(today, helperNeedle, helperReplacement, 'Stage70 helper insertion');

  const memoNeedle = `  const pendingDrafts = useMemo(() => {\n    return data.drafts.filter((draft: any) => String(draft?.status || '').toLowerCase() === 'draft');\n  }, [data.drafts]);\n\n  const loading = status === 'loading' || status === 'idle';\n`;
  const memoReplacement = `  const pendingDrafts = useMemo(() => {\n    return data.drafts.filter((draft: any) => String(draft?.status || '').toLowerCase() === 'draft');\n  }, [data.drafts]);\n\n  const noActionLeads = useMemo(() => {\n    return operatorLeads.filter(({ momentRaw }) => !momentRaw).slice(0, 6);\n  }, [operatorLeads]);\n\n  const highValueAtRiskRows = useMemo(() => {\n    return operatorLeads\n      .filter(({ lead, momentRaw }) => {\n        const value = getLeadValue(lead);\n        const dateKey = getDateKey(momentRaw);\n        return value > 0 && (!dateKey || dateKey < todayKey);\n      })\n      .sort((a, b) => getLeadValue(b.lead) - getLeadValue(a.lead))\n      .slice(0, 6);\n  }, [operatorLeads, todayKey]);\n\n  const waitingLeadRows = useMemo(() => {\n    return operatorLeads\n      .map((entry) => ({ ...entry, freshnessDays: getLeadFreshnessDays(entry.lead) }))\n      .filter((entry) => entry.freshnessDays !== null && entry.freshnessDays >= 3)\n      .sort((a, b) => Number(b.freshnessDays || 0) - Number(a.freshnessDays || 0))\n      .slice(0, 6);\n  }, [operatorLeads]);\n\n  const loading = status === 'loading' || status === 'idle';\n`;
  today = replaceOnce(today, memoNeedle, memoReplacement, 'Stage70 memos insertion');

  const statNeedle = `          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Szkice AI</p><p className="mt-2 text-3xl font-black text-amber-700">{pendingDrafts.length}</p></CardContent></Card>\n        </section>\n`;
  const statReplacement = `          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Szkice AI</p><p className="mt-2 text-3xl font-black text-amber-700">{pendingDrafts.length}</p></CardContent></Card>\n          <Card className="border-slate-100" data-stage70-today-decision-engine-starter="true"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Bez następnego kroku</p><p className="mt-2 text-3xl font-black text-slate-800">{noActionLeads.length}</p></CardContent></Card>\n          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Wartość / ryzyko</p><p className="mt-2 text-3xl font-black text-rose-700">{highValueAtRiskRows.length}</p></CardContent></Card>\n          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Waiting 3+ dni</p><p className="mt-2 text-3xl font-black text-orange-700">{waitingLeadRows.length}</p></CardContent></Card>\n        </section>\n`;
  today = replaceOnce(today, statNeedle, statReplacement, 'Stage70 stat cards insertion');

  const sectionNeedle = `          </StableCard>\n        </section>\n\n        {loading ? (\n`;
  const sectionReplacement = `          </StableCard>\n\n          <StableCard>\n            <SectionHeader title="Leady bez następnego kroku" count={noActionLeads.length} icon={<AlertTriangle className="h-5 w-5" />} tone="bg-slate-100 text-slate-700" />\n            {noActionLeads.length ? noActionLeads.map(({ lead, momentRaw }) => (\n              <RowLink\n                key={'stage70-no-action-' + String(lead.id || getLeadTitle(lead))}\n                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}\n                title={getLeadTitle(lead)}\n                helper="Ten lead nie ma zaplanowanego następnego ruchu."\n                meta={formatLeadValue(lead)}\n                badge="Ustal krok"\n              />\n            )) : <EmptyState text="Każdy aktywny lead ma zaplanowany kolejny krok." />}\n          </StableCard>\n\n          <StableCard>\n            <SectionHeader title="Wysoka wartość / ryzyko" count={highValueAtRiskRows.length} icon={<Target className="h-5 w-5" />} tone="bg-rose-50 text-rose-700" />\n            {highValueAtRiskRows.length ? highValueAtRiskRows.map(({ lead, momentRaw }) => (\n              <RowLink\n                key={'stage70-value-risk-' + String(lead.id || getLeadTitle(lead))}\n                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}\n                title={getLeadTitle(lead)}\n                helper={getLeadRiskReason(lead, momentRaw, todayKey)}\n                meta={formatLeadValue(lead)}\n                badge="Ryzyko"\n              />\n            )) : <EmptyState text="Brak wartościowych leadów z zaległym albo pustym następnym krokiem." />}\n          </StableCard>\n\n          <StableCard>\n            <SectionHeader title="Waiting za długo" count={waitingLeadRows.length} icon={<Clock className="h-5 w-5" />} tone="bg-orange-50 text-orange-700" />\n            {waitingLeadRows.length ? waitingLeadRows.map(({ lead, momentRaw, freshnessDays }) => (\n              <RowLink\n                key={'stage70-waiting-' + String(lead.id || getLeadTitle(lead))}\n                to={lead.id ? '/leads/' + String(lead.id) : '/leads'}\n                title={getLeadTitle(lead)}\n                helper={'Brak świeżego ruchu od ' + String(freshnessDays) + ' dni'}\n                meta={momentRaw ? formatDateTime(momentRaw) : 'Ustal następny krok'}\n                badge="Sprawdź"\n              />\n            )) : <EmptyState text="Brak leadów czekających 3+ dni w aktywnym widoku Dziś." />}\n          </StableCard>\n        </section>\n\n        {loading ? (\n`;
  const idx = today.lastIndexOf(sectionNeedle);
  if (idx < 0) fail('Patch point not found: Stage70 decision sections insertion');
  today = today.slice(0, idx) + sectionReplacement + today.slice(idx + sectionNeedle.length);
}

if (!today.includes('STAGE81_TODAY_RISK_REASON_NEXT_ACTION')) {
  const stage81Needle = `function getLeadRiskReason(lead: any, momentRaw: string, todayKey: string) {\n  const dateKey = getDateKey(momentRaw);\n  if (!dateKey) return 'Brak następnego kroku';\n  if (dateKey < todayKey) return 'Zaległy follow-up';\n  if (getLeadValue(lead) > 0) return 'Wartościowy lead do ruchu';\n  return 'Do ruchu dziś';\n}\n\n`;
  const stage81Replacement = stage81Needle + `const STAGE81_TODAY_RISK_REASON_NEXT_ACTION = 'STAGE81_TODAY_RISK_REASON_NEXT_ACTION';\nvoid STAGE81_TODAY_RISK_REASON_NEXT_ACTION;\n\ntype TodayLeadRisk = {\n  reason: string;\n  suggestedAction: string;\n  score: number;\n};\n\nfunction getStage81LeadRisk(lead: any, momentRaw: string, todayKey: string): TodayLeadRisk {\n  const dateKey = getDateKey(momentRaw);\n  const value = getLeadValue(lead);\n  const freshnessDays = getLeadFreshnessDays(lead);\n  const status = String(lead?.status || '').toLowerCase();\n\n  if (dateKey && dateKey < todayKey && value >= 10000) {\n    return { reason: 'zaległy follow-up przy wartościowym leadzie', suggestedAction: 'skontaktuj się dziś albo ustaw konkretny nowy termin', score: 100 };\n  }\n  if (!dateKey && value >= 10000) {\n    return { reason: 'wysoka wartość i brak następnego kroku', suggestedAction: 'otwórz leada i ustaw follow-up z terminem', score: 90 };\n  }\n  if (dateKey && dateKey < todayKey) {\n    return { reason: 'zaległy follow-up', suggestedAction: 'odrób zaległość albo zamknij temat jako utracony', score: 80 };\n  }\n  if (!dateKey) {\n    return { reason: 'brak następnego kroku', suggestedAction: 'ustaw follow-up albo zamknij temat jako utracony', score: 70 };\n  }\n  if (status === 'waiting_response' && freshnessDays !== null && freshnessDays >= 3) {\n    return { reason: 'lead czeka na odpowiedź ' + String(freshnessDays) + ' dni', suggestedAction: 'wyślij krótkie przypomnienie albo zmień status', score: 65 };\n  }\n  if (value > 0) {\n    return { reason: 'wartościowy lead do ruchu', suggestedAction: 'dopilnuj kontaktu zgodnie z terminem', score: 55 };\n  }\n  return { reason: 'zaplanowany kontakt', suggestedAction: 'wykonaj zaplanowany ruch lub przełóż termin', score: 40 };\n}\n\n`;
  today = replaceOnce(today, stage81Needle, stage81Replacement, 'Stage81 helper insertion');

  today = today.replace(
    `                helper={momentRaw ? 'Zaległy lub dzisiejszy kontakt' : 'Brak następnego kroku'}\n                meta={momentRaw ? formatDateTime(momentRaw) : 'Ustal następny krok'}\n`,
    `                helper={'Powód: ' + getStage81LeadRisk(lead, momentRaw, todayKey).reason}\n                meta={'Ruch: ' + getStage81LeadRisk(lead, momentRaw, todayKey).suggestedAction}\n`
  );
  today = today.replace(
    `                helper="Ten lead nie ma zaplanowanego następnego ruchu."\n                meta={formatLeadValue(lead)}\n`,
    `                helper={'Powód: ' + getStage81LeadRisk(lead, momentRaw, todayKey).reason}\n                meta={'Ruch: ' + getStage81LeadRisk(lead, momentRaw, todayKey).suggestedAction}\n`
  );
  today = today.replace(
    `                helper={getLeadRiskReason(lead, momentRaw, todayKey)}\n                meta={formatLeadValue(lead)}\n`,
    `                helper={'Powód: ' + getStage81LeadRisk(lead, momentRaw, todayKey).reason}\n                meta={'Ruch: ' + getStage81LeadRisk(lead, momentRaw, todayKey).suggestedAction + ' · ' + formatLeadValue(lead)}\n`
  );
  today = today.replace(
    `                helper={'Brak świeżego ruchu od ' + String(freshnessDays) + ' dni'}\n                meta={momentRaw ? formatDateTime(momentRaw) : 'Ustal następny krok'}\n`,
    `                helper={'Powód: lead czeka bez świeżego ruchu od ' + String(freshnessDays) + ' dni'}\n                meta={'Ruch: wróć do kontaktu albo zamknij temat'}\n`
  );

  today = today.replace(
    `      .sort((a, b) => {\n        if (!a.momentRaw && b.momentRaw) return -1;\n        if (a.momentRaw && !b.momentRaw) return 1;\n        return parseTime(a.momentRaw) - parseTime(b.momentRaw);\n      });\n`,
    `      .sort((a, b) => {\n        const riskDiff = getStage81LeadRisk(b.lead, b.momentRaw, todayKey).score - getStage81LeadRisk(a.lead, a.momentRaw, todayKey).score;\n        if (riskDiff !== 0) return riskDiff;\n        if (!a.momentRaw && b.momentRaw) return -1;\n        if (a.momentRaw && !b.momentRaw) return 1;\n        return parseTime(a.momentRaw) - parseTime(b.momentRaw);\n      });\n`
  );
}

if (!today.includes('STAGE82_TODAY_NEXT_7_DAYS')) {
  const stage82Needle = `function getStage81LeadRisk(lead: any, momentRaw: string, todayKey: string): TodayLeadRisk {`;
  if (!today.includes(stage82Needle)) fail('Stage82 requires Stage81 helper');
  const stage82HelperInsertPoint = `function getTaskTitle(task: any) {\n`;
  const stage82Helpers = `const STAGE82_TODAY_NEXT_7_DAYS = 'STAGE82_TODAY_NEXT_7_DAYS';\nvoid STAGE82_TODAY_NEXT_7_DAYS;\n\nfunction addLocalDays(date: Date, amount: number) {\n  const next = new Date(date);\n  next.setDate(next.getDate() + amount);\n  return next;\n}\n\nfunction isDateKeyBetween(dateKey: string, fromKey: string, toKey: string) {\n  return Boolean(dateKey) && dateKey >= fromKey && dateKey <= toKey;\n}\n\nfunction getStage82UpcomingKindLabel(kind: 'lead' | 'task' | 'event') {\n  if (kind === 'task') return 'Zadanie';\n  if (kind === 'event') return 'Wydarzenie';\n  return 'Lead';\n}\n\n` + stage82HelperInsertPoint;
  today = replaceOnce(today, stage82HelperInsertPoint, stage82Helpers, 'Stage82 helper insertion');

  const stage82MemoNeedle = `  const loading = status === 'loading' || status === 'idle';\n`;
  const stage82Memo = `  const upcomingActionRows = useMemo(() => {\n    const fromKey = localDateKey(addLocalDays(new Date(), 1));\n    const toKey = localDateKey(addLocalDays(new Date(), 7));\n\n    const taskRows = data.tasks\n      .filter((task) => !isClosedStatus(task?.status))\n      .map((task) => ({\n        kind: 'task' as const,\n        title: getTaskTitle(task),\n        momentRaw: getTaskMomentRaw(task),\n        helper: 'Zadanie do wykonania w najbliższych dniach',\n        to: '/tasks',\n      }))\n      .filter((entry) => isDateKeyBetween(getDateKey(entry.momentRaw), fromKey, toKey));\n\n    const leadRows = data.leads\n      .filter((lead) => !isClosedLead(lead))\n      .map((lead) => ({\n        kind: 'lead' as const,\n        title: getLeadTitle(lead),\n        momentRaw: getLeadMomentRaw(lead),\n        helper: 'Zaplanowany ruch na leadzie',\n        to: lead.id ? '/leads/' + String(lead.id) : '/leads',\n      }))\n      .filter((entry) => isDateKeyBetween(getDateKey(entry.momentRaw), fromKey, toKey));\n\n    const eventRows = data.events\n      .filter((event) => !isClosedStatus(event?.status))\n      .map((event) => ({\n        kind: 'event' as const,\n        title: readText(event, ['title'], 'Wydarzenie'),\n        momentRaw: getEventMomentRaw(event),\n        helper: 'Wydarzenie w najbliższych dniach',\n        to: '/calendar',\n      }))\n      .filter((entry) => isDateKeyBetween(getDateKey(entry.momentRaw), fromKey, toKey));\n\n    return [...taskRows, ...leadRows, ...eventRows]\n      .sort(sortByMoment)\n      .slice(0, 8);\n  }, [data.events, data.leads, data.tasks]);\n\n  const loading = status === 'loading' || status === 'idle';\n`;
  today = replaceOnce(today, stage82MemoNeedle, stage82Memo, 'Stage82 upcoming memo insertion');

  const stage82StatAnchor = `          <Card className="border-slate-100"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Waiting 3+ dni</p><p className="mt-2 text-3xl font-black text-orange-700">{waitingLeadRows.length}</p></CardContent></Card>\n`;
  const stage82Stat = stage82StatAnchor + `          <Card className="border-slate-100" data-stage82-today-next-7-days="true"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Następne 7 dni</p><p className="mt-2 text-3xl font-black text-indigo-700">{upcomingActionRows.length}</p></CardContent></Card>\n`;
  today = replaceOnce(today, stage82StatAnchor, stage82Stat, 'Stage82 stat card insertion');

  const stage82SectionAnchor = `          <StableCard>\n            <SectionHeader title="Szkice do zatwierdzenia" count={pendingDrafts.length} icon={<FileText className="h-5 w-5" />} tone="bg-amber-50 text-amber-700" />`;
  const stage82Section = `          <StableCard>\n            <SectionHeader title="Następne 7 dni" count={upcomingActionRows.length} icon={<CalendarDays className="h-5 w-5" />} tone="bg-indigo-50 text-indigo-700" />\n            {upcomingActionRows.length ? upcomingActionRows.map((entry) => (\n              <RowLink\n                key={'stage82-upcoming-' + entry.kind + '-' + entry.title + '-' + entry.momentRaw}\n                to={entry.to}\n                title={entry.title}\n                helper={'Plan: ' + entry.helper}\n                meta={formatDateTime(entry.momentRaw)}\n                badge={getStage82UpcomingKindLabel(entry.kind)}\n              />\n            )) : <EmptyState text="Brak zaplanowanych akcji na kolejne 7 dni." />}\n          </StableCard>\n\n` + stage82SectionAnchor;
  today = replaceOnce(today, stage82SectionAnchor, stage82Section, 'Stage82 section insertion');
}

write(todayPath, today);

let gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8').replace(/\r\n/g, '\n') : '';
for (const line of ['.stage70-backup-*', '.stage*-backup-*', '.stage70-82-backup-*']) {
  if (!gitignore.split('\n').includes(line)) gitignore += (gitignore.endsWith('\n') || !gitignore ? '' : '\n') + line + '\n';
}
write(gitignorePath, gitignore);

const pkg = JSON.parse(read(pkgPath));
pkg.scripts = pkg.scripts || {};
const scripts = {
  'check:stage70-today-decision-engine-starter': 'node scripts/check-stage70-today-decision-engine-starter.cjs',
  'check:stage71-ai-draft-only-safety-guard': 'node scripts/check-stage71-ai-draft-only-safety-guard.cjs',
  'check:stage72-access-billing-plan-truth-guard': 'node scripts/check-stage72-access-billing-plan-truth-guard.cjs',
  'check:stage73-cumulative-package-guard': 'node scripts/check-stage73-cumulative-package-guard.cjs',
  'check:stage74-runtime-smoke-contract': 'node scripts/check-stage74-runtime-smoke-contract.cjs',
  'check:stage75-source-of-truth-guard': 'node scripts/check-stage75-source-of-truth-guard.cjs',
  'check:stage76-backup-hygiene-guard': 'node scripts/check-stage76-backup-hygiene-guard.cjs',
  'check:stage77-runtime-evidence-collector': 'node scripts/check-stage77-runtime-evidence-collector.cjs',
  'check:stage78-failure-snapshot-guard': 'node scripts/check-stage78-failure-snapshot-guard.cjs',
  'check:stage79-cumulative-manifest-guard': 'node scripts/check-stage79-cumulative-manifest-guard.cjs',
  'check:stage80-one-command-result-summary': 'node scripts/check-stage80-one-command-result-summary.cjs',
  'check:stage81-today-risk-reason-next-action': 'node scripts/check-stage81-today-risk-reason-next-action.cjs',
  'check:stage82-today-next-7-days': 'node scripts/check-stage82-today-next-7-days.cjs',
  'verify:stage70-82-cumulative': 'node scripts/verify-stage70-82-cumulative.cjs',
  'collect:stage77-runtime-evidence': 'node scripts/collect-stage77-runtime-evidence.cjs',
  'collect:stage78-failure-snapshot': 'node scripts/collect-stage78-failure-snapshot.cjs',
  'collect:stage80-one-command-result-summary': 'node scripts/collect-stage80-one-command-result-summary.cjs'
};
for (const [name, cmd] of Object.entries(scripts)) pkg.scripts[name] = cmd;
write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log('PASS APPLY_STAGE70_82_PATCHES');
