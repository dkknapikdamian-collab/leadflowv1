const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const clientDetail = read("src/pages/ClientDetail.tsx");
const pkg = JSON.parse(read("package.json"));

if (!clientDetail.includes("CLOSEFLOW_CLIENT_DETAIL_CASES_FIRST_TAB_STAGE6")) {
  fail("Brak guarda CLOSEFLOW_CLIENT_DETAIL_CASES_FIRST_TAB_STAGE6");
}

if (!clientDetail.includes("type ClientTab = 'cases' | 'summary' | 'history'")) {
  fail("ClientTab nie zaczyna się od cases -> summary -> history");
}

if (/useState<ClientTab>\(\s*['"]summary['"]\s*\)/.test(clientDetail)) {
  fail("Domyślny active tab nadal ustawiony na summary");
}

if (pkg.scripts?.["check:closeflow-client-detail-cases-first-tab"] !== "node scripts/check-closeflow-client-detail-cases-first-tab.cjs") {
  fail("Brak skryptu check:closeflow-client-detail-cases-first-tab w package.json");
}

console.log("CLOSEFLOW_CLIENT_DETAIL_CASES_FIRST_TAB_CHECK_OK");
