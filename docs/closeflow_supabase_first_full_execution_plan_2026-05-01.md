# CloseFlow — pełny plan domknięcia pod decyzję Supabase-first

**Data:** 2026-05-01  
**Repo lokalne:** `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`  
**Branch:** `dev-rollout-freeze`  
**Tryb:** przekazać AI deweloperowi jako jeden dokument wykonawczy.  
**Decyzja nadrzędna:** Supabase jest docelowym źródłem prawdy dla całej aplikacji.

---

# 0. Najpierw: etapy, które AI deweloper może robić bez Twojej ingerencji

Te etapy można odpalać od razu w repo. Nie wymagają Twojego logowania do Supabase, Stripe, Firebase, Vercel ani GitHub settings, o ile mają być przygotowane jako kod, dokumentacja i migracje do późniejszego uruchomienia.

## Lista bez Twojej ingerencji

| Kolejność | Etap | Co robi |
|---:|---|---|
| 00 | Dokument decyzji Supabase-first | zapisuje kierunek i mapę źródeł danych |
| 05 | Kontrakt danych Supabase | porządkuje DTO, normalizatory i pola |
| 07 | Przepięcie ekranów biznesowych na Supabase API | usuwa bezpośredni Firestore z ekranów |
| 10 | Trial 21 dni + Free/Basic/Pro/AI w kodzie | porządkuje access model po stronie aplikacji |
| 11 | Lead → Klient → Sprawa | domyka flow pracy po pozyskaniu tematu |
| 12 | Najbliższa zaplanowana akcja | usuwa logikę tekstowego next step jako rdzeń |
| 13 | AI Drafts / Quick Capture w Supabase | szkice AI w Supabase, finalny zapis po zatwierdzeniu |
| 15 | Szablony odpowiedzi i szablony spraw | moduł szablonów w Supabase |
| 16 | Dyktafon/notatka przy leadzie, kliencie i sprawie | lekka funkcja wartości w istniejących ekranach |
| 19 | PWA | manifest, ikony, instalacja na telefonie |
| 22 | Testy i skrypty walidacyjne | testy kontraktów, accessu, portalu i AI drafts |
| 23 | TypeScript hardening | typy DTO i ograniczenie `any` w danych biznesowych |
| 25 | Truthful UI | usuwa obietnice funkcji, których jeszcze nie ma |
| 26 | Branding i dokumentacja | porządkuje README, env, nazwę i status produkcji |
| 28 | Jeden kontrakt statusów i enumów | porządkuje statusy w UI, API i Supabase |

## Co AI deweloper ma robić teraz jako pierwszy pakiet bez Ciebie

Jeśli chcesz dzisiaj ruszyć bez czekania na Twoją konfigurację kont i sekretów, najlepszy pierwszy pakiet to:

1. **Etap 00**
2. **Etap 05**
3. **Etap 22**
4. **Etap 28**
5. **Etap 25**
6. **Etap 26**

Dlaczego ta kolejność:

- porządkuje fundament,
- nie wymaga sekretów,
- nie wymaga klikania w panelach,
- zmniejsza ryzyko regresji,
- przygotowuje repo pod szybkie wdrożenie Supabase Auth/RLS/billing, gdy Ty ustawisz rzeczy zewnętrzne.

---

# 1. Etapy, których AI deweloper nie domknie bez Ciebie

Tu AI deweloper może przygotować kod, migracje, instrukcje i checkery, ale nie domknie etapu produkcyjnie bez Twoich dostępów/decyzji.

| Etap | Nazwa | Dlaczego wymaga Ciebie |
|---:|---|---|
| 01 | Supabase Auth | ustawienia Supabase Auth, Google OAuth, redirect URLs, env |
| 02 | RLS i workspace | odpalenie migracji na produkcji, jeśli brak dostępu |
| 03 | Awaryjne zamknięcie Firestore/Storage | deploy rules w Firebase Console/CLI |
| 04 | Sekret Gemini backend-only | prywatne klucze AI w env/secrets |
| 06 | Migracja Firestore → Supabase | decyzja, czy stare dane zachowujemy |
| 08 | Portal klienta na Supabase | bucket, policies, migracje, decyzja o czasie ważności linków |
| 09 | Billing Stripe + Supabase | konto Stripe, klucze, webhook secret, konfiguracja webhooka |
| 14 | AI operator aplikacji | klucze AI i decyzja o providerze |
| 17 | Supabase Storage | bucket i policies, jeśli brak dostępu |
| 18 | Digest/raport mailowy | provider maili, domena, API key |
| 20 | CI/CD + secrets | GitHub/Vercel secrets |
| 21 | Cleanup Firebase | decyzja po migracji danych |
| 24 | Email confirmation gate | decyzja, czy blokujemy zapis przed potwierdzeniem e-mail |
| 27 | Admin config bez hardcoded e-maila | decyzja, kto jest adminem i gdzie to ustawiamy |

---

# 2. Rdzeń decyzji Supabase-first

## Cel techniczny

Zamykamy hybrydę Firebase/Supabase.

Docelowo:

```text
Supabase Auth
Supabase Postgres
Supabase RLS
Supabase Storage
Supabase Edge/API albo Vercel API
Stripe webhook zapisujący do Supabase
AI backend-only
```

## Zakaz

```text
Nie dodawać nowych funkcji do Firestore.
Nie robić kolejnych fallbacków Firestore/Supabase.
Nie ufać workspaceId z frontu.
Nie trzymać sekretów po stronie klienta.
Nie robić finalnego zapisu przez AI bez potwierdzenia.
```

