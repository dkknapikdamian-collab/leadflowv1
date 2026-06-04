# CloseFlow / LeadFlow — owner control roadmap po deep research CRM

Data: 2026-06-04  
Stage: `STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH`  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`  
Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/`

## 1. Główna teza

CloseFlow ma sens tylko jako system pilnowania ruchu sprzedażowego i pieniędzy, nie jako tani CRM.

Produkt ma codziennie odpowiadać właścicielowi:

- kto właśnie ucieka,
- kto nie ma następnego kroku,
- która sprawa stoi,
- gdzie są pieniądze,
- co trzeba ruszyć dzisiaj,
- co może przepaść w tym tygodniu.

## 2. Realny stan repo potwierdzony przed etapem

- `README.md` na `dev-rollout-freeze` opisuje CloseFlow jako aplikację SaaS do pilnowania leadów, follow-upów, zadań, wydarzeń i spraw po sprzedaży.
- Aplikacja ma trasy/widoki: Today, Leads, LeadDetail, Clients, ClientDetail, Cases, CaseDetail, Tasks, Calendar, AiDrafts, Billing, Support, Notifications, Templates.
- `package.json` zawiera guardy i skrypty: `verify:closeflow:quiet`, `check:no-next-step-ui`, `test:nearest-action`, guardy Today, Calendar, billing, Google Calendar i release.
- `_project/07_NEXT_STEPS.md` jest aktywną listą etapów/next steps, ale zawiera dużo historii i starsze duplikaty. Stage221 dopina roadmapę jako osobny blok z markerami.
- `AGENTS.md` wymusza scan-first, pracę na `dev-rollout-freeze`, aktualizację `_project/` i Obsidiana oraz zakaz zmian runtime w etapach pamięci.

## 3. Decyzja

Nie kopiujemy taniego CRM. Nie gonimy Tillio/Firmao/HubSpot/Pipedrive liczbą funkcji.

Budujemy kolejność:

1. A35 Readiness Audit.
2. A35B Mandatory Next Step Contract.
3. A41 Contact Cadence Grid.
4. A46 Sales Funnel Movement View.
5. A42 Lost Lead Rescue.
6. A45 Finance Watchlist.
7. A44 Owner Digest / Weekly Report.
8. A36 Drafts Rebuild.
9. A47 Branchen Playbooks / Control Sprint Offer.

## 4. Etapy

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_START -->
## 2026-06-04 — STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH — owner control roadmap po deep research CRM

STATUS: DO WDROŻENIA JAKO ETAP PAMIĘCI/ROADMAPY. NIE ZMIENIA RUNTIME UI ANI LOGIKI APLIKACJI.

### Powód etapu

Po analizie konkurencji CRM i raportu `deep-research-report (2).md` dopinamy roadmapę CloseFlow do realnego kierunku produktu:

CloseFlow nie ma konkurować jako tani, szeroki CRM. CloseFlow ma być operacyjnym systemem pilnowania ruchu sprzedażowego, następnego kroku, ciszy, spraw i pieniędzy dla małych firm usługowych.

### Realny stan aplikacji potwierdzony przed wpisem

FAKTY Z REPO:
- Repo: `dkknapikdamian-collab/leadflowv1`.
- Aktywna gałąź projektu według pamięci projektu: `dev-rollout-freeze`.
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- `README.md` na `dev-rollout-freeze` już pozycjonuje produkt jako aplikację do pilnowania leadów, follow-upów, zadań, wydarzeń i spraw po sprzedaży.
- Główne widoki istnieją w routingu aplikacji: Today, Leads, LeadDetail, Clients, ClientDetail, Cases, CaseDetail, Tasks, Calendar, AiDrafts, Billing, Support, Notifications, Templates.
- `package.json` ma istniejące guardy/komendy powiązane z no-next-step, nearest action, Today, billing, Google Calendar, release gate i `verify:closeflow:quiet`.
- `_project/07_NEXT_STEPS.md` jest realną listą etapów/next steps, ale zawiera też historię, duplikaty i mojibake po starszych stage’ach. Ten etap dopina nową roadmapę jako osobny blok bez kasowania historii.

### Decyzja produktowa

