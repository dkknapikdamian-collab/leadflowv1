# CloseFlow Stage172 — Global Client Button + Picker Icon Cleanup

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / global quick actions / client create dialog / picker cleanup

## FAKTY

- Stage171 został zastosowany lokalnie i build przeszedł.
- Globalne szybkie akcje są w `GlobalQuickActions.tsx`.
- Picker powiązań jest w `topic-contact-picker.tsx`.
- API helpery `createClientInSupabase` i `createCaseInSupabase` są dostępne.

## DECYZJE DAMIANA

- Lupkę w polu powiązania poprawić albo usunąć. Stage172 usuwa.
- Obok globalnych przycisków dodać `+ Klient`.
- Modal klienta ma mieć to samo źródło prawdy wizualnej co lead.
- W modalu klienta ma być opcja dodania sprawy od razu.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Usunięcie lupki jest lepsze niż dalsze przesuwanie jej CSS-em.
- Globalny `+ Klient` powinien otwierać modal bez zmiany trasy, tak jak globalne `+ Zadanie`.
- Modal klienta powinien używać `lead-form-vnext`, żeby zachować jeden motyw.

## TESTY

```powershell
node scripts/check-stage172-global-client-button-picker-icon-cleanup.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić globalny pasek i modale: `+ Klient`, `+ Lead`, `+ Zadanie`, `+ Wydarzenie`.
