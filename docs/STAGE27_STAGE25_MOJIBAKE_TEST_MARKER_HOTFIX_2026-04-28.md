# Stage27 — Stage25 mojibake test marker hotfix

## Cel

Usunąć literalne markery uszkodzonego kodowania z testu Stage25, które blokowały pełny gate `verify:closeflow:quiet`.

## Problem

Po wdrożeniu paczki V26 aplikacja budowała się poprawnie, a test Stage25 przechodził osobno. Pełny gate padał jednak na audycie polskiego kodowania, bo plik testowy Stage25 zawierał bezpośrednio znaki używane jako markery mojibake.

## Zmienione pliki

- `tests/client-detail-edit-save-and-multi-contact-stage25.test.cjs`
- `tests/stage25-mojibake-marker-hotfix-v27.test.cjs`

## Nie zmieniono

- runtime aplikacji,
- UI,
- API,
- SQL,
- logiki zapisu klienta,
- logiki wielu kontaktów klienta.

## Weryfikacja

Po wdrożeniu uruchomić:

```text
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/client-detail-edit-save-and-multi-contact-stage25.test.cjs
node tests/stage25-mojibake-marker-hotfix-v27.test.cjs
```

## Kryterium zakończenia

Pełny gate `verify:closeflow:quiet` przechodzi bez błędu `polish-mojibake-audit`.
