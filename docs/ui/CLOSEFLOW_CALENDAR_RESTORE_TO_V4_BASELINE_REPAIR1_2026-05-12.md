# CloseFlow — Calendar restore to V4 baseline Repair1

Repair1 poprawia błąd paczki restore: w skrypcie była literówka `restoredPaths`, a właściwa zmienna to `restorePaths`.

Zakres:
- przywrócenie `src/pages/Calendar.tsx` z commita `ca8404f`,
- przywrócenie `src/styles/closeflow-calendar-month-plain-text-rows-v4.css`,
- usunięcie aktywnych plików CSS po V4,
- build jako gate.

Nie ruszamy API, Supabase, danych, sidebaru, routingu ani innych ekranów.
