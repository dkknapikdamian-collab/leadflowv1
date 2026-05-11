const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const contentPath = path.join(repo, 'src', 'lib', 'page-header-content.ts');
const cssPath = path.join(repo, 'src', 'styles', 'closeflow-page-header-card-source-truth.css');
const contentSource = "export type CloseFlowPageHeaderKey =\n  | 'today'\n  | 'leads'\n  | 'clients'\n  | 'cases'\n  | 'tasks'\n  | 'calendar'\n  | 'templates'\n  | 'responseTemplates'\n  | 'activity'\n  | 'aiDrafts'\n  | 'notifications'\n  | 'billing'\n  | 'support'\n  | 'settings'\n  | 'adminAi';\n\nexport type CloseFlowPageHeaderContent = {\n  kicker: string;\n  title: string;\n  description: string;\n};\n\nexport const PAGE_HEADER_CONTENT: Record<CloseFlowPageHeaderKey, CloseFlowPageHeaderContent> = {\n  today: {\n    kicker: 'CENTRUM DNIA',\n    title: 'Priorytety i najbli\u017csze ruchy',\n    description: 'Szybki przegl\u0105d tego, co wymaga reakcji teraz i co warto zaplanowa\u0107 dalej.',\n  },\n  leads: {\n    kicker: 'LISTA SPRZEDA\u017bOWA',\n    title: 'Leady',\n    description: 'Lista aktywnych temat\u00f3w sprzeda\u017cowych. Tu zapisujesz kontakty, pilnujesz warto\u015bci i szybko widzisz, kt\u00f3re leady wymagaj\u0105 ruchu.',\n  },\n  clients: {\n    kicker: 'BAZA RELACJI',\n    title: 'Klienci',\n    description: 'Baza os\u00f3b i firm w tle. Klient \u0142\u0105czy kontakt, leady, sprawy i histori\u0119 relacji.',\n  },\n  cases: {\n    kicker: 'CENTRUM OBS\u0141UGI',\n    title: 'Sprawy',\n    description: 'Tematy ju\u017c prowadzone operacyjnie. Tutaj pilnujesz obs\u0142ugi, blokad, checklist i kolejnych dzia\u0142a\u0144 po pozyskaniu klienta.',\n  },\n  tasks: {\n    kicker: 'ZADANIA',\n    title: 'Lista zada\u0144',\n    description: 'Konkretne rzeczy do wykonania. Zadania maj\u0105 pilnowa\u0107 ruchu, a nie le\u017ce\u0107 jako martwe notatki.',\n  },\n  calendar: {\n    kicker: 'TERMINY',\n    title: 'Kalendarz',\n    description: 'Tydzie\u0144, spotkania i deadline\u2019y w jednym miejscu. Terminy maj\u0105 by\u0107 widoczne bez szukania po modu\u0142ach.',\n  },\n  templates: {\n    kicker: 'SZABLONY SPRAW',\n    title: 'Szablony spraw i checklist',\n    description: 'Gotowe checklisty do powtarzalnych spraw. Szablon ma skr\u00f3ci\u0107 start obs\u0142ugi, nie zast\u0119powa\u0107 decyzji operatora.',\n  },\n  responseTemplates: {\n    kicker: 'ODPOWIEDZI',\n    title: 'Biblioteka odpowiedzi',\n    description: 'W\u0142asne gotowce do follow-up\u00f3w, przypomnie\u0144 i wiadomo\u015bci do klient\u00f3w. AI mo\u017ce p\u00f3\u017aniej pracowa\u0107 na tych szablonach, ale \u017ar\u00f3d\u0142em prawdy jest Twoja biblioteka.',\n  },\n  activity: {\n    kicker: 'AKTYWNO\u015a\u0106',\n    title: 'Aktywno\u015b\u0107',\n    description: 'Historia ruch\u00f3w w aplikacji. Tu sprawdzasz, co zosta\u0142o zrobione i gdzie co\u015b mog\u0142o wypa\u015b\u0107 z procesu.',\n  },\n  aiDrafts: {\n    kicker: 'SZKICE DO SPRAWDZENIA',\n    title: 'Szkice AI',\n    description: 'Sprawd\u017a, popraw i zatwierd\u017a szkice przed zapisem.',\n  },\n  notifications: {\n    kicker: 'POWIADOMIENIA',\n    title: 'Powiadomienia',\n    description: 'Przypomnienia, zaleg\u0142e rzeczy i alerty, kt\u00f3rych nie mo\u017cesz przegapi\u0107.',\n  },\n  billing: {\n    kicker: 'ROZLICZENIA',\n    title: 'Rozliczenia',\n    description: 'Status dost\u0119pu i planu. Sprawdzasz trial, limity i funkcje dost\u0119pne w obecnym pakiecie.',\n  },\n  support: {\n    kicker: 'POMOC',\n    title: 'Pomoc',\n    description: 'Zg\u0142oszenia i status. Tu sprawdzasz problemy, notatki z test\u00f3w i rzeczy wymagaj\u0105ce naprawy.',\n  },\n  settings: {\n    kicker: 'USTAWIENIA',\n    title: 'Ustawienia',\n    description: 'Konfiguracja konta, workspace i sposobu pracy aplikacji. Zmieniaj tylko rzeczy, kt\u00f3re realnie wp\u0142ywaj\u0105 na dzia\u0142anie systemu.',\n  },\n  adminAi: {\n    kicker: 'AI ADMIN',\n    title: 'Konfiguracja AI',\n    description: 'Ukryta warstwa diagnostyczna dla Quick Lead Capture. U\u017cytkownik ko\u0144cowy widzi tylko prosty szkic do potwierdzenia, nie provider\u00f3w ani kluczy.',\n  },\n};\n\nexport function getPageHeaderContent(key: CloseFlowPageHeaderKey): CloseFlowPageHeaderContent {\n  return PAGE_HEADER_CONTENT[key];\n}\n";
const cssBlock = "/* CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_2026_05_11_START\n   owner: CloseFlow Visual System\n   reason: unify page header descriptions, action layout and header action color with the top blue command bar.\n   scope: [data-cf-page-header=\"true\"].cf-page-header only.\n   note: card background stays untouched here.\n*/\n\n:root {\n  --cf-page-header-action-accent: #2563eb;\n  --cf-page-header-action-accent-strong: #1d4ed8;\n  --cf-page-header-action-border: #bfdbfe;\n  --cf-page-header-action-border-strong: #93c5fd;\n  --cf-page-header-action-bg: #ffffff;\n  --cf-page-header-action-hover-bg: #eff6ff;\n  --cf-page-header-action-shadow: 0 8px 18px rgba(37, 99, 235, 0.10);\n  --cf-page-header-action-radius: 14px;\n  --cf-page-header-action-height: 38px;\n\n  --cf-page-header-actions-gap: 10px;\n  --cf-page-header-actions-row-justify: flex-end;\n  --cf-page-header-actions-wrap: nowrap;\n  --cf-page-header-actions-margin-left: auto;\n\n  --cf-page-header-meta-color: #64748b;\n  --cf-page-header-meta-font-size: 12px;\n  --cf-page-header-meta-font-weight: 650;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-layout {\n  align-items: flex-start !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"actions\"],\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .head-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .ai-drafts-header-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .activity-header-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .notifications-header-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .settings-header-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .billing-header-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .support-header-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside {\n  margin-left: var(--cf-page-header-actions-margin-left) !important;\n  align-self: flex-start !important;\n  display: flex !important;\n  flex-direction: row !important;\n  flex-wrap: var(--cf-page-header-actions-wrap) !important;\n  align-items: center !important;\n  justify-content: var(--cf-page-header-actions-row-justify) !important;\n  gap: var(--cf-page-header-actions-gap) !important;\n  min-width: max-content !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"actions\"] > *,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .head-actions > *,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-actions > *,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside > * {\n  flex: 0 0 auto !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside .cf-page-hero-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside .head-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside .notifications-header-actions,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside .ai-drafts-header-actions {\n  display: flex !important;\n  flex-direction: row !important;\n  flex-wrap: nowrap !important;\n  align-items: center !important;\n  gap: var(--cf-page-header-actions-gap) !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside :is(.text-xs, .text-[12px], small, .cf-page-header-meta),\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-meta=\"true\"] {\n  color: var(--cf-page-header-meta-color) !important;\n  -webkit-text-fill-color: var(--cf-page-header-meta-color) !important;\n  font-size: var(--cf-page-header-meta-font-size) !important;\n  font-weight: var(--cf-page-header-meta-font-weight) !important;\n  line-height: 1.35 !important;\n  white-space: nowrap !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header :is(button, a.btn, a[role=\"button\"], .cf-header-action) {\n  min-height: var(--cf-page-header-action-height) !important;\n  border-radius: var(--cf-page-header-action-radius) !important;\n  border: 1px solid var(--cf-page-header-action-border) !important;\n  background: var(--cf-page-header-action-bg) !important;\n  background-color: var(--cf-page-header-action-bg) !important;\n  background-image: none !important;\n  color: var(--cf-page-header-action-accent) !important;\n  -webkit-text-fill-color: var(--cf-page-header-action-accent) !important;\n  box-shadow: var(--cf-page-header-action-shadow) !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header :is(button, a.btn, a[role=\"button\"], .cf-header-action):hover {\n  background: var(--cf-page-header-action-hover-bg) !important;\n  background-color: var(--cf-page-header-action-hover-bg) !important;\n  border-color: var(--cf-page-header-action-border-strong) !important;\n  color: var(--cf-page-header-action-accent-strong) !important;\n  -webkit-text-fill-color: var(--cf-page-header-action-accent-strong) !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header :is(button, a.btn, a[role=\"button\"], .cf-header-action) svg {\n  color: currentColor !important;\n  stroke: currentColor !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"description\"],\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-header-description {\n  max-width: 780px !important;\n}\n\n@media (max-width: 900px) {\n  #root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header,\n  #root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-layout {\n    align-items: stretch !important;\n  }\n\n  #root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"actions\"],\n  #root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .head-actions,\n  #root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-actions,\n  #root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-aside {\n    margin-left: 0 !important;\n    justify-content: flex-start !important;\n    flex-wrap: wrap !important;\n    min-width: 0 !important;\n  }\n}\n/* CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_2026_05_11_END */\n";
fs.mkdirSync(path.dirname(contentPath), { recursive: true });
fs.writeFileSync(contentPath, contentSource, 'utf8');
if (!fs.existsSync(cssPath)) { fs.mkdirSync(path.dirname(cssPath), { recursive: true }); fs.writeFileSync(cssPath, '', 'utf8'); }
let css = fs.readFileSync(cssPath, 'utf8');
const start = '/* CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_2026_05_11_START';
const end = '/* CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_2026_05_11_END */';
const startIndex = css.indexOf(start);
if (startIndex >= 0) {
  const endIndex = css.indexOf(end, startIndex);
  if (endIndex < 0) throw new Error('Stage5 CSS block start found without end marker');
  css = css.slice(0, startIndex).trimEnd() + '\n\n' + css.slice(endIndex + end.length).trimStart();
}
css = css.trimEnd() + '\n\n' + cssBlock + '\n';
fs.writeFileSync(cssPath, css, 'utf8');

