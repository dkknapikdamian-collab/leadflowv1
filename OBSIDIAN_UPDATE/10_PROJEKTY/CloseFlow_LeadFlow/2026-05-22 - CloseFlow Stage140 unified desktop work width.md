# CloseFlow Stage140 — Unified Desktop Work Width

Data: 2026-05-22  
Status: przygotowano ZIP  
Typ: UI desktop width source truth / wszystkie główne zakładki

## FAKTY

- Damian wskazał zakładkę `Dziś` jako przykład właściwej szerokości.
- Prawa krawędź contentu ma dochodzić mniej więcej pod akcję topbara `+ Zadanie`.
- Ta sama szerokość ma obowiązywać we wszystkich zakładkach.
- Nie może być przeskakiwania szerokości między route’ami.

## DECYZJA

Dodać:

```text
src/styles/closeflow-unified-desktop-work-width-stage140.css
```

Główna zmienna:

```css
--cf140-unified-work-width: 1440px;
```

## ZAKRES

- `/`
- `/leads`
- `/clients`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`

## TESTY

```powershell
node scripts/check-stage140-unified-desktop-work-width.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić wizualnie, czy prawa krawędź contentu jest taka sama we wszystkich głównych widokach.
