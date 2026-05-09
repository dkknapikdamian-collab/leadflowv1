# CLOSEFLOW VS-7 Repair7: Cases FileText runtime fix

## Cel
Naprawia release gate `tests/cases-filetext-runtime.test.cjs` po serii napraw VS-7.

## Problem
`Cases.tsx` ma przejsc release gate, ktory wymaga, aby ekran spraw nadal jawnie eksponowal ikone `FileText` i importowal ja z `lucide-react`.

## Zmiana
- Dodaje `FileText` do importu `lucide-react` w `src/pages/Cases.tsx`.
- Przepina kafelek `W realizacji` na `icon={FileText}`.
- Nie zmienia danych, Supabase, routingu, statusow ani logiki spraw.

## Kryterium zakonczenia
- `node --test tests/cases-filetext-runtime.test.cjs` przechodzi.
- `npm run verify:closeflow:quiet` przechodzi albo pokazuje kolejny niezalezny gate.
- `npm run test:raw` i `npm run build` przechodza przed commitem.
