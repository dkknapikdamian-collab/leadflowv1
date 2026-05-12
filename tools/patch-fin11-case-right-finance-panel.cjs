const fs = require('fs');
const path = require('path');

const root = process.cwd();
function file(p) { return path.join(root, p); }
function read(p) { return fs.readFileSync(file(p), 'utf8'); }
function write(p, s) { fs.writeFileSync(file(p), s, 'utf8'); }
function fail(msg) { throw new Error(msg); }

function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function insertAfterFunction(source, fnName, block) {
  if (source.includes('FIN-11_CASE_RIGHT_FINANCE_HELPERS')) return source;
  const start = source.indexOf(`function ${fnName}`);
  if (start < 0) fail(`Nie znaleziono funkcji ${fnName}`);
  const brace = source.indexOf('{', start);
  const end = findMatchingBrace(source, brace);
  if (end < 0) fail(`Nie znaleziono końca funkcji ${fnName}`);
  return source.slice(0, end + 1) + '\n\n' + block + source.slice(end + 1);
}

function patchPackageJson() {
  const p = 'package.json';
  const pkg = JSON.parse(read(p));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:fin11'] = 'node scripts/check-fin11-case-right-finance-panel.cjs';
  pkg.scripts['test:fin11'] = 'node --test tests/fin11-case-right-finance-panel.test.cjs';
  pkg.scripts['verify:fin11'] = 'npm.cmd run check:fin11 && npm.cmd run test:fin11 && npm.cmd run check:fin10 && npm.cmd run test:fin10';
  write(p, JSON.stringify(pkg, null, 2) + '\n');
  console.log('[FIN-11] package.json: dodano check/test/verify fin11');
}

function patchFin10Guard() {
  const p = 'scripts/check-fin10-case-finance-source-truth.cjs';
  if (!fs.existsSync(file(p))) return;
  let source = read(p);
  if (source.includes('FIN-11 allows data-case-finance-panel only for repaired right panel')) return;
  const old = "const oldPanelHits = activeUiFiles.filter((p) => read(p).includes('data-case-finance-panel'));\nassert(oldPanelHits.length === 0, `Stary aktywny panel data-case-finance-panel nadal istnieje: ${oldPanelHits.join(', ')}`);";
  const replacement = "const oldPanelHits = activeUiFiles.filter((p) => {\n  const content = read(p);\n  // FIN-11 allows data-case-finance-panel only for repaired right panel with visible edit actions.\n  return content.includes('data-case-finance-panel') && !content.includes('data-fin11-case-right-finance-panel');\n});\nassert(oldPanelHits.length === 0, `Stary aktywny panel data-case-finance-panel nadal istnieje bez FIN-11 repair marker: ${oldPanelHits.join(', ')}`);";
  if (source.includes(old)) {
    source = source.replace(old, replacement);
  } else if (source.includes("data-case-finance-panel")) {
    source = source.replace(/const oldPanelHits[\s\S]*?assert\(oldPanelHits\.length === 0,[\s\S]*?\);/, replacement);
  }
  write(p, source);
  console.log('[FIN-11] check-fin10: pozwala na naprawiony prawy panel FIN-11');
}

