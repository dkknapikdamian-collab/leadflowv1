# CloseFlow Stage174 — Main Search Surface and Text Normalization

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / main search bars / source truth refinement

## FAKTY

- Stage173 został zastosowany lokalnie i build przeszedł.
- Użytkownik wskazał, że w `Sprawy` tekst searcha jest inny/grubszy niż w `Lead/Klient`.
- W części search barów widać dwie warstwy.
- `Cases.tsx` ma placeholder `Szukaj sprawy, klienta, telefonu, maila albo statusu...`.

## DECYZJE DAMIANA

- Poprawić search bary wszędzie.
- Sprawy mają mieć ten sam styl i podobny placeholder jak Lead/Klient.
- Usunąć efekt dwóch warstw.
- Poszerzyć pasek do początku ciemnoszarego/prawego obszaru.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Double-layer powstaje, bo wrapper i input mają własne tło/border.
- Stage174 powinien nadpisać Stage173: wrapper layout-only, input surface-only.
- Placeholder w `Cases.tsx` trzeba znormalizować do source truth Lead/Klient.

## TESTY

```powershell
node scripts/check-stage174-main-search-surface-and-text-normalization.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Test wizualny `/cases`, `/clients`, `/leads`, `/tasks`.
