# CloseFlow — SINGLE SOURCE OF TRUTH — Etap 1

Data: 2026-05-05  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Preview / release target na teraz: `https://closeflowapp.vercel.app`

Status dokumentu: **KANONICZNY PLIK ETAPU 1**  
Zastępuje wcześniejsze robocze pliki z mapą prawdy i decyzjami AI / Google Calendar.

---

# 1. Aktualne decyzje użytkownika

## 1.1. Branch

```text
dev-rollout-freeze
```

To zostaje główną gałęzią roboczą. Nie tworzyć nowych branchy bez osobnej decyzji.

## 1.2. Aktualny URL aplikacji

```text
https://closeflowapp.vercel.app
```

To jest aktualny adres aplikacji do testów i audytu.

Publiczne strony marketingowe nie są źródłem prawdy aplikacji, dopóki nie zostaną jednoznacznie powiązane z tym release targetem.

## 1.3. Kierunek produktu

Obowiązujący kierunek:

```text
Dziś mówi co ruszyć.
Leady służą do pozyskania.
Sprawy służą do obsługi po pozyskaniu.
Klient tylko łączy historię.
Zadania i wydarzenia są prawdziwymi akcjami.
AI tylko pomaga, ale nie decyduje.
Billing realnie blokuje lub odblokowuje funkcje.
```

To jest dobry kierunek. Chronić go przed rozlaniem w ciężki CRM.

---

# 2. Najbliższa zaplanowana akcja — finalna zasada

## 2.1. Decyzja

Nie utrwalamy ręcznego pola `Następny krok` jako głównej logiki produktu.

Główna logika:

```text
Najbliższa zaplanowana akcja
```

## 2.2. Co to znaczy

Najbliższa zaplanowana akcja jest liczona z realnych wpisów w czasie:

```text
zadanie
wydarzenie
follow-up
spotkanie
deadline
akt notarialny
telefon
notatka z datą
```

## 2.3. Dla czego liczymy najbliższą zaplanowaną akcję

Liczymy ją dla rekordów nadrzędnych:

```text
Lead
Klient
Sprawa
```

Doprecyzowanie:

```text
Lead -> najbliższa akcja sprzedażowa.
Klient -> najbliższa akcja z powiązanych leadów/spraw/wpisów.
Sprawa -> najbliższy termin / akcja operacyjna.
```

## 2.4. Dla czego NIE liczymy next stepu

Nie liczymy własnego next stepu dla standalone:

```text
zadanie bez leada/klienta/sprawy
wydarzenie bez leada/klienta/sprawy
notatka bez leada/klienta/sprawy
```

One same są akcją albo wpisem.

## 2.5. Ważne

Nie usuwać tej logiki ze spraw.

Po kliknięciu `Rozpocznij obsługę` praca przechodzi do sprawy. Jeżeli sprawa nie pokazuje najbliższej akcji/terminu, system po sprzedaży traci sens.

Nazwy w UI dla spraw:

```text
Najbliższy termin w sprawie
Najbliższa akcja operacyjna
```

Nie używać przy sprawie sformułowania `next step`, jeśli to myli użytkownika.

---

# 3. Jedno źródło prawdy dla rzeczy z datą

## 3.1. Co znaczy techniczne `work item`

Użytkownik nie musi widzieć tej nazwy.

Produktowo:

```text
zaplanowana akcja
wpis w kalendarzu
termin
```

Technicznie `work item` to wspólny kontrakt dla wszystkiego, co ma datę i może pojawić się w kalendarzu:

```text
zadanie
wydarzenie
follow-up
spotkanie
deadline
akt notarialny
telefon
notatka z datą
```

## 3.2. Dlaczego ma być jedno źródło prawdy

Jeżeli data-bearing rekordy są rozbite na różne modele, potem:

```text
Dziś pokazuje jedno
Kalendarz pokazuje drugie
AI widzi trzecie
Google Calendar synchronizuje czwarte
powiadomienia liczą się po piątemu
```

To robi cichy chaos. Techniczny szczur w smokingu.

## 3.3. Kierunek

Wszystko, co ma datę i pojawia się w kalendarzu, ma iść przez jeden normalizowany kontrakt.

Pliki do sprawdzenia:

```text
api/work-items.ts
src/lib/calendar-items.ts
src/lib/scheduling.ts
src/pages/Today.tsx
src/pages/Tasks.tsx
src/pages/Calendar.tsx
src/pages/LeadDetail.tsx
src/pages/ClientDetail.tsx
src/pages/CaseDetail.tsx
api/leads.ts
api/clients.ts
api/cases.ts
```

---

