# STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — report

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Teza

Problem z Google Calendar nie powinien być rozwiązywany dopiero w Stage227. Najbliższe akcje, lejek i owner-control wymagają prawdziwych godzin oraz przypomnień.

## Zmiana

- dodano centralny kontrakt czasu Europe/Warsaw;
- UI przelicza reminderAt z lokalnego inputu bez zależności od timezone środowiska;
- event/task routes zapisują datetime-local jako intencję Europe/Warsaw do UTC;
- Google outbound wysyła timed event jako dateTime + timeZone Europe/Warsaw;
- Google inbound odczytuje dateTime + timeZone bez przesunięcia;
- guard i test blokują powrót gołego start.toISOString() w Google body.

## Audyt ryzyk

- Historyczne rekordy zapisane przed R11 mogą mieć już przesuniętą godzinę. Ten etap naprawia nowe/aktualizowane wpisy, nie migruje starych danych.
- Fail w Google reminders może wynikać z ustawień konta Google albo typu przypomnienia email/popup. Etap wymusza poprawny payload aplikacji, ale manual smoke dalej jest konieczny.
- Nie dodano migracji SQL. Jeśli brakuje kolumn Google reminder fields w Supabase, backend fallback usuwa brakujące kolumny, ale pełna trwałość exact reminders może wymagać osobnego SQL.
