# Calendar selected day handler runtime fix v12 — 2026-05-14

## Problem

Produkcja zgłaszała:

```text
ReferenceError: handleEditEntry is not defined
APP_ROUTE_RENDER_FAILED
```

To oznacza, że renderowany kod `Calendar` przekazuje do JSX handler `handleEditEntry`, ale w zakresie funkcji `Calendar()` nie istnieje deklaracja `const handleEditEntry` ani `function handleEditEntry`.

## Przyczyna techniczna

Najbardziej prawdopodobna przyczyna to niedomknięty patch wybranego dnia w kalendarzu: komponenty kart przyjmują `onEdit`, ale rodzic przekazał nazwę lokalnego handlera bez definicji. Vite/esbuild może przepuścić sam build bez type-checku, więc taki błąd potrafi wyjść dopiero w runtime, jeśli nie ma osobnego guarda przed buildem.

## Naprawa

Pakiet:

1. Dodaje brakujący `handleEditEntry`, jeśli `Calendar.tsx` go używa i nie definiuje.
2. Handler otwiera istniejący tryb edycji przez `setEditEntry(entry)` i `setEditDraft(buildEditDraft(entry))`.
3. Nie zmienia układu kalendarza, copy ani miesięcznego widoku.
4. Dodaje guard `scripts/check-calendar-selected-day-handler-scope.cjs`.
5. Podpina guard do `prebuild`, żeby `npm run build` i Vercel nie przepuściły ponownie undefined handlera.

## Zakres nienaruszony

- Nie ruszamy skórki kalendarza.
- Nie zmieniamy modelu tasków/eventów.
- Nie wycinamy akcji edycji, bo edycja z wybranego dnia jest wymagana w V1.
- Nie dotykamy Google Calendar sync.

## Weryfikacja

Po wdrożeniu uruchomić:

```powershell
node scripts/check-calendar-selected-day-handler-scope.cjs
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

Manualnie:

1. Otwórz `/calendar`.
2. Kliknij dzień z zadaniem lub wydarzeniem.
3. Kliknij `Edytuj` przy wpisie z panelu `Wybrany dzień`.
4. Sprawdź, czy otwiera się edycja, a aplikacja nie wyrzuca `APP_ROUTE_RENDER_FAILED`.
5. Sprawdź `+1H`, `+1D`, `+1W`, `Zrobione`, `Usuń`.
