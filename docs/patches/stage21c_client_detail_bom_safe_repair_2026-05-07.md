# Stage21C — ClientDetail admin feedback BOM-safe repair

## Cel

Naprawa paczki Stage21/Stage21B po dwóch problemach kodowania:

1. poprzednie czyszczenie tekstu nie usunęło polskiego opisu z `ClientDetail.tsx`,
2. `package.json` lokalnie zawierał BOM, przez co `JSON.parse()` w Node.js zatrzymał skrypt.

## Zakres

- `src/pages/ClientDetail.tsx`
- `src/styles/visual-stage12-client-detail-vnext.css`
- `package.json`
- `scripts/check-stage21-client-detail-admin-feedback-layout.cjs`
- `scripts/repair-stage21c-client-detail-bom-safe.cjs`

## Zmiany

- usunięto opis: `Klient ma przypięte sprawy i bieżący kontekst pracy.`
- ukryto sekcje finansowe wskazane w admin feedbacku,
- ukryto `Centrum operacyjne klienta`,
- ukryto lewy kafel `Najbliższa zaplanowana akcja`,
- ustawiono profil klienta i `Ostatnie ruchy` wysoko w lewej kolumnie,
- dopisano guard,
- `package.json` jest zapisywany jako UTF-8 bez BOM.

## Weryfikacja

Uruchamiany jest:

```bash
node scripts/check-stage21-client-detail-admin-feedback-layout.cjs
```

## Uwaga

To jest poprawka layoutowa. Jeżeli po wdrożeniu CSS dalej nie da układu 1:1 pod kafelkami szybkich akcji, kolejnym krokiem musi być refactor JSX w `ClientDetail.tsx`, a nie kolejne łatanie samym CSS.
