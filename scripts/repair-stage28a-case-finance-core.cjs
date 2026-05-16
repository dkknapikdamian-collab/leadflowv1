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

function patchClientDetailIdRuntime() {
  const file = path.join(root, "src/pages/ClientDetail.tsx");
  if (!fs.existsSync(file)) return;
  let text = readUtf8NoBom(file);
  const before = text;
  if (text.includes("window.addEventListener('closeflow:context-note-saved'")) {
    text = text
      .replace(/const currentClientId = String\(client\?\.id\s*\|\|\s*id\s*\|\|\s*''\)\.trim\(\);/g, "const currentClientId = String(client?.id || '').trim();")
      .replace(/const currentClientId = String\(id\s*\|\|\s*''\)\.trim\(\);/g, "const currentClientId = String(client?.id || '').trim();")
      .replace(/\}, \[client\?\.id,\s*id\]\);/g, "}, [client?.id]);")
      .replace(/\}, \[id\]\);/g, "}, [client?.id]);");
  }
  if (!text.includes("STAGE28A_CLIENT_NOTE_ID_COMPAT_GUARD")) {
    const anchor = text.includes("const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD")
      ? "const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD = 'client notes event final after failed 27ad';"
      : text.includes("const STAGE26A_FEEDBACK_AFTER_4EC_GUARD")
        ? "const STAGE26A_FEEDBACK_AFTER_4EC_GUARD = 'feedback after 4ec client activity ai drafts';"
        : "";
    if (anchor) text = text.replace(anchor, `${anchor}\nconst STAGE28A_CLIENT_NOTE_ID_COMPAT_GUARD = 'client note listener id safe before finance';`);
  }
  if (text !== before) writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
}

