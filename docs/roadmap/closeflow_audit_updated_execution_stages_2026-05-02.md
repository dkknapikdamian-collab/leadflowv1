# CloseFlow / LeadFlow — zaktualizowana lista etapów po audycie

Data: 2026-05-02  
Repo docelowe: `dkknapikdamian-collab/leadflowv1`  
Gałąź robocza: `dev-rollout-freeze`  
Status: plan wykonawczy po audycie release-readiness

---

## 0. Werdykt po audycie

Audyt nie jest pełnym sign-offem kodu, bo audytor nie miał dostępu do repo, branchu, package.json, skryptów, testów ani działającego builda. Mimo to jego decyzja `NIEGOTOWA DO UŻYTKOWNIKA` jest poprawna jako decyzja release-readiness.

Największy problem nie brzmi: „wiemy, że wszystko jest zepsute”.

Największy problem brzmi: „nie mamy audytowalnego dowodu, że krytyczne ścieżki działają, a publiczna warstwa produktu może obiecywać więcej niż realny stan”.

Dlatego kolejność prac musi być taka:

1. Najpierw audytowalne źródło prawdy.
2. Potem prawda produktu w UI/copy/legal.
3. Potem security, access, workspace, admin isolation.
4. Potem CRUD i reload persistence.
5. Potem AI confirm-first.
6. Potem billing/integracje jako prawdziwe statusy, nie atrapy.
7. Potem mobile/PWA/copy/polskie znaki.
8. Dopiero potem nowe funkcje wartościowe.

---

# FAZA 0 — RELEASE GOVERNANCE I ŹRÓDŁO PRAWDY

## Etap 0.1 — Release Candidate Evidence Gate

### Cel
Dać audytorowi i developerowi jedno, niepodważalne źródło prawdy: repo, branch, commit, preview URL, package.json, skrypty, build, testy, env matrix i znane ograniczenia.

### Dlaczego
Audytor nie mógł sprawdzić aplikacji, bo jego środowisko nie było repozytorium i nie miało package.json. To blokuje każdy sensowny audyt. Bez tego można audytować zły produkt albo zły branch.

### Pliki do sprawdzenia
- repo root
- `package.json`
- `docs/`
- `scripts/`
- `vercel.json`
- `.env.example`
- aktualny deployment / preview URL

### Zmień
- dodać dokument:
  - `docs/release/RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md`
- dodać skrypt:
  - `scripts/print-release-evidence.cjs`
- dodać komendę npm, jeśli jej brakuje:
  - `audit:release-evidence`

Dokument ma zawierać:
- repo URL,
- branch,
- commit hash,
- deployment/preview URL,
- data wygenerowania,
- lista skryptów npm,
- wynik builda,
- wynik testów i guardów,
- env matrix bez sekretów,
- status funkcji: active / requires_config / beta / coming_soon / disabled_by_plan,
- znane ograniczenia.

### Nie zmieniaj
- logiki aplikacji,
- UI,
- routingu,
- danych produkcyjnych.

### Po wdrożeniu sprawdź
Developer ma uruchomić:

