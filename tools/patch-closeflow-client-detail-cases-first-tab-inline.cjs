const fs = require("fs");
const path = require("path");

const root = process.cwd();
const file = path.join(root, "src/pages/ClientDetail.tsx");

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function write(p, text) {
  fs.writeFileSync(p, text.replace(/\r?\n/g, "\n"));
}

function findAny(text, needles) {
  for (const needle of needles) {
    const index = text.indexOf(needle);
    if (index >= 0) return { needle, index };
  }
  return null;
}

function findTabBlock(text, tab) {
  const markers = [
    `setActiveTab('${tab}')`,
    `setActiveTab("${tab}")`,
    `activeTab === '${tab}'`,
    `activeTab === "${tab}"`,
    `data-client-detail-tab="${tab}"`,
    `data-client-detail-tab='${tab}'`,
    `value="${tab}"`,
    `value='${tab}'`,
  ];

  const found = findAny(text, markers);
  if (!found) return null;

  const before = text.slice(0, found.index);
  const candidates = [
    { tag: "button", index: before.lastIndexOf("<button") },
    { tag: "TabsTrigger", index: before.lastIndexOf("<TabsTrigger") },
    { tag: "a", index: before.lastIndexOf("<a") },
  ].filter((item) => item.index >= 0).sort((a, b) => b.index - a.index);

  if (!candidates.length) return null;

  const { tag, index: start } = candidates[0];
  const close = `</${tag}>`;
  const end = text.indexOf(close, found.index);
  if (end < 0) return null;

  return {
    tab,
    start,
    end: end + close.length,
    block: text.slice(start, end + close.length),
  };
}

function reorderTabButtons(text) {
  const tabs = ["summary", "cases", "history", "contact"];
  const blocks = tabs.map((tab) => findTabBlock(text, tab)).filter(Boolean);

  const required = new Set(blocks.map((block) => block.tab));
  if (!required.has("cases") || !required.has("summary") || !required.has("history")) {
    return text;
  }

  const first = Math.min(...blocks.map((block) => block.start));
  const last = Math.max(...blocks.map((block) => block.end));
  const inRange = blocks.filter((block) => block.start >= first && block.end <= last);

  const byTab = new Map(inRange.map((block) => [block.tab, block]));
  const orderedTabs = [
    "cases",
    "summary",
    "history",
    ...inRange.map((block) => block.tab).filter((tab) => !["cases", "summary", "history"].includes(tab)),
  ];

  const replacement = orderedTabs
    .map((tab) => byTab.get(tab)?.block)
    .filter(Boolean)
    .join("\n");

  return text.slice(0, first) + replacement + text.slice(last);
}

function patchClientDetail() {
  if (!fs.existsSync(file)) fail("Brak src/pages/ClientDetail.tsx");

  let text = read(file);

  if (!text.includes("CLOSEFLOW_CLIENT_DETAIL_CASES_FIRST_TAB_STAGE6")) {
    text = text.replace(
      "/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */",
      "/* CLOSEFLOW_CLIENT_DETAIL_CASES_FIRST_TAB_STAGE6 */\n/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */"
    );
  }

  text = text.replace(
    /type\s+ClientTab\s*=\s*'summary'\s*\|\s*'cases'\s*\|\s*'contact'\s*\|\s*'history';/,
    "type ClientTab = 'cases' | 'summary' | 'history' | 'contact';"
  );

  text = text.replace(
    /type\s+ClientTab\s*=\s*'summary'\s*\|\s*'cases'\s*\|\s*'history'\s*\|\s*'contact';/,
    "type ClientTab = 'cases' | 'summary' | 'history' | 'contact';"
  );

  text = text.replace(
    /useState<ClientTab>\(\s*['"]summary['"]\s*\)/g,
    "useState<ClientTab>('cases')"
  );

  text = text.replace(
    /useState\s*\(\s*['"]summary['"]\s*\)/g,
    "useState('cases')"
  );

  text = text.replace(
    /(default(?:Tab|ClientTab|ActiveTab)?\s*=\s*)['"]summary['"]/gi,
    "$1'cases'"
  );

  text = text.replace(
    /(fallback(?:Tab|ClientTab|ActiveTab)?\s*=\s*)['"]summary['"]/gi,
    "$1'cases'"
  );

  text = reorderTabButtons(text);

  write(file, text);
}

function patchPackage() {
  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(read(pkgPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts["check:closeflow-client-detail-cases-first-tab"] =
    "node scripts/check-closeflow-client-detail-cases-first-tab.cjs";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

patchClientDetail();
patchPackage();

console.log("CLOSEFLOW_CLIENT_DETAIL_CASES_FIRST_TAB_INLINE_PATCH_OK");
