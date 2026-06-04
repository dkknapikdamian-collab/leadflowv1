# STAGE220A29 - Lead confirm and no runtime SW reload - 2026-06-04

## Cel

Naprawić:
- natywny komunikat przeglądarki przy przenoszeniu leada do kosza,
- runtime service worker register/update, który może zamykać aktywne modale po powrocie do zakładki.

## Zmiana

- Leads.tsx używa ConfirmDialog zamiast window.confirm dla kosza leada.
- Konfliktowy rekord też używa ConfirmDialog.
- register-service-worker.ts nie rejestruje już nowego worker podczas runtime.
- Istniejące service workery są tylko wyrejestrowane, cache closeflow-* wyczyszczony.
- Dodany guard A29.

## Nie ruszano

- SQL
- RLS
- API
- schema danych
- model refund
- logika finansów

## Test ręczny

1. Kliknij kosz przy leadzie.
2. Nie może pojawić się komunikat "Komunikat ze strony closeflowapp.vercel.app".
3. Ma pojawić się modal CloseFlow.
4. Otwórz modal, przejdź do innej karty przeglądarki, wróć.
5. Modal nie powinien zniknąć.
