# Stage116 - DialogDescription accessibility / Radix warning cleanup

## Status
DO WDROŻENIA / P1.

## Cel
Usunąć warning Radix:
`Missing Description or aria-describedby={undefined} for {DialogContent}`.

## Zakres
- `src/pages/CaseDetail.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/Templates.tsx`
- `tests/stage116-dialog-description-accessibility-contract.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `tools/patch-stage116-dialog-description-a11y.cjs`

## Decyzja
Preferowany wariant to `DialogDescription`, nie masowe kneblowanie przez `aria-describedby={undefined}`. `aria-describedby={undefined}` zostaje tylko jako bezpieczny fallback dla ewentualnego `DialogContent` bez sensownego `DialogHeader/DialogTitle`.

## Fakty z repo
- `src/components/ui/dialog.tsx` już eksportuje `DialogDescription`.
- W aktywnych stronach były importy `DialogContent`, `DialogHeader`, `DialogTitle`, ale bez `DialogDescription`.
- Stage116 dokłada opis do aktywnych modalów w wskazanych plikach.

## Testy automatyczne
Do uruchomienia przez paczkę:
- `node --test tests/stage116-dialog-description-accessibility-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## Test ręczny po wdrożeniu
- Otworzyć modal kalendarza.
- Otworzyć modal sprawy.
- Otworzyć modal leada.
- Otworzyć modal szablonu.
- Konsola bez warningu Radix `Missing Description or aria-describedby`.

## Ryzyka
- Repo lokalne Damiana ma dużo wcześniejszych zmian i plików untracked. Paczka dodaje do commita tylko ścieżki Stage116.
- Jeśli warning zostanie jeszcze w innym ekranie, trzeba rozszerzyć guard na kolejny plik, nie obniżać kontraktu.

## Obsidian
Dodać notatkę:
`10_PROJEKTY/CloseFlow_Lead_App/2026-05-18 - CloseFlow Stage116 DialogDescription accessibility.md`.

## Następny krok
Po zielonym Stage116 i teście ręcznym wrócić do pozostałych problemów: Stage113 logo, Stage114 Calendar P0 batch, pusty odstęp LeadDetail i widok leadów w kliencie.