```powershell
git status
git branch --show-current
git log --oneline -10
npm.cmd run
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

### Kryterium zakończenia
Audytor widzi dokładnie ten sam branch, commit, build i deployment, który ma oceniać.

### Ingerencja użytkownika
Tylko jeśli developer nie zna aktualnego preview URL. Wtedy ma dać użytkownikowi dokładną instrukcję: skąd skopiować URL i gdzie wkleić.

---

## Etap 0.2 — Jedna mapa domen / deploymentów / publicznych źródeł

### Cel
Usunąć ryzyko, że audytor patrzy na `getcloseflow.com`, a my rozwijamy inną aplikację na innym deploymentcie.

### Dlaczego
Audyt wskazuje konflikt: `closeflow.studio` i `getcloseflow.com` opisują różne produkty / różne wersje marki. To jest blocker organizacyjny.

### Pliki do sprawdzenia
- `docs/`
- README / dokumenty wdrożeniowe
- publiczny landing, jeśli jest w repo
- Vercel project / deployment notes

### Zmień
Dodać dokument:

```text
docs/release/CLOSEFLOW_PUBLIC_SOURCE_MAP_2026-05-02.md
```

Dokument ma jasno mówić:
- który URL jest aplikacją do audytu,
- który URL jest landingiem,
- który URL jest stary / obcy / archiwalny,
- który branch i commit odpowiadają release candidate,
- czego audytor nie ma traktować jako aktualnej aplikacji.

### Nie zmieniaj
- domen DNS,
- konfiguracji produkcyjnej,
- treści publicznej, jeśli nie ma jej w repo.

### Po wdrożeniu sprawdź
Czy w dokumentacji nie ma kilku sprzecznych „oficjalnych” URL-i.

### Kryterium zakończenia
Każdy audytor wie: „audytuję ten branch, ten commit, ten deployment, a nie przypadkowy landing”.

### Ingerencja użytkownika
Jeśli publiczny landing jest poza repo, developer ma dać użytkownikowi listę konkretnych miejsc do ręcznej korekty.

---

# FAZA 1 — UI TRUTH, COPY TRUTH, LEGAL TRUTH

## Etap 1.1 — Publiczne i aplikacyjne copy nie może kłamać

### Cel
Ujednolicić komunikację produktu: trial, billing, security, integracje, AI, digest, PWA, cancel/resume, status beta/live.

### Dlaczego
Audyt wskazał sprzeczności typu waitlista + gotowa subskrypcja, Spring 2026 + dashboard cancellation, SOC 2 in progress + SOC 2 certified. To zabija zaufanie i może tworzyć ryzyko prawne.

### Pliki do sprawdzenia
- `src/pages/Billing.tsx`
- `src/pages/Settings.tsx`
- `src/pages/NotificationsCenter.tsx`
- `src/pages/SupportCenter.tsx`
- `src/components/*Plan*`
- `src/lib/plans.ts`
- `src/lib/access.ts`
- `public/*`
- `docs/legal/*`, jeśli istnieją
- landing / FAQ / Terms / Privacy, jeśli są w repo

### Zmień
Wprowadzić jeden słownik statusów funkcji:

```text
active
requires_config
beta
coming_soon
disabled_by_plan
internal_only
```

Każda funkcja w UI ma pokazywać prawdziwy status:
- Stripe checkout działa / test mode / requires config,
- digest logic exists / email provider missing,
- Google Calendar planned / beta / connected,
- AI creates draft only,
- browser notifications require permission,
- PWA available / partially configured,
- security claims tylko faktyczne.

### Nie zmieniaj
- modelu płatności,
- cen,
- logiki planów,
- integracji technicznej, jeśli etap dotyczy tylko prawdy copy.

### Po wdrożeniu sprawdź
- nie ma `SOC 2 certified`, jeśli nie ma certyfikatu,
- nie ma `wysłano e-mail`, jeśli nie ma providera,
- nie ma `połączono Google Calendar`, jeśli nie ma OAuth i syncu,
- billing nie pokazuje gotowego cancel/resume, jeśli backend tego nie obsługuje.

### Kryterium zakończenia
UI, marketing i legal nie obiecują więcej niż system potrafi zrobić.

### Ingerencja użytkownika
Jeżeli część publicznego copy jest poza repo, developer musi dać użytkownikowi gotowe teksty zastępcze i instrukcję ręcznej podmiany.

---

## Etap 1.2 — Guard UI Truth

### Cel
Zablokować powrót fałszywych komunikatów w przyszłości.

### Dlaczego
Jednorazowa poprawka copy nie wystarczy. Regresja w copy jest równie groźna jak regresja w kodzie, bo produkt może znowu udawać gotowość.

### Pliki do sprawdzenia
- `scripts/`
- `tests/`
- `package.json`
- teksty UI w `src/`

### Zmień
Dodać guardy:

```text
scripts/check-ui-truth-claims.cjs
scripts/check-public-security-claims.cjs
scripts/check-integration-status-copy.cjs
```

Guard ma wykrywać zakazane frazy bez warunku / bez statusu:
- `SOC 2 certified`,
- `email sent`, `wysłano`, jeśli brak env guard,
- `Google Calendar connected`, jeśli brak connect state,
- `cancel anytime from dashboard`, jeśli brak flow,
- `AI saved`, jeśli AI tworzy tylko szkic.

### Nie zmieniaj
- działania aplikacji.

### Po wdrożeniu sprawdź
Uruchomić:

```powershell
npm.cmd run check:ui-truth
```

### Kryterium zakończenia
Build/verify nie przepuszcza fałszywych claimów.

---

# FAZA 2 — ACCESS, WORKSPACE, SECURITY

## Etap 2.1 — Workspace isolation i request scope

### Cel
Udowodnić, że user B nie widzi danych usera A, zwykły user nie widzi admin-only route, a workspace po refreshu wraca poprawnie.

### Dlaczego
Audyt wskazuje brak dowodu na auth guards, request scope, RLS, admin isolation i workspace restore po refreshu. To jest P0.

### Pliki do sprawdzenia
- `src/hooks/useWorkspace.ts`
- `src/server/_request-scope.ts`
- `src/server/_access-gate.ts`
- `src/server/_supabase-auth.ts`
- `src/server/_supabase.ts`
- `api/me.ts`
- wszystkie endpointy `api/*.ts`
- Supabase RLS policies / migracje

### Zmień
- każda operacja API musi wyciągać user/workspace z autoryzowanego requestu,
- nie ufać workspaceId z frontu bez walidacji,
- admin-only route muszą mieć backendowy guard,
- workspace musi być odtwarzany po refreshu,
- brak auth = 401,
- brak dostępu do workspace = 403.

### Nie zmieniaj
- UI poza komunikatami błędów,
- danych użytkowników.

### Po wdrożeniu sprawdź
Manualny test:
1. user A tworzy lead/task/event/case,
2. user B loguje się w innym workspace,
3. user B nie widzi danych usera A,
4. zwykły user nie widzi admin routes,
5. po refreshu workspace usera A nadal jest poprawny.

### Kryterium zakończenia
Zero przecieków danych między workspace’ami i zero admin leakage.

### Ingerencja użytkownika
Wymagane testowe konto user A i user B. Developer ma dać dokładną instrukcję, co kliknąć i jakie screeny zrobić.

---

## Etap 2.2 — RLS / backend security proof

### Cel
Udowodnić security nie tylko UI, ale też bazą i API.

### Dlaczego
Jeśli UI filtruje dane, ale API lub RLS przepuszcza cudzy workspace, aplikacja nie jest gotowa.

### Pliki do sprawdzenia
- `supabase/migrations/*.sql`
- `src/server/_supabase.ts`
- endpointy API
- dokumenty SQL / RLS

### Zmień
- sprawdzić RLS dla każdej tabeli: leads, clients, cases, tasks, events, ai_drafts, activities, billing/workspace,
- dopisać brakujące policies,
- dodać dokument RLS matrix.

### SQL
Jeżeli brakuje RLS lub kolumn do scope, developer ma przygotować:

```text
supabase/migrations/YYYYMMDDHHMM_closeflow_rls_workspace_hardening.sql
docs/sql/closeflow_rls_workspace_hardening_2026-05-02.md
```

W docs/sql musi być pełny SQL do skopiowania do Supabase.

### Nie zmieniaj
- nazw tabel bez konieczności,
- danych produkcyjnych bez backupu.

### Po wdrożeniu sprawdź
- request bez auth zwraca 401,
- request do cudzego workspace zwraca 403 albo pusty wynik,
- zwykły user nie może wykonać admin action.

### Kryterium zakończenia
Security jest wymuszone w backendzie i RLS, nie tylko w UI.

---

# FAZA 3 — BILLING, TRIAL, PLANY, ACCESS GATE

## Etap 3.1 — Jedno źródło prawdy dla planów

### Cel
Trial, Free, Basic, Pro, AI i limity muszą być liczone spójnie w backendzie i UI.

### Dlaczego
Audyt wskazuje ryzyko billing truth. UI nie może pokazywać aktywnego dostępu, jeśli backend mówi, że dostęp wygasł.

### Pliki do sprawdzenia
- `src/hooks/useWorkspace.ts`
- `src/lib/access.ts`
- `src/lib/plans.ts`
- `api/me.ts`
- `api/workspace-subscription.ts`
- `src/pages/Billing.tsx`
- `src/pages/Today.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/LeadDetail.tsx`

### Zmień
Statusy:

```text
trial_active
trial_ending
trial_expired
paid_active
payment_failed
canceled
inactive
```

Plany:

```text
Free
Basic
Pro
AI
```

Free:
- 5 aktywnych leadów,
- 5 aktywnych zadań/wydarzeń łącznie,
- 3 aktywne szkice,
- brak AI,
- brak Google Calendar,
- brak digestu e-mail.

### Nie zmieniaj
- ceny bez decyzji właściciela,
- publicznego landing pricing, jeśli nie jest w repo.

### Po wdrożeniu sprawdź
- trial ma właściwą długość,
- po trial expired można czytać dane, ale nie tworzyć ponad limit,
- plan status odświeża się po zmianie,
- UI i backend pokazują to samo.

### Kryterium zakończenia
Access jest liczony z jednego kontraktu, a UI go tylko pokazuje.

---

## Etap 3.2 — Backendowe blokady funkcji

### Cel
Blokady planów nie mogą być tylko frontendowe.

### Dlaczego
Użytkownik może ominąć UI i uderzyć w API. Jeśli API zapisze dane mimo wygasłego triala, billing jest dekoracją.

### Pliki do sprawdzenia
- `src/server/_access-gate.ts`
- `api/leads.ts`
- `api/tasks.ts`
- `api/events.ts`
- `api/cases.ts`
- `api/ai-drafts.ts`
- `api/assistant/*`

### Zmień
Każdy create/update premium action musi sprawdzić:
- plan,
- status trial/billing,
- limity,
- workspace,
- user.

### Nie zmieniaj
- odczytu historycznych danych po wygaśnięciu.

### Po wdrożeniu sprawdź
- Free blokuje 6. aktywnego leada,
- trial expired blokuje nowe rekordy,
- AI endpoint blokuje plan bez AI,
- komunikat jest zrozumiały.

### Kryterium zakończenia
Plan realnie steruje działaniem aplikacji.

---

# FAZA 4 — KONTRAKT DANYCH, CRUD, RELOAD

## Etap 4.1 — Mapa pól i legacy aliasów

### Cel
Ustalić jeden kontrakt danych dla leadów, klientów, spraw, zadań, wydarzeń, szkiców AI i aktywności.

### Dlaczego
Audyt wymaga dowodu CRUD i reload persistence. Tego nie da się porządnie testować, jeśli UI zgaduje pola przez `x || y || z`.

### Pliki do sprawdzenia
- `api/leads.ts`
- `api/clients.ts`, jeśli istnieje
- `api/cases.ts`
- `api/tasks.ts`
- `api/events.ts`
- `api/ai-drafts.ts`
- `src/lib/calendar-items.ts`
- `src/lib/scheduling.ts`
- `src/lib/supabase-fallback.ts`
- `src/pages/Today.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/Leads.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`

### Zmień
Dodać:

```text
docs/technical/DATA_CONTRACT_MAP_2026-05-02.md
```

Dla każdego typu rekordu wypisać:
- pola docelowe,
- pola legacy,
- miejsce normalizacji,
- miejsca, które jeszcze używają legacy aliasów.

### Nie zmieniaj
- UI,
- API response shape przed zakończeniem mapy.

### Po wdrożeniu sprawdź
Grep po repo ma pokazać, gdzie jeszcze jest zgadywanie pól.

### Kryterium zakończenia
Developer wie, które pola są prawdą, a które są tylko kompatybilnością przejściową.

---

## Etap 4.2 — Normalizacja tasków i eventów

### Cel
Task/event mają wyglądać identycznie w Today, Tasks, Calendar, LeadDetail, CaseDetail i AI snapshot.

### Dlaczego
To jest fundament przypomnień, digestu, kalendarza, Today i Google sync.

### Pliki do sprawdzenia
- `api/tasks.ts`
- `api/events.ts`
- `src/lib/calendar-items.ts`
- `src/lib/scheduling.ts`
- `src/pages/Today.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`

### Zmień
Docelowy task:

```text
id
workspaceId
title
status
type
priority
scheduledAt
leadId
caseId
clientId
reminderAt
recurrenceRule
createdAt
updatedAt
```

Docelowy event:

```text
id
workspaceId
title
type
status
startAt
endAt
leadId
caseId
clientId
reminderAt
recurrenceRule
createdAt
updatedAt
```

Legacy obsługiwać tylko w normalize helperach.

### Nie zmieniaj
- wyglądu kart,
- nazw sekcji,
- logiki biznesowej poza normalizacją danych.

### Po wdrożeniu sprawdź
- task dodany z LeadDetail widać w Today, Tasks i Calendar,
- event z Calendar widać w Today i LeadDetail,
- po reloadzie dane wracają.

### Kryterium zakończenia
Jeden rekord = jedno zachowanie we wszystkich ekranach.

---

## Etap 4.3 — CRUD smoke test i reload persistence

### Cel
Dowieść, że podstawowe dane tworzą się, edytują, usuwają i wracają po odświeżeniu.

### Dlaczego
Audyt wskazał brak dowodu CRUD dla Leads, Clients, Cases, Tasks, Events i AI Drafts. To jest krytyczny brak.

### Pliki do sprawdzenia
- `tests/*crud*`
- `tests/*smoke*`
- `scripts/*smoke*`
- endpointy API
- główne widoki

### Zmień
Dodać test/guard:

```text
scripts/smoke-critical-crud.cjs
npm run test:critical
```

Zakres minimalny:
- create/read/update/delete lead,
- create/read/update/delete task,
- create/read/update/delete event,
- lead -> case,
- AI draft -> confirm,
- reload persistence dla Today/Tasks/Calendar/LeadDetail.

### Nie zmieniaj
- danych produkcyjnych,
- env sekretów.

### Po wdrożeniu sprawdź
Uruchomić:

```powershell
npm.cmd run test:critical
npm.cmd run verify:closeflow:quiet
npm.cmd run build
```

### Kryterium zakończenia
Krytyczne ścieżki CRUD mają dowód działania.

---

## Etap 4.4 — Live refresh bez ręcznego odświeżania

### Cel
Po dodaniu/edycji/zamknięciu taska lub eventu Today i Calendar muszą aktualizować się od razu.

### Dlaczego
Wcześniejsze objawy typu „zadania pojawiają się dopiero po odświeżeniu” są P0 używalności. Na telefonie to wygląda jak uszkodzony zapis.

### Pliki do sprawdzenia
- `src/pages/Today.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/LeadDetail.tsx`
- `src/lib/supabase-fallback.ts`
- aktualny store/cache/query layer

### Zmień
Po mutacji:
- aktualizować lokalny stan,
- albo invalidować wspólny snapshot,
- albo odpalić jeden kontrolowany refetch.

Nie robić full page reload i timeoutowych obejść.

### Nie zmieniaj
- modelu danych,
- wyglądu UI.

### Po wdrożeniu sprawdź
- dodaj task w LeadDetail,
- bez odświeżenia sprawdź Today i Tasks,
- oznacz done,
- sprawdź Calendar/Today,
- powtórz na telefonie.

### Kryterium zakończenia
Użytkownik widzi efekty akcji natychmiast.

---

# FAZA 5 — AI GOVERNANCE I CONFIRM-FIRST

## Etap 5.1 — AI read vs draft intent

### Cel
Rozdzielić pytania informacyjne od komend zapisu.

### Dlaczego
Audyt wskazuje, że confirm-first jest obiecane publicznie, ale nieudowodnione w backendzie. To musi być twardy guard, nie ładna narracja.

### Pliki do sprawdzenia
- `src/components/GlobalAiAssistant.tsx`
- `src/components/TodayAiAssistant.tsx`
- `src/pages/AiDrafts.tsx`
- `src/server/ai-assistant.ts`
- `src/server/ai-capture.ts`
- `src/lib/ai-drafts.ts`
- endpointy `api/ai*`

### Zmień
Intent detection:

```text
read/search/answer
create_draft_lead
create_draft_task
create_draft_event
create_draft_note
unknown
```

Bez komendy typu `zapisz`, `dodaj`, `utwórz`, `mam leada` AI nie tworzy szkicu.

### Nie zmieniaj
- AI nie ma tworzyć finalnych rekordów.

### Po wdrożeniu sprawdź
Komendy:
- `Co mam jutro?` -> read, zero zapisu,
- `Znajdź numer do Marka` -> read, zero zapisu,
- `Dorota Kołodziej` -> search, zero zapisu,
- `Zapisz zadanie jutro 12:00 oddzwonić do Marka` -> szkic.

### Kryterium zakończenia
AI nie zapisuje niczego bez intencji tworzenia.

---

## Etap 5.2 — Backendowy guard: tylko szkice, final write po approve

### Cel
Wymusić confirm-first po stronie serwera.

### Dlaczego
Frontend można ominąć. Jeśli endpoint AI potrafi utworzyć finalny lead/task/event bez zatwierdzenia, produkt łamie własną zasadę.

### Pliki do sprawdzenia
- `api/ai-drafts.ts`
- `api/assistant/*`
- `api/leads.ts`
- `api/tasks.ts`
- `api/events.ts`
- `src/server/ai-assistant.ts`
- `src/lib/ai-drafts.ts`

### Zmień
- AI endpointy mogą tworzyć tylko draft,
- finalny zapis wyłącznie przez endpoint confirm,
- confirm sprawdza user/workspace/status draftu,
- rawText po confirm/cancel ma być czyszczony, jeśli takie są zasady prywatności.

### Nie zmieniaj
- zwykłych ręcznych formularzy dodawania rekordów.

### Po wdrożeniu sprawdź
Próba bezpośredniego requestu do AI final write musi nie przejść.

### Kryterium zakończenia
Nie ma backdoora do finalnego zapisu AI.

---

## Etap 5.3 — AI snapshot danych aplikacji

### Cel
AI ma odpowiadać na podstawie danych aplikacji, nie z pustego prompta.

### Dlaczego
Audyt wymaga sprawdzenia, czy pytanie `co mam jutro?` widzi realne dane. Wcześniejsza specyfikacja wskazywała problem pustych tablic w globalnym asystencie.

### Pliki do sprawdzenia
- `src/components/GlobalAiAssistant.tsx`
- `src/server/ai-assistant.ts`
- `api/assistant/context.ts` albo nowy endpoint
- warstwa danych lead/tasks/events/cases/clients

### Zmień
Dodać endpoint:

```text
/api/assistant/context
```

Snapshot ma obejmować tylko dane workspace użytkownika:
- leady,
- klienci,
- sprawy,
- zadania,
- wydarzenia,
- szkice,
- powiązania,
- terminy,
- statusy,
- wartości.

### Nie zmieniaj
- final write flow.

### Po wdrożeniu sprawdź
- jeśli jutro istnieje zadanie, AI je zwraca,
- jeśli istnieje numer telefonu w leadzie, AI go znajduje,
- jeśli nie ma danych, AI mówi, że nie znalazło.

### Kryterium zakończenia
AI nie zmyśla i nie odpowiada z pustych danych.

---

# FAZA 6 — LEAD, CASE, KLIENT: PROSTY MODEL PRACY

## Etap 6.1 — Usunięcie `Następnego kroku` z głównej logiki

### Cel
Zastąpić ręczne pole `Następny krok` blokiem `Najbliższa zaplanowana akcja` liczonym z zadań i wydarzeń.

### Dlaczego
Nowsza decyzja produktowa mówi, że `Następny krok` dubluje taski/eventy i tworzy chaos.

### Pliki do sprawdzenia
- `src/pages/LeadDetail.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Today.tsx`
- `src/lib/scheduling.ts`
- `src/lib/lead-health.ts`
- API lead/task/event

### Zmień
Na aktywnym leadzie pokazać:

```text
Najbliższa zaplanowana akcja
Typ: zadanie / wydarzenie
Tytuł
Termin
Powiązanie
Otwórz szczegóły
```

Jeśli brak:

```text
Brak zaplanowanych działań
```

### Nie zmieniaj
- historii leada,
- danych kontaktowych,
- relacji lead -> case.

### Po wdrożeniu sprawdź
- lead z taskiem pokazuje task jako najbliższą akcję,
- lead z eventem pokazuje event,
- lead bez task/event wpada do sekcji `Bez zaplanowanej akcji`.

### Kryterium zakończenia
Nie ma dwóch równoległych prawd o kolejnym ruchu.

---

## Etap 6.2 — `Rozpocznij obsługę`: lead -> sprawa

### Cel
Dowieźć jasny przepływ: lead aktywny przechodzi do sprawy jako miejsca pracy operacyjnej.

### Dlaczego
Użytkownik nie może po pozyskaniu działać jednocześnie na leadzie, kliencie i sprawie. To robi produktowy makaron.

### Pliki do sprawdzenia
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/Cases.tsx`
- `src/pages/Clients.tsx`
- `api/leads.ts`
- `api/cases.ts`
- `api/clients.ts`, jeśli istnieje
- activity/audit endpoint

### Zmień
Klik `Rozpocznij obsługę` ma:
1. sprawdzić/utworzyć klienta,
2. utworzyć sprawę,
3. podpiąć sprawę do klienta,
4. podpiąć sprawę do leada,
5. oznaczyć lead jako `w obsłudze` / `pozyskany do obsługi`,
6. usunąć lead z aktywnych leadów,
7. zapisać aktywność,
8. przekierować do sprawy.

### Nie zmieniaj
- lead nie ma znikać całkowicie,
- klient nie staje się głównym ekranem pracy.

### Po wdrożeniu sprawdź
- przed/po screen,
- rekord case ma leadId/clientId,
- lead ma linkedCaseId,
- po reloadzie relacje zostają.

### Kryterium zakończenia
Po pozyskaniu temat żyje w sprawie, nie w leadzie.

---

## Etap 6.3 — Widok leada po pozyskaniu

### Cel
Lead pozyskany ma być historią/źródłem, nie miejscem dalszej pracy.

### Dlaczego
Jeśli zostawimy tam szybkie akcje sprzedażowe, user znowu nie będzie wiedział, gdzie działać.

### Pliki do sprawdzenia
- `src/pages/LeadDetail.tsx`
- komponenty quick actions
- lead status helpers

### Zmień
Po pozyskaniu pokazać tylko:
- `Ten temat jest już w obsłudze`,
- sprawa,
- status sprawy,
- data przejścia,
- `Otwórz sprawę`,
- dane źródłowe,
- historia kontaktu.

Ukryć:
- `Następny krok`,
- `Co teraz zrobić z tym leadem`,
- `Planowanie ruchu`,
- `Dodaj zadanie`,
- `Dodaj wydarzenie`,
- szybkie akcje sprzedażowe.

### Nie zmieniaj
- możliwości podglądu historii.

### Po wdrożeniu sprawdź
Lead pozyskany nie wygląda jak aktywny lead.

### Kryterium zakończenia
Użytkownik widzi jeden jasny komunikat: temat jest już w obsłudze, otwórz sprawę.

---

# FAZA 7 — TODAY JAKO CENTRUM EGZEKUCJI

## Etap 7.1 — Sekcje Today według powodu działania

### Cel
Today ma mówić co robić i dlaczego, nie tylko listować rekordy.

### Dlaczego
Produkt ma codziennie odpowiadać: kogo ruszyć, co jest zagrożone, co jest zaległe, co wymaga ruchu.

### Pliki do sprawdzenia
- `src/pages/Today.tsx`
- `src/lib/lead-health.ts`
- `src/lib/scheduling.ts`
- task/event/lead selectors

### Zmień
Sekcje:
- `Zaległe`,
- `Do zrobienia dziś`,
- `Bez zaplanowanej akcji`,
- `Waiting za długo`,
- `Najcenniejsze zagrożone`,
- `Najbliższe dni`,
- `Szkice do sprawdzenia`.

Każda karta pokazuje:
- rekord,
- powód,
- termin,
- priorytet/wartość,
- szybkie działanie,
- link do szczegółów.

### Nie zmieniaj
- sidebaru,
- globalnej skórki,
- formularzy, jeśli nie trzeba.

### Po wdrożeniu sprawdź
- liczby na top stats zgadzają się z sekcjami,
- brak bezsensownych duplikatów,
- po reloadzie Today nadal pokazuje dane.

### Kryterium zakończenia
Po wejściu w Today użytkownik w kilka sekund wie, co zrobić.

---

## Etap 7.2 — Done -> ustaw kolejny ruch

### Cel
Po wykonaniu taska aplikacja pomaga ustawić kolejne działanie.

### Dlaczego
Największa luka procesu: użytkownik zrobił jeden ruch, ale nie zaplanował następnego i lead wypada z rytmu.

### Pliki do sprawdzenia
- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/LeadDetail.tsx`
- `src/lib/scheduling.ts`
- `api/tasks.ts`

### Zmień
Po oznaczeniu taska jako done dla aktywnego leada:
- `Ustaw follow-up`,
- `Jutro`,
- `Za 2 dni`,
- `Za tydzień`,
- `Zostaw bez akcji`.

Jeśli user zostawi bez akcji, lead wpada do `Bez zaplanowanej akcji`.

### Nie zmieniaj
- nie blokuj agresywnie zamknięcia taska,
- nie twórz automatycznie tasków bez kliknięcia.

### Po wdrożeniu sprawdź
- task z leadem,
- task bez leada,
- event w kalendarzu,
- mobile.

### Kryterium zakończenia
Lead nie znika przypadkiem z procesu po wykonaniu jednego kroku.

---

# FAZA 8 — BILLING I INTEGRACJE BEZ ATRAP

## Etap 8.1 — Stripe / checkout / cancel / resume jako prawdziwe flow albo requires_config

### Cel
Billing ma mówić prawdę: działa w test mode, live albo wymaga konfiguracji.

### Dlaczego
Audyt pokazał rozjazd między waitlistą/no card i Terms z auto-renewal/cancel. To trzeba domknąć albo oznaczyć jako nieaktywne.

### Pliki do sprawdzenia
- `src/server/_stripe.ts`
- `src/server/billing-checkout-handler.ts`
- `api/billing-checkout.ts`
- `api/workspace-subscription.ts`
- `src/pages/Billing.tsx`
- `.env.example`

### Zmień
- jeśli brak Stripe env: pokazać `Wymaga konfiguracji`,
- jeśli test mode: pokazać `Tryb testowy`,
- webhook aktualizuje workspace subscription,
- cancel/resume tylko jeśli endpointy działają.

### Nie zmieniaj
- cen i planów bez decyzji użytkownika.

### Po wdrożeniu sprawdź
- checkout test mode,
- webhook,
- cancel,
- resume,
- status po refreshu.

### Kryterium zakończenia
Billing nie jest atrapą.

### Ingerencja użytkownika
Jeśli trzeba ustawić Stripe env w Vercel, developer ma dać gotowe nazwy env i instrukcję krok po kroku. Sekretów nie wpisywać do repo.

---

## Etap 8.2 — Digest / mail provider / cron guard

### Cel
Digest ma mieć prawdziwą logikę i jasny status konfiguracji maila.

### Dlaczego
Bez Resend/mail providera logika może przejść, ale fizyczny e-mail nie zostanie wysłany. UI nie może pisać `wysłano`, jeśli nie ma providera.

### Pliki do sprawdzenia
- digest endpointy,
- cron handler,
- `vercel.json`,
- `src/pages/NotificationsCenter.tsx`,
- `.env.example`,
- docs TODO mail provider.

### Zmień
- `RESEND_API_KEY` guard,
- `CRON_SECRET` guard,
- `APP_URL` guard,
- status: `requires_config`, jeśli brak env,
- jeden digest dziennie na user/workspace.

### Nie zmieniaj
- nie kupować domeny tylko dla tego etapu,
- nie wpisywać sekretów do repo.

### Po wdrożeniu sprawdź
- bez env UI mówi `wymaga konfiguracji`,
- z test env wysyła testowy digest,
- cron bez secretu nie działa.

### Kryterium zakończenia
Digest nie udaje działania bez providera.

---

## Etap 8.3 — Google Calendar / email/calendar integrations: tylko statusy teraz, sync później

### Cel
Nie obiecywać integracji, jeśli nie mamy OAuth, callbacków, sync IDs, retry i disconnect.

### Dlaczego
Audyt wskazał publiczne claimy o integracjach Google/Microsoft/Apple/Calendly bez dowodu działania.

### Pliki do sprawdzenia
- Settings / Integrations UI,
- `.env.example`,
- ewentualne endpointy OAuth,
- docs integrations.

### Zmień teraz
- status `coming_soon` albo `requires_config`,
- żadnych sukces toastów bez realnego connect,
- żadnych publicznych claimów `connected`, jeśli nie ma tokenów/syncu.

### Nie zmieniaj
- nie wdrażać pełnego Google Calendar w tym etapie.

### Po wdrożeniu sprawdź
Klik integracji bez env nie może wyglądać jak sukces.

### Kryterium zakończenia
Integracje są uczciwie oznaczone.

---

# FAZA 9 — MOBILE, PWA, POLSKIE ZNAKI, ROUTE RELOAD

## Etap 9.1 — Mobile smoke i layout blockers

### Cel
Aplikacja ma działać na telefonie: Today, Tasks, Calendar, LeadDetail, Billing, AI Drafts.

### Dlaczego
Audyt nie mógł potwierdzić mobile/PWA. Zakres V1 mówi, że produkt ma być mobile-first/PWA.

### Pliki do sprawdzenia
- global CSS,
- layout shell,
- `src/pages/Today.tsx`,
- `src/pages/Tasks.tsx`,
- `src/pages/Calendar.tsx`,
- `src/pages/LeadDetail.tsx`,
- `src/pages/Billing.tsx`,
- modale i dropdowny.

### Zmień
- naprawić ucięte modale,
- bottom safe area,
- mobile header/sidebar,
- loader states,
- empty/error states,
- route reload white screens.

### Nie zmieniaj
- skórki całości, jeśli nie trzeba.

### Po wdrożeniu sprawdź
Realny telefon + DevTools mobile:
- create task,
- reload Today,
- open modal,
- close modal,
- navigate between tabs.

### Kryterium zakończenia
Na telefonie da się używać aplikacji bez frustracji i refresh drama.

---

## Etap 9.2 — Polish mojibake guard

### Cel
Wyłapać typowe sekwencje mojibake bez utrwalania ich literalnie w repo.

### Dlaczego
Krzaki w polskim UI natychmiast robią wrażenie niedokończonej aplikacji.

### Pliki do sprawdzenia
- wszystkie `src/**/*.tsx`, `src/**/*.ts`, `docs/**/*.md`, `public/**/*`, jeśli zawierają copy.

### Zmień
- naprawić uszkodzone polskie znaki,
- dodać / utrzymać guard:
  - `check:polish-mojibake`.

### Nie zmieniaj
- sensu copy, jeśli chodzi tylko o encoding.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run check:polish-mojibake
```