function patchCaseDetail() {
  const p = 'src/pages/CaseDetail.tsx';
  let source = read(p);

  if (!source.includes('FIN-11_CASE_RIGHT_FINANCE_PANEL')) {
    const constantAnchor = "const STAGE28A3_CASE_FINANCE_HISTORY_VISIBLE_REPAIR_GUARD = 'case finance history visible separate section';";
    if (!source.includes(constantAnchor)) fail('Nie znaleziono kotwicy stałych STAGE28A3 w CaseDetail.tsx');
    source = source.replace(constantAnchor, `${constantAnchor}\nconst FIN11_CASE_RIGHT_FINANCE_PANEL = 'FIN-11_CASE_RIGHT_FINANCE_PANEL_VISIBLE_EDIT_VALUE_COMMISSION';\nconst FIN11_CASE_PORTAL_ACTION_GUARD_COMPAT = 'Portal klienta';`);
  }

  const helperBlock = `/* FIN-11_CASE_RIGHT_FINANCE_HELPERS */
type CaseFinanceEditFormState = {
  contractValue: string;
  currency: string;
  commissionMode: 'none' | 'percent' | 'fixed';
  commissionRate: string;
  commissionAmount: string;
  commissionStatus: string;
};

type CaseFinancePaymentFormState = {
  type: 'partial' | 'commission';
  status: string;
  amount: string;
  currency: string;
  paidAt: string;
  dueAt: string;
  note: string;
};

function fin11Amount(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, value) : 0;
  const normalized = String(value ?? '').trim().replace(/\\s+/g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function fin11MoneyInput(value: unknown) {
  const amount = fin11Amount(value);
  return amount > 0 ? String(amount) : '';
}

function fin11Currency(value: unknown) {
  const normalized = String(value || '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'PLN';
}

function fin11DateTimeLocal(value: unknown) {
  const raw = String(value || '').trim();
  const date = raw ? new Date(raw) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fin11IsoFromLocal(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function formatCaseFinanceValueOrUnset(value: unknown, currency?: string) {
  const amount = fin11Amount(value);
  return amount > 0 ? formatMoney(amount, currency) : 'Nie ustawiono';
}

function buildFin11FinanceEditState(caseData: CaseRecord | null, payments: CasePaymentRecord[]): CaseFinanceEditFormState {
  const summary = getCaseFinanceSourceSummary(caseData, payments);
  return {
    contractValue: fin11MoneyInput(summary.contractValue),
    currency: fin11Currency(summary.currency),
    commissionMode: summary.commissionMode === 'percent' || summary.commissionMode === 'fixed' ? summary.commissionMode : 'none',
    commissionRate: fin11MoneyInput(summary.commissionRate),
    commissionAmount: fin11MoneyInput(summary.commissionAmount),
    commissionStatus: summary.commissionStatus || 'not_set',
  };
}

function buildFin11PaymentState(type: 'partial' | 'commission', currency: string): CaseFinancePaymentFormState {
  return {
    type,
    status: 'paid',
    amount: '',
    currency: fin11Currency(currency),
    paidAt: fin11DateTimeLocal(new Date().toISOString()),
    dueAt: '',
    note: '',
  };
}

function getFin11FinancePreview(form: CaseFinanceEditFormState, payments: CasePaymentRecord[]) {
  const contractValue = fin11Amount(form.contractValue);
  const clientPaidAmount = getCaseFinanceSourceSummary({ contractValue, currency: form.currency } as CaseRecord, payments).clientPaidAmount;
  const commissionRate = form.commissionMode === 'percent' ? Math.min(100, fin11Amount(form.commissionRate)) : 0;
  const commissionAmount = form.commissionMode === 'fixed'
    ? fin11Amount(form.commissionAmount)
    : form.commissionMode === 'percent'
      ? Math.round(((contractValue * commissionRate) / 100) * 100) / 100
      : 0;
  const commissionPaidAmount = getCaseFinanceSourceSummary({ contractValue, currency: form.currency } as CaseRecord, payments).commissionPaidAmount;
  return {
    contractValue,
    currency: fin11Currency(form.currency),
    commissionRate,
    commissionAmount,
    clientPaidAmount,
    commissionPaidAmount,
    remainingAmount: Math.max(contractValue - clientPaidAmount, 0),
    commissionRemainingAmount: Math.max(commissionAmount - commissionPaidAmount, 0),
  };
}`;
  source = insertAfterFunction(source, 'getCaseFinanceSummary', helperBlock);

  // Change the visible value in the old right panel from 0 PLN to Nie ustawiono when unset.
  source = source.replace(/formatMoney\(financeSummary\.expected,\s*financeSummary\.currency\)/g, 'formatCaseFinanceValueOrUnset(financeSummary.expected, financeSummary.currency)');

  // Insert FIN-11 state and handlers after casePayments state, so references are initialized.
  if (!source.includes('FIN-11_CASE_RIGHT_FINANCE_STATE_AND_HANDLERS')) {
    const stateRegex = /(const\s*\[casePayments,\s*setCasePayments\]\s*=\s*useState<CasePaymentRecord\[\]>\(\[\]\);)/;
    const stateMatch = source.match(stateRegex);
    if (!stateMatch) fail('Nie znaleziono stanu casePayments w CaseDetail.tsx');
    const stateBlock = `${stateMatch[1]}

  /* FIN-11_CASE_RIGHT_FINANCE_STATE_AND_HANDLERS */
  const [isFinanceEditOpen, setIsFinanceEditOpen] = useState(false);
  const [financeEditForm, setFinanceEditForm] = useState<CaseFinanceEditFormState>(() => buildFin11FinanceEditState(null, []));
  const [isFinanceSaving, setIsFinanceSaving] = useState(false);
  const [isFinancePaymentOpen, setIsFinancePaymentOpen] = useState(false);
  const [financePaymentForm, setFinancePaymentForm] = useState<CaseFinancePaymentFormState>(() => buildFin11PaymentState('partial', 'PLN'));

  const financeEditPreview = useMemo(() => getFin11FinancePreview(financeEditForm, casePayments), [casePayments, financeEditForm]);

  function openCaseFinanceEditModal() {
    setFinanceEditForm(buildFin11FinanceEditState(caseData, casePayments));
    setIsFinanceEditOpen(true);
  }

  function openCaseFinancePaymentModal(type: 'partial' | 'commission') {
    const summary = getCaseFinanceSourceSummary(caseData, casePayments);
    setFinancePaymentForm(buildFin11PaymentState(type, summary.currency));
    setIsFinancePaymentOpen(true);
  }

  async function reloadCaseFinanceData(nextCaseFallback?: CaseRecord | null) {
    const currentCaseId = String((nextCaseFallback || caseData)?.id || '').trim();
    if (!currentCaseId) return;
    const [freshCase, freshPayments] = await Promise.all([
      fetchCaseByIdFromSupabase(currentCaseId).catch(() => null),
      fetchPaymentsFromSupabase({ caseId: currentCaseId }).catch(() => casePayments as unknown[]),
    ]);
    const normalizedCase = normalizeRecord<CaseRecord>(freshCase) || nextCaseFallback;
    if (normalizedCase) setCaseData(normalizedCase);
    setCasePayments((Array.isArray(freshPayments) ? freshPayments : []) as CasePaymentRecord[]);
  }

  async function handleSaveCaseFinanceEdit() {
    if (!caseData?.id || isFinanceSaving) return;
    const contractValue = financeEditPreview.contractValue;
    const commissionMode = financeEditForm.commissionMode;
    const patch = buildCaseFinancePatch({
      contractValue,
      expectedRevenue: contractValue,
      currency: financeEditPreview.currency,
      commissionMode,
      commissionBase: 'contract_value',
      commissionRate: commissionMode === 'percent' ? financeEditPreview.commissionRate : null,
      commissionAmount: commissionMode === 'fixed' ? financeEditPreview.commissionAmount : financeEditPreview.commissionAmount,
      commissionStatus: financeEditForm.commissionStatus,
    });
    setIsFinanceSaving(true);
    try {
      const updatePayload = {
        id: caseData.id,
        ...patch,
        // FIN-11: derived cache for current backend contract. Payments remain the source of truth.
        remainingAmount: financeEditPreview.remainingAmount,
      } as any;
      const updatedCase = await updateCaseInSupabase(updatePayload);
      const nextCase = normalizeRecord<CaseRecord>(updatedCase) || ({ ...caseData, ...updatePayload } as CaseRecord);
      setCaseData(nextCase);
      await reloadCaseFinanceData(nextCase);
      setIsFinanceEditOpen(false);
      toast.success('Zapisano wartość i prowizję sprawy');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się zapisać wartości i prowizji sprawy');
    } finally {
      setIsFinanceSaving(false);
    }
  }

  async function handleSaveCaseFinancePayment() {
    if (!caseData?.id || isFinanceSaving) return;
    const amount = fin11Amount(financePaymentForm.amount);
    if (amount <= 0) {
      toast.error('Podaj kwotę płatności');
      return;
    }
    setIsFinanceSaving(true);
    try {
      await createPaymentInSupabase({
        caseId: caseData.id,
        clientId: caseData.clientId || null,
        leadId: caseData.leadId || null,
        type: financePaymentForm.type,
        status: financePaymentForm.status,
        amount,
        currency: fin11Currency(financePaymentForm.currency),
        paidAt: fin11IsoFromLocal(financePaymentForm.paidAt),
        dueAt: fin11IsoFromLocal(financePaymentForm.dueAt),
        note: financePaymentForm.note.trim(),
      });
      await reloadCaseFinanceData(caseData);
      setIsFinancePaymentOpen(false);
      toast.success(financePaymentForm.type === 'commission' ? 'Dodano płatność prowizji' : 'Dodano wpłatę');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się dodać płatności');
    } finally {
      setIsFinanceSaving(false);
    }
  }`;
    source = source.replace(stateMatch[1], stateBlock);
  }

  // Add attributes to the real right-card finance panel.
  if (!source.includes('data-fin11-case-right-finance-panel="true"')) {
    const titleIndex = source.indexOf('Rozliczenie sprawy');
    if (titleIndex < 0) fail('Nie znaleziono tekstu Rozliczenie sprawy w CaseDetail.tsx');
    const sectionStart = source.lastIndexOf('<section', titleIndex);
    const sectionEnd = source.indexOf('>', sectionStart);
    if (sectionStart < 0 || sectionEnd < 0 || sectionEnd > titleIndex) fail('Nie znaleziono sekcji panelu finansów przed Rozliczenie sprawy');
    const sectionOpen = source.slice(sectionStart, sectionEnd + 1);
    let nextSectionOpen = sectionOpen;
    if (!nextSectionOpen.includes('data-case-finance-panel=')) nextSectionOpen = nextSectionOpen.replace(/>$/, ' data-case-finance-panel="true">');
    if (!nextSectionOpen.includes('data-fin11-case-right-finance-panel=')) nextSectionOpen = nextSectionOpen.replace(/>$/, ' data-fin11-case-right-finance-panel="true">');
    source = source.slice(0, sectionStart) + nextSectionOpen + source.slice(sectionEnd + 1);
  }

  if (!source.includes('FIN-11_CASE_RIGHT_FINANCE_ACTIONS')) {
    const titleIndex = source.indexOf('Rozliczenie sprawy');
    if (titleIndex < 0) fail('Nie znaleziono Rozliczenie sprawy do wstawienia akcji');
    const titleClose = source.indexOf('>', source.indexOf('</', titleIndex));
    if (titleClose < 0) fail('Nie znaleziono końca nagłówka Rozliczenie sprawy');
    const actions = `
              <div className="case-finance-panel-actions" data-fin11-case-right-finance-actions="true">
                <Button type="button" size="sm" onClick={openCaseFinanceEditModal} disabled={isFinanceSaving}>
                  Edytuj wartość/prowizję
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => openCaseFinancePaymentModal('partial')} disabled={isFinanceSaving}>
                  Dodaj wpłatę
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => openCaseFinancePaymentModal('commission')} disabled={isFinanceSaving}>
                  Dodaj płatność prowizji
                </Button>
              </div>
              <span hidden data-fin11-case-right-finance-actions-marker="FIN-11_CASE_RIGHT_FINANCE_ACTIONS" />`;
    source = source.slice(0, titleClose + 1) + actions + source.slice(titleClose + 1);
  }

  if (!source.includes('FIN-11_CASE_RIGHT_FINANCE_MODALS')) {
    const layoutEnd = source.lastIndexOf('</Layout>');
    if (layoutEnd < 0) fail('Nie znaleziono </Layout> do wstawienia modali FIN-11');
    const modals = `

      {/* FIN-11_CASE_RIGHT_FINANCE_MODALS */}
      <Dialog open={isFinanceEditOpen} onOpenChange={setIsFinanceEditOpen}>
        <DialogContent className="case-finance-edit-modal">
          <DialogHeader>
            <DialogTitle>Wartość sprawy i prowizja</DialogTitle>
          </DialogHeader>
          <div className="case-finance-edit-form">
            <label className="case-finance-edit-field">
              <span>Wartość sprawy / transakcji</span>
              <Input inputMode="decimal" value={financeEditForm.contractValue} placeholder="Nie ustawiono" onChange={(event) => setFinanceEditForm((current) => ({ ...current, contractValue: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Waluta</span>
              <Input value={financeEditForm.currency} placeholder="PLN" maxLength={3} onChange={(event) => setFinanceEditForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Model prowizji</span>
              <select className="case-finance-edit-select" value={financeEditForm.commissionMode} onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionMode: event.target.value as 'none' | 'percent' | 'fixed' }))}>
                <option value="none">Brak</option>
                <option value="percent">Procent od wartości</option>
                <option value="fixed">Kwota stała</option>
              </select>
            </label>
            <label className="case-finance-edit-field">
              <span>Procent prowizji</span>
              <Input inputMode="decimal" value={financeEditForm.commissionRate} disabled={financeEditForm.commissionMode !== 'percent'} placeholder="np. 3" onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionRate: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Kwota prowizji</span>
              <Input inputMode="decimal" value={financeEditForm.commissionAmount} disabled={financeEditForm.commissionMode !== 'fixed'} placeholder="np. 3000" onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionAmount: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Status prowizji</span>
              <select className="case-finance-edit-select" value={financeEditForm.commissionStatus} onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionStatus: event.target.value }))}>
                <option value="not_set">nieustawiona</option>
                <option value="expected">oczekiwana</option>
                <option value="due">należna</option>
                <option value="partially_paid">częściowo zapłacona</option>
                <option value="paid">zapłacona</option>
                <option value="overdue">zaległa</option>
              </select>
            </label>
            <div className="case-finance-edit-preview" data-fin11-case-finance-preview="true">
              <div><span>Prowizja należna:</span><strong>{formatMoney(financeEditPreview.commissionAmount, financeEditPreview.currency)}</strong></div>
              <div><span>Po wpłatach klienta pozostaje:</span><strong>{formatMoney(financeEditPreview.remainingAmount, financeEditPreview.currency)}</strong></div>
              <div><span>Do zapłaty prowizji:</span><strong>{formatMoney(financeEditPreview.commissionRemainingAmount, financeEditPreview.currency)}</strong></div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFinanceEditOpen(false)} disabled={isFinanceSaving}>Anuluj</Button>
            <Button type="button" onClick={handleSaveCaseFinanceEdit} disabled={isFinanceSaving || financeEditPreview.contractValue <= 0}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFinancePaymentOpen} onOpenChange={setIsFinancePaymentOpen}>
        <DialogContent className="case-finance-edit-modal">
          <DialogHeader>
            <DialogTitle>{financePaymentForm.type === 'commission' ? 'Dodaj płatność prowizji' : 'Dodaj wpłatę'}</DialogTitle>
          </DialogHeader>
          <div className="case-finance-edit-form">
            <label className="case-finance-edit-field">
              <span>Kwota</span>
              <Input inputMode="decimal" value={financePaymentForm.amount} placeholder="np. 20000" onChange={(event) => setFinancePaymentForm((current) => ({ ...current, amount: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Waluta</span>
              <Input value={financePaymentForm.currency} maxLength={3} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Status</span>
              <select className="case-finance-edit-select" value={financePaymentForm.status} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, status: event.target.value }))}>
                <option value="paid">opłacona</option>
                <option value="partially_paid">częściowo opłacona</option>
                <option value="fully_paid">w pełni opłacona</option>
                <option value="deposit_paid">zaliczka wpłacona</option>
                <option value="due">należna</option>
                <option value="planned">zaplanowana</option>
              </select>
            </label>
            <label className="case-finance-edit-field">
              <span>Data zapłaty</span>
              <Input type="datetime-local" value={financePaymentForm.paidAt} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, paidAt: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field">
              <span>Termin</span>
              <Input type="datetime-local" value={financePaymentForm.dueAt} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, dueAt: event.target.value }))} />
            </label>
            <label className="case-finance-edit-field case-finance-edit-field--wide">
              <span>Notatka</span>
              <Textarea value={financePaymentForm.note} placeholder="np. przelew / gotówka / faktura" onChange={(event) => setFinancePaymentForm((current) => ({ ...current, note: event.target.value }))} />
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFinancePaymentOpen(false)} disabled={isFinanceSaving}>Anuluj</Button>
            <Button type="button" onClick={handleSaveCaseFinancePayment} disabled={isFinanceSaving || fin11Amount(financePaymentForm.amount) <= 0}>Zapisz płatność</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>`;
    source = source.slice(0, layoutEnd) + modals + '\n' + source.slice(layoutEnd);
  }

  write(p, source);
  console.log('[FIN-11] CaseDetail: prawy panel finansów, przyciski i modale OK');
}