## Docelowa mapa danych

| Obszar | Docelowo |
|---|---|
| Auth | Supabase Auth |
| Profile | Supabase `profiles` |
| Workspace | Supabase `workspaces`, `workspace_members` |
| Leady | Supabase `leads` |
| Klienci | Supabase `clients` |
| Sprawy | Supabase `cases` |
| Zadania | Supabase `tasks` |
| Wydarzenia | Supabase `events` |
| Aktywność | Supabase `activities` |
| Case items | Supabase `case_items` |
| Portal klienta | Supabase token hash + portal session |
| Pliki | Supabase Storage |
| Billing | Stripe + Supabase `billing_events`, pola workspace |
| AI Drafts | Supabase `ai_drafts` |
| Quick Capture | Supabase `quick_lead_drafts` albo `ai_drafts` z typem |
| Szablony | Supabase `response_templates`, `case_templates` |
| Support | Supabase `support_requests`, `support_replies` |
| Ustawienia | Supabase profile/workspace settings |

---

# 3. Obowiązkowa weryfikacja po każdym etapie

Każdy etap kończy się minimum:

```powershell
npm.cmd run lint
npm.cmd run build
```

Dodatkowo, jeśli etap dotyka dostępów lub bezpieczeństwa:

```powershell
npm.cmd run verify:closeflow:quiet
```

Jeżeli etap dotyka Gemini/client secret:

```powershell
npm.cmd run verify:security:gemini-client
```

Jeżeli etap dotyka Supabase-first:

```powershell
npm.cmd run verify:architecture:supabase-first
```

Jeżeli etap dotyka auth Supabase:

```powershell
npm.cmd run verify:auth:supabase-stage01
```

---

# 4. Pełne etapy wykonawcze

---

## ETAP 00 — Dokument decyzji Supabase-first

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Zapisać w repo, że Supabase jest jedynym docelowym źródłem prawdy.

### Pliki do sprawdzenia

```text
docs/
README.md
README-WDROZENIE.md
README_WDROZENIE.md
.env.example
src/lib/supabase-fallback.ts
src/firebase.ts
firestore.rules
storage.rules
api/*
supabase/migrations/*
```

### Zmień

Dodaj:

```text
docs/SUPABASE_FIRST_ARCHITECTURE.md
docs/DATA_SOURCE_MAP.md
```

W `SUPABASE_FIRST_ARCHITECTURE.md` zapisz:

```text
Supabase jest docelowym źródłem prawdy dla danych, auth, storage, billing, portalu, AI drafts, szablonów i aktywności.
Firebase / Firestore jest legacy i ma zostać wygaszony po migracji.
```

W `DATA_SOURCE_MAP.md` wypisz każdy ekran:

```text
Today -> Supabase
Leads -> Supabase
LeadDetail -> Supabase
Tasks -> Supabase
Calendar -> Supabase
Cases -> Supabase
CaseDetail -> Supabase
Clients -> Supabase
ClientDetail -> Supabase
Templates -> Supabase
AI Drafts -> Supabase
Billing -> Supabase + Stripe
ClientPortal -> Supabase + Supabase Storage
Activity -> Supabase
Settings -> Supabase
```

### Nie zmieniaj

- Nie przepinaj jeszcze ekranów.
- Nie usuwaj Firebase dependency.
- Nie zmieniaj UI.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:architecture:supabase-first
```

### Kryterium zakończenia

Repo ma jednoznaczną decyzję architektoniczną i mapę źródeł danych.

---

## ETAP 01 — Supabase Auth jako docelowe logowanie

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Skonfigurować Supabase Auth.
- Włączyć Google OAuth, jeśli zostaje Google login.
- Ustawić redirect URL lokalny i produkcyjny.
- Dodać env w Vercel i lokalnie:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Potwierdzić, czy e-mail/password ma zostać, czy tylko Google/magic link.

### Cel

Przenieść autoryzację na Supabase Auth.

### Pliki do sprawdzenia

```text
src/pages/Login.tsx
src/App.tsx
src/hooks/useWorkspace.ts
src/hooks/useFirebaseSession.ts
src/lib/client-auth.ts
src/lib/supabase-auth.ts
src/lib/supabase-fallback.ts
src/firebase.ts
api/me.ts
src/server/_request-scope.ts
.env.example
```

### Zmień

Dodaj:

```text
src/lib/supabase-auth.ts
src/hooks/useSupabaseSession.ts
```

Frontend ma wysyłać:

```http
Authorization: Bearer <supabase_access_token>
```

Backend nie może ufać:

```text
x-user-id
x-user-email
x-user-name
x-workspace-id
```

`api/me.ts` ma ustalać usera z Supabase JWT.

Po pierwszym loginie utwórz albo odczytaj:

```text
profile
workspace
workspace_member
```

### Nie zmieniaj

- Nie przebudowuj UI loginu.
- Nie dodawaj zespołów.
- Nie zostawiaj docelowej hybrydy Firebase Auth + Supabase Auth.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:auth:supabase-stage01
```

Ręcznie:

- login działa,
- refresh utrzymuje sesję,
- logout czyści sesję,
- API bez tokenu daje `401`,
- cudzy workspaceId w body/header nie działa.

### Kryterium zakończenia

Backend ustala tożsamość z Supabase JWT.

---

## ETAP 02 — RLS i twardy model workspace w Supabase

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Odpalić migracje SQL w Supabase, jeśli AI deweloper nie ma dostępu.
- Potwierdzić model:
  - jeden user = jeden workspace na V1,
  - `workspace_members` zostaje technicznie pod przyszłość.

### Cel

