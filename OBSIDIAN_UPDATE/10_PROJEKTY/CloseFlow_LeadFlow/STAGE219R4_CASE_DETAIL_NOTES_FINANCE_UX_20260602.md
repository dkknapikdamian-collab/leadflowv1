# Stage219-R4 - CaseDetail notes/finance UX repair

## FAKTY
- Po Stage219-R3 nazwa sprawy jest w górnej belce, ale notatki nie odświeżają widoku po zapisie i prawy panel nadal jest za ciężki.
- Wspólny host `ContextActionDialogs` przechwytuje kliknięcia w fazie capture. Przy explicit `data-context-action-kind` trzeba przenosić również `clientId` i `leadId`, inaczej akcje case tracą relację z klientem/lead.
- Prawa kolumna była zależna od wysokości lewego panelu przez wcześniejsze `display: contents` i ręczne grid-row.

## DECYZJE DAMIANA
- Nie pushować samemu.
- Dostarczyć ZIP i komendę.
- Widok ma wyglądać profesjonalnie i pracować bliżej jednego ekranu.
- Notatki mają dać się czytać i muszą się dodawać/odświeżać po zapisie.

## ZAKRES
- `src/pages/CaseDetail.tsx`
- `src/components/ContextActionDialogs.tsx`
- `src/components/CaseQuickActions.tsx`
- `src/styles/closeflow-detail-view-source-truth-stage219.css`
- `scripts/check-stage219r4-case-detail-notes-finance-ux.cjs`
- `tools/stage219r4-apply-case-detail-notes-finance-ux.cjs`

## ZMIANY
- CaseDetail nasłuchuje `closeflow:context-note-saved` i odświeża dane sprawy po zapisie notatki.
- Panel notatek dostaje realne przyciski `Dyktuj notatkę` i `Dodaj notatkę`.
- Explicit context actions przenoszą `clientId`, `leadId`, `caseId`.
- CaseQuickActions przekazują `data-context-client-id` i `data-context-lead-id`.
- CSS przywraca normalne osobne kolumny: lewa kolumna pracy i prawa kolumna kontekstu.
- Finanse idą wyżej w prawym panelu, a notatki zostają w szerokiej lewej kolumnie.

## TESTY
- `node scripts/check-stage219r4-case-detail-notes-finance-ux.cjs`
- `npm run build`
- ręcznie po deployu: dodaj notatkę, sprawdź czy pojawia się w panelu bez odświeżania strony.

## RYZYKA
- Nadal jest to etap CSS + punktowy patch. Docelowo widoki szczegółowe powinny dostać komponenty source-of-truth, nie tylko style.
- Dyktowanie w Stage219-R4 otwiera ten sam wspólny dialog notatki. Jeżeli LeadDetail ma osobny mechanizm speech-to-text, trzeba go później wydzielić jako wspólny komponent.

## NASTĘPNY KROK
Po apply/build zrobić selektywny commit/push i sprawdzić Vercel screen.
