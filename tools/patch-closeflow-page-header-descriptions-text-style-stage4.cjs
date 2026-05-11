const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

const contentSource = "export type CloseFlowPageHeaderKey =\n  | 'today'\n  | 'leads'\n  | 'clients'\n  | 'cases'\n  | 'tasks'\n  | 'calendar'\n  | 'templates'\n  | 'responseTemplates'\n  | 'activity'\n  | 'aiDrafts'\n  | 'notifications'\n  | 'billing'\n  | 'support'\n  | 'settings'\n  | 'adminAi';\n\nexport type CloseFlowPageHeaderContent = {\n  kicker: string;\n  title: string;\n  description: string;\n};\n\nexport const PAGE_HEADER_CONTENT: Record<CloseFlowPageHeaderKey, CloseFlowPageHeaderContent> = {\n  today: {\n    kicker: 'CENTRUM DNIA',\n    title: 'Priorytety i najbli\u017csze ruchy',\n    description: 'Szybki przegl\u0105d tego, co wymaga reakcji teraz i co warto zaplanowa\u0107 dalej.',\n  },\n  leads: {\n    kicker: 'LISTA SPRZEDA\u017bOWA',\n    title: 'Leady',\n    description: 'Lista aktywnych temat\u00f3w sprzeda\u017cowych. Tu zapisujesz kontakty, pilnujesz warto\u015bci i szybko widzisz, kt\u00f3re leady wymagaj\u0105 ruchu.',\n  },\n  clients: {\n    kicker: 'BAZA RELACJI',\n    title: 'Klienci',\n    description: 'Baza os\u00f3b i firm w tle. Klient \u0142\u0105czy kontakt, leady, sprawy i histori\u0119 relacji.',\n  },\n  cases: {\n    kicker: 'CENTRUM OBS\u0141UGI',\n    title: 'Sprawy',\n    description: 'Tematy ju\u017c prowadzone operacyjnie. Tutaj pilnujesz obs\u0142ugi, blokad, checklist i kolejnych dzia\u0142a\u0144 po pozyskaniu klienta.',\n  },\n  tasks: {\n    kicker: 'ZADANIA',\n    title: 'Lista zada\u0144',\n    description: 'Konkretne rzeczy do wykonania. Zadania maj\u0105 pilnowa\u0107 ruchu, a nie le\u017ce\u0107 jako martwe notatki.',\n  },\n  calendar: {\n    kicker: 'TERMINY',\n    title: 'Kalendarz',\n    description: 'Tydzie\u0144, spotkania i deadline\u2019y w jednym miejscu. Terminy maj\u0105 by\u0107 widoczne bez szukania po modu\u0142ach.',\n  },\n  templates: {\n    kicker: 'SZABLONY SPRAW',\n    title: 'Szablony spraw i checklist',\n    description: 'Gotowe checklisty do powtarzalnych spraw. Szablon ma skr\u00f3ci\u0107 start obs\u0142ugi, nie zast\u0119powa\u0107 decyzji operatora.',\n  },\n  responseTemplates: {\n    kicker: 'ODPOWIEDZI',\n    title: 'Biblioteka odpowiedzi',\n    description: 'W\u0142asne gotowce do follow-up\u00f3w, przypomnie\u0144 i wiadomo\u015bci do klient\u00f3w. AI mo\u017ce p\u00f3\u017aniej pracowa\u0107 na tych szablonach, ale \u017ar\u00f3d\u0142em prawdy jest Twoja biblioteka.',\n  },\n  activity: {\n    kicker: 'AKTYWNO\u015a\u0106',\n    title: 'Aktywno\u015b\u0107',\n    description: 'Historia ruch\u00f3w w aplikacji. Tu sprawdzasz, co zosta\u0142o zrobione i gdzie co\u015b mog\u0142o wypa\u015b\u0107 z procesu.',\n  },\n  aiDrafts: {\n    kicker: 'SZKICE DO SPRAWDZENIA',\n    title: 'Szkice AI',\n    description: 'Inbox rzeczy do akceptacji. AI mo\u017ce przygotowa\u0107 szkic, ale finalny zapis dzieje si\u0119 dopiero po Twoim zatwierdzeniu.',\n  },\n  notifications: {\n    kicker: 'POWIADOMIENIA',\n    title: 'Powiadomienia',\n    description: 'Przypomnienia i alerty z aplikacji. Tu widzisz zaleg\u0142e rzeczy, nadchodz\u0105ce terminy i sprawy, kt\u00f3rych nie mo\u017cna przegapi\u0107.',\n  },\n  billing: {\n    kicker: 'ROZLICZENIA',\n    title: 'Rozliczenia',\n    description: 'Status dost\u0119pu i planu. Sprawdzasz trial, limity i funkcje dost\u0119pne w obecnym pakiecie.',\n  },\n  support: {\n    kicker: 'POMOC',\n    title: 'Pomoc',\n    description: 'Zg\u0142oszenia i status. Tu sprawdzasz problemy, notatki z test\u00f3w i rzeczy wymagaj\u0105ce naprawy.',\n  },\n  settings: {\n    kicker: 'USTAWIENIA',\n    title: 'Ustawienia',\n    description: 'Konfiguracja konta, workspace i sposobu pracy aplikacji. Zmieniaj tylko rzeczy, kt\u00f3re realnie wp\u0142ywaj\u0105 na dzia\u0142anie systemu.',\n  },\n  adminAi: {\n    kicker: 'AI ADMIN',\n    title: 'Konfiguracja AI',\n    description: 'Ukryta diagnostyka provider\u00f3w i szkic\u00f3w AI. U\u017cytkownik ko\u0144cowy widzi prosty szkic do potwierdzenia, nie klucze ani providery.',\n  },\n};\n\nexport function getPageHeaderContent(key: CloseFlowPageHeaderKey): CloseFlowPageHeaderContent {\n  return PAGE_HEADER_CONTENT[key];\n}\n";
const styleBlock = "/* CLOSEFLOW_PAGE_HEADER_TITLE_COPY_PARITY_TODAY_STAGE4_2026_05_11_START\n   owner: CloseFlow Visual System\n   reason: make every main page header title/description use the Today-like visual style.\n   scope: [data-cf-page-header=\"true\"].cf-page-header only.\n   note: this does not change card background color.\n*/\n\n:root {\n  --cf-page-header-copy-top-offset: 0px;\n  --cf-page-header-title-color: #0f172a;\n  --cf-page-header-title-font-size: clamp(28px, 2.75vw, 40px);\n  --cf-page-header-title-font-weight: 950;\n  --cf-page-header-title-line-height: 1;\n  --cf-page-header-title-letter-spacing: -0.058em;\n  --cf-page-header-title-margin-top: 0px;\n\n  --cf-page-header-description-color: #64748b;\n  --cf-page-header-description-font-size: 13px;\n  --cf-page-header-description-font-weight: 650;\n  --cf-page-header-description-line-height: 1.45;\n  --cf-page-header-description-margin-top: 9px;\n  --cf-page-header-description-max-width: 780px;\n\n  --cf-page-header-kicker-margin-bottom: 9px;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"copy\"],\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header > :first-child,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-layout > :first-child {\n  transform: translateY(var(--cf-page-header-copy-top-offset)) !important;\n  justify-content: center !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"kicker\"],\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .kicker,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-kicker,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [class*=\"kicker\"] {\n  margin-bottom: var(--cf-page-header-kicker-margin-bottom) !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"title\"],\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header h1,\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-hero-title {\n  margin-top: var(--cf-page-header-title-margin-top) !important;\n  color: var(--cf-page-header-title-color) !important;\n  -webkit-text-fill-color: var(--cf-page-header-title-color) !important;\n  font-size: var(--cf-page-header-title-font-size) !important;\n  font-weight: var(--cf-page-header-title-font-weight) !important;\n  line-height: var(--cf-page-header-title-line-height) !important;\n  letter-spacing: var(--cf-page-header-title-letter-spacing) !important;\n  text-align: left !important;\n  text-shadow: none !important;\n  opacity: 1 !important;\n}\n\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header [data-cf-page-header-part=\"description\"],\n#root .cf-html-shell [data-cf-page-header=\"true\"].cf-page-header .cf-page-header-description {\n  display: block !important;\n  max-width: var(--cf-page-header-description-max-width) !important;\n  margin: var(--cf-page-header-description-margin-top) 0 0 0 !important;\n  color: var(--cf-page-header-description-color) !important;\n  -webkit-text-fill-color: var(--cf-page-header-description-color) !important;\n  font-size: var(--cf-page-header-description-font-size) !important;\n  font-weight: var(--cf-page-header-description-font-weight) !important;\n  line-height: var(--cf-page-header-description-line-height) !important;\n  text-align: left !important;\n  text-shadow: none !important;\n  opacity: 1 !important;\n}\n\n@media (max-width: 720px) {\n  :root {\n    --cf-page-header-title-font-size: clamp(25px, 7vw, 32px);\n    --cf-page-header-title-letter-spacing: -0.045em;\n  }\n}\n/* CLOSEFLOW_PAGE_HEADER_TITLE_COPY_PARITY_TODAY_STAGE4_2026_05_11_END */\n";

