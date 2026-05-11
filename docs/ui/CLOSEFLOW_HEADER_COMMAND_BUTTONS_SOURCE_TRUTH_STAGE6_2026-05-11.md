# CloseFlow — Header Command Buttons Source Truth Stage 6

## Cel

Naprawić realny problem z przyciskami w górnym pasku i głównych kafelkach/headerach:

- `Szybki szkic` nie może mieć innego/dark tła niż reszta.
- `Inbox szkiców`, `Lead`, `Zadanie`, `Wydarzenie` mają mieć ten sam button skin.
- Przyciski w głównym kafelku mają mieć wspólne tło, kolor tekstu i ikon.
- Przyciski w głównym kafelku mają iść w prawy róg i być obok siebie na desktopie.
- Układ akcji ma być jednym źródłem prawdy, a nie lokalnym zlepkiem klas.

## Diagnoza

Są stare aktywne style, które komplikują sprawę:

1. `src/styles/closeflow-action-tokens.css` nadal ustawia:
   - `.cf-section-head-actions`
   - `.cf-section-head-action-stack`
   jako układ kolumnowy.

2. `src/components/GlobalQuickActions.tsx` renderuje toolbar:
   - `Szybki szkic`,
   - `Inbox szkiców`,
   - `Lead`,
   - `Zadanie`,
   - `Wydarzenie`.

3. `src/components/QuickAiCapture.tsx` renderuje trigger `Szybki szkic` jako zwykły `Button className="rounded-xl"`, więc nie miał tego samego source-of-truth co reszta paska.

4. Poprzednie poprawki headerów dotyczyły głównie tekstu/tła kafelka, a nie wszystkich akcji i ich zagnieżdżonych stacków.

## Nowe źródło prawdy

Plik:

`src/styles/closeflow-command-actions-source-truth.css`

Ten plik obsługuje:

- globalny pasek szybkich akcji,
- przyciski w page headerach,
- zagnieżdżone action stacki,
- Today stable header action stack.

## Import

Plik jest importowany:

- w `src/App.tsx`,
- w `src/components/GlobalQuickActions.tsx`,
- w `src/components/QuickAiCapture.tsx`,
- na końcu `src/styles/emergency/emergency-hotfixes.css`.

Powód: stare warstwy mają dużą specyficzność i część jest ładowana późno. Ten etap musi wygrać kaskadą.

## Nie zmieniać

- Logiki przycisków.
- Modali.
- Routingu.
- API.
- Tła głównego kafelka.
- Formularzy.
- List.

## Kryterium ręcznego testu

Po deployu / Ctrl+F5 sprawdzić:

1. Górny pasek:
   - `Szybki szkic`,
   - `Inbox szkiców`,
   - `Lead`,
   - `Zadanie`,
   - `Wydarzenie`
   mają to samo białe tło i niebieski tekst/ikonę.

2. Dziś:
   - `Odśwież dane` i `Widok` są obok siebie, nie jeden pod drugim.

3. Kalendarz:
   - przycisk AI/header action nie ma innego tła niż reszta.

4. Leady/Klienci/Sprawy/Zadania:
   - akcje w głównym kafelku są w prawym rogu i używają tego samego button skin.
