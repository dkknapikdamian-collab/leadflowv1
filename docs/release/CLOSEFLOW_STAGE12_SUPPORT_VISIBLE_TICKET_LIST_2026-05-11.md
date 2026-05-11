# CloseFlow Stage 12 - Support visible ticket list cleanup - 2026-05-11

## Cel

Strona `/help` ma byc prosta i operacyjna:

- formularz zgloszenia,
- lista moich zgloszen,
- status zgloszenia,
- miejsce na odpowiedz.

Usuwamy zbędny prawy rail i marketingowe/pomocnicze karty, ktore nie odpowiadaja na pytanie uzytkownika: gdzie jest moje zgloszenie i czy ktos odpowiedzial.

## Zakres

Patch dotyka tylko:

- `src/pages/SupportCenter.tsx` albo `src/pages/Help.tsx`, zaleznie od tego, ktory plik istnieje w repo,
- `src/styles/SupportCenter.css` albo pierwszy znaleziony `src/styles/support*.css`,
- `package.json`,
- nowy guard `scripts/check-closeflow-support-visible-ticket-list.cjs`.

## Zmiany UI

Usuniete z `/help`:

- `Zgłoszenia i status.` z headera,
- prawy panel `Szybkie linki`,
- prawy panel `Status aplikacji`,
- prawy panel `Kontakt`,
- pusty `support-right-rail`, jezeli byl tylko kontenerem dla usuwanych kart.

Dodane/uwidocznione:

- sekcja `Moje zgłoszenia`,
- marker `data-support-ticket-list="true"`,
- status UI z mapowaniem:
  - `open` / `new` -> `Nowe`,
  - `in_progress` / `pending` -> `W trakcie`,
  - `answered` / `resolved` -> `Odpowiedziane`,
  - `closed` -> `Zamknięte`,
  - inne -> `Status nieznany`,
- miejsce na `Odpowiedź`,
- fallback `Brak odpowiedzi.`, gdy backend nie ma odpowiedzi.

## Wazna uwaga produktowa

Na ten moment odpowiedz moze nie wracac do aplikacji, jesli backend tylko forwarduje mail. UI pokazuje miejsce na odpowiedz, ale integracja odpowiedzi wymaga osobnego etapu. Ten patch nie udaje odpowiedzi i nie tworzy sztucznych danych.

## Czego nie zmieniono

- Nie usunieto formularza zgloszenia.
- Nie usunieto API supportu.
- Nie zmieniono backendowego modelu statusow.
- Nie dodano sztucznych odpowiedzi.
- Nie przebudowano systemu supportu na panel operatora.

## Guard

Dodany skrypt:

```text
npm.cmd run check:support-visible-ticket-list
```

Sprawdza, ze:

- usunieto `Zgłoszenia i status.`,
- usunieto `Szybkie linki`,
- usunieto `Status aplikacji`,
- nie ma karty `Kontakt` jako `support-right-card`,
- istnieje `data-support-ticket-list="true"`,
- istnieje `Moje zgłoszenia`,
- istnieje `Brak odpowiedzi`,
- istnieje `support-ticket-status`.

## Kryterium zakonczenia

`/help` pokazuje prosty uklad: formularz kontaktu i liste moich zgloszen. Kazde zgloszenie ma status i miejsce na odpowiedz. Zbedne prawe karty sa usuniete.
