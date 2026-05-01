# A18 — rollback szerokich importów wizualnych i przywrócenie menu

## Cel

Naprawić regresję wizualną po etapie A14/A17, gdzie stare importy CSS Stage16/Stage17 oraz nowy Stage36 zostały podpięte globalnie w `src/index.css` i rozjechały wygląd wielu zakładek.

## Przyczyna

Pliki `visual-stage16-today-html-reset.css` i `visual-stage17-today-hard-1to1.css` były starymi referencjami/guardami wizualnymi. Samo ich doimportowanie do głównego CSS aktywowało agresywne reguły dla `Dziś` i części wspólnego shellu. Efekt: pionowe kafle, ginący tekst i niespójne style.

Dodatkowo linki nawigacji typu `Szkice AI`, `Powiadomienia`, `Pomoc` oraz `Admin AI` nie były obecne w głównym sidebarze.

## Zakres

- Usunięto z `src/index.css` importy:
  - `visual-stage16-today-html-reset.css`,
  - `visual-stage17-today-hard-1to1.css`,
  - `stage36-unified-light-pages.css`.
- Zmieniono guardy Stage16/Stage17 tak, aby nie wymuszały importu szerokiego CSS.
- Przywrócono grupy nawigacji:
  - `Start pracy`,
  - `Czas i obowiązki`,
  - `System`.
- Dodano w menu:
  - `Szkice AI`,
  - `Powiadomienia`,
  - `Pomoc`,
  - `Admin AI`.

## Nie zmieniono

- Nie cofnięto typów A14.
- Nie ruszono Supabase.
- Nie ruszono logiki biznesowej.
- Nie ruszono routingu.

## Walidacja

Skrypt uruchamia:

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run check:a14-business-types
npm.cmd run test:critical
npm.cmd run build
```
