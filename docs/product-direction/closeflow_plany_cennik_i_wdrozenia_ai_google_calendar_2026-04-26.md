# CloseFlow — plany, cennik i nowe wdrożenia AI / powiadomień / Google Calendar

**Data:** 2026-04-26  
**Projekt:** CloseFlow / LeadFlow  
**Repo:** `dkknapikdamian-collab/leadflowv1`  
**Gałąź robocza:** `dev-rollout-freeze`  
**Status dokumentu:** aktualizacja produktu i priorytetów wdrożeniowych  
**Cel:** uporządkować model planów, trial, Free, Basic, Pro, AI oraz listę funkcji, które muszą zostać wdrożone.

---

# 1. Główna decyzja produktowa

CloseFlow nie powinien być sprzedawany jako zwykły CRM.

Najlepsze pozycjonowanie:

> **CloseFlow codziennie mówi Ci, kogo musisz ruszyć, czego nie możesz przegapić i które leady mogą uciec.**

Rdzeń produktu:

1. ekran **Dziś** jako centrum decyzji,
2. leady, zadania i wydarzenia w jednym miejscu,
3. przypomnienia i poranny digest,
4. szybkie tworzenie szkiców z tekstu / głosu,
5. AI jako operator aplikacji, ale bez samodzielnego zatwierdzania danych,
6. integracja z Google Calendar jako mocna funkcja płatnego planu,
7. PWA / ikonka na telefonie jako „apka bez App Store”.

---

# 2. Zasada, żeby użytkownicy nie siedzieli na Free

Free nie może być pełną darmową wersją aplikacji.

Free ma być:

- trybem demonstracyjnym,
- awaryjnym trybem po trialu,
- miejscem, gdzie użytkownik może zobaczyć sens aplikacji,
- ale nie miejscem do normalnego prowadzenia biznesu.

## Najważniejsza zasada

Nowy użytkownik **nie startuje od Free**.

Nowy użytkownik startuje od:

## **Trial Pro / AI przez 21 dni**

Dopiero po trialu:

- wybiera plan płatny,
- albo spada do ograniczonego Free.

---

# 3. Trial

## Trial — 21 dni

Trial powinien trwać **21 dni**, nie 14.

Powód:

- 14 dni może być za krótkie, żeby użytkownik realnie dodał leady, dostał przypomnienia i poczuł wartość,
- 21 dni daje czas na kilka cykli follow-upów,
- użytkownik szybciej zbuduje nawyk pracy z aplikacją.

## Co zawiera trial

Trial powinien pokazywać pełną wartość produktu:

- nielimitowane leady,
- nielimitowane zadania,
- nielimitowane wydarzenia,
- ekran Dziś,
- kalendarz w aplikacji,
- poranny digest e-mail,
- przypomnienia in-app,
- browser notifications,
- szkice do sprawdzenia,
- szybkie dodawanie z tekstu / głosu,
- testowy dostęp do AI z limitem,
- testowy dostęp do Google Calendar z limitem albo pełny dostęp trialowy,
- PWA / dodanie aplikacji do telefonu.

## Po zakończeniu triala

Po trialu użytkownik:

1. wybiera plan płatny,
2. albo przechodzi na Free.

Dane nie są usuwane.

Jeśli użytkownik spada do Free, może dalej widzieć dane, ale nowe akcje są ograniczone zgodnie z limitem Free.

---

# 4. Proponowane plany

# 4.1. Free — 0 zł

## Rola planu

Free to demo i tryb awaryjny, nie pełna aplikacja.

## Limit

- maks. **5 aktywnych leadów / kontaktów**,
- maks. **5 aktywnych zadań / wydarzeń łącznie**,
- maks. **3 aktywne szkice do sprawdzenia**,
- brak AI,
- brak Google Calendar,
- brak porannego digestu e-mail,
- brak importu CSV,
- brak cyklicznych przypomnień,
- brak zaawansowanych filtrów,
- brak pełnych browser notifications,
- podstawowy ekran Dziś,
- podstawowy kalendarz,
- PWA dostępne.