Każdy rekord biznesowy ma mieć `workspace_id` i RLS.

### Pliki do sprawdzenia

```text
supabase/migrations/*
api/_supabase.ts
src/server/_request-scope.ts
api/me.ts
api/leads.ts
api/tasks.ts
api/events.ts
api/cases.ts
api/clients.ts
api/activities.ts
api/payments.ts
api/system.ts
```

### Zmień

Dodać/zweryfikować tabele:

```text
profiles
workspaces
workspace_members
```

Każda tabela biznesowa ma mieć:

```text
workspace_id
created_by_user_id
created_at
updated_at
```

Tabele minimum:

```text
leads
clients
cases
tasks
events
activities
case_items
ai_drafts
quick_lead_drafts
response_templates
payments
support_requests
client_portal_tokens
billing_events
```

Dodać RLS policies:

- user widzi tylko swój workspace,
- user pisze tylko do swojego workspace,
- portal klienta idzie osobnym endpointem,
- service role tylko server-side.

### Nie zmieniaj

- Nie wyłączaj RLS.
- Nie rób `select *` service role bez filtra workspace.
- Nie pozwalaj frontowi decydować o workspace.

### Po wdrożeniu sprawdź

- user A nie widzi danych usera B,
- insert bez auth daje `401`,
- cudzy `workspace_id` jest blokowany,
- API zawsze filtruje po workspace.

### Kryterium zakończenia

Prywatność danych jest pilnowana przez Supabase/RLS/backend, nie przez frontend.

---

## ETAP 03 — Awaryjne zamknięcie Firestore i Firebase Storage

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Wdrożyć rules w Firebase Console/CLI.
- Potwierdzić, czy Firestore zostaje chwilowo tylko jako legacy.

### Cel

Zamknąć publiczne ścieżki zanim migracja do Supabase będzie skończona.

### Pliki do sprawdzenia

```text
firestore.rules
storage.rules
src/pages/ClientPortal.tsx
src/firebase.ts
src/pages/Templates.tsx
src/pages/Leads.tsx
src/pages/Tasks.tsx
src/pages/Calendar.tsx
```

### Zmień

Usuń publiczne:

```text
allow get: if true
```

Usuń reguły oparte o samo:

```text
exists(client_portal_tokens/{caseId})
```

Portal klienta nie może czytać Firestore po samym `caseId`.

Firebase Storage ma blokować publiczne uploady.

### Nie zmieniaj

- Nie rozwijaj Firestore.
- Nie dodawaj nowych funkcji do Firestore.
- Nie traktuj tego jako docelowej naprawy.

### Po wdrożeniu sprawdź

- anonim nie czyta tokenów,
- anonim nie czyta cases/items,
- portal nie działa przez stary publiczny model.

### Kryterium zakończenia

Firebase legacy nie jest publiczną furtką.

---

## ETAP 04 — Sekret Gemini tylko backend

### Wymaga Twojej ingerencji?

**TAK, częściowo**

### Co musisz zrobić Ty

- Dodać klucze AI jako server-side env:
  - `GEMINI_API_KEY`,
  - `CLOUDFLARE_API_TOKEN`, jeśli używane.
- Nie dawać produkcyjnych kluczy do kodu.

### Cel

Żaden sekret AI nie trafia do frontu.

### Pliki do sprawdzenia

```text
vite.config.ts
.env.example
README.md
src/lib/ai-assistant.ts
src/server/ai-assistant.ts
api/system.ts
api/assistant.ts
src/components/TodayAiAssistant.tsx
package.json
```

### Zmień

Usuń z Vite wszystko typu:

```text
process.env.GEMINI_API_KEY
```

Nie dodawaj:

```text
VITE_GEMINI_API_KEY
```

AI tylko przez backend endpoint.

Backend:

- pobiera dane workspace z Supabase,
- buduje snapshot,
- woła AI,
- waliduje wynik,
- zapisuje szkic, nie finalny rekord.

### Nie zmieniaj

