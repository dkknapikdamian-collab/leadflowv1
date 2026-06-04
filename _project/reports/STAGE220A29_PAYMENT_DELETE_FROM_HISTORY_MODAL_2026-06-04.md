# STAGE220A29 - Usuwanie wpłaty z modala historii wpłat i korekt

Data: 2026-06-04
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

## Cel

Dodać w oknie `Historia wpłat i korekt` możliwość usunięcia konkretnej wpłaty/korekty. Dotychczas w tym oknie była akcja `Koryguj`, ale brakowało bezpośredniej akcji `Usuń` dla błędnie dodanej wpłaty.

## Fakty z repo

- Widok i modal są w `src/pages/CaseDetail.tsx`.
- Helper `deletePaymentFromSupabase(id)` już istnieje w `src/lib/supabase-fallback.ts`, więc etap nie tworzy nowego API.
- Historia finansowa sprawy używa `reloadCaseFinanceData(caseData)` po zmianach.

## Zakres zmian

- Dodano import `deletePaymentFromSupabase` w `CaseDetail.tsx`.
- Dodano stan usuwania: `paymentDeleteTargetStage220A29` i `paymentDeleteSubmittingStage220A29`.
- Dodano `openPaymentDeleteConfirmStage220A29(payment)`.
- Dodano `handleConfirmDeletePaymentStage220A29()`.
- W modalu historii wpłat dodano przycisk `Usuń` przy każdym rekordzie z identyfikatorem.
- Usuwanie idzie przez potwierdzenie `ConfirmDialog` z `confirmTone="destructive"`.
- Po usunięciu wykonywane jest odświeżenie finansów sprawy i wpis aktywności `payment_deleted`.
- Dodano guard `scripts/check-stage220a29-payment-delete-from-history-modal.cjs`.

## Czego nie ruszano

- Nie zmieniano Supabase schema ani migracji.
- Nie zmieniano działania korekty jako refund-record.
- Nie zmieniano logiki liczenia finansów poza odświeżeniem po usunięciu.
- Nie wykonywano pushu.

## Testy / guardy

Automatyczne:

```powershell
node scripts/check-stage220a29-payment-delete-from-history-modal.cjs
npm run build
```

Ręczne:

1. Otwórz sprawę z wpłatą.
2. W panelu finansów kliknij `Koryguj wpłatę`.
3. W oknie `Historia wpłat i korekt` sprawdź, czy przy rekordzie jest `Koryguj` i `Usuń`.
4. Kliknij `Usuń`.
5. Potwierdź w dialogu.
6. Sprawdź, czy rekord znika z historii i czy suma wpłat/do domknięcia przelicza się po odświeżeniu.
7. Sprawdź, czy korekty/refundy też można usunąć jako oddzielne rekordy, jeśli były dodane pomyłkowo.

## Ryzyka

- Usunięcie jest twardą operacją API `DELETE /api/payments?id=...`; to nie jest miękka korekta. Dlatego etap wymusza potwierdzenie.
- Jeśli endpoint DELETE po stronie API ma ograniczenia RLS/workspace, błąd zostanie pokazany w toast.

## Następny krok

Po lokalnym teście i buildzie wykonać selektywny commit/push na `dev-rollout-freeze`.
