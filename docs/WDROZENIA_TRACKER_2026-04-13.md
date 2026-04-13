# WDROŻENIA TRACKER — 2026-04-13

## Zasada obowiązująca od teraz

Jeżeli etap albo podpunkt jest zrobiony, **nie usuwamy go z listy**.
Zostaje na liście i jest oznaczany przez przekreślenie.

Format:
- ~~zrobione~~
- w trakcie
- do zrobienia

---

## Zrobione etapy bazowe

- ~~ETAP 0 — dokumentacja i jedna prawda produktu~~
- ~~ETAP 1 — visual system lock / shell~~
- ~~ETAP 2 — rdzeń Lead Flow w nowej skórce~~
- ~~ETAP 3 — wspólny model danych Lead → Case~~
- ~~ETAP 4 — statusy sprzedażowe i operacyjne jako 2 warstwy~~
- ~~ETAP 5 — sekcja „Start realizacji” w Lead Detail~~
- ~~ETAP 6 — moduł Sprawy: lista + dashboard~~
- ~~ETAP 7 — Case Detail: checklista, blokery, oś czasu, quick actions~~
- ~~ETAP 8 — szablony checklist i tworzenie sprawy z szablonu~~
- ~~ETAP 9 — publiczny panel klienta~~
- ~~ETAP 10 — uploady, decyzje, akceptacje, minimum workflow~~
- ~~ETAP 11 — automatyzacje Lead → Case → Blocker → Ready~~
- ~~ETAP 12 — połączyć Today z Leadami i Sprawami~~
- ~~ETAP 13 — powiadomienia i przypomnienia dla nowych modułów~~
- ~~ETAP 14 — billing, access i nowe moduły~~
- ~~ETAP 15 — security, storage, tokens, RLS, audit~~

---

## Etapy otwarte

### ETAP 16 — full QA / mobile pass / consistency pass

**Status: w trakcie**

- ~~automatyczne minimum: testy~~
- ~~automatyczne minimum: build~~
- do zrobienia: smoke prod
- do zrobienia: manualny smoke end-to-end
- do zrobienia: mobile pass
- do zrobienia: consistency pass
- do zrobienia: security pass
- do zrobienia: raport końcowy manual QA

### R0 — przywrócić pełną zieloność brancha

**Status: do zrobienia**

- do zrobienia: potwierdzić `tests/owner-view-summary.test.ts`
- do zrobienia: potwierdzić `/operator` w `components/dashboard-shell.tsx`
- do zrobienia: potwierdzić `npm test` PASS
- do zrobienia: potwierdzić `npm run build` PASS

### ETAP 17A — runtime / snapshot / portal / notifications

**Status: do zrobienia**

- do zrobienia: manual QA flow operatora
- do zrobienia: manual QA portalu
- do zrobienia: QA workflow notifications
- do zrobienia: spójność lifecycle w runtime, API, snapshot i UI

### ETAP 18 — Today i widoki właścicielskie

**Status: częściowo zrobione**

- ~~Today połączony z Leadami i Sprawami~~
- ~~Operator Center jako pomocniczy ekran~~
- do zrobienia: finalny Today jako ekran egzekucji
- do zrobienia: jedna prawda między Today / Leads / Lead Detail / Cases / Tasks / Calendar / Activity
- do zrobienia: usunięcie martwych badge, filtrów, kart i sekcji

### ETAP 19 — Lead Detail + Tasks + Calendar jako jeden proces

**Status: częściowo zrobione**

- ~~domena wspólnego procesu leada istnieje~~
- ~~Lead Detail został mocno rozbudowany~~
- ~~Tasks zostały poszerzone o backlog / tydzień / zaległe / bez leada~~
- do zrobienia: pełna zgodność Lead Detail / Tasks / Calendar / Today
- do zrobienia: brak stanu „lead w próżni” po zamknięciu akcji

### ETAP 20 — szablony spraw i checklisty kompletności

**Status: częściowo zrobione**

- ~~widok szablonów istnieje~~
- ~~tworzenie sprawy z szablonu istnieje~~
- do zrobienia: sensowne template’y per typ usługi
- do zrobienia: required vs optional jako finalna logika
- do zrobienia: automatyczny start checklisty po `case`
- do zrobienia: pełne wykorzystanie checklisty w Case Detail

### ETAP 21 — billing / trial / access

**Status: częściowo zrobione**

- ~~centralny model dostępu istnieje~~
- ~~UI billing / status konta istnieje~~
- do zrobienia: 7-dniowy trial jako finalny flow produktu
- do zrobienia: blokada po trialu bez płatności
- do zrobienia: poprawny paywall

### ETAP 22 — gotowość wdrożeniowa i operacyjna

**Status: częściowo zrobione**

- ~~smoke scripts istnieją~~
- ~~verify scripts istnieją~~
- do zrobienia: przewidywalny deploy
- do zrobienia: env-y jako standard
- do zrobienia: launchery uruchomieniowe
- do zrobienia: logi
- do zrobienia: pełna paczka ZIP jako standard wydania

### ETAP 23 — packaging sprzedażowy produktu

**Status: do zrobienia**

- do zrobienia: nazwa sprzedażowa
- do zrobienia: pozycjonowanie
- do zrobienia: landing
- do zrobienia: onboarding
- do zrobienia: demo flow

### ETAP 24 — Klienci / Contacts

**Status: do zrobienia**

- do zrobienia: jedna historia klienta
- do zrobienia: wiele leadów i spraw dla jednego kontaktu
- do zrobienia: widok klienta

### ETAP 25 — intake maili i dokumentów

**Status: do zrobienia**

- do zrobienia: lekki intake maili
- do zrobienia: dopasowanie do klienta
- do zrobienia: oznaczanie kompletności

### ETAP 26 — podstawowe metryki operatora

**Status: do zrobienia**

- do zrobienia: leady bez next stepu
- do zrobienia: overdue
- do zrobienia: waiting too long
- do zrobienia: won
- do zrobienia: blocked cases
- do zrobienia: ready_to_start

---

## Kolejność robocza od teraz

1. R0 — pełna zieloność brancha
2. ETAP 16 — manual QA / smoke / consistency
3. ETAP 17A — runtime / portal / notifications QA
4. ETAP 18 — finalny Today i widoki właścicielskie
5. ETAP 19 — pełna spójność Lead Detail / Tasks / Calendar
6. ETAP 20 — checklisty i template’y
7. ETAP 21 — billing / trial / access
8. ETAP 22 — deploy / logi / launchery / ZIP
9. ETAP 23 — packaging sprzedażowy

---

## Zasada dla kolejnych commitów

Przy każdym kolejnym wdrożeniu:
- nie usuwamy ukończonych punktów,
- przekreślamy to, co zamknięte,
- dopisujemy tylko nowy stan i wynik.
