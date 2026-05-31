# STAGE139 Unified Desktop Canvas and Right Stretch — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop shell / tło + rozciągnięcie w prawo

## Cel

Naprawić dwa problemy po Stage138:

1. widoczna różnica kolorów/pas tła między sidebarem a główną treścią,
2. główne okno nadal nie wykorzystuje całej przestrzeni po prawej.

## FAKTY

- Stage137 poszerzył układ.
- Stage138 przesunął content bliżej panelu bocznego.
- Damian pokazał screen, na którym widać pionowy pas innego tła oraz wciąż niewykorzystany prawy obszar.
- Problem dotyczy canvasu desktopowego, a nie jednego kafelka.

## DECYZJA

Dodać Stage139:

```text
src/styles/closeflow-unified-desktop-canvas-stage139.css
```

Stage139:
- ustawia jeden desktopowy kolor canvasu: `#f3f6fb`,
- ustawia go na `html`, `body`, `#root`, `.app`, `main`, `.view.active`, `[data-shell-content]`,
- usuwa ewentualne stare pseudo-elementy tła w shellu,
- rozciąga content w prawo przez usunięcie max-width,
- zostawia lewy margines przy sidebarze `8px`,
- zostawia prawy margines `10px`,
- działa tylko na desktopie.

## Parametry

```css
--cf139-canvas-bg: #f3f6fb;
--cf139-sidebar-width: 240px;
--cf139-left-gutter: 8px;
--cf139-right-gutter: 10px;
--cf139-right-rail-width: 360px;
```

## Testy

```powershell
node scripts/check-stage139-unified-desktop-canvas.cjs
npm.cmd run build
```

## Test ręczny

Sprawdzić:
- `/clients`
- `/leads`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`

Na `/clients`:
- nie powinno być pionowego pasa innego tła między sidebarem a contentem,
- lista i prawy rail powinny sięgać dużo bliżej prawej krawędzi obszaru roboczego.

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

Jeśli po Stage139 content jest za blisko sidebara, zmienić `--cf139-left-gutter` z `8px` na `14px`. Jeśli nadal za wąski po prawej, zmienić `--cf139-right-gutter` z `10px` na `4px`.