## Komunikat sprzedażowy

> Sprawdź, jak działa CloseFlow na kilku leadach.

## Upgrade wall

Przykłady komunikatów:

```text
Masz już 5 leadów w Free. Przejdź na Basic za 19 zł i prowadź leady bez limitu.
```

```text
Poranny mail z planem dnia jest dostępny od planu Basic.
```

```text
Synchronizacja z Google Calendar jest dostępna w planie Pro.
```

```text
Asystent AI jest dostępny w planie AI.
```

---

# 4.2. Basic — 19 zł / mies.

## Rola planu

Basic to pierwszy realny plan do normalnej pracy.

To ma być tani plan dla osoby, która chce przestać gubić leady i follow-upy.

## Zawiera

- nielimitowane leady,
- nielimitowane zadania,
- nielimitowane wydarzenia,
- ekran Dziś,
- kalendarz w aplikacji,
- przypomnienia in-app,
- browser notifications,
- poranny digest e-mail,
- szkice do sprawdzenia,
- szybkie dodawanie z tekstu,
- parser tekstu bez pełnego AI,
- PWA / ikonka aplikacji na telefonie,
- podstawowe filtry,
- podstawowe ustawienia przypomnień.

## Nie zawiera

- Google Calendar sync,
- pełnego AI asystenta,
- AI wyszukiwania danych,
- AI sugestii follow-upów,
- importu CSV,
- zaawansowanych raportów.

## Komunikat sprzedażowy

> Dla osób, które chcą przestać gubić follow-upy.

---

# 4.3. Pro — 39 zł / mies.

## Rola planu

Pro to plan główny, który powinien być oznaczony jako:

## **Najczęściej wybierany**

Pro ma być planem dla użytkownika, który realnie pracuje na leadach codziennie.

## Zawiera wszystko z Basic oraz

- Google Calendar sync,
- przypomnienia przez Google Calendar na telefonie,
- import CSV,
- cykliczne zadania i wydarzenia,
- lepsze filtry,
- tagi / etykiety,
- widok tygodnia i najbliższych terminów,
- więcej ustawień powiadomień,
- raport tygodnia,
- widoki priorytetowe:
  - zaległe,
  - zagrożone,
  - bez akcji,
  - waiting za długo,
  - najcenniejsze do ruszenia.

## Nie zawiera

- pełnego asystenta AI,
- AI pytań do danych aplikacji,
- AI sugestii odpowiedzi,
- AI tworzenia szkiców w pełnym trybie.

## Komunikat sprzedażowy

> Dla osób, które chcą mieć leady, zadania i przypomnienia również w telefonie i Google Calendar.

---

# 4.4. AI — 49 zł / mies. albo 59 zł / mies.

## Rola planu

AI to plan premium.

Nie powinien kosztować tyle samo co Pro, bo inaczej Pro traci sens.

## Rekomendacja ceny

Na start:

```text
39 zł / mies. dla pierwszych użytkowników
```

Regularnie:

```text
49 zł / mies.
```

Opcjonalnie później:

```text
59 zł / mies., jeśli koszty AI i wartość funkcji będą to uzasadniać.
```

## Zawiera wszystko z Pro oraz

- Asystenta CloseFlow w całej aplikacji,
- pytania o dane z aplikacji,
- wyszukiwanie leadów,
- wyszukiwanie kontaktów,
- wyszukiwanie numerów telefonów,
- wyszukiwanie zadań i wydarzeń,
- tworzenie szkiców leadów z tekstu / głosu,
- tworzenie szkiców zadań,
- tworzenie szkiców wydarzeń,
- AI porządkowanie notatek,
- AI podsumowanie dnia,
- AI odpowiedź na pytania:
  - „co mam jutro?”,
  - „co mam dziś zaległe?”,
  - „które leady są zagrożone?”,
  - „znajdź numer do Marka”,
  - „pokaż leady bez zaplanowanej akcji”,
