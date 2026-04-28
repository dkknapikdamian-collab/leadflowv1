# CloseFlow — aktualny status i lista wdrożeń

Data aktualizacji: 2026-04-28  
Repo: `dkknapikdamian-collab/leadflowv1`  
Gałąź: `dev-rollout-freeze`  
Kierunek nadrzędny: **100% Supabase jako docelowe źródło danych i auth**.

## 1. Co uznajemy za wdrożone i wypchnięte do repo

### AI / szkice / operator aplikacji

W repo są już wdrożone etapy:

- Stage 01 — klikane kafelki u góry w `Dziś` jako bezpośrednie przejścia do sekcji.
- Stage 02 — AI Operator Snapshot: asystent dostaje snapshot aplikacji.
- Stage 03 — Szkice AI można zatwierdzać do finalnych rekordów przez bezpieczny flow.
- Stage 04 — Szkice AI są widoczne w `Dziś` jako element do przeglądu.
- Stage 05 — poranny digest uwzględnia Szkice AI.
- Stage 06 — dane liczone lokalnie/regułowo nie zużywają limitu AI.
- Stage 07/08/09/10 — guardy i poprawki kontraktów po etapach kumulacyjnych.
- Stage 11 — `Dziś`: lejek wartości bez podwójnego liczenia tego samego kontaktu jako lead + klient.
- Stage 12/13 — Szkice AI: prawdziwe przenoszenie do lead/zadanie/wydarzenie/notatka + sync Supabase telefon/komputer.

### Billing / PWA / AI provider

- Stripe/BLIK foundation jest obecny.
- Daily digest foundation jest obecny.
- PWA foundation jest obecny: manifest, ikona, service worker statyczny bez cache danych biznesowych.
- Backendowy provider AI ma wiring pod Gemini i Cloudflare, z fallbackiem regułowym.

## 2. Co jest w ostatnim ZIP-ie, ale nie jest jeszcze w repo

Ostatni ZIP w rozmowie powinien być traktowany jako paczka pending.

Faktycznie znalezione w ZIP:

- Stage 15 — Billing copy cleanup.

Dodatkowo istnieje osobny ZIP Stage 14, ale nie był w ostatnim ZIP-ie. Żeby nie rozjechać procesu, przygotowałem poprawiony ZIP zbiorczy z:

- Stage 14 — usunięcie tekstu z kosza leadów,
- Stage 15 — czyszczenie tekstu w Billing,
- wspólny runner `APPLY_CLOSEFLOW_PENDING_STAGES.cmd`.

Stage 16 opisany wcześniej jako „AI session context polish” nie był fizycznie obecny w ostatnim ZIP-ie. Nie traktować go jako wdrożonego.

## 3. Najważniejsze rozbieżności między plikami źródłowymi a repo

### 3.1. 100% Supabase nie jest jeszcze domknięte

Repo nadal używa Firebase Auth:

- `src/firebase.ts` inicjuje Firebase app, auth, Firestore i Storage.
- `src/pages/Login.tsx` używa Firebase `signInWithPopup`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithRedirect`.
- `useWorkspace` pobiera kontekst workspace z Supabase, ale identyfikacja użytkownika nadal pochodzi z client auth snapshotu.

Wniosek: dane aplikacji idą głównie przez Supabase/API, ale auth nie jest jeszcze w 100% Supabase.

### 3.2. Trial w dokumentach ma 21 dni, repo nadal ma 14 dni

Plik planów mówi: `Trial Pro / AI przez 21 dni`. Repo nadal ma:

- `TRIAL_LENGTH_DAYS = 14` w `src/lib/access.ts`,
- lokalny workspace z `trial_14d`,
- teksty logowania i Billing mówiące o 14 dniach.

Wniosek: etap trial/planów wymaga aktualizacji.

### 3.3. Plany w dokumentach i repo nie są spójne

Dokument produktu zakłada:

- Free,
- Basic,
- Pro,
- AI.

Repo w `Billing.tsx` ma obecnie:

- Basic,
- Pro,
- Business.

Wniosek: trzeba zrobić etap planów i gatingu funkcji, zanim mocniej testujemy sprzedaż.

### 3.4. Dokument AI Application Operator ma starszy endpoint

Dokument mówi o `/api/assistant/context`, ale repo używa konsolidacji przez:

- `/api/system?kind=assistant-context`,
- `/api/system?kind=ai-drafts`,
- `/api/system?kind=ai-assistant`.

Wniosek: nie tworzyć nowych endpointów `api/assistant-context.ts`, bo wcześniej pilnowaliśmy limitu funkcji Vercel Hobby. Trzymać konsolidację przez `api/system.ts`.

## 4. Lista wdrożeń do zrobienia — kolejność aktualna

## P0 — poprawić paczkę pending i dopchnąć ją do repo

### Cel
Nie zgubić Stage 14 i Stage 15.

### Zakres
- Stage 14 — kosz leadów bez martwego opisu V1.
- Stage 15 — Billing bez końcówki „workflow działa bez blokad” i bez bloku „Jak działa V1”.

### Kryterium zakończenia
- `npm.cmd run lint`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run build`
- test Stage 14
- test Stage 15
- commit + push do `dev-rollout-freeze`

