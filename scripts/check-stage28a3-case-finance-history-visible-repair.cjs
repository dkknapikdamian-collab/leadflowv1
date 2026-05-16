const fs = require("fs");
const path = require("path");
const root = process.cwd();

function read(file) {
  let text = fs.readFileSync(path.join(root, file), "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const caseDetail = read("src/pages/CaseDetail.tsx");
assert(caseDetail.includes("STAGE28A_CASE_FINANCE_CORE_GUARD"), "Brakuje bazowego guard Stage28A");
assert(caseDetail.includes("STAGE28A3_CASE_FINANCE_HISTORY_VISIBLE_REPAIR_GUARD"), "Brakuje guard Stage28A3");
assert(caseDetail.includes('data-case-finance-panel="true"'), "Brakuje panelu finansow");
assert(caseDetail.includes("Historia wp\u0142at"), "Brakuje naglowka Historia wplat");
assert(caseDetail.includes("visibleCasePayments.length"), "Brakuje licznika historii wplat");
assert(caseDetail.includes("case-detail-finance-payment-row"), "Brakuje wiersza historii wplat");
assert(caseDetail.includes("getPaymentAmount(payment)"), "Brakuje kwoty w historii wplat");
assert(caseDetail.includes("billingStatusLabel(payment.status)"), "Brakuje statusu platnosci w historii");
assert(caseDetail.includes("Dodaj wp\u0142at\u0119"), "Brakuje akcji Dodaj wplate");

const css = read("src/styles/visual-stage13-case-detail-vnext.css");
assert(css.includes("stage28a3 case finance history visible repair"), "Brakuje CSS Stage28A3");
assert(css.includes(".case-detail-finance-history-panel"), "Brakuje styli historii wplat");

const pkg = read("package.json");
assert(pkg.includes("check:stage28a3-case-finance-history-visible-repair"), "Brakuje npm script Stage28A3");
assert(!pkg.includes("check:stage28a2-case-finance-history-repair"), "Stary failujacy Stage28A2 script nie powinien zostac");

console.log("OK stage28a3 case finance history visible repair");