- AI sugestie follow-upów,
- AI szkice odpowiedzi do klienta.

## Limity AI

AI musi mieć limit.

Na start:

```text
300 zapytań miesięcznie
```

albo:

```text
30 zapytań dziennie
```

Dodatkowo można dodać fair use.

## Komunikat sprzedażowy

> Dla osób, które chcą mówić do aplikacji, wyszukiwać dane i tworzyć szkice bez ręcznego klikania.

---

# 5. Tabela funkcji planów

| Funkcja | Free | Basic 19 zł | Pro 39 zł | AI 49 zł |
|---|---:|---:|---:|---:|
| Leady | 5 aktywnych | bez limitu | bez limitu | bez limitu |
| Zadania / wydarzenia | 5 aktywnych | bez limitu | bez limitu | bez limitu |
| Ekran Dziś | tak | tak | tak | tak |
| Kalendarz w aplikacji | podstawowy | pełny | pełny | pełny |
| Poranny mail | nie | tak | tak | tak |
| Przypomnienia in-app | podstawowe | tak | tak | tak |
| Browser notifications | nie / limit | tak | tak | tak |
| PWA / ikonka telefonu | tak | tak | tak | tak |
| Szkice do sprawdzenia | max 3 | tak | tak | tak |
| Parser tekstu | nie | tak | tak | tak |
| Import CSV | nie | nie | tak | tak |
| Cykliczne przypomnienia | nie | proste | pełne | pełne |
| Google Calendar | nie | nie | tak | tak |
| AI wyszukiwanie danych | nie | nie | nie | tak |
| AI tworzenie szkiców | nie | parser | parser | tak |
| AI sugestie odpowiedzi | nie | nie | nie | tak |
| Raport tygodnia | nie | nie | tak | tak |
| Kody promocyjne | nie dotyczy | można użyć | można użyć | można użyć |

---

# 6. Rzeczy, które musimy wdrożyć

Poniżej pełna lista funkcji z aktualnych ustaleń użytkownika.

---

## 6.1. Poranny digest e-mail

### Cel

Każdego ranka użytkownik dostaje e-mail:

> Co dziś masz do zrobienia.

### Co ma zawierać

- zadania na dziś,
- wydarzenia na dziś,
- zaległe rzeczy,
- pilne leady,
- leady bez zaplanowanej akcji,
- szkice do sprawdzenia,
- najbliższe ważne terminy.

### Zasady

- jeden użytkownik dostaje maksymalnie jeden digest dziennie,
- godzina wysyłki z ustawień użytkownika,
- domyślnie np. 07:00 lub 08:00,
- liczenie według strefy czasu użytkownika,
- możliwość wyłączenia digestu w ustawieniach,
- log `lastDigestSentAt`, żeby nie wysyłać duplikatów.

### Plan gating

- Free: brak,
- Basic: tak,
- Pro: tak,
- AI: tak.

---

## 6.2. AI dostępny w całej aplikacji

### Cel

Użytkownik może naturalnie powiedzieć / napisać:

```text
Zapisz zadanie, żeby jutro zadzwonić do Marka.
```

```text
Zapisz leada: Jan Kowalski, chce ofertę na stronę, oddzwonić jutro po 10.
```

```text
Dodaj wydarzenie: spotkanie z Anną w środę o 15.
```

AI nie zapisuje tego od razu jako pewnych danych.

AI tworzy **szkic**.

Użytkownik:

- sprawdza,
- edytuje,
- zatwierdza,
- albo usuwa.

### Obsługiwane typy szkiców

- lead,
- zadanie,
- wydarzenie,
- notatka,
- follow-up.

### Najważniejsza zasada

AI nie zatwierdza danych samodzielnie.

Każda komenda tworząca dane przechodzi przez szkic.

---

## 6.3. Szkice do sprawdzenia w Today

### Cel

