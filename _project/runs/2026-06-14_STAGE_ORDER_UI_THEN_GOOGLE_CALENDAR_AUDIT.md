# 2026-06-14 - Stage order decision: UI closeout, then Google Calendar audit

Data: 2026-06-14 12:05 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical name: CloseFlow / LeadFlow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
Status: ACTIVE_DECISION / NEXT_STAGE_QUEUE_UPDATE

## Scan-first source check

Przeczytano:
- `AGENTS.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/07_NEXT_STEPS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/10_PROJECT_TIMELINE.md`

## Decyzja Damiana

Po aktualnym porzadkowaniu UI i sprawdzaniu operacyjnych podpiec detail views nie przechodzimy od razu do nowych funkcji sprzedazowych.

Kolejnosc pracy zostaje ustawiona tak:

1. Domknac obecne porzadkowanie UI i funkcji operacyjnych:
   - LeadDetail: STAGE231G R3/R4/R4D statusy, guardy, manualne potwierdzenia.
   - CaseDetail: STAGE231H R1/R1B/R1C/R1C2 statusy, guardy, manualne potwierdzenia.
   - Wpisy w `_project`, test history i Obsidian payload musza mowic PASS albo PASS_WITH_EXPLICIT_RISK, nie DO_TEST_AND_PUSH bez dalszego kroku.

2. Nastepny realny etap po tym porzadkowaniu:

```txt
STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT
```

3. Dopiero po audycie i ewentualnej naprawie Google Calendar robimy szczegolowy audyt kolejnych mozliwych wdrozen i decydujemy, co nastepne w aplikacji.

## Dlaczego Google Calendar wraca jako kolejny etap

Błąd Google Calendar nie zostal jeszcze potwierdzony jako zamkniety manualnie dla wielu uzytkownikow.

Do sprawdzenia / naprawy:
- czy kazdy uzytkownik ma wlasne polaczenie `google_calendar_connections`,
- czy task/event tworzone przez drugie konto dostaja poprawne ownership fields,
- czy outbound sync nie pomija nowych rekordow przez `personalScopeSkipped`,
- czy zadanie/wydarzenie z drugiego konta trafia do Google Calendar drugiego konta, a nie Damiana,
- czy UI Settings pokazuje realny status: connected / user_not_connected / skipped / created / failed.

## Status etapu Google Calendar

Status: NEXT_AFTER_UI_OPERATIONAL_CLOSEOUT / DO_VERIFY_AND_REPAIR

Zakres planowanego etapu:
- scan-first Google Calendar handlerow i route task/event,
- SQL diagnostic dla `google_calendar_connections` i `work_items`,
- guard multi-user ownership,
- test drugiego konta,
- manualny test syncu,
- wpis do test history,
- Obsidian payload.

## Zakres, ktorego nie ruszac w tym wpisie

- Nie zmieniano runtime kodu.
- Nie ruszano SQL.
- Nie tworzono nowej funkcji.
- Nie zmieniano Google Calendar handlerow w tym commicie.

## Nastepny krok wykonawczy

Po zamknieciu UI/detail mapping:

```txt
Wdrozyc i zweryfikowac STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT.
```

## Audyt ryzyk

- Jesli Google Calendar zostanie odlozony bez testu multi-user, aplikacja moze dalej dzialac tylko na koncie Damiana.
- Jesli task/event nie maja ownership fields, outbound sync moze pomijac rekordy uzytkownika.
- Jesli UI Settings pokazuje tylko ogolne connected/disabled, uzytkownik nie zrozumie, ze musi polaczyc wlasne konto Google.
- Jesli po Google Calendar przejdziemy od razu do nowych funkcji, utrwalimy niepewny fundament integracyjny.

## Wymagane dokumenty przy wlasciwym etapie

Przy STAGE231F_R2 trzeba zaktualizowac:
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`,
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`,
- `_project/06_GUARDS_AND_TESTS.md`,
- `_project/08_CHANGELOG_AI.md`,
- `_project/10_PROJECT_TIMELINE.md`,
- `_project/13_TEST_HISTORY.md`,
- `_project/runs/STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT.md`,
- `_project/obsidian_updates/[data]_STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT.md`.
