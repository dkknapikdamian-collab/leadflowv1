# CloseFlow — Build Blockers Masscheck LeadDetail Fix Audit

Generated: 2026-05-12T06:19:11.891Z

Verdict: **PASS**

## Failures

- none

## Risky rows found by mass scan

- tools/patch-closeflow-build-blockers-masscheck-leaddetail-fix.cjs:21 [broken-polish-fallback-quote, common-broken-jsx-string-before-tag] `const before = "{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy}</small>";`
- tools/repair-stage14d-real-case-history-repair3.cjs:70 [bad-calendar-regex-token-from-v3] `const re = new RegExp('const\\s*\\[\\s*([A-Za-z_$][\\w$]*)\\s*,\\s*[A-Za-z_$][\\w$]*\\s*\\]\\s*=\\s*useState\\s*<\\s*' + escapeRegex(typeName) + '\\s*\\[\\]\\s*>', 'm');`
- tools/repair-stage14f-lead-detail-right-rail-cleanup-repair1.cjs:40 [broken-polish-fallback-quote, common-broken-jsx-string-before-tag] `"<small>{serviceCaseId ? serviceCaseStatusLabel : 'Brak powiązanej sprawy}</small>",`
- tools/repair-stage14f-lead-detail-right-rail-cleanup-repair1.cjs:98 [broken-polish-fallback-quote] `if (source.includes("'Brak powiązanej sprawy}</small>")) {`
- scripts/check-stage14f-lead-detail-right-rail-cleanup.cjs:26 [broken-polish-fallback-quote, common-broken-jsx-string-before-tag] `assertNotIncludes(source, "serviceCaseStatusLabel : 'Brak powiązanej sprawy}</small>", 'uszkodzony literal linked case');`
- scripts/check-stage14f-lead-detail-right-rail-cleanup.cjs:27 [broken-polish-fallback-quote] `assertNotIncludes(source, "'Brak powiązanej sprawy}</small>", 'brakujący apostrof w linked case empty state');`