Na ekranie Dziś użytkownik ma widzieć rzeczy, które AI lub szybkie dodawanie przygotowało, ale które nie są jeszcze zatwierdzone.

### Sekcja

```text
Do sprawdzenia
```

### Co pokazuje

- szkice leadów,
- szkice zadań,
- szkice wydarzeń,
- szkice notatek,
- szkice pochodzące z Quick Lead Capture,
- szkice pochodzące z Asystenta AI.

### Akcje na szkicu

- Sprawdź,
- Edytuj,
- Zatwierdź,
- Usuń,
- Anuluj.

### Dane szkicu

Każdy szkic powinien mieć:

- `id`,
- `workspaceId`,
- `userId`,
- `type`: `lead | task | event | note`,
- `rawText`,
- `parsedData`,
- `provider`,
- `status`,
- `createdAt`,
- `updatedAt`,
- `expiresAt`,
- `confirmedAt`,
- `cancelledAt`.

### Prywatność

Po zatwierdzeniu albo anulowaniu surowy tekst powinien zostać usunięty albo wyczyszczony.

---

## 6.4. AI wyszukujące dane w aplikacji

### Cel

AI musi umieć odpowiadać na pytania na podstawie danych z aplikacji.

Przykłady:

```text
Co mam jutro?
```

```text
Co mam dziś?
```

```text
Pokaż zaległe zadania.
```

```text
Znajdź numer do Marka.
```

```text
Jakie leady są bez akcji?
```

```text
Które leady są zagrożone?
```

```text
Co czeka za długo?
```

### Najważniejsza zasada

AI nie może odpowiadać z pustego prompta.

AI musi dostać kontekst z bazy aplikacji.

### Potrzebny mechanizm

Dodać endpoint:

```text
/api/assistant/context
```

Endpoint powinien umieć pobrać:

- leady,
- zadania,
- wydarzenia,
- sprawy,
- kontakty / klientów,
- szkice,
- powiązania lead ↔ zadanie,
- powiązania lead ↔ wydarzenie,
- powiązania lead ↔ sprawa.

### Zakres odpowiedzi

AI odpowiada tylko na podstawie danych aplikacji.

Jeśli nie ma danych:

```text
Nie znalazłem tego w danych aplikacji.
```

Nie może zmyślać.

### Plan gating

- Free: brak,
- Basic: brak,
- Pro: brak,
- AI: tak.

---

## 6.5. Poprawa obecnego AI, które nie widzi danych

### Problem

Aktualnie AI potrafi przyjąć komendę dodania danych, ale słabo radzi sobie z wyszukiwaniem i odpowiadaniem na pytania.

Przykład problemu:

- użytkownik pyta: „co mam jutro?”,
- AI odpowiada, że nic,
- mimo że w aplikacji są zadania / wydarzenia na jutro.

### Przyczyna

AI prawdopodobnie nie dostaje pełnego kontekstu z aplikacji albo dostaje go w złym zakresie.

### Poprawka

1. Dodać jawny intent detection:
   - create lead,
   - create task,
   - create event,
   - search / answer,
   - summarize today,
   - summarize tomorrow,
   - find contact,
   - unknown.

2. Dla pytań typu search / answer pobrać dane przed wywołaniem AI.

3. AI ma odpowiedzieć na podstawie danych, nie na podstawie przypuszczenia.

4. Dodać testy:
   - jeśli jutro istnieje zadanie, AI je zwraca,
   - jeśli jutro istnieje wydarzenie, AI je zwraca,
   - jeśli istnieje numer telefonu w leadzie, AI go znajduje,
   - jeśli nie ma danych, AI mówi, że nie znalazło.

---

## 6.6. Przypomnienia

### Cel

Aplikacja musi realnie przypominać, nie tylko przechowywać dane.

### Typy przypomnień

- in-app,
- browser notifications,
- e-mail digest,
- później Google Calendar notifications przez sync.

### Reguły przypomnień

