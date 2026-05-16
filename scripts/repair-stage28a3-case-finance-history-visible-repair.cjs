const fs = require("fs");
const path = require("path");
const root = process.cwd();

function readUtf8NoBom(file) {
  let text = fs.readFileSync(file, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}
function writeUtf8NoBom(file, text) {
  fs.writeFileSync(file, text, "utf8");
}
function ensureFile(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

function patchCaseDetail() {
  const file = path.join(root, "src/pages/CaseDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const before = text;

  if (!text.includes("STAGE28A3_CASE_FINANCE_HISTORY_VISIBLE_REPAIR_GUARD")) {
    const anchor = text.includes("const STAGE28A_CASE_FINANCE_CORE_GUARD")
      ? "const STAGE28A_CASE_FINANCE_CORE_GUARD = 'case finance core value paid remaining partial payments';"
      : "const CASE_DETAIL_V1_EVENT_ACTION_GUARD = 'Dodaj wydarzenie';";
    text = text.replace(anchor, `${anchor}\nconst STAGE28A3_CASE_FINANCE_HISTORY_VISIBLE_REPAIR_GUARD = 'case finance history visible separate section';`);
  }

  if (!text.includes('data-case-finance-panel="true"')) {
    throw new Error("Brakuje panelu finansow Stage28A. Uruchom Stage28A przed Stage28A3 albo nie resetuj repo.");
  }
  if (!text.includes("visibleCasePayments")) {
    throw new Error("Brakuje visibleCasePayments ze Stage28A.");
  }
  if (!text.includes("caseFinanceSummary")) {
    throw new Error("Brakuje caseFinanceSummary ze Stage28A.");
  }

  if (!text.includes("Historia wp\u0142at")) {
    // Najbezpieczniej: osobna sekcja widoczna zaraz przed Tabs. Nie zale\u017Cy od klas z poprzedniego patcha.
    const match = text.match(/\n(\s*)<Tabs\b/);
    if (!match) throw new Error("Nie znaleziono <Tabs> anchor w CaseDetail.");
    const indent = match[1];
    const historyPanel = `
${indent}<section className="case-detail-finance-history-panel" data-case-finance-history-panel="true">
${indent}  <div className="case-detail-finance-payments-head">
${indent}    <strong>Historia wp\u0142at</strong>
${indent}    <span>{visibleCasePayments.length}</span>
${indent}  </div>
${indent}  {visibleCasePayments.length ? (
${indent}    <div className="case-detail-finance-history-list">
${indent}      {visibleCasePayments.map((payment) => (
${indent}        <article key={String(payment.id || payment.createdAt || payment.note || getPaymentAmount(payment))} className="case-detail-finance-payment-row">
${indent}          <div>
${indent}            <strong>{formatMoney(getPaymentAmount(payment), payment.currency || caseFinanceSummary.currency)}</strong>
${indent}            <span>{billingStatusLabel(payment.status)}</span>
${indent}          </div>
${indent}          <small>{formatDate(payment.paidAt || payment.createdAt || payment.dueAt, 'Bez daty')}</small>
${indent}        </article>
${indent}      ))}
${indent}    </div>
${indent}  ) : (
${indent}    <p className="case-detail-finance-empty">Brak wp\u0142at. Dodaj pierwsz\u0105 zaliczk\u0119 albo p\u0142atno\u015B\u0107 cz\u0119\u015Bciow\u0105.</p>
${indent}  )}
${indent}</section>

`;
    text = text.slice(0, match.index) + historyPanel + text.slice(match.index);
  }

  if (!text.includes("Historia wp\u0142at")) throw new Error("Brakuje tekstu Historia wp\u0142at po Stage28A3.");
  if (!text.includes('data-case-finance-history-panel="true"') && !text.includes("case-detail-finance-payments-head")) {
    throw new Error("Brakuje widocznej historii wplat po Stage28A3.");
  }

  if (text !== before) {
    writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
    console.log("Patched CaseDetail Stage28A3.");
  } else {
    console.log("CaseDetail already Stage28A3-ready.");
  }
}

function patchCss() {
  const file = path.join(root, "src/styles/visual-stage13-case-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const marker = "/* stage28a3 case finance history visible repair */";
  const block = `
${marker}
.case-detail-finance-history-panel {
  margin: -4px 0 16px;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.38);
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.case-detail-finance-history-list {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.case-detail-finance-history-panel .case-detail-finance-empty {
  margin: 10px 0 0;
}
`.trimEnd() + "\n";

  if (!text.includes(marker)) {
    text = text.replace(/\s*$/u, "\n\n" + block);
  }
  writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
  console.log("Patched CSS Stage28A3.");
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  ensureFile(file);
  const pkg = JSON.parse(readUtf8NoBom(file));
  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts["check:stage28a2-case-finance-history-repair"];
  pkg.scripts["check:stage28a3-case-finance-history-visible-repair"] = "node scripts/check-stage28a3-case-finance-history-visible-repair.cjs";
  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json Stage28A3.");
}

patchCaseDetail();
patchCss();
patchPackageJson();
console.log("Stage28A3 repair complete.");
