# Stage 12 V13 — Szkice AI: prawdziwe przeniesienie + synchronizacja między urządzeniami

## Cel

Naprawić dwa problemy:

1. Błąd patchera Stage 12 (`ReferenceError: active is not defined`).
2. Różne szkice na telefonie i komputerze przez lokalny fallback `localStorage`.

## Co zmienia patch

### Szkice AI → finalne rekordy

- `Lead / Zadanie / Wydarzenie / Notatka` są wybierane jako cel przeniesienia.
- Po zmianie celu formularz przebudowuje się i autouzupełnia z treści szkicu.
- Zadanie używa `TASK_TYPES` i `PRIORITY_OPTIONS`.
- Wydarzenie używa `EVENT_TYPES`.
- Lead używa `SOURCE_OPTIONS`.
- Finalny zapis następuje dopiero po kliknięciu `Przenieś do aplikacji`.
- Po sukcesie szkic przechodzi do `Zatwierdzone`.

### Synchronizacja telefon ↔ komputer

- Szkice lokalne, które powstały offline albo przez fallback, są dosyłane do Supabase przy kolejnym odczycie.
- Widok szkiców łączy rekordy z Supabase i lokalne szkice jeszcze niewysłane.
- `saveAiLeadDraftAsync` nie tworzy już drugiego zdalnego szkicu przez podwójne wywołanie zapisu.
- Supabase jest traktowane jako wspólne źródło dla urządzeń, lokalny zapis zostaje tylko awaryjną siatką bezpieczeństwa.

## Ważne

Jeśli telefon ma stare lokalne szkice, których nie ma na komputerze, po wdrożeniu tej wersji trzeba otworzyć `Szkice AI` na telefonie. Aplikacja spróbuje wtedy dosłać lokalne szkice do Supabase. Po odświeżeniu komputer powinien zobaczyć te same szkice.

Jeśli urządzenia są zalogowane na różne konta lub różne workspace, listy nadal będą różne i to będzie poprawne zachowanie.

## Testy

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/ai-draft-real-transfer-stage12.test.cjs
node tests/ai-drafts-supabase-sync-stage13.test.cjs
```
