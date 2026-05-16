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
assert(caseDetail.includes("STAGE28A_CASE_FINANCE_CORE_GUARD"), "Brakuje guard Stage28A");
assert(caseDetail.includes("type CasePaymentRecord ="), "Brakuje typu CasePaymentRecord");
assert(caseDetail.includes("function getCaseFinanceSummary("), "Brakuje helpera getCaseFinanceSummary");
assert(caseDetail.includes("const caseFinanceSummary = useMemo("), "Brakuje useMemo caseFinanceSummary");
assert(caseDetail.includes("const visibleCasePayments = useMemo("), "Brakuje visibleCasePayments");
assert(caseDetail.includes("const handleCreateCasePayment = async () =>"), "Brakuje handlera dodawania wplaty");
assert(caseDetail.includes('data-case-finance-panel="true"'), "Brakuje panelu finansow sprawy");
assert(caseDetail.includes('data-case-payment-dialog="true"'), "Brakuje dialogu dodawania wplaty");
assert(caseDetail.includes("Warto\u015B\u0107"), "Brakuje etykiety Warto\u015B\u0107");
assert(caseDetail.includes("Wp\u0142acono"), "Brakuje etykiety Wp\u0142acono");
assert(caseDetail.includes("Pozosta\u0142o"), "Brakuje etykiety Pozosta\u0142o");
assert(caseDetail.includes("Historia wp\u0142at"), "Brakuje historii wplat");
assert(caseDetail.includes("Dodaj wp\u0142at\u0119"), "Brakuje akcji Dodaj wplate");
assert(caseDetail.includes("createPaymentInSupabase(input as any)"), "Brakuje zapisu platnosci do Supabase");
assert(caseDetail.includes("eventType: 'payment_added'"), "Brakuje activity payment_added");

const css = read("src/styles/visual-stage13-case-detail-vnext.css");
assert(css.includes("stage28a case finance core"), "Brakuje CSS Stage28A");
assert(css.includes(".case-detail-finance-panel"), "Brakuje styli panelu finansow");
assert(css.includes(".case-detail-finance-grid"), "Brakuje styli gridu finansow");
assert(css.includes(".case-detail-payment-dialog select"), "Brakuje styli dialogu platnosci");

const clientDetail = fs.existsSync(path.join(root, "src/pages/ClientDetail.tsx")) ? read("src/pages/ClientDetail.tsx") : "";
if (clientDetail.includes("window.addEventListener('closeflow:context-note-saved'")) {
  assert(!clientDetail.includes("client?.id || id"), "ClientDetail nie moze miec client?.id || id po Stage28A");
  assert(!clientDetail.includes("String(id || '')"), "ClientDetail nie moze miec String(id || '') po Stage28A");
}

const pkg = read("package.json");
assert(pkg.includes("check:stage28a-case-finance-core"), "Brakuje npm script Stage28A");

console.log("OK stage28a case finance core");
