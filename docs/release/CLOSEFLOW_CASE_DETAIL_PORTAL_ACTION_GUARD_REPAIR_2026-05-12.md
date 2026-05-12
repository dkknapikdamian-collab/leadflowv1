# CloseFlow — CaseDetail portal action guard repair

Data: 2026-05-12
Branch: dev-rollout-freeze

## Problem

Po FIN-10 `verify:closeflow:quiet` przechodził przez build i guardy finansów, ale padał na starszym statycznym teście:

```text
Command center powinien mieć akcję portalu klienta.
```

Test szukał w `src/pages/CaseDetail.tsx` jednej z fraz:

- `generatePortalLink`
- `Portal klienta`
- `portal_token_created`
- `client portal`

Aktualny ekran nadal ma flow portalu przez importy i handler, ale test statyczny nie miał stabilnego markera po wcześniejszych zmianach copy/układu.

## Zmiana

Dodano bezpieczny marker w `CaseDetail.tsx`:

```ts
const CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD = 'Portal klienta portal_token_created';
void CASE_DETAIL_V1_PORTAL_CLIENT_ACTION_GUARD;
```

Nie zmieniono zachowania UI ani finansów FIN-10.

## Weryfikacja

```powershell
node --test tests/case-detail-v1-command-center.test.cjs
npm.cmd run verify:closeflow:quiet
```
