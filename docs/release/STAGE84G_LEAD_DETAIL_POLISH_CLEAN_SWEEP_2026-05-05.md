# Stage84G - Lead Detail Polish clean sweep

Data: 2026-05-05  
Zakres: naprawa polskich znaków po Stage84 i domknięcie guardów

## Cel

Usunąć uszkodzone polskie znaki z plików dotkniętych przez Stage84 oraz z dokumentów release, które blokowały globalny guard Polish mojibake.

## Zmieniono

- wyczyszczono mojibake w plikach src, api, docs, scripts i tests,
- usunięto niecommitowane artefakty po nieudanych paczkach Stage84E i Stage84F,
- poprawiono check Stage84 tak, aby wymagał poprawnych polskich tekstów,
- dodano check Stage84G,
- dodano test Stage84G,
- dodano aliasy skryptów Stage84B, Stage84C, Stage84E i Stage84F do finalnego guardu Stage84G.

## Nie zmieniaj

- nie zmieniać logiki centrum pracy leada,
- nie zmieniać logiki deduplikacji Stage64,
- nie ruszać Google Calendar,
- nie ruszać billingu.

## Kryterium zakończenia

W LeadDetail i dokumentach release nie ma uszkodzonych polskich znaków. Guard check:polish-mojibake przechodzi.