function patchCss() {
  const p = 'src/styles/visual-stage13-case-detail-vnext.css';
  let source = read(p);
  if (!source.includes('FIN-11_CASE_RIGHT_FINANCE_PANEL_STYLES')) {
    source += `

/* FIN-11_CASE_RIGHT_FINANCE_PANEL_STYLES */
.case-finance-panel-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 10px;
}

.case-finance-panel-actions .btn,
.case-finance-panel-actions button {
  width: 100%;
  justify-content: center;
}

.case-finance-edit-modal {
  max-width: 680px;
}

.case-finance-edit-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-top: 4px;
}

.case-finance-edit-field {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: var(--cf-text-muted, #64748b);
}

.case-finance-edit-field--wide,
.case-finance-edit-preview {
  grid-column: 1 / -1;
}

.case-finance-edit-select {
  min-height: 38px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--cf-border, rgba(148, 163, 184, 0.35));
  background: var(--cf-surface, #fff);
  color: var(--cf-text, #0f172a);
  padding: 0 10px;
}

.case-finance-edit-preview {
  display: grid;
  gap: 8px;
  border: 1px solid var(--cf-border, rgba(148, 163, 184, 0.35));
  border-radius: 14px;
  padding: 12px;
  background: var(--cf-surface-muted, rgba(148, 163, 184, 0.08));
}

.case-finance-edit-preview div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 680px) {
  .case-finance-edit-form {
    grid-template-columns: 1fr;
  }
}
`;
    write(p, source);
    console.log('[FIN-11] CSS: style panelu i modali OK');
  }
}

function main() {
  patchPackageJson();
  patchFin10Guard();
  patchCaseDetail();
  patchCss();
  console.log('[FIN-11] patch zakończony');
}

main();
