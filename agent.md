# agent.md

## Zasada Pracy Z Repo (Main Frozen)

- Repo jest "frozen" w sensie procesu: nie pushujemy nic bezposrednio na galaz `main`.
- Wszystkie zmiany robimy w tym repo lokalnie i wersjonujemy w Git jako brancze robocze (feature/hotfix).
- Publikacja/merge do `main` dopiero gdy user jawnie powie, ze to jest final i mamy zielone testy.
- "Finalna wersja projektu" ma zyc w tym repo (to jest source of truth), bez duplikowania rownoleglych kopii.

## Jedna prawda produktu (po scaleniu Lead Flow + Forteca)

Produkt nie jest juz tylko "lead follow-up app".
Produkt jest **systemem do domykania i uruchamiania klienta**.

### Zasada nadrzedna

- sprzedaz = lead flow
- po statusie `won` lead moze przejsc do sprawy operacyjnej

### Co to oznacza produktowo

- Forteca nie jest osobna aplikacja
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

Nowa skorka UI ma byc oparta o kierunek Forteca i dzialac jako jeden wspolny visual system dla wszystkich ekranow.

### Ograniczenia tej iteracji

- bez zmian auth/billing flow
- bez zmiany obecnych zasad dostepu
- bez publicznego portalu klienta
