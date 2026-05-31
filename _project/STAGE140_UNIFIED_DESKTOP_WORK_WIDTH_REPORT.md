# STAGE140 Unified Desktop Work Width — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop width source truth / wszystkie główne zakładki

## Cel

Ustawić jedną wspólną szerokość roboczą dla każdej głównej zakładki. Wzorzec: zakładka `Dziś`, której content na screenie kończy się mniej więcej pod przyciskiem `+ Zadanie` w topbarze.

## FAKTY

- Damian wskazał, że po Stage139 szerokość musi być spójna we wszystkich zakładkach.
- Nie chodzi już o pełne rozciąganie do prawej krawędzi, tylko o stabilną szerokość roboczą.
- `TodayStable.tsx` ma root:
  `main className="mx-auto flex w-full max-w-7xl ..."` oraz `data-p0-today-stable-rebuild="true"`.
- Inne route’y mają własne rooty: `.main-clients-html`, `.main-leads-html`, `.main-cases-html`, `.main-calendar-html`, `.main-templates-html`, activity shell itd.
- Jeśli każdy route ma własny width/max-width, UI przeskakuje między zakładkami.

## Decyzja

Dodać jeden CSS source truth:

```text
src/styles/closeflow-unified-desktop-work-width-stage140.css
```

Parametry:

```css
--cf140-unified-work-width: 1440px;
--cf140-wide-work-width: 1480px;
--cf140-left-gutter: 8px;
--cf140-right-safe-gutter: 16px;
--cf140-right-rail-width: 360px;
```

## Zasada

Każda główna zakładka ma:
- ten sam lewy start,
- tę samą szerokość,
- ten sam prawy stop,
- zero skakania szerokości między route’ami.

## Zakładki objęte

- `/`
- `/leads`
- `/clients`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`

## Testy

```powershell
node scripts/check-stage140-unified-desktop-work-width.cjs
npm.cmd run build
```

## Test ręczny

Na desktopie:
1. Wejdź w `/`.
2. Zobacz prawą krawędź głównego contentu względem przycisku `+ Zadanie`.
3. Przejdź po kolei:
   - `/leads`
   - `/clients`
   - `/cases`
   - `/tasks`
   - `/calendar`
   - `/templates`
   - `/response-templates`
   - `/activity`
4. Prawa krawędź contentu ma być w tej samej linii.

## Czego nie ruszano

- mobile/tablet
- dane
- routing
- Supabase/Auth/Google
- Stripe
- AI
- przyciski
- logika list
- Vercel deploy
- push

## Następny krok

Jeśli content kończy się za wcześnie, zwiększyć tylko:
`--cf140-unified-work-width`.

Jeśli kończy się za daleko, zmniejszyć tylko:
`--cf140-unified-work-width`.

Nie robić osobnych widthów dla zakładek.
