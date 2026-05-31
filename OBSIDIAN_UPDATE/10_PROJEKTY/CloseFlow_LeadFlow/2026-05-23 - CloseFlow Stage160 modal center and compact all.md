# CloseFlow Stage160 — Modal Center and Compact All

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / dialogs / all modal windows centered and compact

## FAKTY

- Po Stage159 wszystkie podokienka nadal wymagają poprawy.
- Główny problem: okna są za duże i/lub przesunięte zamiast być centered.
- Trzeba obsłużyć dwa konteksty: dialogi wewnątrz Stage157 zoomed app oraz portale poza root.

## DECYZJE DAMIANA

- Wszystkie podokienka mają być mniejsze i na środku.
- Dotyczy leadów, zadań, wydarzeń i pozostałych okien.
- Każda poprawka musi mieć guard.
- Bez pusha i deploya przed akceptacją.

## HIPOTEZY AI

- Poprawny Stage160 musi centrować inaczej dialogi w zoomed app i inaczej dialogi portaled poza root.
- To jest bardziej prawdopodobny root cause niż samo za duże paddingi.

## TESTY

```powershell
node scripts/check-stage160-modal-center-and-compact-all.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić ręcznie wszystkie główne modalne podokienka.
