# CloseFlow Stage168 — Remove Sales List Label From Cards

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / card label cleanup

## FAKTY

- Stage167 został zastosowany lokalnie i build przeszedł.
- Użytkownik wskazał, że z każdego kafelka trzeba usunąć napis `LISTA SPRZEDAŻOWA`.

## DECYZJE DAMIANA

- Kasujemy `LISTA SPRZEDAŻOWA` z każdego kafelka.
- Nie kasujemy samych kafelków ani danych.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- To jest wizualny overline/label i nie powinien być powtarzany na każdym kafelku.
- Guard powinien skanować `src` po polskich, ASCII i mojibake wariantach.

## TESTY

```powershell
node scripts/check-stage168-remove-sales-list-label-from-cards.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić zakładki z kafelkami: leady, klienci, sprawy.