### Kryterium zakończenia
Brak mojibake w UI i docs.

---

## Etap 9.3 — PWA sanity

### Cel
PWA ma być prawdziwie przygotowane albo uczciwie oznaczone.

### Dlaczego
Jeśli mówimy „apka na telefon”, manifest i standalone muszą działać.

### Pliki do sprawdzenia
- `public/manifest.webmanifest`,
- service worker,
- ikony,
- meta theme color,
- install prompt / instrukcja.

### Zmień
- manifest,
- ikony,
- display standalone,
- ostrożny cache,
- instrukcja `Dodaj do ekranu głównego`.

### Nie zmieniaj
- nie robić natywnej aplikacji.

### Po wdrożeniu sprawdź
- Chrome installability,
- mobile add to home screen,
- reload offline/online behavior.

### Kryterium zakończenia
PWA nie jest atrapą.

---

# FAZA 10 — TESTY, GUARDY, CI, FINAL SIGN-OFF

## Etap 10.1 — Stałe release gates

### Cel
Ustawić testy tak, żeby release nie był oparty o intuicję.

### Dlaczego
Audyt wskazał brak dowodu, że guardy istnieją i przechodzą. Build sam nie wystarcza.

### Pliki do sprawdzenia
- `package.json`
- `scripts/`
- `tests/`
- CI, jeśli istnieje

