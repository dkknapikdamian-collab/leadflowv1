# STAGE220A36-R4 — Build Guard and Case Item Schema Fix — REPORT

Data: 2026-06-05 22:15 Europe/Warsaw

## FAKTY
- Vercel build na commicie 00b8a95 padal na A35 guardzie przez mojibake.
- Dodanie braku padalo na PGRST204, bo payload POST case_items wysylal approved_at.
- R4 naprawia guardy i payload bez migracji Supabase.

## AUDYT RYZYK
- Najwieksze ryzyko: false PASS runnera po czerwonym guardzie. R4 wymusza prebuild i osobny guard payloadu.
- Usuniecie approved_at z POST moze oznaczac brak historii zatwierdzenia w nowych brakach, ale obecny schema cache i tak tego nie obsluguje.
- Zatwierdzanie/approved_at powinno byc osobnym etapem z SQL tylko, jesli realnie potrzebne.

## STATUS
Do testu lokalnego i push po PASS.