---

## P1 — Supabase Auth zamiast Firebase Auth

### Cel
Domknąć kierunek 100% Supabase.

### Pliki do sprawdzenia
- `src/pages/Login.tsx`
- `src/firebase.ts`
- `src/lib/client-auth.ts`
- `src/hooks/useClientAuthSnapshot.ts`
- `src/hooks/useWorkspace.ts`
- `src/lib/supabase-fallback.ts`
- `api/me.ts`
- server helpers odpowiedzialne za identity/request scope
- SQL: `profiles`, `workspaces`, `workspace_members`

### Zmień
- Logowanie/rejestracja/reset hasła przenieść na Supabase Auth.
- Google login przez Supabase OAuth, nie Firebase.
- Źródłem usera ma być Supabase session/JWT.
- `fetchMeFromSupabase` ma bazować na Supabase user, nie na zaufanych headerach z client snapshot.
- Firebase usunąć albo zostawić tylko jako martwy legacy do usunięcia w kolejnym etapie.
- Local/demo fallback dopuścić tylko w DEV, nie jako ścieżka produkcyjna.

### Nie zmieniaj
- Widoku logowania ponad konieczne teksty.
- Modelu leadów, zadań, spraw.
- Istniejących ekranów aplikacji.

### Po wdrożeniu sprawdź
- Rejestracja tworzy usera w Supabase.
- Login e-mail działa.
- Google OAuth działa na desktopie i telefonie.
- `workspace` tworzy się/ładuje poprawnie.
- Po odświeżeniu strony sesja zostaje.
- API nie ufa samym `x-user-id` z frontu.

---

## P2 — model planów: Free / Basic / Pro / AI + trial 21 dni

### Cel
Ustalić prawdziwy model sprzedaży i odblokowań.

### Pliki do sprawdzenia
- `src/lib/access.ts`
- `src/pages/Billing.tsx`
- `src/hooks/useWorkspace.ts`
- `api/billing-checkout.ts`
- `api/stripe-webhook.ts`
- `api/me.ts`
- `src/server/*billing*`
- SQL workspace subscription fields

### Zmień
- Trial: 21 dni.
- Plany: Free, Basic, Pro, AI.
- Usunąć/zmienić `Business`, jeśli nie zostaje jako osobny plan.
- Dodać feature gating:
  - Free: limity demo,
  - Basic: codzienna praca bez AI/Google,
  - Pro: Google Calendar / mocniejsze funkcje,
  - AI: asystent AI i limity AI.
- Ujednolicić teksty planów w Login, Billing, Sidebar i access summary.

### Po wdrożeniu sprawdź
- Nowy user dostaje 21 dni trialu.
- Po trialu Free jest ograniczony.
- Basic/Pro/AI pokazują poprawne funkcje.
- Checkout tworzy właściwy plan.
- Webhook aktywuje właściwy plan.

---

## P3 — twarde limity Free i bramki funkcji

### Cel
Free nie może być pełną darmową aplikacją.

### Zakres minimalny
- 5 aktywnych leadów/kontaktów.
- 5 aktywnych zadań/wydarzeń łącznie.
- 3 aktywne szkice AI.
- Brak AI.
- Brak digestu.
- Brak Google Calendar.

