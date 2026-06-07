# Stage227E1 — Lead header + phone visibility

Data: 2026-06-07 Europe/Warsaw  
Tryb: local-only, bez pushu.

## Cel
Telefon i podstawowe dane leada mają być widoczne od razu po wejściu w LeadDetail.

## Decyzje
- Telefon trafia do kompaktowej linii danych w headerze.
- Jeśli telefonu nie ma, widoczny jest tekst "Brak telefonu".
- Telefon ma przycisk "Kopiuj".
- Header pokazuje też źródło, e-mail, firmę i ostatni kontakt.
- Nie ruszamy modelu danych, Supabase, notatek, blokad ani układu work center.

## Testy
- node scripts/check-stage227e1-lead-header-phone-visibility.cjs
- node --test tests/stage227e1-lead-header-phone-visibility.test.cjs
- node scripts/check-stage227e0-detail-shell-width-audit.cjs
- node scripts/check-stage227e4r3-lead-detail-runtime-copy-cleanup.cjs
- npm run build

## Ryzyka
- Header może być ciaśniejszy przy bardzo długich wartościach.
- Wymagany test wizualny po kilku leadach: z telefonem, bez telefonu, z e-mailem i bez e-maila.
