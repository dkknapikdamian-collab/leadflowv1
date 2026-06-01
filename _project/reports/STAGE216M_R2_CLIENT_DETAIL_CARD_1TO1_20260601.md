# STAGE216M-R2 - ClientDetail karta 1:1 do LeadDetail

## Cel

Naprawić styl kart w ClientDetail po Stage216M-R1. Damian wskazał, że układ jest lepszy, ale trzeba zacząć od dopasowania karty 1:1 do LeadDetail.

## Fakty

- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- R1 grid lock został wdrożony i wypchnięty.
- Aktualny problem: header/karta klienta i karta danych klienta nadal wyglądają jak osobny wzorzec, nie jak karta leada.

## Decyzje Damiana

- Poprawiamy kafelek po kafelku.
- Najpierw karta/styl 1:1.
- Nazewnictwo, ikonki i kolory później.

## Zakres

- CSS-only override:
  - header ClientDetail jak header LeadDetail,
  - `Dane klienta` jak `Dane leada`,
  - edit button w karcie jako mały outline w prawym górnym rogu,
  - ukrycie ikon w wierszach danych klienta,
  - usunięcie stylu profilowego/avatara z karty danych.

## Czego nie ruszano

- Supabase
- API
- płatności
- sprawy
- dane klientów
- logika notatek
- routing

## Testy automatyczne

- `node tests/stage216m-r2-client-detail-card-1to1-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Test ręczny

Porównać `/clients/:id` i `/leads/:id` na tym samym viewportcie:

1. Header klienta powinien mieć rytm karty leada.
2. Karta `Dane klienta` powinna mieć styl jak `Dane leada`.
3. Nie powinno być avatarowego/profilowego wyglądu w karcie danych.
4. Niebieski pełny przycisk `Edytuj dane` w karcie nie powinien dominować.

## Następny krok

Po akceptacji karty przejść do kolejnych kafelków: top-kafle, notatki, sprawy, prawa szyna.