# 4. Google Calendar — aktualna prawda i zakres poprawki

## 4.1. Decyzja użytkownika

Google Calendar:

```text
działa
wysyła w dwie strony
wykrywa kolizje
```

Nie traktować już jako oczywistej atrapy bez dowodu.

## 4.2. Zakres poprawki

Nie przebudowywać całej integracji na ślepo.

Poprawić przypomnienia w:

```text
każdym zadaniu
każdej notatce z datą
każdym wydarzeniu
wszystkim, co pojawia się w kalendarzu
```

## 4.3. Dozwolone przypomnienia

Tylko te:

```text
Tego samego dnia o [godzina]
Dzień wcześniej o [godzina]
2 dni wcześniej o [godzina]
1 tydzień wcześniej o [godzina]
Niestandardowe
```

## 4.4. Niestandardowe

```text
[liczba] dni wcześniej o [godzina]
[liczba] tygodni wcześniej o [godzina]
```

## 4.5. Czego nie dodawać

Nie dodawać:

```text
15 minut przed
30 minut przed
1 godzina przed
jutro rano
za 2 dni
dowolnych naszych presetów niezgodnych z decyzją użytkownika
```

## 4.6. Model danych

Proponowany typ:

```ts
type CalendarReminderRule =
  | { kind: "same_day_at"; time: string }
  | { kind: "day_before_at"; time: string }
  | { kind: "two_days_before_at"; time: string }
  | { kind: "week_before_at"; time: string }
  | {
      kind: "custom";
      amount: number;
      unit: "days" | "weeks";
      time: string;
    };
```

Każdy wpis z datą:

```ts
reminderRule: CalendarReminderRule | null
```

## 4.7. Sync z Google

W aplikacji trzymamy regułę semantyczną:

```text
dzień wcześniej o 09:00
```

Przy synchronizacji do Google przeliczamy to na offset w minutach przed startem wydarzenia.

Po zmianie daty/godziny wpisu trzeba przeliczyć reminder ponownie.

## 4.8. Walidacje

Blokować:

```text
same_day_at po godzinie startu wydarzenia
przypomnienie po wydarzeniu
brak godziny
custom amount <= 0
custom amount absurdalnie duży
```

---

# 5. Digest email — aktualna prawda

## 5.1. Status

Digest:

```text
ma logikę
działał testowo
aktualnie wymaga potwierdzenia
fizyczna wysyłka zależy od domeny / mail providera / env
```

## 5.2. Co UI ma mówić

Jeżeli brak konfiguracji:

```text
Digest gotowy logicznie, ale mail provider nie jest skonfigurowany.
```

Nie pokazywać:

```text
Wysłano digest
```

jeśli mail fizycznie nie poszedł.

## 5.3. Pliki do sprawdzenia

```text
api/daily-digest.ts
api/system.ts
src/server/_digest.ts
src/pages/NotificationsCenter.tsx
src/pages/Settings.tsx
src/components/NotificationRuntime.tsx
vercel.json
.env.example
docs/TODO_DIGEST_MAIL_PROVIDER_ENV.md
```

---

# 6. AI — aktualna prawda i wymagany kierunek

## 6.1. Decyzja użytkownika

Obecne AI nie spełnia oczekiwań.

AI ma działać naturalnie i znać dane aplikacji:

```text
wydarzenia
klientów
leady
sprawy
zadania
notatki
aktywności
terminy
powiązania
```

AI nie ma być:

```text
keyword botem
listą gotowych szablonów
systemem sztywnych odpowiedzi
halucynującym chatbotem bez danych
```

## 6.2. Przykłady pytań, które AI musi obsłużyć

```text
Czy jutro o 17 coś mam?
Czy w przeciągu 4 godzin mam spotkanie?
Na kiedy mam najbliższy akt notarialny?
Co mam jutro?
Znajdź numer do Marka.
Które leady są bez zaplanowanej akcji?
Co czeka za długo?
```

## 6.3. Zasada techniczna

AI nie „wie” przez prompt.

Backend musi przygotować mu prawdziwy kontekst aplikacji.

Docelowy endpoint:

```text
/api/assistant/query
```

## 6.4. Tryby AI

```text
read — użytkownik pyta o dane
draft — użytkownik chce coś zapisać
unknown — niejasne albo poza zakresem
```

## 6.5. Flow odpowiedzi AI

```text
1. Auth i workspace scope.
2. Rozpoznanie trybu read/draft.
3. Pobranie relevant context z bazy.
4. Filtrowanie po czasie/osobie/typie sprawy.
5. AI dostaje tylko prawdziwe dane.
6. AI pisze naturalną odpowiedź.
7. UI dostaje też powiązane rekordy do kliknięcia.
```