- Nie usuwaj całego AI.
- Nie rób finalnego zapisu przez AI.
- Nie wysyłaj sekretów do klienta.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:security:gemini-client
```

### Kryterium zakończenia

W `dist` nie ma sekretu AI ani sposobu jego odczytu.

---

## ETAP 05 — Kontrakt danych Supabase

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Usunąć chaos pól i fallbacków.

### Pliki do sprawdzenia

```text
src/lib/data-contract.ts
src/lib/supabase-fallback.ts
src/lib/calendar-items.ts
src/lib/scheduling.ts
api/leads.ts
api/tasks.ts
api/events.ts
api/cases.ts
api/clients.ts
api/activities.ts
supabase/migrations/*
```

### Zmień

Ustal DTO:

```text
LeadDto
ClientDto
CaseDto
TaskDto
EventDto
ActivityDto
PaymentDto
AiDraftDto
ResponseTemplateDto
CaseItemDto
```

Legacy aliasy tylko w normalizatorach:

```text
normalizeLeadContract
normalizeTaskContract
normalizeEventContract
normalizeCaseContract
normalizeClientContract
```

Widoki nie mogą robić:

```ts
dueAt || scheduledAt || date
```

w wielu miejscach.

### Nie zmieniaj

- Nie zmieniaj UI.
- Nie dodawaj nowych funkcji.
- Nie usuwaj danych legacy bez migracji.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run check:data-contract-stage-a1
npm.cmd run check:data-contract-stage-a2
npm.cmd run check:task-event-contract
```

### Kryterium zakończenia

Frontend i backend rozmawiają jednym kontraktem danych.

---

## ETAP 06 — Migracja Firestore → Supabase albo decyzja o czystym starcie

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

Wybrać:

```text
A) stare dane są ważne i migrujemy
B) stare dane są testowe i startujemy czysto w Supabase
```

### Cel

Pozbyć się hybrydy danych.

### Pliki do sprawdzenia

```text
src/pages/Leads.tsx
src/pages/LeadDetail.tsx
src/pages/Tasks.tsx
src/pages/Calendar.tsx
src/pages/Templates.tsx
src/pages/Settings.tsx
src/pages/Activity.tsx
src/firebase.ts
scripts/export-firestore-*
scripts/import-supabase-*
supabase/migrations/*
```

### Zmień

Dodaj:

```text
docs/FIRESTORE_TO_SUPABASE_MIGRATION.md
```

Przygotuj dry-run eksport/import.

Mapowania:

```text
ownerId -> user_id
workspaceId -> workspace_id
leadId -> lead_id
caseId -> case_id
```

### Nie zmieniaj

- Nie usuwaj Firestore path przed potwierdzeniem migracji.
- Nie wykonuj produkcyjnej migracji bez backupu.

### Po wdrożeniu sprawdź

- liczba rekordów przed/po,
- poprawne workspace_id,
- brak duplikatów,
- aplikacja widzi dane z Supabase.

### Kryterium zakończenia

Firestore przestaje być źródłem prawdy.

---

## ETAP 07 — Przepięcie ekranów biznesowych na Supabase API

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Ekrany operatora czytają i zapisują tylko przez Supabase/API.

### Pliki do sprawdzenia

```text
src/pages/Today.tsx
src/pages/Leads.tsx
src/pages/LeadDetail.tsx
src/pages/Tasks.tsx
src/pages/Calendar.tsx
src/pages/Cases.tsx
src/pages/CaseDetail.tsx
src/pages/Clients.tsx
src/pages/ClientDetail.tsx
src/pages/Activity.tsx
src/pages/Settings.tsx
src/lib/supabase-fallback.ts
src/firebase.ts
```

### Zmień

Usuń z ekranów biznesowych bezpośrednie:

```text
firebase/firestore
collection
doc
onSnapshot
addDoc
updateDoc
deleteDoc
```

Zastąp funkcjami API/Supabase.

### Nie zmieniaj

- Nie zmieniaj wyglądu.
- Nie dokładaj Realtime, jeśli nie trzeba.
- Nie przebudowuj flow.

### Po wdrożeniu sprawdź

- CRUD leadów działa,
- CRUD tasków działa,
- eventy działają,
- cases działają,
- clients działają,
- settings zapisują się,
- po refreshu dane zostają.

### Kryterium zakończenia

Operator nie używa Firestore w runtime.

---

## ETAP 08 — Portal klienta na Supabase

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Utworzyć bucket/policies albo odpalić instrukcje.
- Potwierdzić czas ważności linku.
- Potwierdzić limity plików.

### Cel

Portal klienta działa przez Supabase token hash, sesję i Supabase Storage.

### Pliki do sprawdzenia

```text
src/pages/ClientPortal.tsx
api/client-portal-tokens.ts
api/client-portal-session.ts
api/case-items.ts
api/activities.ts
api/storage-upload.ts
src/server/_portal-token.ts
supabase/migrations/*
supabase/storage policies
```

### Zmień

Tabela:

```text
client_portal_tokens
```

Pola:

```text
id
workspace_id
case_id
token_hash
expires_at
revoked_at
last_used_at
created_at
created_by_user_id
```

Plain token zwracany tylko raz.

Portalowe API nie przyjmuje dowolnego `workspaceId`.

Upload przez Supabase Storage.

### Nie zmieniaj

- Nie twórz kont klienta w V1.
- Nie trzymaj plain tokenu.
- Nie używaj Firebase Storage.
- Nie zapisuj haseł klienta jako plain text.

### Po wdrożeniu sprawdź

- zły token daje `403`,
- wygasły token daje `403`,
- podmiana caseId nie działa,
- upload działa tylko z ważną sesją.

### Kryterium zakończenia

Portal jest bezpiecznym linkiem V1 na Supabase.

---

## ETAP 09 — Billing Stripe + Supabase access

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Skonfigurować Stripe.
- Dodać klucze.
- Ustawić webhook URL.
- Potwierdzić ceny i faktury.

### Cel

Płatność realnie aktualizuje dostęp w Supabase.

### Pliki do sprawdzenia

```text
src/pages/Billing.tsx
api/billing-checkout.ts
api/billing-webhook.ts
api/billing-actions.ts
src/server/_stripe.ts
src/server/_access-gate.ts
api/me.ts
supabase/migrations/*
```

### Zmień

Workspace:

```text
plan_id
subscription_status
billing_provider
provider_customer_id
provider_subscription_id
next_billing_at
cancel_at_period_end
trial_ends_at
```

Tabela:

```text
billing_events
```

Webhook:

- weryfikuje podpis,
- obsługuje checkout,
- aktualizuje workspace,
- jest idempotentny.

### Nie zmieniaj

- Nie aktywuj planu z frontu.
- Nie udawaj płatności toastem.
- Nie zmieniaj cen bez decyzji.

### Po wdrożeniu sprawdź

- trial -> checkout -> webhook -> paid_active,
- duplikat webhooka nie psuje danych,
- cudzy workspaceId blokowany,
- trial expired blokuje mutacje.

### Kryterium zakończenia

Billing jest produkcyjnym mechanizmem dostępu.

---

## ETAP 10 — Trial 21 dni + Free/Basic/Pro/AI

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Spójny model planów w Supabase i UI.

### Pliki do sprawdzenia

```text
api/me.ts
src/hooks/useWorkspace.ts
src/pages/Login.tsx
src/pages/Billing.tsx
src/components/Layout.tsx
src/server/_access-gate.ts
supabase/migrations/*
```

### Zmień

Nowy user:

```text
trial_active
trial_ends_at = now + 21 dni
```

Free:

```text
5 aktywnych leadów
5 aktywnych zadań/wydarzeń
3 aktywne szkice
brak AI
brak digestu
brak Google Calendar
```

Basic/Pro/AI zgodnie z planem.

### Nie zmieniaj

- Nie licz planu z env.
- Nie trzymaj accessu w localStorage.
- Nie pokazuj funkcji AI poza planem AI/trial.

### Po wdrożeniu sprawdź

- nowy user ma 21 dni,
- po trialu dane widoczne,
- tworzenie ograniczone,
- limity Free działają.

### Kryterium zakończenia

Access jest liczony z Supabase, nie z frontu.

---

## ETAP 11 — Lead → Klient → Sprawa

### Wymaga Twojej ingerencji?

**NIE**

### Cel

`Rozpocznij obsługę` tworzy/podpina klienta i sprawę.

### Pliki do sprawdzenia

```text
src/pages/LeadDetail.tsx
src/pages/CaseDetail.tsx
src/pages/ClientDetail.tsx
api/leads.ts
api/cases.ts
api/clients.ts
api/activities.ts
supabase/migrations/*
```

### Zmień

Endpoint `start_service`:

1. tworzy/podpina klienta,
2. tworzy sprawę,
3. ustawia lead jako przeniesiony do obsługi,
4. zapisuje activity,
5. zwraca `caseId`,
6. UI przekierowuje do sprawy.

Lead po przeniesieniu pokazuje:

```text
Ten temat jest już w obsłudze
Otwórz sprawę
```

### Nie zmieniaj

- Nie przenoś pracy do klienta.
- Nie zostawiaj aktywnych akcji sprzedażowych na leadzie po przeniesieniu.
- Nie kasuj historii leada.

### Po wdrożeniu sprawdź

- lead znika z aktywnych,
- case ma leadId/clientId,
- lead linkuje do case,
- Today nie pokazuje przeniesionego leada.

### Kryterium zakończenia

Po pozyskaniu główna praca idzie do sprawy.

---

## ETAP 12 — Najbliższa zaplanowana akcja

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Zastąpić `Następny krok` realną akcją z tasków/eventów.

### Pliki do sprawdzenia

```text
src/pages/Today.tsx
src/pages/Leads.tsx
src/pages/LeadDetail.tsx
src/pages/CaseDetail.tsx
src/lib/lead-health.ts
src/lib/scheduling.ts
api/tasks.ts
api/events.ts
api/leads.ts
```

### Zmień

Dodaj helper:

```text
getNearestPlannedAction(recordType, recordId)
```

UI pokazuje:

```text
Najbliższa zaplanowana akcja
```

Brak akcji:

```text
Brak zaplanowanych działań
```

Today używa:

```text
Bez zaplanowanej akcji
```

### Nie zmieniaj

- Nie twórz kolejnego pola tekstowego.
- Nie usuwaj tasków/eventów.
- Nie kasuj legacy bez migracji.

### Po wdrożeniu sprawdź

- lead z taskiem pokazuje task,
- lead z eventem pokazuje event,
- brak task/event wpada do brak zaplanowanej akcji.

### Kryterium zakończenia

System pilnuje działań w czasie, nie tekstowego pola.

---

## ETAP 13 — AI Drafts / Quick Capture w Supabase

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Szkice AI są w Supabase, a finalny zapis tylko po zatwierdzeniu.

### Pliki do sprawdzenia

```text
src/pages/AiDrafts.tsx
src/components/QuickAiCapture.tsx
src/components/TodayAiAssistant.tsx
src/lib/ai-drafts.ts
src/lib/ai-capture.ts
api/system.ts
api/quick-leads.ts
supabase/migrations/*
```

### Zmień

Tabela:

```text
ai_drafts
```

Pola:

```text
id
workspace_id
user_id
type
raw_text
parsed_data
provider
status
source
expires_at
confirmed_at
cancelled_at
linked_record_id
linked_record_type
created_at
updated_at
```

Po confirmed/cancelled/expired czyść `raw_text`.

### Nie zmieniaj

- Nie zapisuj finalnych rekordów bez potwierdzenia.
- Nie trzymaj surowych notatek po zatwierdzeniu.
- Nie używaj Firestore/localStorage jako źródła prawdy.

### Po wdrożeniu sprawdź

- szkic wraca po refreshu,
- zatwierdzenie tworzy rekord,
- anulowanie czyści raw text,
- szkice są per workspace.

### Kryterium zakończenia

AI Drafts są bezpiecznym workflow review.

---

## ETAP 14 — AI operator aplikacji

### Wymaga Twojej ingerencji?

**TAK, częściowo**

### Co musisz zrobić Ty

- Dodać klucze AI do env.
- Potwierdzić provider: Gemini / Cloudflare / parser.

### Cel

AI odpowiada na podstawie danych Supabase.

### Pliki do sprawdzenia

```text
src/components/GlobalAiAssistant.tsx
src/components/TodayAiAssistant.tsx
src/lib/ai-assistant.ts
src/server/ai-assistant.ts
api/assistant.ts
api/system.ts
src/lib/supabase-fallback.ts
```

### Zmień

Snapshot:

```text
leads
clients
cases
tasks
events
drafts
relations
nearestActions
access
```

Tryby:

```text
read/search
draft lead
draft task
draft event
draft note
unknown
```

Bez komendy zapisu AI tylko czyta.

### Nie zmieniaj

- Nie twórz finalnych rekordów.
- Nie zmyślaj danych.
- Nie wysyłaj danych spoza workspace.

### Po wdrożeniu sprawdź

- „Co mam jutro?” zwraca realne dane.
- „Znajdź numer do Marka” szuka.
- „Zapisz zadanie...” tworzy szkic.
- Brak danych daje: `Nie znalazłem tego w danych aplikacji.`

### Kryterium zakończenia

AI jest operatorem danych, ale nie samodzielnym zapisującym.

---

## ETAP 15 — Szablony odpowiedzi i szablony spraw

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Szablony są w Supabase i widoczne w aplikacji.

### Pliki do sprawdzenia

```text
src/pages/Templates.tsx
src/pages/ResponseTemplates.tsx
src/App.tsx
src/components/Layout.tsx
api/response-templates.ts
api/case-templates.ts
src/lib/supabase-fallback.ts
supabase/migrations/*
```

### Zmień

Rozdziel:

```text
Szablony spraw
Szablony odpowiedzi
```

Tabela:

```text
response_templates
```

Pola:

```text
id
workspace_id
name
category
tags
body
variables
archived_at
created_at
updated_at
```

### Nie zmieniaj

- Nie używaj Firestore templates.
- Nie mieszaj z AI Drafts.
- Nie dodawaj wysyłki maila w tym etapie.

### Po wdrożeniu sprawdź

- dodanie,
- edycja,
- archiwizacja,
- wyszukiwanie,
- odczyt per workspace.

### Kryterium zakończenia

Szablony są modułem Supabase.

---

## ETAP 16 — Dyktafon/notatka kontekstowa

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Szybka notatka przy leadzie, kliencie i sprawie.

### Pliki do sprawdzenia

```text
src/pages/LeadDetail.tsx
src/pages/ClientDetail.tsx
src/pages/CaseDetail.tsx
src/components/VoiceNoteCapture.tsx
src/lib/ai-capture.ts
src/lib/ai-drafts.ts
api/activities.ts
api/system.ts
supabase/migrations/*
```

### Zmień

Dodaj:

```text
src/components/VoiceNoteCapture.tsx
```

Props:

```ts
recordType: 'lead' | 'client' | 'case'
recordId: string
recordLabel?: string
mode?: 'note_only' | 'note_with_suggestions'
onSaved?: () => void
```

### Nie zmieniaj

- Nie nagrywaj audio do pliku.
- Nie twórz tasków/eventów bez potwierdzenia.
- Nie usuwaj QuickAiCapture.

### Po wdrożeniu sprawdź

- notatka przy leadzie,
- notatka przy kliencie,
- notatka przy sprawie,
- po refreshu zostaje.

### Kryterium zakończenia

Użytkownik zapisuje kontekst rozmowy w dobrym miejscu.

---

## ETAP 17 — Supabase Storage

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Utworzyć bucket/policies albo odpalić instrukcje.
- Potwierdzić limity plików.

### Cel

Pliki są w Supabase Storage.

### Pliki do sprawdzenia

```text
src/pages/ClientPortal.tsx
src/pages/CaseDetail.tsx
api/storage-upload.ts
api/case-items.ts
supabase/storage policies
supabase/migrations/*
```

### Zmień

Bucket:

```text
case-files
```

Path:

```text
workspace_id/case_id/item_id/file_id
```

Signed upload/download.

### Nie zmieniaj

- Nie używaj Firebase Storage.
- Nie dawaj publicznych URL-i.
- Nie ufaj file.name.

### Po wdrożeniu sprawdź

- upload operatora,
- upload portalu,
- brak dostępu cudzych userów,
- linki kontrolowane.

### Kryterium zakończenia

Pliki są prywatne i pod Supabase.

---

## ETAP 18 — Digest dzienny i raport tygodniowy

### Wymaga Twojej ingerencji?

**TAK, częściowo**

### Co musisz zrobić Ty

- Wybrać provider maili.
- Dodać API key.
- Ustawić domenę/nadawcę.

### Cel

Mail z planem dnia i raport tygodnia na bazie Supabase.

### Pliki do sprawdzenia

```text
api/daily-digest.ts
api/weekly-report.ts
src/server/_digest.ts
src/server/_mail.ts
src/pages/Settings.tsx
src/lib/supabase-fallback.ts
vercel.json
supabase/migrations/*
```

### Zmień

Digest:

```text
taski na dziś
eventy na dziś
zaległe
leady/sprawy bez zaplanowanej akcji
szkice do sprawdzenia
```

Raport tygodniowy:

```text
nowe leady
leady przeniesione do spraw
wykonane zadania
zaległe
blokery spraw
szkice
następny tydzień
```

Tabela:

```text
digest_logs
```

### Nie zmieniaj

- Nie buduj dużego dashboardu.
- Nie wysyłaj bez zgody.
- Nie dubluj maili.

### Po wdrożeniu sprawdź

- jeden digest dziennie,
- wyłączenie działa,
- raport nie dubluje się,
- dane tylko z workspace.

### Kryterium zakończenia

Aplikacja realnie przypomina i raportuje.

---

## ETAP 19 — PWA

### Wymaga Twojej ingerencji?

**NIE**

### Cel

CloseFlow da się dodać do ekranu głównego telefonu.

### Pliki do sprawdzenia

```text
public/manifest.webmanifest
public/icons/*
src/components/PwaInstallPrompt.tsx
src/App.tsx
vite.config.ts
index.html
service worker
```

### Zmień

Manifest:

```text
name
short_name
theme_color
background_color
display standalone
icons
```

Komunikat:

```text
Dodaj CloseFlow do ekranu głównego telefonu
```

### Nie zmieniaj

- Nie rób natywnej aplikacji.
- Nie cache’uj agresywnie API.
- Nie rób offline-first.

### Po wdrożeniu sprawdź

- Android Chrome,
- iPhone Safari instrukcja,
- standalone mode,
- brak starego cache.

### Kryterium zakończenia

CloseFlow działa jak web-app na telefonie.

---

## ETAP 20 — CI/CD + kontrola migracji

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Dodać GitHub/Vercel secrets.
- Potwierdzić deploy flow.

### Cel

Nie wypychać regresji bez lint/build.

### Pliki do sprawdzenia

```text
.github/workflows/ci.yml
.github/workflows/vercel-production-deploy.yml
package.json
scripts/*
supabase/migrations/*
```

### Zmień

CI:

```text
npm ci
npm run lint
npm run build
```

Check migracji:

- numeracja,
- brak destrukcyjnych DROP bez komentarza,
- brak sekretów.

Deploy:

- concurrency,
- zależność od CI.

### Nie zmieniaj

- Nie wkładaj sekretów do repo.
- Nie rób ciężkiego E2E na start.

### Po wdrożeniu sprawdź

- błąd TS blokuje CI,
- mojibake blokuje CI,
- deploy nie odpala się kilka razy.

### Kryterium zakończenia

Repo ma bramkę jakości.

---

## ETAP 21 — Cleanup Firebase po migracji

### Wymaga Twojej ingerencji?

**TAK**

### Co musisz zrobić Ty

- Potwierdzić, że dane w Supabase są OK.
- Potwierdzić, że produkcja działa bez Firebase.

### Cel

Usunąć Firebase z runtime.

### Pliki do sprawdzenia

```text
package.json
src/firebase.ts
src/**/*firebase*
src/**/*firestore*
firestore.rules
storage.rules
.env.example
README.md
docs/*
```

### Zmień

- usuń importy Firebase,
- usuń dependency, jeśli nieużywane,
- usuń env Firebase,
- README na Supabase-only.

### Nie zmieniaj

- Nie rób tego przed migracją.
- Nie usuwaj backupów.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run build
```

Grep:

```powershell
Select-String -Path "src\**\*" -Pattern "firebase","firestore" -SimpleMatch
```

### Kryterium zakończenia

Projekt nie jest już hybrydą.

---

## ETAP 22 — Testy i skrypty walidacyjne

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Dodać minimalną automatyczną kontrolę jakości.

### Pliki do sprawdzenia

```text
package.json
tests/*
scripts/*
.github/workflows/ci.yml
src/lib/data-contract.ts
src/lib/scheduling.ts
src/lib/lead-health.ts
api/*
```

### Zmień

Dodaj testy/guardy:

- kontrakt lead/task/event/case/client/activity,
- auth/access,
- workspace isolation,
- AI drafts,
- portal token,
- billing access,
- no client secret,
- no Firebase write path dla nowych funkcji.

### Nie zmieniaj

- Nie buduj ciężkiego Playwrighta na start.
- Nie zmieniaj UI.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd test
```

### Kryterium zakończenia

Najważniejsze regresje są łapane automatycznie.

---

## ETAP 23 — TypeScript hardening

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Ograniczyć `any` i luźne typy w danych biznesowych.

### Pliki do sprawdzenia

```text
tsconfig.json
src/**/*.ts
src/**/*.tsx
api/**/*.ts
src/lib/data-contract.ts
src/lib/supabase-fallback.ts
```

### Zmień

Dodaj mocne typy dla DTO:

```text
LeadDto
TaskDto
EventDto
CaseDto
ClientDto
ActivityDto
AiDraftDto
```

Najpierw typy danych i API, potem dopiero reszta.

### Nie zmieniaj

- Nie włączaj od razu strict true, jeśli rozwali pół repo.
- Nie rób refaktoru UI.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run build
```

