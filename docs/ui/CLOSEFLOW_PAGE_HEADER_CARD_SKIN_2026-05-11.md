# CloseFlow — Page header / card skin tokens

## Cel

Ujednolicić wizualnie górne kafelki/nagłówki ekranów:

- Leady
- Klienci
- Sprawy
- Zadania
- Kalendarz
- Szablony
- Odpowiedzi
- Aktywność
- Szkice AI
- Powiadomienia
- Rozliczenia
- Pomoc
- Ustawienia
- Admin AI

## Zakres

To jest etap bezpieczny: CSS-only.

Nie dodaje runtime DOM patchera.
Nie dodaje MutationObserver.
Nie rusza pozycji modali.
Nie zmienia logiki przycisków.
Nie zmienia endpointów.
Nie zmienia formularzy.

## Jedno źródło prawdy

### Wygląd kafelków/nagłówków

`src/styles/closeflow-page-header.css`

Dodany blok:

`CLOSEFLOW_PAGE_HEADER_CARD_SKIN_2026_05_11`

### Kolory przycisków w nagłówkach

`src/styles/closeflow-action-tokens.css`

Dodany blok:

`CLOSEFLOW_HEADER_ACTION_TOKENS_2026_05_11`

## Decyzja kolorystyczna

- główny CTA: blue/indigo
- AI: violet/indigo
- neutralne: slate/white
- danger/delete: czerwony
- zielony: tylko status sukcesu, nie główne CTA

## Weryfikacja ręczna

Po wdrożeniu przejść:

1. `/leads`
2. `/clients`
3. `/cases`
4. `/tasks`
5. `/calendar`
6. `/templates`
7. `/response-templates`
8. `/activity`
9. `/ai-drafts`
10. `/notifications`
11. `/billing`
12. `/help`
13. `/settings`
14. `/settings/ai`

Sprawdzić:

- czy górny kafelek ma spójną czcionkę,
- czy tytuły mają jeden rozmiar i wagę,
- czy opisy mają jeden kolor,
- czy przyciski nie są zielone jako CTA,
- czy AI ma własny odcień violet/indigo,
- czy aplikacja się nie dławi.

## Ważna lekcja z poprzedniego błędu

Nie wdrażać nagłówków przez runtime modyfikujący DOM po renderze.
Jeśli później dokładamy opisy z jednego źródła prawdy, robimy to przez normalny komponent React w ekranach, etapami.