function patchCaseDetail() {
  const file = path.join(root, "src/pages/CaseDetail.tsx");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const before = text;

  if (!text.includes("STAGE28A_CASE_FINANCE_CORE_GUARD")) {
    text = text.replace(
      "const CASE_DETAIL_V1_EVENT_ACTION_GUARD = 'Dodaj wydarzenie';",
      "const CASE_DETAIL_V1_EVENT_ACTION_GUARD = 'Dodaj wydarzenie';\nconst STAGE28A_CASE_FINANCE_CORE_GUARD = 'case finance core value paid remaining partial payments';"
    );
  }

  if (!text.includes("type CasePaymentRecord =")) {
    const typeBlock = `
type CasePaymentRecord = {
  id?: string;
  caseId?: string | null;
  clientId?: string | null;
  leadId?: string | null;
  type?: string;
  status?: string;
  amount?: number | string;
  value?: number | string;
  paidAmount?: number | string;
  currency?: string;
  dueAt?: string | null;
  paidAt?: string | null;
  createdAt?: any;
  note?: string | null;
};
`;
    text = text.replace("type CaseActivity = {", typeBlock + "\ntype CaseActivity = {");
  }

  if (!text.includes("function getCaseFinanceSummary(")) {
    const helperBlock = `
function getPaymentAmount(payment: CasePaymentRecord) {
  const raw = payment.amount ?? payment.value ?? payment.paidAmount ?? 0;
  const amount = Number(raw || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function getCaseExpectedRevenue(caseData?: CaseRecord | null) {
  const raw =
    caseData?.expectedRevenue ??
    (caseData as any)?.caseValue ??
    (caseData as any)?.dealValue ??
    (caseData as any)?.value ??
    0;
  const amount = Number(raw || 0);
  return Number.isFinite(amount) ? amount : 0;
}

function getCaseFinanceSummary(caseData: CaseRecord | null, payments: CasePaymentRecord[]) {
  const currency = String(caseData?.currency || payments.find((payment) => payment.currency)?.currency || 'PLN').toUpperCase();
  const expected = getCaseExpectedRevenue(caseData);
  const paid = payments
    .filter((payment) => isPaidPaymentStatus(payment.status || 'paid'))
    .reduce((sum, payment) => sum + getPaymentAmount(payment), 0);
  const remaining = Math.max(expected - paid, 0);
  const progress = expected > 0 ? Math.min(100, Math.round((paid / expected) * 100)) : 0;
  const status =
    expected <= 0
      ? 'Ustal warto\u015B\u0107'
      : paid <= 0
        ? 'Brak wp\u0142aty'
        : remaining <= 0
          ? 'Op\u0142acone'
          : 'Cz\u0119\u015Bciowo op\u0142acone';
  return { expected, paid, remaining, progress, status, currency };
}

function sortCasePayments(payments: CasePaymentRecord[]) {
  return [...payments].sort((first, second) => {
    const firstTime = sortTime(first.paidAt || first.createdAt || first.dueAt, 0);
    const secondTime = sortTime(second.paidAt || second.createdAt || second.dueAt, 0);
    return secondTime - firstTime;
  });
}
`;
    text = text.replace("function sortTime(value: any, fallback = Number.MAX_SAFE_INTEGER) {", helperBlock + "\nfunction sortTime(value: any, fallback = Number.MAX_SAFE_INTEGER) {");
  }

  if (!text.includes("const caseFinanceSummary = useMemo(")) {
    const insertBefore = "  const refreshCaseData = useCallback(async () => {";
    if (!text.includes(insertBefore)) throw new Error("Nie znaleziono refreshCaseData anchor w CaseDetail.");
    const financeState = `
  const caseFinanceSummary = useMemo(
    () => getCaseFinanceSummary(caseData, payments as CasePaymentRecord[]),
    [caseData, payments],
  );
  const visibleCasePayments = useMemo(() => sortCasePayments(payments as CasePaymentRecord[]).slice(0, 8), [payments]);

  const handleCreateCasePayment = async () => {
    if (!caseId || !caseData) return;
    if (!hasAccess) {
      toast.error('Brak dost\u0119pu do zapisu p\u0142atno\u015Bci.');
      return;
    }
    const amount = Number(casePaymentDraft.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Podaj poprawn\u0105 kwot\u0119 wp\u0142aty.');
      return;
    }
    try {
      setCasePaymentSubmitting(true);
      const input = {
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        type: casePaymentDraft.type || 'payment',
        status: casePaymentDraft.status || 'partially_paid',
        amount,
        currency: caseData.currency || 'PLN',
        dueAt: casePaymentDraft.dueAt ? toIsoFromLocalInput(casePaymentDraft.dueAt) : '',
        paidAt: new Date().toISOString(),
        note: casePaymentDraft.note || '',
      };
      const created = await createPaymentInSupabase(input as any);
      setPayments((previous) => [created || input, ...previous]);
      await insertActivityToSupabase({
        caseId,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        actorType: 'operator',
        eventType: 'payment_added',
        payload: { title: 'Dodano wp\u0142at\u0119', amount, status: input.status, note: input.note },
      } as any).catch(() => null);
      setCasePaymentDraft({ type: 'payment', amount: '', status: 'partially_paid', dueAt: '', note: '' });
      setIsCasePaymentOpen(false);
      toast.success('Wp\u0142ata dodana');
    } catch (error) {
      console.error(error);
      toast.error('Nie uda\u0142o si\u0119 doda\u0107 wp\u0142aty.');
    } finally {
      setCasePaymentSubmitting(false);
    }
  };

`;
    text = text.replace(insertBefore, financeState + insertBefore);
  }

  if (!text.includes('data-case-finance-panel="true"')) {
    const tabsRegex = /\n(\s*)<Tabs\b/;
    const match = text.match(tabsRegex);
    if (!match) throw new Error("Nie znaleziono <Tabs> anchor w CaseDetail.");
    const indent = match[1];
    const panel = `
${indent}<section className="case-detail-finance-panel" data-case-finance-panel="true">
${indent}  <div className="case-detail-finance-head">
${indent}    <div>
${indent}      <p>Finanse sprawy</p>
${indent}      <h2>{caseFinanceSummary.status}</h2>
${indent}    </div>
${indent}    <Button type="button" size="sm" onClick={() => setIsCasePaymentOpen(true)} disabled={!hasAccess}>
${indent}      <Plus className="h-4 w-4" />
${indent}      Dodaj wp\u0142at\u0119
${indent}    </Button>
${indent}  </div>
${indent}  <div className="case-detail-finance-grid">
${indent}    <div className="case-detail-finance-stat">
${indent}      <span>Warto\u015B\u0107</span>
${indent}      <strong>{formatMoney(caseFinanceSummary.expected, caseFinanceSummary.currency)}</strong>
${indent}    </div>
${indent}    <div className="case-detail-finance-stat is-paid">
${indent}      <span>Wp\u0142acono</span>
${indent}      <strong>{formatMoney(caseFinanceSummary.paid, caseFinanceSummary.currency)}</strong>
${indent}    </div>
${indent}    <div className="case-detail-finance-stat is-left">
${indent}      <span>Pozosta\u0142o</span>
${indent}      <strong>{formatMoney(caseFinanceSummary.remaining, caseFinanceSummary.currency)}</strong>
${indent}    </div>
${indent}  </div>
${indent}  <div className="case-detail-finance-progress" aria-label={\`Op\u0142acono \${caseFinanceSummary.progress}%\`}>
${indent}    <span style={{ width: \`\${caseFinanceSummary.progress}%\` }} />
${indent}  </div>
${indent}  <div className="case-detail-finance-payments">
${indent}    <div className="case-detail-finance-payments-head">
${indent}      <strong>Historia wp\u0142at</strong>
${indent}      <span>{visibleCasePayments.length}</span>
${indent}    </div>
${indent}    {visibleCasePayments.length ? (
${indent}      visibleCasePayments.map((payment) => (
${indent}        <article key={String(payment.id || payment.createdAt || payment.note || getPaymentAmount(payment))} className="case-detail-finance-payment-row">
${indent}          <div>
${indent}            <strong>{formatMoney(getPaymentAmount(payment), payment.currency || caseFinanceSummary.currency)}</strong>
${indent}            <span>{billingStatusLabel(payment.status)}</span>
${indent}          </div>
${indent}          <small>{formatDate(payment.paidAt || payment.createdAt || payment.dueAt, 'Bez daty')}</small>
${indent}        </article>
${indent}      ))
${indent}    ) : (
${indent}      <p className="case-detail-finance-empty">Brak wp\u0142at. Dodaj pierwsz\u0105 zaliczk\u0119 albo p\u0142atno\u015B\u0107 cz\u0119\u015Bciow\u0105.</p>
${indent}    )}
${indent}  </div>
${indent}</section>

`;
    text = text.slice(0, match.index) + panel + text.slice(match.index);
  }

  if (!text.includes('data-case-payment-dialog="true"')) {
    const layoutEnd = text.lastIndexOf("</Layout>");
    if (layoutEnd === -1) throw new Error("Nie znaleziono </Layout> anchor w CaseDetail.");
    const dialog = `
      <Dialog open={isCasePaymentOpen} onOpenChange={setIsCasePaymentOpen}>
        <DialogContent data-case-payment-dialog="true" className="case-detail-payment-dialog">
          <DialogHeader>
            <DialogTitle>Dodaj wp\u0142at\u0119 do sprawy</DialogTitle>
          </DialogHeader>
          <div className="case-detail-payment-form">
            <div>
              <Label htmlFor="case-payment-amount">Kwota wp\u0142aty</Label>
              <Input
                id="case-payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={casePaymentDraft.amount}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, amount: event.target.value }))}
                placeholder="np. 2000"
              />
            </div>
            <div>
              <Label htmlFor="case-payment-status">Status</Label>
              <select
                id="case-payment-status"
                value={casePaymentDraft.status}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, status: event.target.value }))}
              >
                <option value="deposit_paid">Zaliczka wp\u0142acona</option>
                <option value="partially_paid">Cz\u0119\u015Bciowo op\u0142acone</option>
                <option value="fully_paid">Op\u0142acone</option>
                <option value="awaiting_payment">Czeka na p\u0142atno\u015B\u0107</option>
              </select>
            </div>
            <div>
              <Label htmlFor="case-payment-type">Typ</Label>
              <select
                id="case-payment-type"
                value={casePaymentDraft.type}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, type: event.target.value }))}
              >
                <option value="deposit">Zaliczka</option>
                <option value="partial">Wp\u0142ata cz\u0119\u015Bciowa</option>
                <option value="final">Dop\u0142ata ko\u0144cowa</option>
                <option value="other">Inna wp\u0142ata</option>
              </select>
            </div>
            <div>
              <Label htmlFor="case-payment-note">Notatka</Label>
              <Textarea
                id="case-payment-note"
                value={casePaymentDraft.note}
                onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, note: event.target.value }))}
                placeholder="np. zaliczka po akceptacji oferty"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCasePaymentOpen(false)}>
              Anuluj
            </Button>
            <Button type="button" onClick={handleCreateCasePayment} disabled={casePaymentSubmitting || !hasAccess}>
              {casePaymentSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Zapisz wp\u0142at\u0119
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
`;
    text = text.slice(0, layoutEnd) + dialog + text.slice(layoutEnd);
  }

  if (text !== before) {
    writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
    console.log("Patched CaseDetail Stage28A.");
  } else {
    console.log("CaseDetail already Stage28A-ready.");
  }
}

