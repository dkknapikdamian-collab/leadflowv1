# CloseFlow FIN-13 — finanse klienta jako finanse spraw

Data: 2026-05-13  
Branch: `dev-rollout-freeze`

## Cel

FIN-13 dodaje sekcję `Finanse klienta`, ale bez tworzenia osobnego modelu finansów klienta.

Klient pokazuje agregat finansów swoich spraw:

- suma wartości spraw,
- suma wpłat klienta,
- suma pozostała,
- suma prowizji należnej,
- suma prowizji zapłaconej,
- lista spraw z finansami.

## Decyzja

Źródłem prawdy nadal jest sprawa + płatności:

- `fetchCasesFromSupabase({ clientId })`,
- `fetchPaymentsFromSupabase({ clientId })`,
- grupowanie `paymentsByCaseId`,
- `getCaseFinanceSummary(caseRecord, paymentsForCase)` dla każdej sprawy.

Nie powstaje żadne saldo klienta ani niezależne finanse klienta.

## Wspólny modal

Paczka dodaje również fundament FIN-12, jeśli nie ma go jeszcze w repo:

- `src/components/finance/CaseFinanceEditorDialog.tsx`,
- `src/components/finance/CaseFinanceActionButtons.tsx`.

Sprawa i klient mają używać tego samego edytora wartości/prowizji sprawy.

## UI klienta

Przy każdej sprawie w finansach klienta są:

- nazwa sprawy,
- wartość,
- wpłacono,
- pozostało,
- prowizja,
- status prowizji,
- `Edytuj wartość/prowizję`,
- `Dodaj wpłatę`,
- `Otwórz sprawę`.

Wpłata dodawana z klienta zawsze ma `caseId`. Jeśli nie ma wskazanej sprawy, zapis jest blokowany.

## Weryfikacja

```powershell
npm.cmd run check:fin13
npm.cmd run test:fin13
npm.cmd run check:fin10
npm.cmd run test:fin10
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

## Manual smoke

1. Wejdź w klienta.
2. Otwórz zakładkę `Sprawy`.
3. Sprawdź sekcję `Finanse klienta`.
4. Przy konkretnej sprawie kliknij `Edytuj wartość/prowizję`.
5. Ustaw wartość i prowizję, zapisz.
6. Kliknij `Otwórz sprawę` i sprawdź, czy ta sama wartość jest widoczna w sprawie.
7. Wróć do klienta, dodaj wpłatę przy sprawie.
8. Odśwież stronę i sprawdź, czy klient i sprawa pokazują te same wartości.