### Kryterium zakończenia

Dane biznesowe nie są mgłą `any`.

---

## ETAP 24 — Supabase email confirmation gate

### Wymaga Twojej ingerencji?

**TAK, częściowo**

### Co musisz zrobić Ty

- Potwierdzić, czy blokujemy zapis przed potwierdzeniem e-maila.

### Cel

Użytkownik e-mail/password nie ma pełnego zapisu bez potwierdzenia e-maila.

### Pliki do sprawdzenia

```text
src/pages/Login.tsx
src/App.tsx
src/hooks/useWorkspace.ts
src/lib/supabase-auth.ts
api/me.ts
src/server/_access-gate.ts
```

### Zmień

- dodaj ekran „Potwierdź e-mail”,
- przycisk wyślij ponownie,
- przycisk sprawdź ponownie,
- blokada mutacji przed potwierdzeniem.

### Nie zmieniaj

- Nie blokuj Google OAuth, jeśli email verified.
- Nie mieszaj z billingiem.

### Po wdrożeniu sprawdź

- e-mail/password widzi gate,
- po potwierdzeniu przechodzi,
- API blokuje mutacje przed confirmation.

### Kryterium zakończenia

Email verification jest realnym warunkiem, nie ozdobą.

---

## ETAP 25 — Truthful UI

