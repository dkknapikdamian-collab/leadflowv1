# EliteFlow / CloseFlow — blokada stylu kafelków metryk według zakładki Dziś

Data: 2026-05-07  
Zakres: tylko kafelki metryk u góry widoków operatora.

## Cel

Kafelki metryk w zakładkach:

- Leady,
- Klienci,
- Sprawy,
- Zadania,
- Szablony,
- Odpowiedzi / Szkice,
- Aktywność,

mają wyglądać jak górne kafelki w zakładce Dziś: ta sama wysokość, szerokość, rytm siatki, białe tło, zaokrąglenie, typografia, układ `tekst po lewej -> liczba + ikona po prawej`.

## Co zmieniono

1. `src/components/StatShortcutCard.tsx`
   - wspólny komponent kafelka metryk dostał układ zgodny z Dziś,
   - ikona jest zawsze po prawej stronie liczby,
   - zachowane są stare markery testowe `STAGE16AK` i `STAGE16AL`.

2. `src/styles/closeflow-metric-tiles.css`
   - ustawiono jeden visual lock dla top kafelków,
   - siatki metryk mają 4 kolumny na desktopie, 2 na średnim ekranie i 1 na telefonie,
   - dodano obsługę widoku `TasksStable`, który ma własne hardcoded kafelki bez `StatShortcutCard`,
   - dodano fallback dla starszych kafelków `.metric`, `.stat-card`, `.summary-card`, `.dashboard-stat-card`.

3. `scripts/check-eliteflow-metric-tile-lock.cjs`
   - sprawdza, czy komponent, CSS i podstawowe strony nadal mają wymagane markery.

## Czego nie zmieniano

- logiki danych,
- API,
- routingu,
- treści merytorycznej kafelków,
- działania filtrów po kliknięciu kafelka,
- widoku Dziś jako źródła wzorca.

## Weryfikacja ręczna

Po wdrożeniu przejść kolejno:

1. `/today`
2. `/leads`
3. `/clients`
4. `/cases`
5. `/tasks`
6. `/templates`
7. `/response-templates`
8. `/ai-drafts`
9. `/activity`

Na każdym ekranie sprawdzić górne kafelki: szerokość, wysokość, kolorystykę, tekst, liczby i ikony.
