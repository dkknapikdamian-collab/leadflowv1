# CloseFlow — Calendar Skin Only V1

## Cel

Wdrożyć zaakceptowany jasny styl kalendarza jako skórkę, bez przebudowy struktury.

## Twarda zasada

Panel boczny ma zostać widoczny.

Ten pakiet:
- nie zmienia JSX layoutu kalendarza,
- nie usuwa panelu bocznego,
- nie przepina renderowania miesiąca,
- nie zmienia handlerów,
- nie zmienia API,
- nie zmienia danych.

## Co zmienia

Dodaje:

`src/styles/closeflow-calendar-skin-only-v1.css`

oraz importuje ten plik w:

`src/pages/Calendar.tsx`

## Co robi CSS

- usuwa wizualnie duże czarne bloki z kalendarza,
- zamienia powierzchnie kalendarza na jasne karty,
- poprawia kontrast tekstu,
- zachowuje panel boczny,
- poprawia widoczność kafelków miesiąca,
- styluje chipy wydarzeń/zadań/telefonów,
- styluje „więcej” / overflow, jeśli taki element istnieje w DOM,
- robi puste dni jasne, a nie ciemne,
- pilnuje kolorów:
  - wydarzenie: fiolet,
  - zadanie: zieleń,
  - telefon/lead: niebieski,
  - usuń: czerwony,
  - standardowe akcje: niebieski.

## Czego nie rozwiązuje jeszcze w 100%

Jeśli obecny DOM miesięcznego kalendarza nie renderuje elementu typu `+ X więcej`, CSS może go tylko wystylować, ale nie może go stworzyć.
Wtedy następny etap będzie strukturalny: przepięcie realnego widoku miesiąca na układ z `+ X więcej` i panelem wybranego dnia.

## Kryterium zakończenia

Po wdrożeniu:
- kalendarz jest jasny,
- panel boczny dalej widoczny,
- miesiąc jest czytelniejszy,
- agenda/lista nie ma dużych czarnych sekcji,
- przyciski i chipy są spójne z resztą aplikacji.