## 6.6. Dla pytań czasowych

Przykład:

```text
Czy jutro o 17 coś mam?
```

Backend ma:

```text
ustalić jutro w timezone użytkownika
sprawdzić okno czasowe
pobrać wpisy z aplikacji
uwzględnić Google Calendar, jeśli sync jest aktywny
dopiero potem dać kontekst AI
```

Odpowiedź ma być konkretna:

```text
Tak. Jutro o 17:00 masz spotkanie z Anną w sprawie działki.
```

albo:

```text
Nie widzę nic zaplanowanego jutro o 17:00. Najbliższy wpis tego dnia masz o 15:00.
```

## 6.7. Dla pytań typu „najbliższy akt notarialny”

Backend szuka po:

```text
type
title
description
notes
case title
activity text
```

Frazami / semantyką:

```text
akt notarialny
notariusz
umowa notarialna
podpisanie aktu
```

To nie są gotowe odpowiedzi. To jest search/query.

## 6.8. AI nie może

```text
tworzyć finalnych rekordów bez potwierdzenia
zgadywać danych, których nie ma
mieszać workspace
odpowiadać z pustego prompta
używać zaszytych szablonów jako udawanej inteligencji
wysyłać maili bez zatwierdzenia
```

## 6.9. Kontrakt odpowiedzi

```ts
type AssistantAnswer = {
  mode: "read" | "draft" | "unknown";
  answer: string;
  items: Array<{
    type: "lead" | "client" | "case" | "work_item" | "note" | "activity";
    id: string;
    label: string;
    date?: string | null;
    reason?: string | null;
  }>;
  draft?: null | AiDraft;
  confidence: "high" | "medium" | "low";
};
```

---

# 7. Ocena nowego audytu — co potwierdzamy, co odrzucamy

## 7.1. Ogólny werdykt audytu

Status „niegotowa do publicznego użytkownika”:

```text
CZĘŚCIOWO TAK
```

Dla publicznej sprzedaży: tak, nadal wymaga dopięcia AI, billing/digest/env evidence i security proof.

Dla zamkniętego testu zaufanego: niekoniecznie, bo użytkownik potwierdza, że główna ścieżka poza AI działa.

## 7.2. Stripe / billing jako największy blocker

```text
CZĘŚCIOWO TAK
```

Prawda dla publicznej sprzedaży.

Nie musi blokować zamkniętego testu produktu, jeżeli celem jest test workflow i nie zbieramy płatności.

Pliki istnieją:

```text
api/billing-checkout.ts
api/stripe-webhook.ts
```

Ale trzeba potwierdzić, czy webhook jest pełny i czy env jest ustawione.

## 7.3. Google Calendar jako atrapa

```text
NIE PRZYJMUJEMY JAKO PRAWDA
```

Użytkownik potwierdził runtime:

```text
działa
wysyła w obie strony
wykrywa kolizje
```

Audyt może być oparty o stare repo albo nie znać obecnego stanu.

Zakres poprawki:

```text
przypomnienia 1:1 jak Google Calendar
```

Nie:

```text
budowa OAuth od zera
```

Dopiero jeśli test pokaże, że sync nie działa, wracamy do integracji.

## 7.4. PWA nie wdrożone / brak manifestu

```text
FAŁSZ W REPO
```

W repo istnieje:

```text
public/manifest.webmanifest
public/service-worker.js
```

Można testować jakość PWA, service worker cache i install prompt, ale twierdzenie „brak manifestu” jest nieaktualne.

## 7.5. Brak guardu polskich znaków

```text
FAŁSZ / NIEAKTUALNE
```

W repo istnieje:

```text
scripts/check-polish-mojibake.cjs
```

Możliwe, że nadal są pojedyncze literówki, ale teza „brak systemu guard” jest nieaktualna.

## 7.6. Trial 14 vs 21

```text
NIE POTWIERDZAM BEZ GREP/TESTU
```

Nie przyjmować jako fakt bez sprawdzenia w:

```text
api/me.ts
src/hooks/useWorkspace.ts
src/lib/access.ts
src/lib/plans.ts
src/pages/Billing.tsx
```

Wymagany test:

```text
grep po 14
grep po TRIAL_DAYS
świeże konto
ekran trial
/api/me response
```

## 7.7. AI zapisuje finalne dane bez potwierdzenia

```text
NIE POTWIERDZAM DOKŁADNEJ TEZY, ALE AI JEST P0 DO PRZEBUDOWY
```

Użytkownik potwierdza, że AI nie działa zgodnie z oczekiwanym produktem.

