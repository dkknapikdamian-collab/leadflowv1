# Today and calendar activity logging

Data: 2026-04-24

## Problem

Dziś i Kalendarz stały się ekranami operacyjnymi. Użytkownik może oznaczać wpisy jako wykonane, przywracać je i usuwać, ale te akcje nie miały jasnego śladu w historii aktywności.

## Decyzja

Akcje z ekranów Dziś i Kalendarz zapisują activity log.

## Zdarzenia

```text
calendar_entry_completed
calendar_entry_restored
calendar_entry_deleted
today_task_completed
today_task_restored
today_task_deleted
today_event_completed
today_event_restored
today_event_deleted
```

## Dane w payload

Payload zawiera:

- source: today albo calendar,
- entryId,
- sourceId,
- kind,
- title,
- startsAt,
- status,
- nextStatus przy przełączeniu statusu.

## Relacje

Jeśli wpis ma leadId albo caseId, aktywność jest zapisywana z relacją do leada albo sprawy.

## Efekt

- ekran Activity może pokazać, kto i kiedy wykonał/przywrócił/usunął wpis,
- historia klienta/sprawy dostaje ważne ślady operacyjne,
- łatwiej diagnozować przypadkowe kliknięcia i zmiany statusu.

## Zakres

Zmiana nie rusza SQL i nie zmienia modelu danych. Używa istniejącego insertActivityToSupabase.
