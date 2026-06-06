# STAGE227B R3 — dev-only funnel preview route local report

Data: 2026-06-06 16:10 Europe/Warsaw

Zakres: dodać `/dev/funnel` jako lokalną trasę preview, żeby dało się ocenić Stage227B bez logowania.

Nie ruszać: Supabase, RLS, API, mutacji danych, produkcyjnego routingu `/funnel`, sidebaru.

Manual: uruchomić `npm run dev`, potem `Start-Process "http://localhost:3000/dev/funnel"`.