const contentPath = path.join(repo, 'src', 'lib', 'page-header-content.ts');
const cssPath = path.join(repo, 'src', 'styles', 'closeflow-page-header-card-source-truth.css');

fs.mkdirSync(path.dirname(contentPath), { recursive: true });
fs.writeFileSync(contentPath, contentSource, 'utf8');

if (!fs.existsSync(cssPath)) {
  fs.mkdirSync(path.dirname(cssPath), { recursive: true });
  fs.writeFileSync(cssPath, '', 'utf8');
}

let css = fs.readFileSync(cssPath, 'utf8');
const start = '/* CLOSEFLOW_PAGE_HEADER_TITLE_COPY_PARITY_TODAY_STAGE4_2026_05_11_START';
const end = '/* CLOSEFLOW_PAGE_HEADER_TITLE_COPY_PARITY_TODAY_STAGE4_2026_05_11_END */';
const startIndex = css.indexOf(start);
if (startIndex >= 0) {
  const endIndex = css.indexOf(end, startIndex);
  if (endIndex < 0) throw new Error('Stage4 CSS block start found without end marker');
  css = css.slice(0, startIndex).trimEnd() + '\n\n' + css.slice(endIndex + end.length).trimStart();
}
css = css.trimEnd() + '\n\n' + styleBlock + '\n';
fs.writeFileSync(cssPath, css, 'utf8');

