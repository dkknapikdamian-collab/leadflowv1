# STAGE220A31I - A14 guard evolution for commission basis

## Cel
Naprawić czerwony build po STAGE220A31H bez cofania decyzji produktowej: w finansach sprawy rozdzielamy wartość transakcji od prowizji należnej.

## Fakt
`npm run build` zatrzymał się na `STAGE220A14_FINANCE_SCOPE_GUARD_LOCK`, bo stary guard nadal wymagał etykiety `Wpłaty w sprawie`, mimo że nowy A31 pokazuje prowizję jako podstawowy model rozliczenia.

## Decyzja produktowa
Dla spraw typu sprzedaż działki/nieruchomości:
- `100 000 PLN` = wartość transakcji / sprawy,
- `3%` = stawka prowizji,
- `3 000 PLN` = prowizja należna / wynagrodzenie.

## Zakres techniczny
- Zaktualizowano `scripts/check-stage220a14-finance-scope-guard-lock.cjs`, aby akceptował A31, kiedy w `CaseDetail.tsx` istnieje marker `data-stage220a31-finance-billing-summary="true"`.
- Dodano guard `scripts/check-stage220a31i-a14-guard-evolution.cjs`.
- Nie cofnięto nowego UI ani modelu prowizji.

## Czego nie ruszano
- API płatności.
- Supabase.
- Historia wpłat i korekt.
- Wyliczanie prowizji w helperach finansowych.

## Testy
```powershell
node scripts/check-stage220a14-finance-scope-guard-lock.cjs
node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
node scripts/check-stage220a31i-a14-guard-evolution.cjs
npm run build
```
