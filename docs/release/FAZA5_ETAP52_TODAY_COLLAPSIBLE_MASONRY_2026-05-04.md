# FAZA 5 — Etap 5.2 — Today collapsible masonry / niezależna wysokość sekcji

Data: 2026-05-04
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Naprawić UX ekranu `Dziś`, gdzie sekcje/kafelki powinny:

1. dać się zwijać i rozwijać,
2. zachować swój własny rozmiar zależny od liczby wpisów,
3. nie rozciągać się tylko dlatego, że sąsiednia sekcja w tym samym rzędzie ma dużo więcej notatek/zadań.

## Co zmieniono

- Dodano marker etapu `FAZA5_ETAP52_TODAY_COLLAPSIBLE_MASONRY`.
- Dodano CSS `src/styles/today-collapsible-masonry.css`.
- `TileCard` na ekranie `Dziś` dostał jawne klasy i atrybuty:
  - `today-independent-section`,
  - `self-start`,
  - `h-fit`,
  - `data-today-collapsible-section="true"`,
  - `data-today-tile-body="true"`.
- CSS wymusza `align-self: start`, `height: fit-content`, `min-height: 0` dla kafli i `align-items: start` dla siatek z kaflami Today.
- Dodano guard `scripts/check-faza5-etap52-today-collapsible-masonry.cjs`.
- Dodano test `tests/faza5-etap52-today-collapsible-masonry.test.cjs`.
- Dodano skrypt npm `check:faza5-etap52-today-collapsible-masonry`.

## Czego nie zmieniano

- Nie ruszano API.
- Nie ruszano Supabase.
- Nie zmieniano logiki danych Today.
- Nie zmieniano kolejności sekcji.
- Nie przebudowywano całego UI.

## Weryfikacja

Po wdrożeniu uruchomić:

```powershell
npm.cmd run check:faza5-etap52-today-collapsible-masonry
npm.cmd run build
```

## Test ręczny

1. Wejdź w `Dziś`.
2. Znajdź układ, gdzie jedna sekcja ma dużo wpisów, a sąsiednia ma 0-1 wpis.
3. Sprawdź, czy krótka sekcja nie rozciąga się do wysokości długiej sekcji.
4. Zwiń i rozwiń kilka sekcji.
5. Odśwież stronę i sprawdź, czy ekran nie traci działania.

## Kryterium zakończenia

Sekcje `Dziś` działają jak niezależne kafle: można je zwijać, a ich wysokość wynika z ich własnej zawartości, nie z wysokości sąsiada w gridzie.
