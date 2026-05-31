# CloseFlow Stage173 — Main Search Source Truth

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / main search bars / source truth

## FAKTY

- Stage172 został wdrożony lokalnie i build przeszedł.
- Globalny `+ Klient` jest już widoczny.
- Paski wyszukiwania w głównych sekcjach nadal mają problem: za szerokie i/lub ikona nachodzi na placeholder.
- `Clients.tsx` i `Leads.tsx` mają `div.search`.

## DECYZJE DAMIANA

- Poprawić pasek wyszukiwania wszędzie.
- Podpiąć do jednego źródła prawdy wizualnej.
- Pasek ma kończyć się mniej więcej przy trzecim kafelku / lewej kolumnie.
- Lupka albo znak nie może zasłaniać tekstu.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Wspólny CSS i marker `data-cf-main-search-source="stage173"` jest bezpieczniejszy niż ręczne strojenie każdej zakładki.
- Dekoracyjne ikony w głównym searchu lepiej ukryć, żeby nie wracała kolizja z tekstem.
- Desktop max width 1060px powinien zatrzymać search w miejscu zbliżonym do trzeciego kafelka.

## TESTY

```powershell
node scripts/check-stage173-main-search-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Test `/clients` i `/leads`; potem szybki przegląd `/cases`, `/tasks`, `/templates`.
