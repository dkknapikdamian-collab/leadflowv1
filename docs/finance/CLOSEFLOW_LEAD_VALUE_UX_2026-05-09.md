# CloseFlow FIN-4 — Lead value UX

Marker: `FIN-4_CLOSEFLOW_LEAD_VALUE_UX_V1`

## Cel

Dodać do leadów opcjonalną, zwijaną sekcję finansową bez robienia osobnego panelu księgowego.

Sekcja ma obsługiwać minimum:

- wartość potencjalna,
- model prowizji: brak / procent / kwota stała,
- procent prowizji,
- kwota stała prowizji, gdy wybrano model stały,
- notatka finansowa.

## Zasada wizualna

FIN-4 nie tworzy lokalnej wyspy wizualnej.

Źródłem prawdy dla wyglądu są:

- `src/components/finance/LeadValuePanel.tsx`,
- `src/styles/finance/closeflow-finance.css`,
- istniejące prymitywy UI `Button` i `Input`,
- kontrakt finansowy FIN-1.

`Leads.tsx` i `LeadDetail.tsx` mają tylko podpiąć komponent i przekazać dane. Nie mają tworzyć własnego panelu finansowego ręcznie.

## Co zmienia FIN-4

- Dodaje komponent `LeadValuePanel`.
- Dodaje style `.cf-finance-lead-value-panel*` w istniejącym finance CSS.
- Dodaje opcjonalne pola finansowe do leadów w migracji.
- Rozszerza fallback/schema handling dla `api/leads.ts`.
- Rozszerza `LeadInsertInput` w `src/lib/supabase-fallback.ts`.
- Rozszerza normalizację leadów w `src/lib/data-contract.ts`.
- Rozszerza `relation-value.ts` o dodatkowe aliasy wartości leadów.
- Podpina panel w formularzu nowego leada i edycji leada.

## Czego FIN-4 nie robi

- Nie zmienia listy spraw.
- Nie zmienia `CaseDetail`.
- Nie tworzy pełnego księgowego modułu prowizji.
- Nie ukrywa istniejących pól `dealValue`.
- Nie robi automatycznego wyliczania płatności dla leadów z poziomu listy.

## Kryterium zakończenia

Etap jest zakończony, gdy guard `scripts/check-closeflow-lead-value-ux.cjs` zwraca:

```text
CLOSEFLOW_LEAD_VALUE_UX_FIN4_OK
```
