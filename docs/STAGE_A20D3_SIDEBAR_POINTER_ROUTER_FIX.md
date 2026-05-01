# A20d3 - sidebar pointer router fix

## Cel

Domknac blad, w ktorym ekran Dzis blokowal pierwsza grupe nawigacji w lewym menu. CSS z A20c nie wystarczyl, wiec poprawka idzie w shellu aplikacji.

## Zmiana

- `Layout.tsx` dostaje `useNavigate`.
- Root shell dostaje `onPointerDownCapture`.
- Handler sprawdza po wspolrzednych, czy klik byl w realnym przycisku sidebaru.
- Jesli tak, wykonuje `navigate(path)` zanim warstwa z ekranu Dzis zdazy przechwycic klik.
- Menu boczne dostaje jednolity odcien nieaktywnych zakladek, w tym Szkice AI.

## Nie zmieniano

- API.
- Supabase.
- Statusow domenowych.
- Notatek glosowych.
- Flow lead -> klient -> sprawa.

## Reczne sprawdzenie

1. Wejdz w Dzis.
2. Bez F12 kliknij Leady.
3. Wroc w Dzis.
4. Kliknij Klienci.
5. Wroc w Dzis.
6. Kliknij Sprawy.
7. Wroc w Dzis.
8. Kliknij Szkice AI.
9. Sprawdz, czy Zadania nadal dzialaja.

## Kryterium zakonczenia

Nawigacja z Dzis do pierwszej grupy menu dziala bez otwierania DevTools i bez wchodzenia najpierw w Zadania.