const pageDefs = [
  ['src/pages/TodayStable.tsx','today'],
  ['src/pages/Leads.tsx','leads'],
  ['src/pages/Clients.tsx','clients'],
  ['src/pages/Cases.tsx','cases'],
  ['src/pages/TasksStable.tsx','tasks'],
  ['src/pages/Calendar.tsx','calendar'],
  ['src/pages/Templates.tsx','templates'],
  ['src/pages/ResponseTemplates.tsx','responseTemplates'],
  ['src/pages/Activity.tsx','activity'],
  ['src/pages/AiDrafts.tsx','aiDrafts'],
  ['src/pages/NotificationsCenter.tsx','notifications'],
  ['src/pages/Billing.tsx','billing'],
  ['src/pages/SupportCenter.tsx','support'],
  ['src/pages/Settings.tsx','settings'],
  ['src/pages/AdminAiSettings.tsx','adminAi'],
];

const fallbackDescriptions = {
  today: ['Szybki przegląd tego, co wymaga reakcji teraz i co warto zaplanować dalej.'],
  leads: ['Lista aktywnych tematów sprzedażowych. Tu zapisujesz kontakty, pilnujesz wartości i szybko widzisz, które leady wymagają ruchu.'],
  clients: ['Baza osób i firm w tle. Klient łączy kontakt, leady, sprawy i historię relacji.'],
  cases: ['Tematy już prowadzone operacyjnie. Tutaj pilnujesz obsługi, blokad, checklist i kolejnych działań po pozyskaniu klienta.'],
  tasks: ['Konkretne rzeczy do wykonania. Zadania mają pilnować ruchu, a nie leżeć jako martwe notatki.'],
  calendar: ['Tydzień, spotkania i deadline’y w jednym miejscu. Terminy mają być widoczne bez szukania po modułach.'],
  templates: ['Gotowe checklisty do powtarzalnych spraw. Szablon ma skrócić start obsługi, nie zastępować decyzji operatora.'],
  responseTemplates: ['Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. AI może później pracować na tych szablonach, ale źródłem prawdy jest Twoja biblioteka.'],
  activity: ['Historia ruchów w aplikacji. Tu sprawdzasz, co zostało zrobione i gdzie coś mogło wypaść z procesu.'],
  aiDrafts: ['Inbox rzeczy do akceptacji. AI może przygotować szkic, ale finalny zapis dzieje się dopiero po Twoim zatwierdzeniu.', 'Sprawdź, popraw i zatwierdź szkice przed zapisem w CRM.', 'Sprawdź, popraw i zatwierdź szkice przed zapisem.'],
  notifications: ['Przypomnienia i alerty z aplikacji. Tu widzisz zaległe rzeczy, nadchodzące terminy i sprawy, których nie można przegapić.', 'Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.'],
  billing: ['Status dostępu i planu. Sprawdzasz trial, limity i funkcje dostępne w obecnym pakiecie.'],
  support: ['Zgłoszenia i status. Tu sprawdzasz problemy, notatki z testów i rzeczy wymagające naprawy.'],
  settings: ['Konfiguracja konta, workspace i sposobu pracy aplikacji. Zmieniaj tylko rzeczy, które realnie wpływają na działanie systemu.'],
  adminAi: ['Ukryta diagnostyka providerów i szkiców AI. Użytkownik końcowy widzi prosty szkic do potwierdzenia, nie klucze ani providery.', 'Ukryta warstwa diagnostyczna dla Quick Lead Capture. Użytkownik końcowy widzi tylko prosty szkic do potwierdzenia, nie providerów ani kluczy.'],
};