### Wymaga Twojej ingerencji?

**NIE**

### Cel

UI nie obiecuje funkcji, których jeszcze nie ma.

### Pliki do sprawdzenia

```text
src/pages/Billing.tsx
src/pages/Settings.tsx
src/pages/ClientPortal.tsx
src/pages/SupportCenter.tsx
src/components/Layout.tsx
src/pages/Login.tsx
src/pages/Templates.tsx
src/pages/NotificationsCenter.tsx
```

### Zmień

Usuń albo oznacz jako beta:

- faktury, jeśli nie działają,
- Stripe, jeśli webhook nie działa,
- Google Calendar, jeśli nie działa,
- portal, jeśli tokeny nie są gotowe,
- wysyłki maili, jeśli nie wysyłają.

### Nie zmieniaj

- Nie usuwaj działających funkcji.
- Nie rób redesignu.

### Po wdrożeniu sprawdź

- demo nie sprzedaje fikcji,
- przyciski robią to, co mówią.

### Kryterium zakończenia

Aplikacja jest uczciwa wobec użytkownika.

---

## ETAP 26 — Branding i dokumentacja produkcyjna

### Wymaga Twojej ingerencji?

**NIE**

### Cel

Wyczyścić README, env, nazwy i status produkcji.

### Pliki do sprawdzenia