DECYZJA DAMIANA / KIERUNEK:
- Nie budujemy „tańszego CRM-a”.
- Nie kopiujemy Tillio/Firmao/HubSpot/Pipedrive feature-for-feature.
- Budujemy właścicielski system kontroli: kto ucieka, kto nie ma kolejnego kroku, która sprawa stoi, gdzie leżą pieniądze, co trzeba ruszyć dzisiaj.
- SaaS ma być furtką. Realna monetyzacja ma iść przez wdrożenie procesu, playbooki, cleanup i miesięczny review.

### Logiczna kolejność etapów do wdrożenia

#### A35 — Readiness Audit / Owner Control Baseline

CEL:
- Zbudować wewnętrzny i/lub półproduktowy audyt gotowości sprzedażowej.
- Audyt ma działać na realnych danych leadów/spraw z ostatnich 30 dni lub na ręcznie/importowo podanych danych.

ZAKRES:
- Policz:
  - leady bez następnego kroku,
  - leady bez kontaktu 7+ dni,
  - leady bez kontaktu 14+ dni,
  - sprawy bez ruchu,
  - sprawy z wartością finansową, ale bez następnego kroku,
  - rekordy bez właściciela/odpowiedzialnego,
  - rekordy z notatką, ale bez zadania/follow-upu.
- Dodać raport: `CloseFlow Readiness Audit`.
- Wynik ma być używalny jako:
  - wewnętrzny ekran diagnostyczny,
  - podstawa oferty `CloseFlow Control Sprint`,
  - źródło danych do kolejnych etapów.

NIE RUSZAĆ:
- Nie budować BI dashboardu.
- Nie budować pełnego scoringu AI.
- Nie rozbudowywać ERP/faktur/KSeF.

GUARD/TEST:
- Guard ma sprawdzać, że A35 dokumentuje metryki: no-next-step, 7d silence, 14d silence, stale cases, money-without-next-step.
- Test ręczny: na danych testowych/realnych porównać liczby z listą leadów/spraw.

#### A35B — Mandatory Next Step Contract

CEL:
- Każdy aktywny lead/sprawa musi mieć jasny stan kolejnego kroku albo świadomy status `brak kolejnego kroku`.

ZAKRES:
- Ujednolicić definicję `next step`.
- Na LeadDetail/ClientDetail/CaseDetail pokazywać:
  - ostatni kontakt,
  - następny krok,
  - liczba dni ciszy,
  - status ryzyka,
  - szybkie akcje: ustaw follow-up, dodaj zadanie, dodaj notatkę, oznacz jako martwy/utracony.
- Nie pozwolić, żeby historia aktywności była tylko dziennikiem. Historia ma karmić status ryzyka.

NIE RUSZAĆ:
- Nie robić jeszcze pełnej automatyzacji.
- Nie mieszać z AI drafts rebuild.

GUARD/TEST:
- Guard: detail views mają widoczny kontrakt last-contact / next-step / silence-age / risk.
- Test ręczny: lead z kontaktem, lead bez kontaktu, sprawa z płatnością, sprawa bez następnego kroku.

#### A41 — Contact Cadence Grid / Reminder Engine

CEL:
- Dodać czytelną siatkę kontaktu jako główny widok operacyjny, nie jako spam powiadomień.

ZAKRES:
- Widok/sekcja `Siatka kontaktu`.
- Bucket/filtrowanie:
  - kontakt dziś,
  - 1 dzień ciszy,
  - 2 dni ciszy,
  - 3 dni ciszy,
  - 5 dni ciszy,
  - 7 dni ciszy,
  - 14 dni ciszy.
- Każdy rekord pokazuje:
  - osoba/firma,
  - typ: lead/klient/sprawa,
  - ostatni kontakt,
  - następny krok,
  - wartość sprawy jeśli istnieje,
  - status ryzyka,
  - szybkie akcje.
- Engine ma bazować na realnej historii aktywności, zadaniach i wydarzeniach.

NIE RUSZAĆ:
- Nie zamieniać tego w zwykłe browser notifications.
- Nie budować jeszcze pełnego sekwencera mailowego.