### Zmień
Dodać lub potwierdzić komendy:

```text
check:ui-truth
check:polish-mojibake
check:routes
check:access-billing
check:ai-confirm-first
test:critical
verify:closeflow:quiet
```

### Nie zmieniaj
- testów w sposób, który ukrywa błędy.

### Po wdrożeniu sprawdź

```powershell
npm.cmd run build
npm.cmd run verify:closeflow:quiet
npm.cmd run test:critical
```

### Kryterium zakończenia
Regresje copy/access/AI/CRUD nie przechodzą niezauważone.

---

## Etap 10.2 — Manualny smoke test release candidate

### Cel
Przejść aplikację jak pierwszy realny użytkownik.

### Dlaczego
Automatyczne testy nie złapią całego UX, mobile, flow i reload persistence.

### Test ręczny
1. login user A,
2. utwórz lead,
3. utwórz task,
4. utwórz event,
5. sprawdź Today,
6. odśwież Today/Tasks/Calendar/LeadDetail,
7. wygeneruj AI draft,
8. zatwierdź AI draft,
9. kliknij `Rozpocznij obsługę`,
10. sprawdź sprawę,
11. logout,
12. login user B,
13. potwierdź brak danych usera A,
14. mobile test.

### Kryterium zakończenia
Jest dowód video/screen/log, że krytyczne ścieżki działają.

