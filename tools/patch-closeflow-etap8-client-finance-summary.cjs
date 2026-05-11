const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function write(rel, text) { fs.writeFileSync(path.join(root, rel), text, 'utf8'); }
function fail(message) { console.error(message); process.exit(1); }

function patchPackage() {
  const pkgPath = 'package.json';
  const pkg = JSON.parse(read(pkgPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow-client-finance-summary'] = 'node scripts/check-closeflow-client-finance-summary.cjs';
  write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function patchFinanceMiniSummary() {
  const rel = 'src/components/finance/FinanceMiniSummary.tsx';
  let text = read(rel);
  if (!text.includes("import { calculateClientFinanceSummary } from '../../lib/client-finance';")) {
    text = text.replace(
      "import { buildClientFinanceSummary } from '../../lib/finance/finance-client-summary';",
      "import { calculateClientFinanceSummary } from '../../lib/client-finance';",
    );
  }
  if (!text.includes("import { calculateClientFinanceSummary } from '../../lib/client-finance';")) {
    fail('Nie udało się przepiąć importu helpera finansów klienta.');
  }

  text = text.replace(
    /type ClientFinanceRelationSummaryProps = \{\n/,
    "type ClientFinanceRelationSummaryProps = {\n  client?: Record<string, unknown> | null;\n",
  );

  text = text.replace(
    /export function ClientFinanceRelationSummary\(\{\n/,
    "export function ClientFinanceRelationSummary({\n  client,\n",
  );

  text = text.replace("title = 'Finanse relacji',", "title = 'Podsumowanie finansów',");

  const oldSummary = `  const summary = useMemo(() => buildClientFinanceSummary({
    cases: Array.isArray(cases) ? cases : loadedCases,
    payments: Array.isArray(payments) ? payments : loadedPayments,
  }), [cases, loadedCases, loadedPayments, payments]);`;
  const newSummary = `  const summary = useMemo(() => calculateClientFinanceSummary({
    client: client || { id: resolvedClientId },
    cases: Array.isArray(cases) ? cases : loadedCases,
    payments: Array.isArray(payments) ? payments : loadedPayments,
    mode: 'primary_case_first',
  }), [cases, client, loadedCases, loadedPayments, payments, resolvedClientId]);`;
  if (text.includes(oldSummary)) {
    text = text.replace(oldSummary, newSummary);
  } else if (!text.includes('calculateClientFinanceSummary({')) {
    fail('Nie znaleziono bloku useMemo buildClientFinanceSummary w FinanceMiniSummary.');
  }

  text = text.replace('data-fin7-client-finance-summary="true"', 'data-fin8-client-finance-summary="true"');
  text = text.replace('<p className="cf-finance-kicker">FIN-7</p>', '<p className="cf-finance-kicker">FIN-8</p>');

  const marker = 'data-fin8-client-finance-summary="true"';
  const markerIndex = text.indexOf(marker);
  if (markerIndex === -1) fail('Nie znaleziono markera FIN-8 w komponencie finansów klienta.');
  const dlStart = text.indexOf('      <dl className="cf-finance-mini-summary__grid">', markerIndex);
  const dlEnd = text.indexOf('      </dl>', dlStart);
  if (dlStart === -1 || dlEnd === -1) fail('Nie znaleziono siatki metryk finansów klienta.');
  const afterDlEnd = dlEnd + '      </dl>'.length;
  const newGrid = `      <dl className="cf-finance-mini-summary__grid">
        <div className="cf-finance-metric">
          <dt>Wartość</dt>
          <dd>{formatMoney(summary.totalValue)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Opłacone</dt>
          <dd>{formatMoney(summary.paidValue)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Do domknięcia</dt>
          <dd>{formatMoney(summary.remainingValue)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Rozliczenia</dt>
          <dd>{summary.settlementsCount.toLocaleString('pl-PL')}</dd>
        </div>
      </dl>`;
  text = text.slice(0, dlStart) + newGrid + text.slice(afterDlEnd);

  write(rel, text);
}

function patchClientDetail() {
  const rel = 'src/pages/ClientDetail.tsx';
  let text = read(rel);
  if (!text.includes('<ClientFinanceRelationSummary')) {
    fail('Nie znaleziono ClientFinanceRelationSummary w ClientDetail.');
  }
  if (!text.includes('client={client}')) {
    const index = text.indexOf('<ClientFinanceRelationSummary');
    const lineEnd = text.indexOf('\n', index);
    if (lineEnd === -1) fail('Nie udało się znaleźć miejsca na prop client w ClientDetail.');
    text = text.slice(0, lineEnd + 1) + '                    client={client}\n' + text.slice(lineEnd + 1);
  }
  write(rel, text);
}

patchPackage();
patchFinanceMiniSummary();
patchClientDetail();
console.log('CLOSEFLOW_ETAP8_CLIENT_FINANCE_SUMMARY_PATCH_OK');