- zaległe,
- dziś rano,
- 30 minut przed terminem,
- lead bez akcji,
- waiting za długo,
- szkice do sprawdzenia,
- najbliższe ważne terminy.

### Snooze

Użytkownik powinien móc odłożyć przypomnienie:

- 15 minut,
- 1 godzina,
- jutro,
- własna data.

---

## 6.7. PWA / ikonka aplikacji na telefon

### Cel

Aplikacja ma wyglądać jak aplikacja na telefonie, mimo że jest webowa.

### Co wdrożyć

- `manifest.webmanifest`,
- ikony aplikacji,
- nazwa aplikacji,
- kolor aplikacji,
- display mode `standalone`,
- service worker z ostrożnym cache,
- panel / instrukcja „Dodaj aplikację do ekranu głównego”.

### Komunikat w UI

```text
Dodaj CloseFlow do ekranu głównego telefonu.
```

### Ważne

Nie budujemy teraz natywnej aplikacji Android / iOS.

---

## 6.8. Kody promocyjne

### Cel

Kody promocyjne mają pomóc w sprzedaży, testach i ręcznym dawaniu zniżek.

### Typy kodów

- procentowy, np. `START50`,
- kwotowy, np. `-20 zł`,
- darmowy miesiąc,
- wydłużony trial,
- kod dla pierwszych użytkowników.

### Pola kodu

- `id`,
- `code`,
- `discountType`,
- `discountValue`,
- `appliesToPlanIds`,
- `maxUses`,
- `usedCount`,
- `validFrom`,
- `validUntil`,
- `status`,
- `createdAt`,
- `updatedAt`.

### Gdzie używać

- ekran Billing,
- checkout,
- panel admin / ręczne generowanie,
- kampanie promocyjne.

---

## 6.9. Google Calendar sync

### Cel

Zadania, wydarzenia i terminy z CloseFlow mają pojawiać się w Google Calendar użytkownika.

Dzięki temu użytkownik dostaje powiadomienia na telefonie z Google Calendar.

### Co synchronizować

- wydarzenia,
- zadania z konkretną godziną,
- follow-upy z terminem,
- spotkania,
- deadliny.

### Jak to ma działać

1. Użytkownik łączy Google Calendar.
2. Aplikacja tworzy albo wybiera kalendarz.
3. Preferowana opcja: osobny kalendarz `CloseFlow`.
4. Każde wydarzenie z aplikacji dostaje `googleCalendarEventId`.
5. Edycja w aplikacji aktualizuje wpis w Google.
6. Usunięcie w aplikacji usuwa albo anuluje wpis w Google.
7. Oznaczenie jako wykonane może usuwać wpis albo oznaczać go odpowiednio, zależnie od przyjętego modelu.

### Plan gating

- Free: brak,
- Basic: brak,
- Pro: tak,
- AI: tak.

### Ważne

Google Calendar nie powinien być wdrażany przed ustabilizowaniem modelu tasków i eventów.

Najpierw dane w CloseFlow muszą być spójne.

---

# 7. Kolejność wdrożenia

## Etap 1 — model planów, trial i limity

### Cel

Ustalić twardy model planów i ograniczeń.

### Pliki do sprawdzenia

```text
src/hooks/useWorkspace.ts
src/pages/Billing.tsx
api/workspace-subscription.ts
src/lib/access.ts
src/lib/plans.ts
```

### Zmień

- dodać plany:
  - `free`,
  - `basic`,
  - `pro`,
  - `ai`,
- ustawić trial na 21 dni,
- dodać limity Free,
- dodać uprawnienia funkcji per plan,
- dodać blokady funkcji po planie,
- dodać jasne komunikaty upgrade wall.

### Nie zmieniaj

- wyglądu całej aplikacji,
- modelu leadów,
- modelu tasków,
- kalendarza.

### Po wdrożeniu sprawdź

- nowy user dostaje trial 21 dni,
- po trialu może spaść do Free,
- Free blokuje 6. leada,
- Basic odblokowuje nielimitowane leady,
- Pro odblokowuje Google Calendar,
- AI odblokowuje Asystenta.

