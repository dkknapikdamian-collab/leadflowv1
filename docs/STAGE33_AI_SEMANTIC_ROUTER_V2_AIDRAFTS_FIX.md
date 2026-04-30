# Stage33 v2 - AI semantic router + AI Drafts contrast fix

## Cel

Naprawić nieudany Stage33 i dodać poprawkę czytelności wygenerowanego szkicu w zakładce Szkice AI.

## Dlaczego v2

Poprzedni skrypt Stage33 szukał granic funkcji `askTodayAiAssistant` zbyt kruchym sposobem. Przy aktualnym stanie pliku nie znalazł końca funkcji i przerwał wdrożenie przed zmianami w kodzie.

Stage33 v2 używa skanowania nawiasów klamrowych, więc potrafi bezpiecznie podmienić funkcję nawet po wcześniejszych etapach i zmianach w pliku.

## Zakres

### AI assistant

- modelowy router semantyczny jest pierwszą ścieżką pytań o aplikację,
- lokalny Stage32 zostaje jako fallback, nie jako główny mózg,
- backend dostaje mapę aplikacji oraz kompaktowy snapshot danych,
- odpowiedź wraca w kontrakcie zgodnym z UI asystenta,
- zapis rekordów dalej nie jest automatyczny, komendy zapisu obsługują Szkice AI.

### Szkice AI

- wygenerowany tekst szkicu ma ciemny tekst na jasnym tle,
- pola edycji i zatwierdzania szkicu mają wymuszony kontrast,
- placeholdery są widoczne,
- fix działa także na mobile.

## Nie zmienia

- routingu,
- modelu danych,
- Supabase API,
- logiki zatwierdzania szkiców,
- reguły, że AI nie tworzy finalnych rekordów bez zatwierdzenia.

## Testy

- `node scripts/check-stage33-ai-semantic-router-v2-aidrafts-fix.cjs`
- `node scripts/check-polish-mojibake.cjs`
- `npm.cmd run lint`
- `npm.cmd run build`
