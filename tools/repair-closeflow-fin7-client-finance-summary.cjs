const fs = require('fs');

function read(rel) { return fs.readFileSync(rel, 'utf8'); }
function write(rel, text) { fs.writeFileSync(rel, text, 'utf8'); }
function ensureIncludes(text, needle, label) { if (!text.includes(needle)) throw new Error(`Missing ${label}: ${needle}`); }

function patchFinanceMiniSummary() {
  const rel = 'src/components/finance/FinanceMiniSummary.tsx';
  let text = read(rel);

  if (!text.includes("from 'react'")) {
    text = "import { useEffect, useMemo, useState } from 'react';\n" + text;
  } else if (!text.includes('useEffect') || !text.includes('useMemo') || !text.includes('useState')) {
    text = text.replace(/import\s*\{([^}]+)\}\s*from\s*['"]react['"];?/, (match, body) => {
      const names = new Set(body.split(',').map((part) => part.trim()).filter(Boolean));
      for (const name of ['useEffect', 'useMemo', 'useState']) names.add(name);
      return `import { ${Array.from(names).join(', ')} } from 'react';`;
    });
  }

  if (!text.includes("from '../../lib/finance/finance-client-summary'")) {
    text = text.replace(
      /import type \{ CommissionMode, CommissionStatus, FinanceSummary \} from '..\/..\/lib\/finance\/finance-types';\n/,
      "import type { CommissionMode, CommissionStatus, FinanceSummary } from '../../lib/finance/finance-types';\nimport { buildClientFinanceSummary } from '../../lib/finance/finance-client-summary';\n"
    );
  }

  if (!text.includes("from '../../lib/supabase-fallback'")) {
    const anchor = "import { buildClientFinanceSummary } from '../../lib/finance/finance-client-summary';\n";
    text = text.replace(anchor, anchor + "import { fetchCasesFromSupabase, fetchPaymentsFromSupabase } from '../../lib/supabase-fallback';\n");
  }

  if (!text.includes('FIN7_CLIENT_FINANCE_RELATION_SUMMARY_COMPONENT')) {
    const addition = `

type ClientFinanceRelationSummaryProps = {
  clientId?: string | null;
  cases?: Array<Record<string, unknown>>;
  payments?: Array<Record<string, unknown>>;
  title?: string;
};

export const FIN7_CLIENT_FINANCE_RELATION_SUMMARY_COMPONENT = 'FIN-7_CLIENT_FINANCE_RELATION_SUMMARY_COMPONENT_V1' as const;

export function ClientFinanceRelationSummary({
  clientId,
  cases,
  payments,
  title = 'Finanse relacji',
}: ClientFinanceRelationSummaryProps) {
  const [loadedCases, setLoadedCases] = useState<Array<Record<string, unknown>>>([]);
  const [loadedPayments, setLoadedPayments] = useState<Array<Record<string, unknown>>>([]);
  const resolvedClientId = String(clientId || '').trim();

  useEffect(() => {
    if (!resolvedClientId || Array.isArray(cases)) return;
    let cancelled = false;
    fetchCasesFromSupabase({ clientId: resolvedClientId })
      .then((rows) => { if (!cancelled) setLoadedCases(Array.isArray(rows) ? rows as Array<Record<string, unknown>> : []); })
      .catch(() => { if (!cancelled) setLoadedCases([]); });
    return () => { cancelled = true; };
  }, [cases, resolvedClientId]);

  useEffect(() => {
    if (!resolvedClientId || Array.isArray(payments)) return;
    let cancelled = false;
    fetchPaymentsFromSupabase({ clientId: resolvedClientId })
      .then((rows) => { if (!cancelled) setLoadedPayments(Array.isArray(rows) ? rows as Array<Record<string, unknown>> : []); })
      .catch(() => { if (!cancelled) setLoadedPayments([]); });
    return () => { cancelled = true; };
  }, [payments, resolvedClientId]);

  const summary = useMemo(() => buildClientFinanceSummary({
    cases: Array.isArray(cases) ? cases : loadedCases,
    payments: Array.isArray(payments) ? payments : loadedPayments,
  }), [cases, loadedCases, loadedPayments, payments]);

  return (
    <section className="cf-finance-mini-summary cf-finance-client-summary" data-fin7-client-finance-summary="true" aria-label={title}>
      <div className="cf-finance-mini-summary__header">
        <p className="cf-finance-kicker">FIN-7</p>
        <strong className="cf-finance-mini-summary__value">{title}</strong>
      </div>
      <dl className="cf-finance-mini-summary__grid">
        <div className="cf-finance-metric">
          <dt>Suma spraw</dt>
          <dd>{formatMoney(summary.contractValue, summary.currency)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Prowizja należna</dt>
          <dd>{formatMoney(summary.commissionAmount, summary.currency)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Wpłacono</dt>
          <dd>{formatMoney(summary.paidAmount, summary.currency)}</dd>
        </div>
        <div className="cf-finance-metric">
          <dt>Pozostało</dt>
          <dd>{formatMoney(summary.remainingAmount, summary.currency)}</dd>
        </div>
      </dl>
    </section>
  );
}
`;
    text = text.replace(/\nexport default FinanceMiniSummary;\s*$/, addition + '\n\nexport default FinanceMiniSummary;\n');
  }

  ensureIncludes(text, 'ClientFinanceRelationSummary', 'FIN-7 component export');
  ensureIncludes(text, 'Suma spraw', 'FIN-7 sum label');
  ensureIncludes(text, 'Prowizja należna', 'FIN-7 commission label');
  write(rel, text);
  console.log(`patched: ${rel}`);
}

