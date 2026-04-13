# ETAP 19 — Lead Detail + Tasks + Calendar jako jeden proces

## Cel

Domknąć warstwę pracy operatora tak, żeby:
- Lead Detail,
- Tasks,
- Calendar

nie były trzema osobnymi światami, tylko trzema powierzchniami tego samego procesu.

Operator ma widzieć:
- ostatni kontakt,
- kolejny krok,
- ryzyko,
- liczbę aktywnych działań,
- zaległości,
- czy lead jest już gotowy do przejścia na case,
- czy proces jest zamknięty.

---

## Pliki do sprawdzenia

### Widoki
- `components/views.tsx`
- `components/today-page-view.tsx`

### Domena
- `lib/domain/lead-state.ts`
- `lib/domain/lead-process-surface.ts`
- `lib/domain/lead-case.ts`

### Snapshot i mutacje
- `lib/snapshot.ts`
- `lib/data/actions.ts`

### Testy
- `tests/lead-state.test.ts`
- `tests/lead-process-surface.test.ts`
- `tests/today.test.ts`
- `tests/snapshot.test.ts`

---

## Zmień

### 1. Jedna prawda procesu leada
Wszystkie trzy powierzchnie mają czytać ten sam stan procesu:
- lead detail
- tasks
- calendar

Nie wolno robić osobnych interpretacji „co dalej” w każdym ekranie.

### 2. Lead Detail ma prowadzić operatora
Lead Detail ma jasno pokazywać:
- ostatni kontakt
- kolejny krok
- termin
- risk
- aktywne działania
- czy można uruchomić operacje
- czy lead ma już case

### 3. Tasks mają być procesowe
Tasks nie mogą być tylko listą terminów.
Mają wspierać:
- sprzedaż,
- follow-up,
- przejście do case,
- domykanie brakujących ruchów.

### 4. Calendar ma wspierać działanie, nie zastępować logikę
Calendar ma pokazywać ruch w czasie,
ale logika procesu ma nadal siedzieć w domenie, nie w samym kalendarzu.

### 5. Dopnij wspólne summary procesu
Warstwa domenowa ma umieć odpowiedzieć:
- jaki jest stage procesu,
- jaki jest następny ruch,
- ile jest aktywnych tasków,
- ile jest overdue,
- ile rzeczy widać w kalendarzu,
- czy operator powinien jeszcze sprzedawać czy już prowadzić case.

---

## Nie zmieniaj

- nie wracaj do modelu oddzielonych światów lead / task / calendar,
- nie zmieniaj branchy,
- dalej pracujemy tylko na `dev-rollout-freeze`,
- nie rozlewaj etapu o billing, contacts albo intake.

---

## Po wdrożeniu sprawdź

- `npm test`
- `npm run build`
- ręczne flow:
  - lead bez next stepu
  - lead z overdue
  - lead z aktywnym taskiem i eventem
  - lead `won` bez case
  - lead `won` z case
  - lead `lost`
- zgodność między:
  - Lead Detail
  - Tasks
  - Calendar
  - Today

---

## Kryterium zakończenia

Etap jest zakończony dopiero wtedy, gdy operator może wejść w leada i bez zgadywania zobaczyć:
- co się dzieje,
- co ma zrobić,
- czy proces jest jeszcze sprzedażowy,
- czy przeszedł już na operacje.