### Kryterium zakończenia

System wie, jaki plan ma użytkownik i jakie funkcje są dostępne.

---

## Etap 2 — szkice jako wspólny mechanizm

### Cel

Dodać jeden wspólny mechanizm szkiców dla AI i szybkiego dodawania.

### Pliki do sprawdzenia

```text
src/pages/Today.tsx
src/pages/Leads.tsx
src/pages/Tasks.tsx
src/pages/Calendar.tsx
src/components/quick-lead/*
api/quick-leads/*
src/lib/assistant/*
src/lib/drafts/*
```

### Zmień

- dodać model `AppDraft`,
- typy szkiców:
  - lead,
  - task,
  - event,
  - note,
- statusy:
  - pending,
  - confirmed,
  - cancelled,
  - expired,
  - failed,
- dodać API:
  - create draft,
  - update draft,
  - confirm draft,
  - cancel draft,
  - expire drafts,
- dodać czyszczenie surowego tekstu po zatwierdzeniu/anulowaniu.

### Nie zmieniaj

- istniejącego ręcznego dodawania leadów,
- istniejącego ręcznego dodawania tasków i eventów.

### Po wdrożeniu sprawdź

- draft można utworzyć,
- draft można poprawić,
- draft można zatwierdzić,
- draft można anulować,
- rawText znika po zatwierdzeniu albo anulowaniu.

### Kryterium zakończenia

Aplikacja ma jeden stabilny mechanizm szkiców do zatwierdzania.

---

## Etap 3 — sekcja „Do sprawdzenia” w Today

### Cel

Pokazać użytkownikowi wszystkie niezatwierdzone szkice na głównym ekranie.

### Pliki do sprawdzenia

```text
src/pages/Today.tsx
src/lib/today.ts
src/lib/drafts/*
src/components/drafts/*
```

### Zmień

- dodać sekcję `Do sprawdzenia`,
- pokazać szkice w kolejności od najnowszych,
- dodać akcje:
  - sprawdź,
  - edytuj,
  - zatwierdź,
  - usuń,
- dodać licznik szkiców w górnych kafelkach Today.

### Nie zmieniaj

- pozostałych sekcji Today bez potrzeby,
- logiki zaległych / dziś.

### Po wdrożeniu sprawdź

- szkic z Quick Lead Capture pojawia się w Today,
- szkic AI pojawia się w Today,
- zatwierdzony szkic znika z sekcji,
- anulowany szkic znika z sekcji.

### Kryterium zakończenia

Użytkownik od razu widzi, co wymaga zatwierdzenia.

---

## Etap 4 — poprawa AI: dostęp do danych aplikacji

### Cel

AI ma odpowiadać na pytania na podstawie danych z aplikacji.

### Pliki do sprawdzenia

```text
api/assistant.ts
api/assistant-context.ts
src/lib/assistant/*
src/lib/calendar-items.ts
src/lib/scheduling.ts
src/pages/Today.tsx
src/pages/Tasks.tsx
src/pages/Calendar.tsx
src/pages/Leads.tsx
src/pages/LeadDetail.tsx
```

### Zmień

- dodać endpoint kontekstowy,
- dodać intent detection,
- dodać pobieranie danych zależnie od pytania,
- dodać zakresy:
  - dziś,
  - jutro,
  - ten tydzień,
  - zaległe,
  - kontakty,
  - numery telefonów,
  - leady bez akcji,
  - leady zagrożone,
- dodać odpowiedź „nie znalazłem w danych aplikacji”, jeśli brak wyników.

### Nie zmieniaj

- mechanizmu tworzenia szkiców, jeśli działa,
- ręcznych formularzy.

### Po wdrożeniu sprawdź

- pytanie „co mam jutro?” zwraca realne zadania i wydarzenia,
- pytanie „znajdź numer do X” szuka w leadach / kontaktach,
- pytanie o zaległe pokazuje realne zaległe,
- AI nie zmyśla danych.