function patchClientDetail() {
  const rel = 'src/pages/ClientDetail.tsx';
  let text = read(rel);
  if (!text.includes("../components/finance/FinanceMiniSummary")) {
    text = text.replace(
      /import \{ Button \} from '..\/components\/ui\/button';\n/,
      "import { Button } from '../components/ui/button';\nimport { ClientFinanceRelationSummary } from '../components/finance/FinanceMiniSummary';\n"
    );
  }

  if (!text.includes('data-fin7-client-detail-finance-summary')) {
    const panel = `
        <div data-fin7-client-detail-finance-summary="true">
          <ClientFinanceRelationSummary clientId={String((client as any)?.id || '')} />
        </div>
`;
    const layoutMatch = text.match(/<Layout[^>]*>/);
    if (!layoutMatch || typeof layoutMatch.index !== 'number') {
      throw new Error(`${rel}: cannot find <Layout> anchor for FIN-7 panel`);
    }
    const insertAt = layoutMatch.index + layoutMatch[0].length;
    text = text.slice(0, insertAt) + panel + text.slice(insertAt);
  }

  ensureIncludes(text, 'ClientFinanceRelationSummary', 'ClientDetail import/render');
  ensureIncludes(text, 'data-fin7-client-detail-finance-summary', 'ClientDetail FIN-7 mount marker');
  write(rel, text);
  console.log(`patched: ${rel}`);
}

function patchCss() {
  const rel = 'src/styles/finance/closeflow-finance.css';
  let text = read(rel);
  if (!text.includes('FIN-7_CLIENT_FINANCE_SUMMARY_STYLE')) {
    text += `

/* FIN-7_CLIENT_FINANCE_SUMMARY_STYLE */
.cf-finance-client-summary {
  margin: 0 0 16px;
}
.cf-finance-client-summary .cf-finance-mini-summary__value {
  font-size: 18px;
}
`;
    write(rel, text);
    console.log(`patched: ${rel}`);
  }
}

patchFinanceMiniSummary();
patchClientDetail();
patchCss();
console.log('CLOSEFLOW_FIN7_CLIENT_FINANCE_SUMMARY_PATCH_OK');