function dedupeDescNodes(text, key) {
  const nodeRe = new RegExp(`\\n\\s*<p[^>]*PAGE_HEADER_CONTENT\\.${key}\\.description[^>]*>[\\s\\S]*?<\\/p>`, 'g');
  const matches = text.match(nodeRe) || [];
  if (matches.length > 1) {
    let first = true;
    text = text.replace(nodeRe, (m) => {
      if (first) { first = false; return m; }
      return '';
    });
  }
  return text;
}

function ensureDescriptionRef(text, key) {
  const desired = `<p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.${key}.description}</p>`;
  for (const candidate of fallbackDescriptions[key] || []) {
    const escaped = candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const literalPRe = new RegExp(`<p([^>]*)>\\s*${escaped}\\s*<\\/p>`, 'g');
    text = text.replace(literalPRe, desired);
  }
  const descRe = new RegExp(`<p[^>]*>\\s*\\{PAGE_HEADER_CONTENT\\.${key}\\.description\\}\\s*<\\/p>`, 'g');
  text = text.replace(descRe, desired);
  text = dedupeDescNodes(text, key);
  return text;
}

function markActions(text) {
  const repls = [
    ['className="head-actions"', 'className="head-actions" data-cf-page-header-part="actions"'],
    ['className="cf-page-hero-actions flex flex-wrap gap-2"', 'className="cf-page-hero-actions flex flex-wrap gap-2" data-cf-page-header-part="actions"'],
    ['className="ai-drafts-header-actions"', 'className="ai-drafts-header-actions" data-cf-page-header-part="actions"'],
    ['className="activity-header-actions"', 'className="activity-header-actions" data-cf-page-header-part="actions"'],
    ['className="notifications-header-actions"', 'className="notifications-header-actions" data-cf-page-header-part="actions"'],
    ['className="billing-header-actions"', 'className="billing-header-actions" data-cf-page-header-part="actions"'],
    ['className="settings-header-actions"', 'className="settings-header-actions" data-cf-page-header-part="actions"'],
    ['className="support-header-actions"', 'className="support-header-actions" data-cf-page-header-part="actions"'],
    ['className="cf-page-hero-aside"', 'className="cf-page-hero-aside" data-cf-page-header-part="actions"'],
  ];
  for (const [from, to] of repls) if (text.includes(from) && !text.includes(to)) text = text.replace(from, to);
  return text;
}

function markCopy(text) {
  const targets = [
    ['className="space-y-2"', 'className="space-y-2" data-cf-page-header-part="copy"'],
    ['className="space-y-1"', 'className="space-y-1" data-cf-page-header-part="copy"'],
  ];
  for (const [from, to] of targets) {
    if (text.includes(from) && !text.includes(to)) text = text.replace(from, to);
  }
  return text;
}

let changed = [];
for (const [rel, key] of pageDefs) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) continue;
  let text = fs.readFileSync(full, 'utf8');
  const before = text;
  text = ensureDescriptionRef(text, key);
  text = markActions(text);
  text = markCopy(text);
  if (text !== before) {
    fs.writeFileSync(full, text, 'utf8');
    changed.push(rel);
  }
}
console.log('CLOSEFLOW_PAGE_HEADER_COPY_ACTIONS_STAGE5_PATCH_OK');
console.log(JSON.stringify({ changed }, null, 2));