const files = [
  ['src/pages/TodayStable.tsx', 'today', ['Priorytety i najbliższe ruchy', 'Dziś', 'Dzisiaj']],
  ['src/pages/Leads.tsx', 'leads', ['Leady']],
  ['src/pages/Clients.tsx', 'clients', ['Klienci']],
  ['src/pages/Cases.tsx', 'cases', ['Sprawy']],
  ['src/pages/TasksStable.tsx', 'tasks', ['Lista zadań']],
  ['src/pages/Calendar.tsx', 'calendar', ['Kalendarz']],
  ['src/pages/Templates.tsx', 'templates', ['Szablony spraw i checklist', 'Szablony']],
  ['src/pages/ResponseTemplates.tsx', 'responseTemplates', ['Biblioteka odpowiedzi', 'Szablony odpowiedzi']],
  ['src/pages/Activity.tsx', 'activity', ['Aktywność']],
  ['src/pages/AiDrafts.tsx', 'aiDrafts', ['Szkice AI']],
  ['src/pages/NotificationsCenter.tsx', 'notifications', ['Powiadomienia']],
  ['src/pages/Billing.tsx', 'billing', ['Rozliczenia']],
  ['src/pages/SupportCenter.tsx', 'support', ['Pomoc', 'Centrum pomocy']],
  ['src/pages/Settings.tsx', 'settings', ['Ustawienia']],
  ['src/pages/AdminAiSettings.tsx', 'adminAi', ['Konfiguracja AI']],
];

function escRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ensureImport(text) {
  if (text.includes("page-header-content")) return text;

  const importLine = "import { PAGE_HEADER_CONTENT } from '../lib/page-header-content';";
  const cssImportRe = /^import\s+['"][^'"]+\.css['"];\s*$/gm;
  let lastCss = null;
  for (const match of text.matchAll(cssImportRe)) lastCss = match;
  if (lastCss) {
    const insertAt = lastCss.index + lastCss[0].length;
    return text.slice(0, insertAt) + '\n' + importLine + text.slice(insertAt);
  }

  const importRe = /^import[\s\S]*?;\s*$/gm;
  let lastImport = null;
  for (const match of text.matchAll(importRe)) lastImport = match;
  if (!lastImport) return importLine + '\n' + text;
  const insertAt = lastImport.index + lastImport[0].length;
  return text.slice(0, insertAt) + '\n' + importLine + text.slice(insertAt);
}

function titleExpression(key) {
  return `{PAGE_HEADER_CONTENT.${key}.title}`;
}

function descNode(key) {
  return `<p data-cf-page-header-part="description" className="cf-page-header-description">{PAGE_HEADER_CONTENT.${key}.description}</p>`;
}