GUARD/TEST:
- Guard: bucket 7d/14d nie może być tylko statycznym tekstem; musi być połączony z obliczaniem ostatniego kontaktu.
- Test ręczny: rekordy z różnymi datami kontaktu wpadają do właściwych bucketów.

#### A46 — Sales Funnel Movement View / Lejek ruchu sprzedażowego

CEL:
- Zbudować lejek ruchu, który pokazuje nie tylko etap, ale też ciszę, brak kroku, ryzyko i pieniądze.

ZAKRES:
- Pipeline/lejek ma pokazywać:
  - etap,
  - wiek kontaktu,
  - ostatni kontakt,
  - następny krok,
  - dni bez ruchu,
  - wartość/potencjalna prowizja,
  - risk flag,
  - szybkie akcje.
- Karta w lejku nie może być tylko nazwą i etapem.
- Lejek ma zasilać Today, Lost Lead Rescue i Owner Digest.

NIE RUSZAĆ:
- Nie kopiować klasycznego CRM kanban jako całości.
- Nie robić forecastingu enterprise.

GUARD/TEST:
- Guard: karta lejka zawiera next-step, silence-age, risk, quick actions.
- Test ręczny: leady/sprawy zmieniają etap i nadal zachowują status ruchu.

#### A42 — Lost Lead Rescue

CEL:
- Zbudować osobny ekran `Do odzyskania`, nie tylko filtr w leadach.

ZAKRES:
- Pokazuje:
  - brak ruchu 7+ dni,
  - 14 dni ciszy,
  - brak następnego kroku,
  - leady z dużą wartością bez aktywności,
  - niedokończone szkice,
  - leady bez właściciela.
- Szybkie akcje:
  - odezwij się dziś,
  - utwórz zadanie,
  - odłóż,
  - dodaj notatkę,
  - przygotuj szkic,
  - oznacz jako martwy/utracony.
- Widok ma być używalny codziennie/tygodniowo przez właściciela.

NIE RUSZAĆ:
- Nie robić rozbudowanych automatyzacji marketingowych.
- Nie wysyłać nic automatycznie bez akceptacji.

GUARD/TEST:
- Guard: ekran/rescue model wymaga kryteriów 7d, 14d, no-next-step i quick actions.
- Test ręczny: minimum 5 przypadków testowych wpada do właściwych sekcji.

#### A45 — Finance Watchlist / Money-at-Risk

CEL:
- Zbudować listę pieniędzy do ruszenia, nie pełny moduł księgowy.

ZAKRES:
- Pokazuje:
  - sprawy z wartością, ale bez następnego kroku,
  - prowizje do rozliczenia,
  - wpłaty po terminie,
  - brak daty płatności,
  - korekty do sprawdzenia,
  - duże kwoty bez ruchu 7+ dni.
- Powiązać z istniejącymi finansami sprawy: wartość, prowizja, wpłaty, korekty, usuwanie wpłat.
- Widok ma zasilać Owner Digest.

NIE RUSZAĆ:
- Nie budować KSeF.
- Nie budować fakturowania, magazynu, banków, ERP ani księgowości.
- Nie kopiować Firmao/Berg.

GUARD/TEST:
- Guard: finance watchlist nie może importować modułów księgowych/ERP ani obiecywać fakturowania.
- Test ręczny: sprawa z kwotą i brakiem next step pojawia się jako money-at-risk.

#### A44 — Owner Digest / Weekly Report

CEL:
- Dodać dzienny/tygodniowy raport właściciela jako listę decyzji, nie vanity dashboard.

ZAKRES:
- Daily:
  - co dziś ruszyć,
  - kto nie ma następnego kroku,
  - kto ma 7/14 dni ciszy,
  - które sprawy stoją,
  - jakie pieniądze wymagają ruchu.
- Weekly:
  - ile leadów weszło,
  - ile leadów bez next step,
  - ile 7d/14d ciszy,
  - ile spraw bez ruchu,
  - ile pieniędzy bez ruchu,
  - największe ryzyko tygodnia.
- Digest ma być widoczny w aplikacji i docelowo możliwy do wysyłki, ale bez automatycznego wysyłania bez konfiguracji/akceptacji.

NIE RUSZAĆ:
- Nie robić newslettera.
- Nie robić dashboardu wykresów dla samego wyglądu.
- Nie wysyłać e-maili, jeśli produkcyjny email nie jest gotowy.

