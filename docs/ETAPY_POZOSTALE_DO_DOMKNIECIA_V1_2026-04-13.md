# ETAPY POZOSTAŁE DO DOMKNIĘCIA V1 — 2026-04-13

## Po co ten dokument

To jest jedna skonsolidowana lista tego, co jeszcze trzeba dowieźć, żeby aplikacja miała sens jako:

**jeden system do domykania i uruchamiania klienta**

czyli:
- warstwa sprzedaży = Lead Flow,
- warstwa po sprzedaży = Sprawy / kompletność / portal klienta,
- jedna historia klienta,
- jedna aplikacja,
- jedno source of truth procesu.

To nie jest lista wszystkich możliwych pomysłów.
To jest lista tego, co realnie zostało do zrobienia, podzielona na priorytety.

---

# BLOKERY NATYCHMIASTOWE

## R0 — przywrócić pełną zieloność brancha

### Co domknąć
- naprawić `tests/owner-view-summary.test.ts`
- dopiąć `/operator` w `components/dashboard-shell.tsx`
- potwierdzić:
  - `npm test` PASS
  - `npm run build` PASS
  - commit i push na `dev-rollout-freeze`

### Dlaczego to jest pierwsze
Nie budujemy dalej na czerwonym branchu.

---

# ETAPY KRYTYCZNE DO SENSOWNEGO V1

## ETAP 17A — runtime / snapshot / portal / notifications

### Co zostało
- manual QA flow operatora:
  - lead bez next stepu
  - lead overdue
  - lead po `won`
  - utworzenie `case`
  - blocker
  - `waiting_for_client`
  - `ready_to_start`
  - `in_progress`
  - zgodność z `Today`
- manual QA portalu:
  - poprawny token
  - zły token
  - wygasły token
  - odwołany token
  - upload
  - akceptacja
  - brak uprawnień
- QA workflow notifications:
  - brak duplikatów
  - brak spamu
  - poprawne mapowanie `waiting_for_client`, `blocked`, `ready_to_start`

### Kryterium zakończenia
Nowy lifecycle jest spójny w runtime, API, snapshot i UI.

---

## ETAP 18 — Today i widoki właścicielskie

### Co zostało
- dopiąć `Today` jako prawdziwy ekran egzekucji:
  - top moves today
  - missing next step
  - overdue
  - waiting too long
  - blocked cases
  - ready to start
  - execution queue
- jedna prawda między:
  - Today
  - Leads
  - Lead Detail
  - Cases
  - Tasks
  - Calendar
  - Activity
- usunąć martwe badge, filtry, karty i sekcje
- dociągnąć `Operator Center` jako pomocniczy ekran, ale bez zabicia roli `Today` jako serca produktu

### Kryterium zakończenia
Operator po wejściu do aplikacji w kilka sekund wie:
- komu odpisać,
- co jest zagrożone,
- co stoi,
- co jest gotowe do startu.

---

## ETAP 19 — Lead Detail + Tasks + Calendar jako jeden proces

### Co trzeba wdrożyć
- Lead Detail ma pokazywać prawdziwy stan procesu:
  - ostatni kontakt
  - next step
  - termin
  - dni bez ruchu
  - risk
  - historię działań
- Tasks mają być procesowe, nie tylko listą terminów
- Calendar ma wspierać proces, a nie zastępować logikę produktu
- brak stanu „lead w próżni” po zamknięciu akcji

### Kryterium zakończenia
Sprzedażowy flow operatora jest domknięty od listy do detalu i z powrotem.

---

## ETAP 20 — szablony spraw i checklisty kompletności

### Co trzeba wdrożyć
- sensowne template’y per typ usługi
- required vs optional
- automatyczny start checklisty po `case`
- finalne domknięcie typów elementów:
  - file
  - decision
  - approval
  - access
  - response
- pełne wykorzystanie checklisty w Case Detail

### Kryterium zakończenia
Sprawa po starcie ma od razu sensowną, gotową strukturę działania.

---

## ETAP 21 — billing / trial / access

### Co trzeba wdrożyć
- 7-dniowy trial
- po trialu: płatność albo blokada
- poprawny paywall
- brak wycieków dostępu
- czytelny status konta
- poprawne ograniczenia read-only tam, gdzie mają sens

### Kryterium zakończenia
Produkt działa jak prawdziwy SaaS, nie jak projekt testowy.

---

## ETAP 22 — gotowość wdrożeniowa i operacyjna

### Co trzeba wdrożyć
- przewidywalny deploy
- env-y
- smoke scripts
- launchery uruchomieniowe
- logi:
  - `logs/app.log`
  - `logs/error.log`
  - `logs/test.log`
- pełna paczka ZIP jako standard wydania

### Kryterium zakończenia
Aplikację da się stabilnie uruchamiać, testować i przenosić bez chaosu.

---

## ETAP 23 — packaging sprzedażowy produktu

### Co trzeba wdrożyć
- finalna lub robocza nazwa sprzedażowa
- pozycjonowanie
- landing
- onboarding
- demo flow
- jedna jasna obietnica produktu

### Kryterium zakończenia
Da się jasno odpowiedzieć:
- dla kogo to jest,
- jaki problem rozwiązuje,
- za co ktoś ma zapłacić.

---

# ETAPY MOCNO ZALECANE ZARAZ PO RDZENIU

## ETAP 24 — Klienci / Contacts

### Co trzeba wdrożyć
- jedna historia klienta
- wiele leadów i spraw dla jednego kontaktu
- łatwe przejście sprzedaż -> realizacja
- przygotowanie docelowego widoku klienta

### Dlaczego to ważne
To domyka obietnicę jednego systemu, a nie dwóch sklejonych modułów.

---

## ETAP 25 — intake maili i dokumentów

### Co trzeba wdrożyć
- lekki intake maili
- dopasowanie do klienta
- oznaczanie kompletności
- bez robienia z systemu magazynu dokumentów

### Dlaczego to ważne
Dla części branż to może być bardzo mocny klin produktowy.

---

## ETAP 26 — podstawowe metryki operatora

### Co trzeba wdrożyć
- ile leadów bez next stepu
- ile overdue
- ile waiting too long
- ile won
- ile blocked cases
- ile ready_to_start
- ile dni od `won` do `ready_to_start`

### Dlaczego to ważne
To wzmacnia zarządzanie i sprzedaż produktu.

---

# NIE BLOKUJE SENSOWNEGO V1

## Na później
- team i role
- cięższe AI
- outbound / Lead Opportunity Radar
- monitoring sociali
- enterprise CRM
- rozbudowane integracje

---

# KOLEJNOŚĆ DALSZYCH WDROŻEŃ

## Najbardziej sensowna kolejność
1. R0 — zielony branch
2. ETAP 17A — runtime / portal / notifications
3. ETAP 18 — Today i widoki właścicielskie
4. ETAP 19 — Lead Detail / Tasks / Calendar
5. ETAP 20 — Templates / checklisty
6. ETAP 21 — Billing / trial / access
7. ETAP 22 — Deploy / smoke / logi / launchery
8. ETAP 23 — Packaging sprzedażowy
9. ETAP 24 — Contacts / Klienci
10. ETAP 26 — Metryki operatora
11. ETAP 25 — Intake maili / dokumentów

---

# OSTATECZNY WERDYKT

Żeby ta aplikacja miała sens, nie potrzeba teraz kolejnych nowych modułów.

Trzeba domknąć:
- spójny proces,
- ekran egzekucji,
- portal klienta,
- kompletność sprawy,
- billing,
- gotowość do sprzedaży.

Dopiero potem warto rozwijać dodatki.
