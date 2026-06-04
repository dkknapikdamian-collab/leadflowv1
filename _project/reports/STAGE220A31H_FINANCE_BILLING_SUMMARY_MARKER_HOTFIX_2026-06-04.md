# STAGE220A31H - finance billing summary marker hotfix

## Cel
Domknąć częściowo nałożony STAGE220A31 po błędach paczek A31E/A31F/A31G.

## Fakt
Guard STAGE220A31 wymagał markera `data-stage220a31-finance-billing-summary="true"` w prawym panelu finansów. Brak tego markera blokował etap.

## Zakres
- Wymieniono blok metryk finansów sprawy na jasny model: wartość transakcji, prowizja należna, wpłacono prowizji, do zapłaty prowizji.
- Dodano marker `data-stage220a31-finance-billing-summary="true"`.
- Utrzymano kompatybilność z wcześniejszymi guardami przez ukryty legacy token dla `clientPaidAmount` i `remainingAmount`.
- Utrzymano wymóg bezpiecznego marginesu w modalach finansowych.

## Testy
- node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs
- npm run build

## Czego nie ruszano
- API.
- Supabase.
- Historia wpłat.
- Algorytm liczenia prowizji procentowej.