### Kryterium zakończenia

AI przestaje być ślepym czatem i staje się asystentem aplikacji.

---

## Etap 5 — poranny digest e-mail

### Cel

Wysyłać codziennie rano jeden zbiorczy mail z planem dnia.

### Pliki do sprawdzenia

```text
api/daily-digest.ts
api/cron/daily-digest.ts
src/pages/Settings.tsx
src/pages/NotificationsCenter.tsx
src/lib/notifications.ts
src/lib/email/*
src/lib/today.ts
```

### Zmień

- dodać ustawienia:
  - `dailyDigestEmailEnabled`,
  - `dailyDigestHour`,
  - `timezone`,
  - `lastDigestSentAt`,
- zbudować payload digestu,
- dodać template maila,
- dodać cron / scheduler,
- dodać log wysyłki,
- dodać blokadę duplikatów.

### Nie zmieniaj

- support maili,
- ręcznych wysyłek maila.

### Po wdrożeniu sprawdź

- user z włączonym digestem dostaje jeden mail,
- user z wyłączonym digestem nie dostaje maila,
- mail zawiera zadania, wydarzenia, zaległe i szkice,
- drugi raz tego samego dnia nie wysyła duplikatu.

### Kryterium zakończenia

Poranny digest działa jako realna wartość Basic+.

---

## Etap 6 — PWA i instalacja na telefonie

### Cel

Aplikacja ma dać się dodać na ekran główny telefonu.

### Pliki do sprawdzenia

```text
public/
vite.config.ts
src/components/*
src/pages/Settings.tsx
src/pages/Today.tsx
```

### Zmień

- dodać `manifest.webmanifest`,
- dodać ikony,
- dodać service worker,
- dodać `display: standalone`,
- dodać panel instalacji PWA,
- dodać instrukcję Android / iPhone.

### Nie zmieniaj

- logiki danych,
- API,
- routingu biznesowego.

### Po wdrożeniu sprawdź

- manifest ładuje się poprawnie,
- aplikacja ma ikonę,
- na telefonie można dodać ją do ekranu głównego,
- dane biznesowe nie są agresywnie cache’owane.

### Kryterium zakończenia

CloseFlow wygląda i zachowuje się jak lekka aplikacja na telefonie.

---

## Etap 7 — kody promocyjne

### Cel

Dodać system kodów promocyjnych do planów i triala.

### Pliki do sprawdzenia

```text
src/pages/Billing.tsx
api/billing/*
api/workspace-subscription.ts
src/lib/plans.ts
src/lib/access.ts
```

### Zmień

- dodać model promo code,
- dodać walidację kodu,
- dodać pole kodu w Billing,
- dodać zastosowanie zniżki do checkoutu,
- dodać limity użyć,
- dodać daty ważności.

### Nie zmieniaj

- cen bazowych planów,
- istniejących statusów subskrypcji poza integracją kodu.

### Po wdrożeniu sprawdź

- poprawny kod działa,
- wygasły kod nie działa,
- kod z limitem użyć nie działa po przekroczeniu,
- kod przypisany do planu działa tylko dla tego planu.

### Kryterium zakończenia

Można realnie dawać promocje i kontrolować dostęp.

---

## Etap 8 — Google Calendar sync

### Cel

Synchronizować kalendarz CloseFlow z Google Calendar.

### Pliki do sprawdzenia

```text
src/pages/Settings.tsx
src/pages/Calendar.tsx
src/pages/Tasks.tsx
src/pages/LeadDetail.tsx
api/google-calendar/*
src/lib/calendar-items.ts
src/lib/scheduling.ts
src/lib/access.ts
```

### Zmień

- dodać połączenie Google Calendar,
- dodać wybór / utworzenie kalendarza CloseFlow,
- dodać `googleCalendarEventId`,
- synchronizować create / update / delete,
- dodać log błędów sync,
- dodać retry,
- dodać odłączenie integracji.