function patchTitleAndDescription(text, key, titleCandidates) {
  if (text.includes(`PAGE_HEADER_CONTENT.${key}.description`)) return text;

  for (const title of titleCandidates) {
    const titleRe = new RegExp(`(<h1([^>]*)>\\s*)${escRegExp(title)}(\\s*</h1>)`);
    if (titleRe.test(text)) {
      text = text.replace(titleRe, (match, open, attrs, close) => {
        let fixedOpen = open;
        if (!/data-cf-page-header-part=/.test(attrs)) {
          fixedOpen = open.replace('<h1', '<h1 data-cf-page-header-part="title"');
        }
        return fixedOpen + `{PAGE_HEADER_CONTENT.${key}.title}` + close;
      });

      const h1WithSource = new RegExp(`(<h1[^>]*>\\s*\\{PAGE_HEADER_CONTENT\\.${key}\\.title\\}\\s*</h1>)([\s\S]{0,450}?)`);
      const after = text.match(h1WithSource);
      if (after) {
        const h1 = after[1];
        const tail = after[2];
        const immediatePRe = /^\s*<p([^>]*)>[\s\S]*?<\/p>/;
        if (immediatePRe.test(tail)) {
          const patchedTail = tail.replace(immediatePRe, '\n              ' + descNode(key));
          text = text.replace(h1 + tail, h1 + patchedTail);
        } else {
          text = text.replace(h1, h1 + '\n              ' + descNode(key));
        }
      }
      return text;
    }
  }

  return text;
}

function patchKicker(text, key) {
  if (text.includes(`PAGE_HEADER_CONTENT.${key}.kicker`)) return text;

  const kickerPatterns = [
    /(<span([^>]*className="[^"]*kicker[^"]*"[^>]*)>)([^<]{2,80})(<\/span>)/,
    /(<Badge([^>]*className="[^"]*kicker[^"]*"[^>]*)>)([^<]{2,80})(<\/Badge>)/,
    /(<div([^>]*app-primary-chip[^>]*)>)([\s\S]{0,200}?)(<\/div>)/
  ];

  for (const re of kickerPatterns) {
    if (re.test(text)) {
      return text.replace(re, (match, open, attrs, old, close) => {
        let fixedOpen = open;
        if (!/data-cf-page-header-part=/.test(open)) {
          fixedOpen = open.replace(/^(<\w+)/, '$1 data-cf-page-header-part="kicker"');
        }
        if (key === 'adminAi' && open.startsWith('<div')) {
          // Keep icon inside admin AI chip when present.
          const iconMatch = old.match(/<EntityIcon[\s\S]*?\/>/);
          const icon = iconMatch ? iconMatch[0] + '\n              ' : '';
          return fixedOpen + icon + `{PAGE_HEADER_CONTENT.${key}.kicker}` + close;
        }
        return fixedOpen + `{PAGE_HEADER_CONTENT.${key}.kicker}` + close;
      });
    }
  }
  return text;
}

function markCopyContainer(text) {
  // Safe, conservative markers for common header copy wrappers.
  text = text.replace(/<div>\s*(\n\s*<span[^>]*className="[^"]*kicker)/, '<div data-cf-page-header-part="copy">$1');
  text = text.replace(/<div>\s*(\n\s*<Badge[^>]*className="[^"]*cf-page-hero-kicker)/, '<div data-cf-page-header-part="copy">$1');
  text = text.replace(/<div className="space-y-2">\s*(\n\s*<div[^>]*app-primary-chip)/, '<div className="space-y-2" data-cf-page-header-part="copy">$1');
  return text;
}

function markActions(text) {
  const replacements = [
    ['className="head-actions"', 'className="head-actions" data-cf-page-header-part="actions"'],
    ['className="cf-page-hero-actions flex flex-wrap gap-2"', 'className="cf-page-hero-actions flex flex-wrap gap-2" data-cf-page-header-part="actions"'],
    ['className="ai-drafts-header-actions"', 'className="ai-drafts-header-actions" data-cf-page-header-part="actions"'],
    ['className="activity-header-actions"', 'className="activity-header-actions" data-cf-page-header-part="actions"'],
    ['className="notifications-header-actions"', 'className="notifications-header-actions" data-cf-page-header-part="actions"'],
  ];
  for (const [from, to] of replacements) {
    if (text.includes(from) && !text.includes(to)) text = text.replace(from, to);
  }
  return text;
}

let changed = [];
for (const [rel, key, titles] of files) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) continue;
  let text = fs.readFileSync(full, 'utf8');
  const before = text;
  text = ensureImport(text);
  text = patchKicker(text, key);
  text = patchTitleAndDescription(text, key, titles);
  text = markCopyContainer(text);
  text = markActions(text);
  if (text !== before) {
    fs.writeFileSync(full, text, 'utf8');
    changed.push(rel);
  }
}

console.log('CLOSEFLOW_PAGE_HEADER_DESCRIPTIONS_TEXT_STYLE_STAGE4_PATCH_OK');
console.log(JSON.stringify({ changed }, null, 2));
