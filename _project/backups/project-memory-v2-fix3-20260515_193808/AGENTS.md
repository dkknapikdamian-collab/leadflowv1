# AGENTS.md - CloseFlow lead app

## Projekt

CloseFlow / Lead app to aplikacja operacyjna do leadów, klientów, spraw, zadań, kalendarza, follow-upów, szkiców AI i codziennego pilnowania ruchu sprzedażowo-operacyjnego.

Repo: `dkknapikdamian-collab/leadflowv1`
Branch roboczy: `dev-rollout-freeze`
Lokalnie: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

## Obowiązkowo przed pracą

1. Przeczytaj ten plik.
2. Przeczytaj cały folder `_project/`.
3. Sprawdź `git status --short`.
4. Sprawdź aktualny branch.
5. Nie zakładaj, że czat jest źródłem prawdy, jeśli repo mówi coś innego.

## Czego nie wolno robić bez wyraźnego zakresu

- Nie zmieniać UI.
- Nie zmieniać routingu.
- Nie zmieniać logiki produktu.
- Nie robić szerokiego refaktoru.
- Nie usuwać działających funkcji.
- Nie tworzyć nowych gałęzi.
- Nie dopisywać hipotez jako faktów.
- Nie wpychać sekretów ani envów do repo.

## Główne zasady produktu

- CloseFlow nie jest zwykłym CRM-em.
- `Dziś` ma być centrum decyzji.
- Lead aktywny jest miejscem pracy sprzedażowej.
- Sprawa jest miejscem pracy operacyjnej po pozyskaniu tematu.
- Klient jest rekordem w tle, który łączy wiele tematów.
- Główna logika ma opierać się na najbliższej zaplanowanej akcji z zadań/wydarzeń, nie na osobnym tekstowym polu `Następny krok`, chyba że aktualny kod wymaga legacy compatibility.
- AI tworzy szkice i odpowiada na podstawie danych aplikacji, ale finalne rekordy wymagają potwierdzenia użytkownika.

## Po każdej sensownej pracy aktualizuj

- `_project/03_CURRENT_STAGE.md`, jeśli etap się zmienił,
- `_project/04_DECISIONS.md`, jeśli zapadła decyzja,
- `_project/05_MANUAL_TESTS.md`, jeśli doszedł test ręczny,
- `_project/06_GUARDS_AND_TESTS.md`, jeśli doszedł lub zmienił się guard,
- `_project/07_NEXT_STEPS.md`, zawsze po etapie,
- `_project/08_CHANGELOG_AI.md`, zawsze po etapie,
- `_project/11_USER_CONFIRMED_TESTS.md`, jeśli Damian coś potwierdził,
- `_project/runs/`, zawsze po pracy AI.

## Obsidian

Centralny vault:
`C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT`

Sekcja projektu:
`10_PROJEKTY\CloseFlow_Lead_App`

Jeśli zmiana dotyczy kierunku, decyzji, testów, potwierdzeń, next steps lub raportów, zaktualizuj też Obsidiana.

## Testy po pracy

Uruchom dostępne:

```powershell
node scripts/check-project-memory.cjs
npm run check:project-memory
npm run typecheck
npm run build
npm run verify:closeflow:quiet
```

Jeśli komenda nie istnieje, zapisz to w raporcie. Nie udawaj, że przeszła.
