# FAZA 3 - Etap 3.2A - Plan feature access gate

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** decyzja planów + backendowe blokady funkcji + pierwszy UI hook pod widoczność planów.

## Główna teza

CloseFlow ma być prosty:

```text
Free = demo z limitami
Basic = proste CRM bez ciężkich integracji
Pro = integracje i automatyzacje operacyjne
AI = pełny asystent AI
Trial = pełny AI przez 21 dni
```

Nie dodajemy nowych funkcji na siłę. Najpierw pilnujemy, żeby istniejące funkcje nie kłamały i nie były dostępne poza planem.

## Poziom przekonania

```text
8/10
```

## Argument za

Taki podział ma sens sprzedażowy:

- Free pokazuje wartość i pozwala przetestować proces,
- Basic daje tani plan dla solo usługodawcy,
- Pro ma jasny powód dopłaty: Google Calendar, raporty, import, cykliczność,
- AI ma jasny powód dopłaty: pełny asystent, a nie tylko parser.

## Argument przeciw

Basic z digestem i lekkimi szkicami może wymagać kosztów mail/AI. Dlatego pełny AI nie wchodzi do Basic. Lekki parser/szkice muszą pozostać ograniczone albo regułowe.

## Co zmieniłoby decyzję

Zmieniłbym plan matrix, jeśli:

- koszty AI będą za wysokie nawet w planie AI,
- Google Calendar okaże się głównym powodem zakupu, wtedy można go przesunąć wyżej/niżej,
- użytkownicy Basic będą kupować tylko dla digestu i będzie to zbyt kosztowne,
- Pro bez AI nie będzie dawał wystarczającej wartości.

## Najkrótszy test

Sprzedażowy test:

```text
Czy klient rozumie w 10 sekund, za co dopłaca z Free do Basic, Basic do Pro i Pro do AI?
```

Jeżeli nie, plan matrix jest zły.

## Decyzja planów

| Funkcja | Free | Basic | Pro | AI | Trial 21 dni |
|---|---:|---:|---:|---:|---:|
| Leady / klienci / sprawy / zadania / wydarzenia | limit | tak | tak | tak | tak |
| Limity aktywnych leadów | 5 | brak | brak | brak | brak |
| Limity aktywnych tasków | 5 | brak | brak | brak | brak |
| Limity aktywnych eventów | 5 | brak | brak | brak | brak |
| Limity aktywnych szkiców | 3 | brak | brak | brak | brak |
| Browser notifications | nie | tak | tak | tak | tak |
| Daily digest e-mail | nie | tak, jeśli env | tak, jeśli env | tak, jeśli env | tak, jeśli env |
| Light parser / lekkie szkice | nie | tak | tak | tak | tak |
| Google Calendar | nie | nie | tak | tak | tak |
| Weekly report | nie | nie | tak | tak | tak |
| CSV import | nie | nie | tak | tak | tak |
| Recurring reminders | nie | nie | tak | tak | tak |
| Full AI assistant | nie | nie | nie | tak | tak |

## Backend rule

Frontend nie wystarczy.

Każda płatna funkcja musi mieć backendowy gate:

```text
assertWorkspaceFeatureAccess(...)
```

Dla AI:

```text
assertWorkspaceAiAllowed(...)
```

Dla Google Calendar:

```text
assertWorkspaceFeatureAccess(workspaceId, 'googleCalendar')
```

## UI rule

Funkcja niedostępna w planie nie powinna być pokazywana jako aktywna funkcja.

Statusy dozwolone:

```text
available
hidden_by_plan
requires_config
beta
coming_soon
internal_only
```

Ten etap 3.2A dodaje pierwszy hook UI: Google Calendar w Settings ma bazować na `access.features.googleCalendar`, nie na samym `paid_active`.

Pełne ukrywanie UI wszystkich sekcji to następny etap:

```text
FAZA 3 - Etap 3.2B - Plan-based UI visibility and feature smoke
```

## Co robi ten etap

1. Dodaje `assertWorkspaceFeatureAccess` do `_access-gate.ts`.
2. Przepina `assertWorkspaceAiAllowed`, żeby bazował na `fullAi`.
3. Zamyka lukę: Pro nie daje już pełnego AI.
4. Dodaje Google Calendar gate w `api/leads.ts`, żeby lead mutation nie tworzyła eventu Google poza planem.
5. Przepina Settings Google Calendar z `paid_active` na `access.features.googleCalendar`.
6. Dodaje dokumenty plan feature matrix.
7. Dodaje guard i test.
8. Dopina test do `verify:closeflow:quiet`.

## Czego ten etap NIE robi

Ten etap nie robi jeszcze pełnego refactoru UI.

Ten etap nie odpala manualnego smoke wszystkich funkcji.

Ten etap nie dodaje nowych funkcji.

## Kryterium zakończenia

Etap 3.2A jest zamknięty, gdy:

- backend ma `assertWorkspaceFeatureAccess`,
- AI backend używa `fullAi`,
- Google Calendar w API leadów jest blokowany przez `googleCalendar`,
- Settings używa `access.features.googleCalendar`,
- plan matrix jest w dokumentach,
- guard/test/build przechodzą.

## Następny etap

```text
FAZA 3 - Etap 3.2B - Plan-based UI visibility and feature smoke
```

Tam trzeba przejść:

```text
Billing
Settings
Today
AiDrafts
QuickAiCapture
TodayAiAssistant
Google Calendar settings
Digest settings
PWA/notifications
```

i ukryć / pokazać funkcje według planu.