### Pliki do sprawdzenia
- `src/lib/access.ts`
- `src/lib/supabase-fallback.ts`
- formularze tworzenia lead/task/event/draft
- API `leads`, `tasks`, `events`, `system?kind=ai-drafts`

### Kryterium zakończenia
Limit musi blokować zapis na backendzie, nie tylko ukrywać przycisk w UI.

---

## P4 — Szkice AI: prywatność i model AppDraft

### Cel
Ujednolicić Szkice AI jako pełny mechanizm aplikacji.

### Co już jest
- typy: lead/task/event/note,
- statusy draft/converted/archived,
- sync Supabase + local fallback,
- przenoszenie do finalnych rekordów.

### Co dopracować
- docelowy status naming: `pending/confirmed/cancelled/expired/failed` albo decyzja, że zostaje `draft/converted/archived`.
- po zatwierdzeniu/anulowaniu czyścić `rawText` także po stronie Supabase.
- dodać `expiresAt`, jeśli szkice mają wygasać.
- dodać osobny event/activity przy anulowaniu.

---

## P5 — AI Application Operator: jakość odpowiedzi i sesja rozmowy

### Cel
Asystent ma lepiej odpowiadać na follow-upy typu:

- „A które z tego jest najważniejsze?”
- „Co z tego mam ruszyć pierwsze?”
- „Pokaż mi tylko klientów bez ruchu.”

### Co już jest
- snapshot aplikacji,
- global search,
- szkice,
- cost guard,
- Gemini/Cloudflare provider wiring.

### Co zostało
- pamięć ostatniego pytania/odpowiedzi w otwartym oknie,
- lepszy ranking priorytetów,
- odpowiedzi „nie znalazłem w danych aplikacji” dla niepewnych pytań,
- testy konkretnych scenariuszy biznesowych.

---

## P6 — poranny digest: ustawienia użytkownika i realny harmonogram

### Co już jest
- endpoint/foundation digestu,
- cron auth,
- szkice AI w digest.

### Co dopracować
- ustawienie godziny w UI,
- strefa czasu per workspace/user,
- `lastDigestSentAt` i log wysyłki,
- test, że nie wysyła dubla tego samego dnia,
- decyzja, czy Free ma digest zablokowany.

---

## P7 — Google Calendar sync

### Cel
Dopiero po ustabilizowaniu task/event i planów.

### Zakres
- OAuth Google przez docelowy auth Supabase albo osobną integrację,
- osobny kalendarz `CloseFlow`,
- `googleCalendarEventId`,
- create/update/delete sync,
- retry i log błędów,
- gating: Pro + AI.

---

## P8 — kody promocyjne

### Cel
Sprzedaż i testy pierwszych użytkowników.

### Zakres
- model kodu,
- walidacja kodu,
- limity użyć,
- ważność czasowa,
- powiązanie z planem,
- integracja z checkoutem.

---

## P9 — końcowy test wersji tester

### Cel
Sprawdzić aplikację jak prawdziwy użytkownik.

### Scenariusze obowiązkowe
1. Rejestracja/logowanie.
2. Dodanie leada.
3. Przeniesienie leada do klienta/sprawy.
4. Dodanie zadania i wydarzenia.
5. Widok `Dziś` pokazuje realne rzeczy.
6. Szkic AI z telefonu pojawia się na komputerze.
7. Szkic AI staje się zadaniem/wydarzeniem/leadem.
8. Billing pokazuje poprawny plan i teksty.
9. PWA działa na telefonie.
10. Brak błędów w konsoli na głównych ekranach.

## 5. Rzeczy, które odkładamy

Nie robić teraz:

- WhatsApp/Instagram/Facebook scraping,
- Google Contacts,
- outbound automation,
- natywnej aplikacji mobilnej,
- zespołów i wielu seatów,
- rozbudowanego enterprise CRM,
- pełnego Google Calendar przed Supabase Auth i planami.

## 6. Decyzja na najbliższy ruch

Najbliższy sensowny ruch:

1. Odpalić poprawiony ZIP pending z Stage 14 + Stage 15.
2. Zrobić testy.
3. Commit + push.
4. Następny większy etap: **Supabase Auth / 100% Supabase**.

To jest ważniejsze niż dalsze kosmetyczne teksty, bo bez tego aplikacja nadal ma hybrydę Firebase + Supabase.