### Nie zmieniaj

- struktury tasków/eventów bez potrzeby,
- kalendarza w aplikacji jako źródła prawdy.

### Po wdrożeniu sprawdź

- event z aplikacji pojawia się w Google Calendar,
- zmiana godziny aktualizuje Google,
- usunięcie usuwa/anuluje wpis,
- odłączenie Google nie usuwa danych z CloseFlow,
- Basic nie ma dostępu,
- Pro i AI mają dostęp.

### Kryterium zakończenia

Użytkownik może korzystać z powiadomień telefonu przez Google Calendar.

---

# 8. Kolejność strategiczna

Najlepsza kolejność:

1. **Plany i limity**
2. **Szkice jako wspólny mechanizm**
3. **Szkice w Today**
4. **AI z dostępem do danych aplikacji**
5. **Poranny digest e-mail**
6. **PWA**
7. **Kody promocyjne**
8. **Google Calendar sync**

Dlaczego Google Calendar dopiero później:

- wymaga stabilnego modelu tasków i eventów,
- wymaga OAuth,
- wymaga sync i retry,
- jeśli zrobimy to przed porządkiem w danych, zsynchronizujemy chaos.

---

# 9. Co sprzedaje aplikację najmocniej

Najmocniejsze hasło:

> **Rano dostajesz plan dnia. W ciągu dnia CloseFlow pilnuje, żeby żaden lead nie uciekł.**

Najmocniejsze funkcje sprzedażowe:

1. poranny mail,
2. ekran Dziś,
3. szkice z głosu / tekstu,
4. AI, które znajduje dane w aplikacji,
5. Google Calendar sync,
6. PWA na telefonie.

---

# 10. Czego nie robić teraz

Nie wdrażać teraz:

- natywnej aplikacji Android / iOS,
- pełnego call recordingu,
- automatycznego podsłuchiwania rozmów,
- AI, które zapisuje dane bez potwierdzenia,
- Google Contacts sync,
- WhatsApp integration,
- Facebook / Instagram scraping,
- LinkedIn scraping,
- automatycznego outboundu,
- zespołów i wielu seatów,
- rozbudowanego enterprise CRM.

Najpierw trzeba dowieźć:

> użytkownik codziennie wie, co ma zrobić i nic mu nie ginie.

---

# 11. Kryterium zakończenia tej grupy wdrożeń

Ta grupa jest zakończona, gdy:

1. użytkownik startuje z 21-dniowym trialem,
2. Free jest ograniczony i nie nadaje się do pełnej pracy,
3. Basic daje pełny codzienny porządek za 19 zł,
4. Pro sprzedaje Google Calendar za 39 zł,
5. AI sprzedaje asystenta za 49 zł,
6. ekran Dziś pokazuje szkice do sprawdzenia,
7. AI potrafi odpowiedzieć, co użytkownik ma dziś / jutro,
8. poranny digest e-mail działa,
9. PWA da się dodać na telefon,
10. kody promocyjne działają,
11. Google Calendar sync działa dla Pro+.

---

# 12. Krótki opis do użycia w produkcie

## Free

Sprawdź CloseFlow na kilku leadach.

## Basic

Dla osób, które chcą przestać gubić follow-upy.

## Pro

Dla osób, które chcą mieć leady, zadania i przypomnienia także w Google Calendar.

## AI

Dla osób, które chcą mówić do aplikacji, wyszukiwać dane i tworzyć szkice bez ręcznego klikania.

---

# 13. Finalna decyzja

Wdrażamy model:

```text
Trial Pro/AI 21 dni
Free jako ograniczone demo
Basic 19 zł
Pro 39 zł
AI 49 zł regularnie / 39 zł launch promo
```

Free nie jest głównym produktem.

Free jest tylko wejściem i zabezpieczeniem.

Głównym planem sprzedażowym ma być **Pro**, a planem premium **AI**.