Nie przyjmować bez dowodu twierdzenia:

```text
AI na pewno robi direct write finalnych rekordów
```

Ale kierunek naprawy jest jasny:

```text
AI Application Brain V1
read/draft
backend context
confirm-first
```

## 7.8. Endpointy bez auth / workspace leak

```text
NIE POTWIERDZAM BEZ TESTU
```

To jest ryzyko P0, ale nie fakt bez dowodu.

Wymagany test:

```text
2 userów
2 workspace
read/patch/delete po cudzym ID
sprawdzenie 403/404
```

## 7.9. Admin AI widoczny dla zwykłych userów

```text
DO POTWIERDZENIA
```

Nie przyjmować jako fakt bez ręcznego testu zwykłym kontem.

Pliki:

```text
src/components/Layout.tsx
api/me.ts
src/lib/access.ts
src/pages/Admin*
```

## 7.10. Quick Lead Capture jako atrapa

```text
DO POTWIERDZENIA, NIE PRZYJMUJEMY NA WIARĘ
```

Użytkownik potwierdza, że główny smoke poza AI jest OK.

Test:

```text
Szybki lead z notatki
parser
draft
zatwierdzenie
lead + work-item
reload
```

## 7.11. Today „Dodaj lead” jako atrapa

```text
DO POTWIERDZENIA / PRAWDOPODOBNIE NIEAKTUALNE
```

Jeśli główna ścieżka dodawania leada działa, audyt może mylić konkretny przycisk z całym flow.

Test:

```text
klik Dodaj lead z Today
czy otwiera modal
czy zapisuje lead
czy widać w Leads
czy reload działa
```

## 7.12. Lead -> sprawa częściowo wdrożone

```text
DO POTWIERDZENIA, ALE UŻYTKOWNIK MÓWI ŻE SMOKE OK
```

Finalna zasada:

```text
Rozpocznij obsługę -> tworzy/podpina sprawę -> przekierowuje do sprawy -> lead staje się historią
```

Jeżeli choć jeden z tych punktów nie działa, naprawiamy.

## 7.13. Digest jako częściowo wdrożony

```text
TAK
```

To jest zgodne z aktualną prawdą:

```text
logika jest
fizyczna wysyłka wymaga konfiguracji mail providera/env
```

## 7.14. Polskie znaki / literówki

```text
MOŻLIWE, ALE NIE GENERALIZOWAĆ
```

Jeżeli są konkretne napisy, naprawiać. Nie robić z tego P0.

---

# 8. Nowa lista priorytetów po weryfikacji audytu

## P0 — prawdziwe blokery dla dalszej jakości

### P0.1 — AI Application Brain V1

Największy produktowy blocker teraz.

Cel:

```text
AI naturalnie odpowiada na pytania o dane aplikacji.
AI tworzy tylko szkice przy komendach zapisu.
AI nie działa na szablonach.
```

### P0.2 — Jedno źródło prawdy dla rzeczy z datą

Bez tego AI i Google reminders będą niestabilne.

Cel:

```text
wszystko, co ma datę, przechodzi przez jeden kontrakt
```

### P0.3 — Google Calendar reminders 1:1

Nie całe Google od zera. Tylko przypomnienia.

Cel:

```text
same day at
day before at
2 days before at
week before at
custom days/weeks before at
```

### P0.4 — Workspace/auth proof

Nie dlatego, że mamy dowód wycieku, tylko dlatego, że bez tego nie wolno iść do szerokich userów.

Cel:

```text
test 2 userów / 2 workspace / cudzy ID -> 403/404
```

## P1 — przed publiczną sprzedażą

### P1.1 — Billing / Stripe produkcyjnie

Jeśli aplikacja ma zarabiać przez płatności online, Stripe musi być realny.

### P1.2 — Digest mail provider evidence

Nie udawać wysyłki bez Resend/domeny/env.

### P1.3 — Release evidence

Jeden commit, jeden branch, jeden URL, wynik build/test.

## P2 — polish i UX

```text
polskie znaki
puste stany
loading states
mobile polish
spójność CTA
PWA install smoke
```

---

# 9. Pakiet wdrożeniowy — aktualizacja dokumentów do jednego pliku

## Cel

Zostawić jeden kanoniczny plik Etapu 1 i nie mnożyć sprzecznych dokumentów.

## Docelowy plik

```text
docs/audit/CLOSEFLOW_SINGLE_SOURCE_OF_TRUTH_ETAP1_2026-05-05.md
```

## Pliki robocze do zastąpienia / oznaczenia jako stare

