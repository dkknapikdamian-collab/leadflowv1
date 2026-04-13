# ETAP 18 — Today i widoki właścicielskie jako finalny ekran pracy operatora

## Cel

Dowieźć taki układ i logikę ekranów, żeby operator po wejściu do aplikacji w kilka sekund wiedział:
- komu odpisać,
- który lead jest zagrożony,
- która sprawa stoi przez klienta,
- co jest gotowe do startu,
- jaki jest następny ruch.

To nie jest etap „upiększania UI”.
To jest etap domknięcia **codziennej użyteczności produktu**.

---

## Pliki do sprawdzenia

### Widoki główne
- `components/today-page-view.tsx`
- `components/views.tsx`
- `components/cases-page-view.tsx`
- `components/lead-pipeline-page-view.tsx`
- `components/dashboard-shell.tsx`

### Domena i view-model
- `lib/today.ts`
- `lib/domain/lead-state.ts`
- `lib/domain/cases-dashboard.ts`
- `lib/domain/lead-case.ts`

### Routing i shell
- `app/today/page.tsx`
- `app/leads/page.tsx`
- `app/cases/page.tsx`
- `app/tasks/page.tsx`
- `app/calendar/page.tsx`
- `app/activity/page.tsx`

### Testy
- `tests/today.test.ts`
- `tests/cases-dashboard.test.ts`
- `tests/lead-state.test.ts`
- `tests/workflow-runtime-stage-usage.test.ts`

---

## Zmień

### 1. Today ma być egzekucyjny, nie ozdobny
Today ma pokazywać w pierwszym ekranie:
- top moves today,
- missing next step,
- overdue,
- waiting too long,
- blocked cases,
- ready to start,
- execution queue.

Operator nie może szukać tego po kilku ekranach.

### 2. Jedna prawda między Today, Leads i Cases
Jeżeli lead lub sprawa są alarmowe, to:
- Today,
- lista,
- detail,
- stat card,
- command center

mają to pokazywać spójnie.

### 3. Usuń pozorną złożoność
Jeśli jakiś filtr, karta, badge albo sekcja:
- nic nie robi,
- nie ma mocy domenowej,
- pokazuje inną prawdę niż runtime,

ma zostać uproszczona albo usunięta.

### 4. Finalny układ operatora
Widoki mają być uporządkowane pod 3 pytania:
- co wymaga ruchu teraz,
- co jest zagrożone,
- co jest gotowe do ruszenia.

### 5. Dopnij powierzchnie właścicielskie
Minimum do przejścia:
- Today
- Leads
- Cases
- Tasks
- Calendar
- Activity

Muszą działać jako jeden system procesu, nie luźne ekrany.

---

## Nie zmieniaj

- nie rozlewaj zakresu o nowe moduły poboczne,
- nie wracaj do starego modelu samego lead follow-up bez case lifecycle,
- nie zmieniaj architektury branchy,
- dalej pracujemy tylko na `dev-rollout-freeze`.

---

## Po wdrożeniu sprawdź

- `npm test`
- `npm run build`
- ręczne kliknięcie:
  - Today
  - Leads
  - Cases
  - Tasks
  - Calendar
  - Activity
- zgodność alarmów i statusów między widokami
- brak martwych elementów UI

---

## Kryterium zakończenia

Etap jest zakończony dopiero wtedy, gdy:
- Today realnie prowadzi operatora przez dzień,
- widoki właścicielskie są spójne,
- nie ma rozjazdów między listą, detalem i command center,
- aplikacja ma sens jako codzienne narzędzie pracy, a nie tylko zbiór ekranów.
