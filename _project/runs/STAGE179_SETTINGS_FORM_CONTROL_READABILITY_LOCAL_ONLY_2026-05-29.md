# STAGE179 Settings form control readability - local only

Data: 2026-05-29
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Tryb: lokalnie, bez commita, bez pusha

## FAKTY

- Damian wskazał, że pola „Typ przypomnienia Google” i „Ile minut wcześniej” są nieczytelne na aktualnym tle ustawień.
- Problem dotyczy kontrastu tekstu/form controls w `/settings`, szczególnie w sekcji `data-google-calendar-reminder-ui="stage06"`.
- Etap dodaje osobny plik CSS importowany tylko przez `Settings.tsx`.
- Zakres zmiany: czytelność pól `input`, `select`, `textarea`, `option`, `disabled`, `placeholder`, `focus` w obrębie `.settings-vnext-page`.

## DECYZJE DAMIANA

- Pracujemy tylko lokalnie.
- Nie robimy pusha do repo.
- Poprawka ma dopasować kontrast do innych stylów wizualnych aplikacji.

## HIPOTEZY AI

- Źródłem problemu jest konflikt globalnego/skórkowego stylu ciemnych kontrolek z jasną kartą ustawień.
- Najbezpieczniejsze rozwiązanie to lokalny, scoped CSS dla Settings, zamiast zmiany globalnych komponentów `Input` albo całego theme systemu.

## ZAKRES

Zmienione/przygotowane lokalnie:

- `src/pages/Settings.tsx` - dodany import CSS.
- `src/styles/closeflow-settings-form-control-readability-stage179.css` - nowy scoped styl czytelności pól formularza.
- `tests/stage179-settings-form-control-readability-contract.test.cjs` - guard statyczny.
- `_project/runs/STAGE179_SETTINGS_FORM_CONTROL_READABILITY_LOCAL_ONLY_2026-05-29.md` - raport etapu.

## TESTY AUTOMATYCZNE

Po apply uruchomić:

```powershell
node --test tests/stage179-settings-form-control-readability-contract.test.cjs
npm run build
```

## TEST RĘCZNY

1. Uruchom lokalnie `npm run dev`.
2. Wejdź w `/settings`.
3. Sprawdź sekcję „Przypomnienia Google Calendar”.
4. Pole „Typ przypomnienia Google” ma mieć jasne tło i ciemny, czytelny tekst.
5. Lista opcji selecta ma być czytelna po rozwinięciu.
6. Pole „Ile minut wcześniej” ma być czytelne również gdy jest disabled przy opcji `default`.
7. Focus po kliknięciu ma być widoczny, ale nie krzyczeć jak neon w piwnicy.

## CZEGO NIE RUSZANO

- Logika Google Calendar.
- Preferencje przypomnień.
- API.
- Supabase.
- Routing.
- Repo GitHub, commit, push.

## NASTĘPNY KROK

Po potwierdzeniu ręcznym można dorzucić tę poprawkę do większej paczki lokalnych UI fixów i dopiero wtedy zrobić zbiorczy push.