```text
docs/audit/ETAP1_MAPA_PRAWDY_APLIKACJI_ZAKLADKI_PRZEPLYWY_2026-05-05.md
docs/audit/ETAP1_DECYZJE_AI_GOOGLE_REMINDERS_2026-05-05.md
docs/audit/AUDYT_REPO_CONFIRMATION_PLAN_2026-05-05.md
```

## Nie usuwać na ślepo

Jeżeli pliki istnieją, przenieść je do:

```text
docs/audit/archive_etap1_2026-05-05/
```

albo zostawić, ale w nowym pliku wskazać, że kanoniczny jest tylko:

```text
CLOSEFLOW_SINGLE_SOURCE_OF_TRUTH_ETAP1_2026-05-05.md
```

## Po wdrożeniu sprawdź

```text
docs/audit/CLOSEFLOW_SINGLE_SOURCE_OF_TRUTH_ETAP1_2026-05-05.md istnieje
stare pliki nie są traktowane jako aktualne
README / release docs nie przeczą decyzjom
```

## Kryterium zakończenia

Etap 1 ma jedno źródło prawdy.

---

# 10. Pakiet wdrożeniowy — najbliższy etap kodowy po dokumentacji

## ETAP 2 — Jedno źródło prawdy dla zaplanowanych akcji + reminder model

### Cel

Przygotować fundament pod AI i poprawkę Google Calendar reminders.

### Pliki do sprawdzenia

```text
api/work-items.ts
src/lib/calendar-items.ts
src/lib/scheduling.ts
src/lib/notifications.ts
src/pages/Calendar.tsx
src/pages/Tasks.tsx
src/pages/Today.tsx
src/pages/LeadDetail.tsx
src/pages/ClientDetail.tsx
src/pages/CaseDetail.tsx
api/leads.ts
api/clients.ts
api/cases.ts
```

### Zmień

1. Dodać jeden model `CalendarReminderRule`.
2. Dodać `reminderRule` do normalizowanego wpisu z datą.
3. Ujednolicić UI przypomnień.
4. Dodać helper:

```ts
getNearestPlannedAction(recordType, recordId, dateBearingItems)
```

5. Helper działa dla:

```text
lead
client
case
```

6. Helper nie działa dla standalone task/event/note jako `next step`.

### Nie zmieniaj

```text
Google OAuth
AI
billing
digest
flow lead -> sprawa
```

### Po wdrożeniu sprawdź

```text
standalone event z datą -> Calendar tak, next step nie
lead event -> najbliższa akcja leada tak
client event -> najbliższa akcja klienta tak
case event -> najbliższy termin sprawy tak
reminder dzień wcześniej o 09:00 -> zapis i sync
custom 3 dni wcześniej o 08:00 -> zapis i sync
```

### Kryterium zakończenia

AI i Calendar mają jeden stabilny fundament danych.

---

# 11. Rzeczy, których nie wolno teraz robić

```text
Nie przebudowywać Google Calendar od zera, skoro runtime działa.
Nie uznawać PWA za niewdrożone, skoro manifest/service worker są w repo.
Nie traktować każdego punktu audytu jako faktu.
Nie dokładac kolejnych funkcji przed AI Brain i reminder model.
Nie utrwalać ręcznego nextStep jako głównej logiki.
Nie kasować starych dokumentów bez archiwum.
```

---

# 12. Pytania / braki do potwierdzenia

Żeby zamknąć niepewne punkty, potrzebne są tylko krótkie dowody:

## 12.1. Trial

Uruchomić grep:

```powershell
Select-String -Path "api\me.ts","src\hooks\useWorkspace.ts","src\lib\access.ts","src\lib\plans.ts","src\pages\Billing.tsx" -Pattern "TRIAL_DAYS|14|21|trial" -CaseSensitive:$false
```

Cel:

```text
potwierdzić 21 dni i brak starych 14
```

## 12.2. Google Calendar implementation

Uruchomić:

```powershell
Get-ChildItem -Recurse -File | Select-String -Pattern "googleCalendar|GOOGLE_CLIENT|GOOGLE_SECRET|calendar.events|collision|conflict|sync" -CaseSensitive:$false | Select-Object Path,LineNumber,Line | Format-Table -AutoSize
```

Cel:

```text
ustalić dokładne pliki integracji, skoro runtime działa
```

## 12.3. AI direct write

Uruchomić / sprawdzić test:

```text
pytanie read: "co mam jutro?" -> nie tworzy szkicu ani rekordu
komenda draft: "zapisz zadanie jutro 12" -> tworzy szkic
confirm -> dopiero wtedy rekord
```

Cel:

```text
rozróżnić "AI nie działa dobrze" od "AI robi niebezpieczny direct write"
```