GUARD/TEST:
- Guard: digest ma zawierać listę ryzyk i akcji, nie tylko metryki.
- Test ręczny: owner widzi co dziś zrobić bez przechodzenia przez 5 ekranów.

#### A36 — Drafts Rebuild / Jedna skrzynka szkiców

CEL:
- Przebudować szkice jako jedno miejsce zatwierdzania danych, ale dopiero po warstwie kontroli.

ZAKRES:
- Jedna skrzynka:
  - ręczny szkic,
  - wklejony tekst,
  - dyktowanie,
  - parser,
  - AI.
- Zatwierdź jako:
  - lead,
  - zadanie,
  - wydarzenie,
  - notatka,
  - follow-up.
- Po zatwierdzeniu wpis musi automatycznie przypisać się do lead/klient/sprawa, jeśli kontekst jest znany.
- AI dalej działa confirm-first: nie zapisuje finalnych danych bez akceptacji użytkownika.

NIE RUSZAĆ:
- Nie sprzedawać tego jako głównego wyróżnika „AI CRM”.
- Nie dodawać automatycznego wysyłania wiadomości.

GUARD/TEST:
- Guard: AI drafts confirm-first i brak automatycznego finalnego zapisu bez akceptacji.
- Test ręczny: szkic z LeadDetail/ClientDetail/CaseDetail zachowuje kontekst.

#### A47 — Branchen Playbooks / Control Sprint Offer

CEL:
- Spiąć produkt z usługą wdrożeniową, żeby nie sprzedawać samego taniego SaaS.

ZAKRES:
- Oferta startowa:
  - `CloseFlow Control Sprint`,
  - readiness audit,
  - import/porządkowanie danych,
  - ustawienie etapów,
  - next-step discipline,
  - contact cadence,
  - owner digest,
  - podstawowy finance watchlist,
  - jedno szkolenie.
- Pierwszy segment:
  - małe usługi B2B z inboundem i właścicielem blisko sprzedaży.
- Playbook V1:
  - etapy,
  - wymagane next steps,
  - progi ciszy,
  - zasady follow-upu,
  - raport ownera.

NIE RUSZAĆ:
- Nie robić 10 branż naraz.
- Nie budować marketplace’u playbooków.
- Nie robić bespoke wdrożeń bez szablonu.

GUARD/TEST:
- Guard: roadmapa nie może mieć więcej niż jednego aktywnego segmentu startowego bez oznaczenia `DO_POTWIERDZENIA`.
- Test sprzedażowy: 10 rozmów / demo na danych z ostatnich 30 dni / próba sprzedaży Control Sprint.

### Minimalny porządek wdrożenia

1. A35 Readiness Audit.
2. A35B Mandatory Next Step Contract.
3. A41 Contact Cadence Grid.
4. A46 Sales Funnel Movement View.
5. A42 Lost Lead Rescue.
6. A45 Finance Watchlist.
7. A44 Owner Digest / Weekly Report.
8. A36 Drafts Rebuild.
9. A47 Branchen Playbooks / Control Sprint Offer.

### Warunki zamknięcia tej roadmapy

- Każdy etap ma osobny run report w `_project/runs/`.
- Każdy etap ma guard/test albo jawny SKIP z powodem.
- Każdy etap aktualizuje `_project/07_NEXT_STEPS.md`, `_project/08_CHANGELOG_AI.md`, `_project/12_IMPLEMENTATION_LEDGER.md`, `_project/13_TEST_HISTORY.md`.
- Każdy etap ma aktualizację Obsidiana albo manifest.
- Nie używać `git add .`.
- Nie robić push przed testami/guardami i ręcznym potwierdzeniem, jeśli etap dotyka runtime UI.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_END -->


## 5. Guard

`node scripts/check-stage221-owner-control-roadmap-memory.cjs`

## 6. Czego nie ruszano

- runtime UI,
- routing,
- API,
- Supabase,
- style,
- produkcyjna logika aplikacji.

## 7. Następny krok

Wdrożyć Stage221 jako etap dokumentacyjny/pamięciowy. Potem rozpocząć A35 jako pierwszy realny etap produktowy.
