# STAGE220A31 - finance modal inset and commission basis

## Cel
Ujednolicić margines w modalach finansowych i naprawić język rozliczenia prowizji.

## Fakty
- Wartość transakcji/sprawy może być np. ceną działki 100 000 PLN.
- Prowizja 3% od 100 000 PLN daje 3 000 PLN wynagrodzenia.
- UI nie może sugerować, że 100 000 PLN to kwota prowizji do zapłaty.

## Zmiany
- Dodano bezpieczny wewnętrzny odstęp w modalach finansowych.
- Zmieniono etykiety: wartość transakcji, prowizja należna, wpłacono prowizji, do zapłaty prowizji.
- Podgląd w modalu pokazuje podstawę liczenia prowizji.
- Dodano guard STAGE220A31 i podpięto go do prebuild.

## Testy
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- npm run build

## Czego nie ruszano
- API płatności.
- Supabase.
- Historia wpłat i korekt.
- Algorytm liczenia prowizji procentowej, bo już liczy od wartości transakcji.
