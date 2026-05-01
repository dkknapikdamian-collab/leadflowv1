# P0 — naprawa wycieku GEMINI_API_KEY z bundla klienta

## Co zmienia ten patch

- usuwa ekspozycję `process.env.GEMINI_API_KEY` z `vite.config.ts`,
- blokuje użycie Gemini i `@google/genai` w kodzie klienta `src/**`, z wyjątkiem `src/server/**`,
- dodaje skrypt `verify:security:gemini-client`,
- sprawdza po buildzie, czy `dist` nie zawiera nazwy sekretu, aliasu sekretu, providera Gemini ani realnej wartości `GEMINI_API_KEY`, jeśli jest ustawiona w środowisku,
- aktualizuje `.env.example` i `README.md`, żeby klucz Gemini był opisany tylko jako server env.

## Zakres celowo ograniczony

- nie przebudowuje całego AI,
- nie usuwa UI asystenta,
- nie przenosi wszystkich przepływów AI na nową architekturę, jeśli nie jest to konieczne do usunięcia wycieku,
- nie usuwa `@google/genai`, jeżeli jest używane po stronie backendowej.

## Weryfikacja

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run verify:security:gemini-client
```

## Kryterium zakończenia

Build frontu nie zawiera żadnego sekretu Gemini ani nazwy sekretu. Gemini może działać tylko przez backend/API.