### Ingerencja użytkownika
Tak. Developer ma dać użytkownikowi dokładną instrukcję testu i listę danych testowych do wpisania.

---

## Etap 10.3 — Final release sign-off

### Cel
Podjąć decyzję `go / no-go / internal-only`.

### Dlaczego
Bez pisemnej decyzji wracamy do chaosu: „chyba działa”.

### Pliki do dodania

```text
docs/release/RELEASE_SIGNOFF_2026-05-02.md
```

### Dokument zawiera
- branch,
- commit,
- deployment URL,
- wynik testów automatycznych,
- wynik smoke testu manualnego,
- znane ograniczenia,
- funkcje aktywne,
- funkcje wymagające konfiguracji,
- decyzję końcową.

### Kryterium zakończenia
Można odpowiedzialnie powiedzieć: dajemy / nie dajemy użytkownikowi.

---

# FAZA 11 — FUNKCJE WARTOŚCIOWE PO P0/P1

Te etapy są ważne, ale dopiero po zamknięciu fundamentów.

## Etap 11.1 — Voice / Quick Lead Capture

### Cel
Szybkie zapisanie leada z tekstu/dyktowania jako szkic do potwierdzenia.

### Dlaczego
To daje realną przewagę na telefonie po rozmowie, ale nie może wyprzedzić CRUD/access/AI confirm-first.

