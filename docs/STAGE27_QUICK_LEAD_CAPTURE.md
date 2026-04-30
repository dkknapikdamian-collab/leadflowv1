# ETAP 27 — Quick Lead Capture / Szybki lead z notatki

## Cel

Użytkownik może wpisać albo podyktować krótką notatkę po rozmowie, a aplikacja przygotowuje szkic leada do sprawdzenia. Finalny lead powstaje dopiero po zatwierdzeniu użytkownika.

## Zakres wdrożenia

Dodano:

- `src/lib/quick-lead-parser.ts`
- `src/lib/quick-lead-parser.cjs`
- `src/components/quick-lead/QuickLeadCaptureModal.tsx`
- `src/components/quick-lead/index.ts`
- `src/styles/quick-lead-capture-stage27.css`
- `tests/stage27-quick-lead-capture.test.cjs`

Dodatkowo dodano hotfix wizualny kafelków w zakładce Zadania:

- `src/styles/hotfix-task-stat-tiles-clean.css`
- `tests/hotfix-task-stat-tiles-clean.test.cjs`

## Zasada bezpieczeństwa

Quick Lead Capture działa w trybie szkicu:

1. Notatka jest przetwarzana parserem regułowym.
2. Tworzony jest szkic AI/draft do sprawdzenia.
3. Użytkownik edytuje pola.
4. Dopiero kliknięcie `Zatwierdź i zapisz` tworzy finalnego leada.
5. Po zatwierdzeniu albo anulowaniu surowy tekst jest czyszczony z aktywnego szkicu.

## Parser regułowy

Parser wykrywa:

- kontakt,
- telefon,
- e-mail,
- źródło,
- potrzebę,
- następne działanie,
- termin,
- priorytet.

Parser działa bez AI. AI nie jest wymagane do działania tego etapu.

## Wejścia w UI

- Leady: przycisk `Dodaj szybkiego leada`.
- Globalny pasek szybkich akcji: przycisk `Szybki lead`, dostępny także z widoku Dziś.

## Testy

```powershell
node tests/stage27-quick-lead-capture.test.cjs
node tests/hotfix-task-stat-tiles-clean.test.cjs
npm.cmd run check:polish
npm.cmd run build
```

## Test ręczny

1. Wejdź w `/leads`.
2. Kliknij `Dodaj szybkiego leada`.
3. Wpisz: `Pani Anna z Tarnowa chce wycenę mieszkania, 608 123 456, zadzwonić jutro po 10, przyszła z Facebooka.`
4. Kliknij `Przetwórz notatkę`.
5. Sprawdź pola.
6. Kliknij `Zatwierdź i zapisz`.
7. Sprawdź, że lead został utworzony.
8. Jeśli był termin, sprawdź zadanie/follow-up.
9. Sprawdź `/ai-drafts`.
10. Sprawdź kafelki w `/tasks` — niebieska obwódka/tło za kafelkami nie powinny występować.
