# CloseFlow — Calendar Month Plain Text Deep Audit

## Cel

Zrobić masowy audyt problemu nakładania wpisów w widoku miesięcznym kalendarza.

## Hipoteza

Problemem nie jest już pojedynczy kolor ani jedna reguła CSS. Problemem jest to, że wpis w miesiącu jest renderowany i stylowany jako mały kafelek/chip, czyli „kafelek w kafelku”.

## Co sprawdza

- importy CSS w `Calendar.tsx`,
- aktywne stare warstwy kalendarza,
- ryzykowne reguły CSS dla overlapu,
- markery poprzednich prób naprawy,
- sygnały renderu w `Calendar.tsx`,
- czy trzeba iść w plain text row zamiast mini-kafelków.

## Wynik

Generuje:
- `docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.md`
- `docs/ui/CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_DEEP_AUDIT.generated.json`

## Następna decyzja

Jeśli raport potwierdzi screen, wdrażamy plain text rows w widoku miesiąca.
