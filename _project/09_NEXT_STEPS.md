

## Stage104 calendar loading performance manual measurement

Next: run browser manual check on /calendar: incognito load x3, Week/Month toggle x5, click multiple days, verify no multi-second blank state and no APP_ROUTE_RENDER_FAILED/ReferenceError/Missing lazy page export.
Backend range-limited fetch remains a later optimization candidate after measuring current local improvement.


## Stage104 V3 manual calendar performance check
- Open /calendar in incognito, reload x3, switch Week/Month x5, click several days, verify no APP_ROUTE_RENDER_FAILED/ReferenceError/Missing lazy page export.
- If visual and performance check pass, finalize with a narrow commit only for Stage104/Stage108 touched files.


## STAGE104_V4_CALENDAR_PERFORMANCE_GUARD_FIX

- Local-only guard repair for Calendar performance contract.
- Guard forbids selectedDate-driven DOM post-processing reruns but allows data-driven updates.
- No git add/commit/push in this package.

## STAGE107_TEMPLATES_DELETE_VISUAL_MANUAL_AFTER_PUSH

Po pushu użytkownik ma wykonać test ręczny z Obsidiana:
1. /templates: karta szablonu wygląda spójnie z resztą aplikacji.
2. Widoczny jest przycisk Usuń.
3. Klik Usuń pokazuje confirm.
4. Anulowanie zostawia szablon.
5. Usunięcie testowego szablonu usuwa go z listy.
6. Po refreshu szablon dalej nie wraca.

## STAGE107_TEMPLATES_POST_PUSH_USER_TESTS_RULE

Decyzja procesu Damiana:
- Kazda lokalna praca przed pushem musi miec zapisana sekcje: Testy do wykonania przez uzytkownika po pushu.
- Sekcja ma trafic do run reportu i notatki Obsidian dla danego etapu.
- Etap nie jest zamkniety, jesli po pushu nie ma jasnej checklisty recznej walidacji.

Testy do wykonania przez uzytkownika po pushu dla Stage107 Templates:
1. Wejsc na /templates.
2. Sprawdzic czy karta szablonu jest jasna i spojna z reszta aplikacji.
3. Sprawdzic czy widac przycisk Usun.
4. Kliknac Usun i anulowac potwierdzenie; szablon ma zostac.
5. Na testowym szablonie potwierdzic usuniecie.
6. Odświezyc strone i sprawdzic, czy szablon nadal nie wraca.

## STAGE107_TEMPLATES_MANUAL_TEST_AFTER_PUSH

Po pushu sprawdzić ręcznie na /templates:
1. Karta szablonu wygląda spójnie z resztą aplikacji.
2. Na karcie jest widoczny przycisk Usuń.
3. Kliknięcie Usuń pokazuje confirm.
4. Anulowanie confirmu zostawia szablon.
5. Testowy szablon da się usunąć po potwierdzeniu.
6. Po odświeżeniu strony usunięty szablon nie wraca.

## Stage107 templates post-push manual tests
1. Open /templates.
2. Verify readable card style and visible Usun action.
3. Cancel delete confirm and confirm the template remains.
4. Delete a test template with confirmation and refresh to verify persistence.


## STAGE108_RENDER_SMOKE_NEXT_2026_05_17

Po lokalnym OK i po pushu Damian ma sprawdzic:
1. /calendar w produkcji.
2. Panel wybranego dnia pokazuje realny wpis i pelne etykiety.
3. Konsola bez APP_ROUTE_RENDER_FAILED, ReferenceError, Missing lazy page export.
4. Przelaczenie tydzien/miesiac nie ukrywa wpisow.

Nastepny techniczny krok: rozszerzyc smoke guard na /clients, /leads i /today.


## STAGE108_V2_RENDER_SMOKE_NEXT_2026_05_17

Testy do wykonania przez uzytkownika po pushu:
1. Otworzyc /calendar w produkcji.
2. Panel wybranego dnia pokazuje realny wpis.
3. Typ jest pelny: Wydarzenie, nie Wyd.
4. Relacja nie jest pusta.
5. Akcje nie sa puste.
6. Konsola bez APP_ROUTE_RENDER_FAILED, ReferenceError, Missing lazy page export.

Nastepny krok: rozszerzyc render-smoke na /clients, /leads i /today.

## STAGE108_RENDER_SMOKE_NEXT_STEPS_V4

Status: LOCAL-ONLY.

Po pushu uzytkownik ma wykonac:
1. Wejsc na /calendar.
2. Otworzyc dzien z wpisami w panelu wybranego dnia.
3. Sprawdzic, czy tytul, pelny typ, godzina, status, relacja i akcje sa widoczne.
4. Sprawdzic konsole pod katem: ReferenceError, APP_ROUTE_RENDER_FAILED, Missing lazy page export.
5. Potwierdzic, ze UI nie pokazuje pustego wpisu ani niewidocznych akcji.

Nastepny krok techniczny: rozszerzyc render-smoke na /clients, /leads i /today.

## STAGE108_RENDER_SMOKE_NEXT_STEPS_V5

Po lokalnym przejściu Stage108 V5:
1. Nie pushować automatycznie.
2. Ręcznie sprawdzić /calendar i panel wybranego dnia.
3. Po pushu wykonać testy użytkownika:
   - otworzyć /calendar,
   - kliknąć kilka dni,
   - sprawdzić, czy wpisy mają tytuł, pełny typ, status, relację i akcje,
   - sprawdzić konsolę pod APP_ROUTE_RENDER_FAILED, ReferenceError, Missing lazy page export.
4. Następny smoke rozszerzyć na /clients, /leads, /today.

## Stage108 V8 next steps
- After push: manually validate /calendar selected-day entry content and console errors.
- Extend render-smoke approach to /clients, /leads and /today.
- P0 production blocker: switch Stripe from sandbox/test mode to live mode before real payments.

