# STAGE220A32B - case finance controls, delete action and label readability

## Cel
Naprawić trzy drobne, ale widoczne problemy w CaseDetail:
- przycisk `Usuń sprawę` ma wyglądać jak czerwony destrukcyjny action, bez dekoracyjnej kropki/pseudo-elementu,
- labelki w modalach finansowych mają być czytelne na ciemnym tle,
- wybór modelu prowizji ma blokować i odblokowywać właściwe pole.

## Decyzje
- `Procent od wartości transakcji`: aktywne jest pole stawki procentowej, kwota stała jest czyszczona i zablokowana.
- `Kwota stała`: aktywne jest pole kwoty prowizji, procent jest czyszczony i zablokowany.
- `Brak`: oba pola są czyszczone i zablokowane.

## Zakres
- `src/pages/CaseDetail.tsx`
- `src/styles/visual-stage13-case-detail-vnext.css`
- `src/styles/closeflow-case-finance-modal-stage220a30.css`
- `scripts/check-stage220a32-finance-controls-delete-labels.cjs`
- `package.json` prebuild guard wiring

## Czego nie ruszano
- API.
- Supabase.
- Historia wpłat i korekt.
- Algorytm liczenia prowizji.

## Testy
`node scripts/check-stage220a32-finance-controls-delete-labels.cjs`
`npm run build`
