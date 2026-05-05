# Stage85 - jednolite okna akcji kontekstowych

## Cel

Zadanie, wydarzenie i notatka mają wyglądać oraz działać tak samo niezależnie od tego, czy użytkownik zaczyna akcję z górnego paska, z leada, z klienta albo ze sprawy.

## Decyzja

Nie kopiujemy osobnych uproszczonych formularzy do każdego ekranu. Aplikacja dostaje jeden wspólny host dialogów w Layout, a ekrany szczegółów tylko wywołują właściwy typ akcji dla aktualnego rekordu.

## Zmienione elementy

- src/components/ContextActionDialogs.tsx - wspólny host i przechwytywanie kliknięć z ekranów szczegółów.
- src/components/TaskCreateDialog.tsx - obsługa kontekstu leada, klienta i sprawy.
- src/components/EventCreateDialog.tsx - wspólny rozbudowany dialog wydarzenia.
- src/components/ContextNoteDialog.tsx - wspólny dialog notatki dla rekordów.
- src/components/Layout.tsx - host dialogów podpięty raz w shellu.
- scripts/check-stage84-lead-detail-work-center.cjs i test Stage84 - wyczyszczone z literalnych uszkodzonych znaków.

## Nie zmienia

- Nie zmienia deduplikacji Stage64.
- Nie rusza Google Calendar OAuth ani billing.
- Nie usuwa istniejących danych.
- Nie tworzy zadań ani wydarzeń bez kliknięcia użytkownika.

## Kryterium zakończenia

- Kliknięcie dodania zadania, wydarzenia albo notatki z leada, klienta lub sprawy otwiera wspólny rozbudowany dialog.
- Zadanie i wydarzenie zapisują relację do aktualnego rekordu.
- Guardy nie przechowują literalnych uszkodzonych polskich znaków.
- Build produkcyjny przechodzi.