function patchCss() {
  const file = path.join(root, "src/styles/visual-stage13-case-detail-vnext.css");
  ensureFile(file);
  let text = readUtf8NoBom(file);
  const marker = "/* stage28a case finance core */";
  const block = `
${marker}
.case-detail-finance-panel {
  margin: 14px 0 16px;
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, 0.42);
  border-radius: 22px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.case-detail-finance-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.case-detail-finance-head p {
  margin: 0 0 4px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.case-detail-finance-head h2 {
  margin: 0;
  color: #0f172a;
  font-size: 20px;
  line-height: 1.1;
}

.case-detail-finance-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.case-detail-finance-stat {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
}

.case-detail-finance-stat span {
  display: block;
  margin-bottom: 5px;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
}

.case-detail-finance-stat strong {
  color: #0f172a;
  font-size: 18px;
  line-height: 1.1;
}

.case-detail-finance-stat.is-paid {
  background: #ecfdf5;
  border-color: #bbf7d0;
}

.case-detail-finance-stat.is-paid strong {
  color: #047857;
}

.case-detail-finance-stat.is-left {
  background: #fff7ed;
  border-color: #fed7aa;
}

.case-detail-finance-stat.is-left strong {
  color: #c2410c;
}

.case-detail-finance-progress {
  height: 8px;
  margin-top: 12px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.case-detail-finance-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.case-detail-finance-payments {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.case-detail-finance-payments-head,
.case-detail-finance-payment-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.case-detail-finance-payments-head strong {
  color: #0f172a;
  font-size: 13px;
}

.case-detail-finance-payments-head span {
  min-width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 11px;
  font-weight: 900;
}

.case-detail-finance-payment-row {
  padding: 10px 11px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 14px;
  background: #ffffff;
}

.case-detail-finance-payment-row div {
  display: grid;
  gap: 3px;
}

.case-detail-finance-payment-row strong {
  color: #0f172a;
  font-size: 13px;
}

.case-detail-finance-payment-row span,
.case-detail-finance-payment-row small,
.case-detail-finance-empty {
  color: #64748b;
  font-size: 11px;
  line-height: 1.35;
}

.case-detail-payment-dialog select {
  width: 100%;
  min-height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 10px;
  background: #ffffff;
  color: #0f172a;
}

.case-detail-payment-form {
  display: grid;
  gap: 12px;
}

@media (max-width: 760px) {
  .case-detail-finance-head,
  .case-detail-finance-payment-row {
    flex-direction: column;
    align-items: stretch;
  }

  .case-detail-finance-grid {
    grid-template-columns: 1fr;
  }
}
`.trimEnd() + "\n";

  if (text.includes(marker)) {
    const start = text.indexOf(marker);
    const before = text.slice(0, start).replace(/\s*$/u, "\n\n");
    text = before + block;
  } else {
    text = text.replace(/\s*$/u, "\n\n" + block);
  }
  writeUtf8NoBom(file, text.endsWith("\n") ? text : text + "\n");
  console.log("Patched case detail CSS Stage28A.");
}

function patchPackageJson() {
  const file = path.join(root, "package.json");
  ensureFile(file);
  const pkg = JSON.parse(readUtf8NoBom(file));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts["check:stage28a-case-finance-core"] = "node scripts/check-stage28a-case-finance-core.cjs";
  writeUtf8NoBom(file, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched package.json Stage28A.");
}

patchClientDetailIdRuntime();
patchCaseDetail();
patchCss();
patchPackageJson();
console.log("Stage28A repair complete.");
