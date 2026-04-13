# ETAP 17A — runtime / snapshot / portal / notifications

## Cel

Domknąć spójność runtime po wdrożeniu nowego lifecycle `lead -> case -> ready_to_start -> in_progress`.

Ten etap zakłada, że bug odradzających się zadań jest już potraktowany jako osobna naprawa i teraz nie wracamy do niego.

Celem tego etapu jest sprawdzić i dopiąć:
- zgodność `store / actions / repository / snapshot / API`
- ręczny flow operatora
- ręczny flow portalu klienta
- workflow notifications

---

## Pliki do sprawdzenia

### Runtime i persystencja
- `lib/store.tsx`
- `lib/data/actions.ts`
- `lib/data/repository.ts`
- `lib/snapshot.ts`
- `app/api/app/snapshot/route.ts`
- `lib/supabase/app-snapshot.ts`

### Domena i widoki
- `lib/domain/lead-state.ts`
- `lib/domain/lead-case.ts`
- `lib/domain/cases-dashboard.ts`
- `lib/today.ts`
- `components/today-page-view.tsx`
- `components/views.tsx`
- `components/cases-page-view.tsx`
- `components/client-portal-view.tsx`

### Portal i workflow
- `app/api/client-portal/[token]/route.ts`
- `app/api/client-portal/[token]/attachments/[attachmentId]/route.ts`
- `app/api/system/workflow-notifications/route.ts`
- `lib/mail/workflow-planner.ts`
- `lib/security/portal-token.ts`
- `lib/storage/upload-policy.ts`
- `lib/storage/signed-access.ts`

### Testy
- `tests/today.test.ts`
- `tests/lead-case-bridge.test.ts`
- `tests/case-automation.test.ts`
- `tests/cases-dashboard.test.ts`
- `tests/client-portal-token.test.ts`
- `tests/portal-token-security.test.ts`
- `tests/workflow-planner.test.ts`
- `tests/workflow-stage-integration.test.ts`
- `tests/workflow-runtime-stage-usage.test.ts`

---

## Zmień

### 1. Sprawdź source of truth runtime
Potwierdź, że nowy lifecycle jest czytany i zapisywany tak samo w:
- pamięci lokalnej
- snapshot
- repository
- route API
- refetch z serwera

Nie może istnieć drugi równoległy model statusów sprawy albo blockerów.

### 2. Zrób manual QA flow operatora
Przejdź ręcznie i udokumentuj:
1. lead bez next stepu
2. lead overdue
3. lead po `won`
4. utworzenie `case`
5. checklista i blokery
6. `waiting_for_client`
7. `ready_to_start`
8. `in_progress`
9. widoczność w `Today`

### 3. Zrób manual QA portalu klienta
Sprawdź ręcznie:
- poprawny token
- zły token
- wygasły token
- odwołany token
- upload pliku
- akceptację
- brak uprawnień

### 4. Zrób QA workflow notifications
Sprawdź:
- czy planner tworzy właściwe powiadomienia
- czy nie ma duplikatów
- czy `waiting_for_client`, `blocked`, `ready_to_start` mapują się poprawnie
- czy operator i klient nie dostają spamu

### 5. Jeśli znajdziesz rozjazd
Napraw tylko realne rozjazdy między runtime a domeną.
Nie rób nowych funkcji pobocznych.
Nie zmieniaj zakresu produktu.

---

## Nie zmieniaj

- nie wracaj do modelu dwóch osobnych aplikacji
- nie cofaj nowego lifecycle `lead -> case`
- nie zmieniaj merge targetu, dalej pracujemy tylko na `dev-rollout-freeze`
- nie dodawaj nowego scope poza QA i dopięciem runtime

---

## Po wdrożeniu sprawdź

- `npm test`
- `npm run build`
- ręczne przeklikanie Today / Leads / Cases / Portal / Tasks / Calendar
- brak rozjazdów między snapshotem lokalnym i stanem po refetch

---

## Kryterium zakończenia

Etap jest zakończony dopiero wtedy, gdy:
- flow operatora działa ręcznie
- portal klienta działa ręcznie
- workflow notifications są zweryfikowane
- runtime i snapshot są spójne
- branch nadal jest zielony i gotowy do dalszego cleanupu przed merge
