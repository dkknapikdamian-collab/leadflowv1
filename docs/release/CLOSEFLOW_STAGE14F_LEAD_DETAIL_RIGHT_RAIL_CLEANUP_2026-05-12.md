# CLOSEFLOW STAGE14F — LeadDetail right rail cleanup

## Cel
Naprawa prawego raila na `/leads/:id` bez zmiany flow `Rozpocznij obsługę`.

## Zakres
- Usunięto copy: `Co tu trzeba zrobić teraz`.
- Usunięto opis: `Krótki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.`.
- Brak najbliższej akcji ma być pokazany jako `-`.
- Powód ryzyka ma fallback `Powód: -`.
- Przycisk `Rozpocznij obsługę` dostaje widoczny marker i klasy akcji.
- Prawy rail dostaje lokalne CSS override przeciw ucinaniu tekstów.

## Nie zmienia
- Nie zmienia handoffu lead → sprawa.
- Nie zmienia API.
- Nie dodaje nowych funkcji AI.
- Nie usuwa karty szybkich akcji.

## Guard
`scripts/check-stage14f-lead-detail-right-rail-cleanup.cjs`
