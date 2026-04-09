# ETAP 16 — Raport QA (template)

Wypełnij ten plik po przejściu ETAP 16 na gałęzi `freeze`.

## Metadane

- Data:
- Branch:
- Commit:
- Środowisko (local/prod/preview):
- Urządzenia:
  - Desktop:
  - Mobile:

## Automatyczne testy

- `cmd /c "npm test"`: PASS / FAIL
- `cmd /c "npm run build"`: PASS / FAIL
- `cmd /c "npm run smoke:prod:build"`: PASS / FAIL

## Manual smoke — operator (flow end-to-end)

1. Lead wpada: PASS / FAIL
2. Lead ma next step: PASS / FAIL
3. Lead przechodzi na `won` / `ready to start`: PASS / FAIL
4. Tworzy się sprawa: PASS / FAIL
5. Sprawa ma checklistę: PASS / FAIL
6. Generuje się link klienta: PASS / FAIL
7. Klient wykonuje akcję (upload/odpowiedź/akceptacja): PASS / FAIL
8. Operator weryfikuje: PASS / FAIL
9. Sprawa dochodzi do `ready_to_start`: PASS / FAIL

## Widoki (bez crashy / bez błędów runtime)

- Today: PASS / FAIL
- Leads: PASS / FAIL
- LeadDetail: PASS / FAIL
- Cases: PASS / FAIL
- Case detail: PASS / FAIL
- Templates: PASS / FAIL
- Tasks: PASS / FAIL
- Calendar: PASS / FAIL
- Activity: PASS / FAIL
- Billing: PASS / FAIL
- Settings: PASS / FAIL
- Portal klienta: PASS / FAIL

## Mobile pass

- Sidebar: PASS / FAIL
- Cards/lists spacing: PASS / FAIL
- Forms/modals/drawers: PASS / FAIL
- Portal klienta UX: PASS / FAIL
- Date pickery/inputy: PASS / FAIL
- Badge statusów (kontrast): PASS / FAIL
- Click targets: PASS / FAIL

## Consistency pass (jedna skórka)

- Brak starej/nowej skóry równolegle: PASS / FAIL
- Spójne CTA: PASS / FAIL
- Empty/loading/error states spójne: PASS / FAIL
- Komunikaty błędów spójne: PASS / FAIL

## Security pass

- Workspace isolation (user A vs user B): PASS / FAIL
- Portal token (expire/revoke): PASS / FAIL
- Brak publicznych plików bez podpisu: PASS / FAIL
- Rate limiting portalu: PASS / FAIL

## Lista znalezionych problemów

1.
2.
3.

## Decyzja

- ETAP 16 zaliczony: TAK / NIE
- Jeśli NIE: co blokuje i jaki następny krok:

