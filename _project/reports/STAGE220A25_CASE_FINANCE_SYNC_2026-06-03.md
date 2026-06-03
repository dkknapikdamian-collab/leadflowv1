# STAGE220A25 - Case finance sync - 2026-06-03

## Cel

Naprawić przepływ:
klient tworzony z wartością i sprawą -> sprawa ma wartość -> CaseDetail pokazuje wartość -> wpłaty częściowe/pełne aktualizują sprawę i klienta.

## Diagnoza

- API spraw zapisuje wartość sprawy, jeśli dostanie ją w payload.
- Front klienta nie miał twardego kontraktu tworzenia sprawy z `contractValue`.
- CaseDetail miał dwa źródła płatności: `payments` i `casePayments`.

## Zmienione pliki

- src/lib/supabase-fallback.ts
- src/pages/Clients.tsx
- api/cases.ts
- src/pages/CaseDetail.tsx
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a25-case-finance-sync.cjs
- package.json

## Nie ruszano

- Supabase SQL
- RLS
- migracje
- routing
- schema danych

## Testy

- node scripts/check-stage220a25-case-finance-sync.cjs
- npm run build

## Test ręczny po deployu

1. Dodaj klienta.
2. W sekcji Sprawa startowa zostaw zaznaczone „Utwórz sprawę od razu”.
3. Wpisz wartość sprawy, np. 1280 PLN.
4. Otwórz klienta: finanse klienta mają pokazać 1280 PLN.
5. Otwórz sprawę: finanse sprawy mają pokazać wartość 1280 PLN.
6. Dodaj częściową wpłatę, np. 500 PLN.
7. Sprawa ma pokazać wpłacono 500 i do domknięcia 780.
8. Klient ma pokazać sumę wpłat 500 i do domknięcia 780.
9. Dodaj pełne rozliczenie pozostałej kwoty.
10. Sprawa i klient mają pokazać do domknięcia 0.
