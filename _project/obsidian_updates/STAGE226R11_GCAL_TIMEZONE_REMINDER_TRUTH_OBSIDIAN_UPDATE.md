# STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH — aktualizacja Obsidiana

- data i godzina: 2026-06-06 14:58 Europe/Warsaw
- nazwa / alias wejściowy: Stage226R11 — Google Calendar Timezone + Reminder Truth Audit/Fix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE226R11_GCAL_TIMEZONE_REMINDER_TRUTH_REPORT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: 01_PULPIT - CloseFlow Lead App.md / DO_POTWIERDZENIA
- mapa zależności: 06_MAPA_ZALEZNOSCI - CloseFlow Lead App.md / DO_POTWIERDZENIA
- ściąga plików: 07_SCIAGA_PLIKOW - CloseFlow Lead App.md / DO_POTWIERDZENIA
- typ wpisu: bugfix/audyt czasu i przypomnień Google Calendar przed Stage227
- docelowa ścieżka: 04_KIERUNEK_DO_WDROZENIA; 09_TESTY_DO_WYKONANIA_I_WYNIKI; 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
- status zapisu: przygotowano w repo _project/obsidian_updates; APPLY spróbuje dopisać do vaulta, jeśli ścieżki istnieją lokalnie
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Wpis do kierunku

Po R10D2 ręczny smoke konfliktów/duplikatów jest OK. Następny etap to R11: Google Calendar timezone + reminders. Stage227 ma czekać do potwierdzenia, że najbliższe akcje nie kłamią godzinami ani brakiem powiadomień.

## Testy ręczne

1. Dodaj wydarzenie w CloseFlow na 12:00 Europe/Warsaw z przypomnieniem 30 min wcześniej.
2. Sprawdź Network /api/events: startAt/scheduledAt/endAt/reminderAt.
3. Uruchom outbound sync.
4. Google Calendar ma pokazać 12:00 i przypomnienie 30 min przed.
5. Zmień w Google na 13:30 i uruchom inbound.
6. CloseFlow ma pokazać 13:30 bez przesunięcia.
7. Powtórz dla zadania.
8. Powtórz dla daty zimowej i letniej.

## Audyt ryzyk

- Stare rekordy mogły być już zapisane z przesunięciem — nie migrować ich automatycznie bez osobnego etapu.
- Przypomnienia Google mogą zależeć od ustawień konta i kalendarza, ale payload aplikacji ma zawierać poprawne reminders.
- Bez ręcznego smoke Google nie zamykać R11.
