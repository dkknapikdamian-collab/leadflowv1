# STAGE16S - Today AI header comment syntax repair - 2026-05-06

Cel: naprawić build blocker w `src/components/TodayAiAssistant.tsx`, gdzie poprzednie statyczne markery AI zostawiły samotne `*/` przed importem.

Zakres:
- czyści wszystko przed pierwszym `import`,
- zapisuje legalny blok komentarza z markerami kontraktów statycznych,
- nie zmienia runtime logiki asystenta,
- odpala `npm run build`,
- opcjonalnie odpala focused collector.

NO_COMMIT=true
NO_PUSH=true