```text
index.html
README.md
README-WDROZENIE.md
README_WDROZENIE.md
.env.example
docs/*
public/manifest.webmanifest
```

### Zmień

Nazwa wszędzie:

```text
CloseFlow
```

Dodaj:

```text
docs/PRODUCTION_READINESS_STATUS.md
```

Sekcje:

```text
działa
beta
wymaga konfiguracji
nie używać jeszcze produkcyjnie
```

### Nie zmieniaj

- Nie obiecuj niegotowych funkcji.
- Nie ukrywaj ostrzeżeń.

### Po wdrożeniu sprawdź

- README jest Supabase-first,
- env nie pokazuje sekretów jako VITE,
- manifest ma CloseFlow.

### Kryterium zakończenia

Repo wygląda jak jeden projekt, nie składanka etapów.

---

## ETAP 27 — Admin config bez hardcoded e-maila

### Wymaga Twojej ingerencji?

**TAK, częściowo**

### Co musisz zrobić Ty

- Potwierdzić, kto jest adminem.
- Potwierdzić, czy admin ma być w `profiles.role`, czy w env/server config.

### Cel

Admin nie jest hardcoded w froncie.

### Pliki do sprawdzenia

```text
src/lib/admin.ts
src/hooks/useWorkspace.ts
api/me.ts
src/server/_request-scope.ts
supabase/migrations/*
.env.example
```

