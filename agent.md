# agent.md

## Zasada Pracy Z Repo (Main Frozen)

- Repo jest "frozen" w sensie procesu: nie pushujemy nic bezposrednio na galaz `main`.
- Wszystkie zmiany robimy w tym repo lokalnie i wersjonujemy w Git jako brancze robocze (feature/hotfix).
- Publikacja/merge do `main` dopiero gdy user jawnie powie, ze to jest final i mamy zielone testy.
- "Finalna wersja projektu" ma zyc w tym repo (to jest source of truth), bez duplikowania rownoleglych kopii.

## Mapa Repo (Oszczedzanie Tokenow)

- Zrodlem prawdy o strukturze repo jest: `docs/REPO_MAP.md` (generowane z `git ls-files`).
- Zanim zaczniesz prace: otworz `docs/REPO_MAP.md` i znajdz pliki/foldery powiazane z zadaniem.
- Zasada zmiany: modyfikuj tylko pliki potrzebne do celu zmiany (bez "przekopywania" calego repo).
- Zasada wyszukiwania: jesli musisz uzyc `rg`, ogranicz je do 1-3 katalogow albo konkretnych plikow wskazanych w mapie.
- Utrzymanie mapy (twarda zasada): po KAZDEJ zmianie w repo aktualizuj mape przez `node scripts/gen-repo-map.mjs` i committuj `docs/REPO_MAP.md` razem z dana zmiana.

## Zasady Finalnej Aplikacji (ClientPilot) - Source Of Truth

### 1) Jeden produkt, jedna baza prawdy

- Jeden system do domykania i uruchamiania klienta.
- Lead Flow to rdzen sprzedazowy.
- Sprawy / kompletnosc / Client Portal to modul uruchamiany po sprzedazy.
- Jedna baza online jako source of truth (nie lokalny stan).
- Jedno konto, jeden workspace, jedna historia klienta.
- Kazdy rekord biznesowy musi byc przypisany do workspace.
- Auth, workspace, trial, billing, RLS i centralna logika dostepu sa twardym fundamentem produktu.

### 2) Nie kopiujemy prototypu 1:1 jako kodu bazowego

- Lead Flow = baza architektoniczna (twarde zasady danych online + access + workspace).
- Prototyp = kierunek wizualny + nowy modul + flow operacyjny (UX), ale nie osobna aplikacja ani baza kodowa do przeniesienia 1:1.
- Uzytkownik nie ma czuc, ze "wchodzi do drugiej aplikacji".

### 3) Docelowy przeplyw

- lead -> next step -> lead won -> tworzy sie sprawa -> sprawa dostaje checkliste
- klient dostaje link (Client Portal) -> klient dosyla pliki / decyzje
- operator weryfikuje -> sprawa staje sie ready to start

### 4) Docelowa domena (poziomy)

- Kontakt/Klient: jedna osoba/firma.
- Lead: etap sprzedazowy (status, wartosc, priorytet, next step, risk, historia).
- Case/Sprawa: etap operacyjny po wygraniu.
- Checklist kompletnosci: materialy, decyzje, zgody, pliki, akceptacje, braki, blokery.
- Aktywnosc i przypomnienia: overdue, kto czeka na kogo, czy sprawa stoi, jaki nastepny ruch.

### 5) Docelowe menu operatora

Portal klienta nie jest pozycja w menu - to wejscie z linku.

Finalnie:
- Dzis
- Leady
- Sprawy
- Zadania
- Kalendarz
- (Klienci - na start moze byc ukryte w modelu Lead/Case, ale architektura ma to przewidywac)
- Szablony
- Aktywnosc
- Rozliczenia
- Ustawienia

Minimum na wczesnym etapie:
- Dzis
- Leady
- Zadania
- Kalendarz
- Sprawy
- Aktywnosc
- Rozliczenia
- Ustawienia

### 6) Visual System Lock (kierunek nowej skorki)

Wszystkie ekrany maja byc jednym visual systemem:
- sidebar
- karty + stats cards
- search + filters bar
- list cards
- detail headers
- status badges
- shell operatora
- shell Client Portal
- dialogi i formularze
- empty/loading/error states

### 7) Co zostaje vs co zmieniamy

Zostaje:
- Today jako centrum dowodzenia
- logika next step / overdue / risk / waiting too long
- zadania, kalendarz, przypomnienia, snooze
- settings, billing, auth, workspace, trial, dane online, RLS, centralny access model

Zmieniamy/dowozimy:
- skorka i komponenty widokowe w nowym stylu (jeden visual system)
- IA tak, by Sprawy byly pelnoprawnym modulem
- most danych: po won lead przechodzi w case
- Today ma pokazywac tez blokady po sprzedazy
- lead detail ma sekcje "Start realizacji"
- Client Portal + checklisty + uploady + akceptacje + status kompletnosci

### 8) Kolejnosc budowy (werdykt)

1. Zamrozenie architektury i nowej skorki rdzenia
2. Domkniecie rdzenia Lead Flow w nowej skorce
3. Dolozenie Spraw jako modulu po sprzedazy
4. Client Portal + checklisty + uploady + akceptacje
5. Automatyzacje, blokery, dashboard polaczony
6. Twarde domkniecie bezpieczenstwa, billingu, accessu, QA

## Jedna prawda produktu (jedna aplikacja)

Produkt nie jest juz tylko "lead follow-up app".
Produkt jest **systemem do domykania i uruchamiania klienta**.

### Zasada nadrzedna

- sprzedaz = lead flow
- po statusie `won` lead moze przejsc do sprawy operacyjnej

### Co to oznacza produktowo

- Nie ma "drugiej aplikacji" - wszystko jest jednym produktem
- Sprawy sa modulem tego samego systemu
- jeden system, jeden workspace, jedna historia dzialan

### Finalne menu operatora

1. Dzis
2. Leady
3. Sprawy
4. Zadania
5. Kalendarz
6. Aktywnosc
7. Rozliczenia
8. Ustawienia

Pozniej:
- Szablony
- Klienci

### Kierunek UI

Nowa skorka UI ma dzialac jako jeden wspolny visual system dla wszystkich ekranow.

### Ograniczenia tej iteracji

- bez zmian auth/billing flow
- bez zmiany obecnych zasad dostepu
- (historycznie) bez publicznego portalu klienta - aktualnie portal klienta jest elementem finalnego produktu
