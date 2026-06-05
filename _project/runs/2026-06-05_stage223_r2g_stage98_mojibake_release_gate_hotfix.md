# STAGE223 R2G - Stage98 mojibake release gate hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2F:
  - Stage220A17 OK
  - case trash actions OK
  - Stage113 OK
  - Stage223 guard/runtime OK
  - Stage222 regression OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `FAILED: stage98 calendar mojibake hard gate preflight`.
- Stage98 wykrył:
  - raw BOM w wielu plikach `src`,
  - stare mojibake w CSS/testach/scripts,
  - literalne markery mojibake w starszych guardach i skryptach naprawczych.
- To jest stary release-gate cleanup, nie błąd Stage223.

## ZAKRES

- Skanować tylko aktywne źródła zgodnie ze Stage98:
  - `src`
  - `tests`
  - `scripts`
- Usunąć BOM na początku pliku.
- Naprawić typowe mojibake pary do poprawnych polskich znaków.
- Pozostałe literalne zakazane codepointy w guardach/testach zamienić na ASCII unicode escapes.
- Nie zmieniać Activity Truth, Today ani Supabase.
- Nie wyłączać Stage98.

## RYZYKO

- To jest szeroki cleanup. Może dotknąć wiele starych skryptów/testów.
- Jeżeli po R2G `verify:closeflow:quiet` znajdzie kolejny historyczny gate, traktować go jako osobny release blocker, nie jako błąd Stage223.
- Po takim cleanupie trzeba sprawdzić `git diff --stat` i nie robić `git add .`.

## TESTY

```powershell
node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
node scripts/check-stage220a17-case-detail-vst-wiring.cjs
node scripts/check-closeflow-case-trash-actions.cjs
node --test tests/stage113-closeflow-logo-source-contract.test.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B + R2C + R2D + R2E + R2F + R2G.
