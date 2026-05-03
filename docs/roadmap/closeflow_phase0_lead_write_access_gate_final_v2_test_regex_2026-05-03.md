# CloseFlow Phase 0 — lead write access gate final v2

Data: 2026-05-03

Cel: naprawić ostatni czerwony release gate po poprawkach Vercel runtime/typecheck.

Zakres:
- poprawiony test statyczny `tests/phase0-lead-write-access-gate-final.test.cjs`, bo poprzednia wersja miała błędny regex bez escapingu `\s`,
- utrzymany kontrakt `assertWorkspaceWriteAccess` z warunkiem `isPastDate(nextBillingAt)`,
- utrzymane eksporty `assertWorkspaceAiAllowed` i `assertWorkspaceEntityLimit` wymagane przez handlery Vercel,
- bez zmian w UI i bez dotykania RentFlow.

Po wdrożeniu wymagane:
- `node tests/lead-write-access-gate.test.cjs`,
- `node tests/phase0-lead-write-access-gate-final.test.cjs`,
- `npm run check:polish-mojibake`,
- `npm run test:critical`,
- `npm run build`,
- `npx tsc --noEmit`,
- `npm run verify:closeflow:quiet`,
- `npm run audit:release-evidence -- --preview-url=https://closeflowapp.vercel.app`.
