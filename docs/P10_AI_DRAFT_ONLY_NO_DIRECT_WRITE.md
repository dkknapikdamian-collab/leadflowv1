# P10 — AI tylko przez szkice

## Cel

AI nie może sugerować ani wykonywać bezpośredniego zapisu finalnych rekordów.

> AI przygotowuje szkic. Ty zatwierdzasz zapis.

## Co zmieniono

- Usunięto z `TodayAiAssistant.tsx` przycisk `Jasne rekordy od razu`.
- Usunięto puste badge.
- Zmieniono copy bramki bezpieczeństwa na `AI przygotowuje szkic. Ty zatwierdzasz zapis.`.
- Usunięto klientowy branch finalnego zapisu lead/task/event.
- Komendy zapisu typu lead/task/event/note tworzą szkic AI.
- Pytania bez komendy zapisu zostają ścieżką odczytu danych aplikacji.
- `ai-direct-write-guard.ts` jest twardo wyłączony przez `AI_DIRECT_WRITE_ENABLED = false`.
- `ai-assistant.ts` normalizuje odpowiedzi do `noAutoWrite: true`.

## Nie zmieniono

- Nie usunięto asystenta.
- Nie usunięto dyktowania.
- Nie dodano obowiązkowego drogiego LLM.
- Nie ruszano zatwierdzania szkiców przez użytkownika.

## Ręczne testy

1. `Zapisz zadanie jutro o 10 oddzwonić do klienta` → szkic AI typu `task`, bez finalnego zadania.
2. `Co mam jutro?` → odczyt danych aplikacji, bez szkicu i bez finalnego zapisu.
3. UI nie pokazuje `Jasne rekordy od razu`.