### Zmień

Admin z Supabase:

```text
profiles.role = admin
```

albo server-side config.

`/api/me` zwraca `isAdmin` z backendu.

Admin-only endpointy sprawdzają rolę na serwerze.

### Nie zmieniaj

- Nie dawaj admina z localStorage.
- Nie ufaj e-mailowi z klienta.
- Nie pokazuj admin tools bez serwerowej weryfikacji.

### Po wdrożeniu sprawdź

- zwykły user nie widzi admin tools,
- podmiana e-maila nic nie daje,
- admin z Supabase ma dostęp.

### Kryterium zakończenia

Admin jest bezpieczny i konfigurowalny.

---

## ETAP 28 — Jeden kontrakt statusów i enumów

### Wymaga Twojej ingerencji?

**NIE**, chyba że chcesz zmienić nazwy biznesowe.

### Cel

Statusy są spójne w UI, API i Supabase.

### Pliki do sprawdzenia

```text
src/lib/statuses.ts
src/lib/options.ts
src/lib/data-contract.ts
api/*
supabase/migrations/*
firebase-blueprint.json
docs/*
```

### Zmień

Dodaj:

```text
src/lib/domain-statuses.ts
```

Statusy:

```text
LeadStatus
CaseStatus
TaskStatus
EventStatus
PortalItemStatus
AiDraftStatus
BillingStatus
```

Zmapuj legacy.

API waliduje statusy.

Supabase ma check constraints albo walidację backendową.

### Nie zmieniaj

- Nie wymyślaj nowych statusów bez potrzeby.
- Nie mieszaj statusu technicznego z copy.

### Po wdrożeniu sprawdź

- Lead status spójny wszędzie.
- Case status spójny wszędzie.
- Task done wszędzie znaczy to samo.
- Billing status jeden zestaw.

### Kryterium zakończenia

Nie ma zupy statusów.

---

# 5. Najlepsza kolejność na dzisiaj

## Bez Twojego udziału, od razu dla AI dewelopera

```text
00 -> 05 -> 22 -> 28 -> 25 -> 26 -> 07 -> 10 -> 11 -> 12 -> 13 -> 15 -> 16 -> 19 -> 23
```

## Równolegle Ty przygotowujesz

```text
01 Supabase Auth config
02 możliwość odpalenia migracji
04 klucze AI server-side
08 Storage bucket
09 Stripe
18 provider maili
20 GitHub/Vercel secrets
```

## Potem domknięcie produkcyjne

```text
01 -> 02 -> 03 -> 04 -> 06 -> 08 -> 09 -> 14 -> 17 -> 18 -> 20 -> 21 -> 24 -> 27
```

---

# 6. Najważniejszy werdykt dla AI dewelopera

```text
Nie dokładamy już niczego do Firestore.
Nie utrzymujemy dwóch backendów.
Supabase jest rdzeniem.
Najpierw kontrakt danych, RLS, auth i bezpieczeństwo.
Dopiero potem portal, billing, AI i funkcje wartości.
```