### Zasada
Parser zawsze działa, AI opcjonalne, użytkownik zatwierdza, rawText czyszczony po confirm/cancel.

---

## Etap 11.2 — Podyktuj notatkę przy leadzie/kliencie/sprawie

### Cel
Szybka notatka kontekstowa po rozmowie.

### Dlaczego
To jest praktyczna funkcja codzienna, mały UI, duża wartość.

### Zasada
Notatka przypina się do aktualnego rekordu, nie tworzy przypadkowych leadów.

---

## Etap 11.3 — Szablony odpowiedzi

### Cel
Własna biblioteka odpowiedzi do kopiowania / generowania szkiców.

### Dlaczego
Daje wartość sprzedażową bez wdrażania pełnej automatycznej wysyłki maili.

---

## Etap 11.4 — Google Calendar Sync

### Cel
Sync tasków/eventów do Google Calendar dla Pro/AI.

### Dlaczego
To dobry selling point, ale tylko po twardym kontrakcie task/event i access gate.

---

## Etap 11.5 — Portal klienta / uploady / akceptacje

### Cel
Druga warstwa produktu: po pozyskaniu klienta system pilnuje kompletności sprawy.

### Dlaczego
To zwiększa wartość, ale wymaga stabilnego lead -> sprawa, RLS, storage i privacy.

---

# Najbliższy pakiet do wdrożenia po tym audycie

Następny techniczny pakiet powinien obejmować tylko:

1. Etap 0.1 — Release Candidate Evidence Gate.
2. Etap 0.2 — mapa domen/deploymentów.
3. Etap 1.1 — UI/copy/legal truth lock.
4. Etap 1.2 — guard UI truth.
5. Etap 2.1 — workspace isolation audit / request scope checklist.

Nie wdrażać teraz:
- Google Calendar,
- voice capture,
- szablonów,
- portalu klienta,
- dużego AI V2,
- nowej skórki UI.

Najpierw dowód, potem funkcje.

