<!-- STAGE231B0_R7_CASE_ARCHIVE_RESTORE_NAVIGATION -->
# 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md

<!-- STAGE228F_R2_RUNTIME_COPY_CLEANUP -->
## 2026-06-07 18:55 Europe/Warsaw - STAGE228F R2 risk sweep

- R1 pokazal klase bledu: kruche regexy PowerShell z polskimi znakami moga zatrzymac apply przed zmianami.
- R2 ogranicza PowerShell do runnera i przenosi patchowanie do Node.js.
- Ryzyko regresji UI: usuniecie zbyt szerokie mogloby zabrac filtr Historia; guard pilnuje, ze filtr zostaje.
- Ryzyko biznesowe: usuniecie opisow moze zmniejszyc kontekst, ale Damian zdecydowal: bez dopiskow, tylko najpotrzebniejsze.

<!-- STAGE228G_RISK_AUDIT -->
## 2026-06-07 19:05 Europe/Warsaw - STAGE228G risk audit

- Potencjalne ryzyko: label/key based tone resolver może źle dobrać kolor przy nowych nazwach. Mitigacja: SimpleFilterItem obsługuje explicit tone.
- Potencjalne ryzyko: import CSS w OperatorSideCard obejmuje wszystkie operator rail cards. To celowe, ale trzeba sprawdzić /leads, /clients i /cases.
- Potencjalne ryzyko: usunięcie helper sentence w case row zmniejsza ilość tekstu diagnostycznego na liście. Szczegóły nadal zostają w status pills i detailu sprawy.
- Test ręczny: /cases desktop i narrow width, potem /leads oraz /clients right rail smoke.

<!-- STAGE228H_R3_RISKS -->
## 2026-06-07 19:45 Europe/Warsaw - STAGE228H R3 risks
- Ryzyko: wcześniejsze etapy F/G są nadal lokalne i modyfikują te same obszary UI; przed commitem potrzebny zbiorczy smoke /leads /clients /cases /dev/funnel.
- Ryzyko: prebuild miał stary guard wymagający skasowanego copy; R3 aktualizuje guard, bo inaczej build byłby sprzeczny z decyzją UI cleanup.
- Ryzyko: /dev/funnel bez logowania używać tylko do podglądu dev; /funnel produkcyjnie zostaje chroniony.
<!-- /STAGE228H_R3_RISKS -->

<!-- STAGE228R1_RISK -->
## 2026-06-08 - Stage228R1 risk audit
- Ryzyko: lokalne stare pliki Stage228 mogą nadal istnieć, ale nie powinny być aktywnie importowane.
- Ryzyko: /activity, /ai-drafts, /notifications, /help, /settings, /billing mają inne klasy i wymagają osobnego etapu.
- Ryzyko: /funnel ma osobny bug kodowania znaków i nie należy mieszać go z rail source truth.
<!-- /STAGE228R1_RISK -->

<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_RISK_START -->
## 2026-06-09 - STAGE230C Phone dictation duplicate-words audit

Ryzyka:
- Trace może zawierać końcówkę realnej treści klienta; dlatego pozostaje tylko lokalnym stanem React i UI.
- Automatyczna deduplikacja bez dowodu może usuwać poprawne powtórzenia użytkownika.
- Problem może być mobile-only i nie odtworzyć się na desktopie.
- IME/composition może działać inaczej w Android Chrome, Samsung Keyboard, Gboard i iOS Safari.
- Jeśli problem jest po stronie klawiatury/browsera, aplikacja może tylko ograniczyć skutki albo ostrzec użytkownika w osobnym etapie.
<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_RISK_END -->

<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_RISK_START -->
## 2026-06-09 - STAGE230C-R2 Voice debug visibility/readability hotfix

Ryzyka:
- Błąd dublowania nadal istnieje; R2 tylko umożliwia zebranie trace.
- Jeżeli użytkownik nie widzi przycisku kopiowania, Stage230C nie daje dowodu.
- Globalne style mogą nadpisywać kolory textarea/buttonów; R2 dodaje scoped `!important` tylko dla quick capture/debug.
- Deduplikacja bez trace nadal zakazana.
<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_RISK_END -->

<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_RISK_START -->
## 2026-06-09 - STAGE230C R6 voice debug panel rewrite

Ryzyka:
- R2/R4/R5 zostawiły lokalnie częściowy stan, więc R6 celowo nadpisuje cały blok panelu zamiast łatać pojedynczą klamrę.
- Nadal wymagany ręczny test telefonu: widoczność tekstu, widoczność Kopiuj trace i realny trace duplikacji.
- Problem dublowania tekstu nie jest naprawiany w tym etapie.
<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_RISK_END -->

<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_RISK_START -->
## 2026-06-09 - STAGE230C R8 mass panel region rewrite

Ryzyka:
- Wielokrotne lokalne hotfixy R2-R7 pokazaly, ze punktowe patche JSX sa zbyt kruche.
- Dalsze poprawki panelu powinny podmieniac wyznaczony region albo uzywac AST/prettier/build before package.
- Manualny test telefonu nadal jest wymagany przed push.
<!-- STAGE230C_R8_MASS_PANEL_REGION_REWRITE_RISK_END -->

<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_RISK_START -->
## 2026-06-09 - STAGE230C R10 quick capture visual source truth

Ryzyka:
- Globalne style mogą nadal nadpisywać część komponentów, dlatego R10 używa scoped selektorów i !important tylko w obrębie quick capture.
- Visual source truth jest obecnie w CSS formularzy Stage20; długofalowo warto wydzielić centralne tokeny formularzy, zamiast rozpraszać klasy.
- Dublowanie dyktowania jest oznaczone jako problem konkretnego telefonu, nie aplikacji, dopóki nie pojawi się reprodukcja na innym urządzeniu.
<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_RISK_END -->

<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_RISK_START -->
## 2026-06-09 - STAGE230C R12 R2 guard global marker compatibility

Ryzyka:
- Zbyt kruche guardy JSX potrafią blokować dobre poprawki UI; R12 usuwa to ryzyko dla quick capture.
- Guard global-marker jest mniej precyzyjny niż parser AST, ale bezpieczniejszy niż błędne wycinanie sekcji po className.
- Docelowo warto wydzielić komponent/form source truth, aby quick capture nie wymagał lokalnych wyjątków CSS.
<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_RISK_END -->

<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_RISK_START -->
## 2026-06-09 - STAGE230C R15 guard split + visual source truth

Ryzyka:
- Dotychczasowe R2-R14 pokazaly zbyt kruche guardy oparte o dokładny JSX.
- Dalsze guardy UI powinny sprawdzać stabilne data-markery i source truth, nie pełny string className.
- Test telefonu nadal wymagany dla kontrastu: tekst, placeholder, disabled button, przyciski diagnostyczne.
<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_RISK_END -->

<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_RISK_START -->
## 2026-06-09 - STAGE231A Google auth entry consistency

Ryzyka:
- Obecny OAuth bootstrap oznacza publiczny trial dla nowych kont Google, dopóki STAGE231D nie zdecyduje inaczej.
- Settings nadal ma akcje bezpieczeństwa na Firebase Auth i wymaga migracji do Supabase Auth w STAGE231B.
- Maile auth i redirect URL wymagają osobnej QA w STAGE231C.
<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_RISK_END -->

## STAGE231D_RISK_AUDIT

- Google OAuth may still create raw Supabase auth.users when public signups are enabled. Stage231D blocks application bootstrap for login intent without an existing profile.
- Email/password requires Supabase e-mail confirmation when configured; this is expected.
- Invite-only should be a later optional mode, not default public SaaS behavior.
- Supabase auth trigger functions are no-op after STAGE231C; api/me is the source of truth for app profile/workspace bootstrap.

## STAGE231D_R5_RISK_AUDIT

- A Google account that already received a profile/workspace from the earlier broken flow is now technically registered in CloseFlow and may still log in. Test the blocker with a truly fresh Google account or delete the earlier test profile/workspace deliberately.
- Missing authIntent is now blocked only for Google OAuth without a profile, not for e-mail/password, to avoid breaking e-mail confirmation bootstrap after the Supabase trigger no-op repair.
- URL query authIntent must be cleared after successful /api/me to avoid stale intent; clearCloseFlowAuthIntent now removes both sessionStorage and URL query keys.

<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_START -->
## 2026-06-10 Europe/Warsaw â€” STAGE230D0 Text/Input Contrast Sweep

FAKT:
- Damian zgłosił biały tekst na białym tle podczas wpisywania/dyktowania w aplikacji.
- Zakres R1: /ai-drafts, szybki szkic, Stage230C debug trace, input/textarea/select/placeholder/focus.

DECYZJA:
- Tryb CloseFlow: GIT-FIRST / PUSH-FIRST.
- Nie używać lokalnych ZIP-ów jako głównej ścieżki dla Damiana.

TESTY:
- Stage230B regression guard/test.
- Stage230C regression guard/test.
- Stage230D0 contrast guard/test.
- npm run build.
- git diff --check.

RYZYKA:
- Możliwe podobne problemy kontrastu w innych modułach aplikacji.
- Nie wdrażano deduplikacji dyktowania bez trace.
<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END -->

## 2026-06-10 â€” STAGE231B0 risk audit

- Nie dodano SQL ani pól closed_at/archived_at bez potwierdzenia schematu.
- Zamknięcie nie zeruje pól finansowych i nie usuwa payments.
- Awaryjne usunięcie nadal istnieje, więc wymaga ręcznego testu UI, czy nie jest mylone z normalnym zakończeniem.
- Lifetime earnings klienta wymaga osobnego Stage231B1.

## Risk audit â€” STAGE231B0-R7

Archive/restore uses status update only. No SQL. Existing duplicate savedRecord build warning remains outside this stage.


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "Przywróć sprawę".
- Restore flow używa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostają zachowane; delete flow nie jest używany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodność nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Logika finansów, delete flow i dane rozliczeń pozostają bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodność CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodność segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formę `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `Przywróć sprawę` używa handlera reopen.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodność `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietę `Sprawy zamknięte` oraz filtr aktywne vs zamknięte.
- Bez zmian w delete flow, płatnościach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamknięte`, `Przywróć sprawę`.
- Kontrakt używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamknięte/przywróć oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodność `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- Podział używa wspólnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodność CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, płatnościach, prowizjach i lifetime finance.
\n\n## 2026-06-10 â€” STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po częściowym R4: elastyczny patch ClientDetail, aktywne/zamknięte sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 â€” STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usunięto sklejone anchory `const X = useMemo( const X = useMemo(` po częściowym R2/R4/R6/R7.
- Zakres: dotknięte pliki TSX, whitespace, sanity check R8, pełny build/test.



## 2026-06-10 â€” STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usunięto stary drugi `toggleCaseView`, który pozostał po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokładnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


## 2026-06-10 — STAGE231B0-R9 — Client history and case view model
- Status: LOCAL_ONLY_PREPARED.
- Zakres: /cases jawne widoki Otwarte/Zamknięte/Wszystkie, zamknięte sprawy klienta przeniesione do Historii, szerszy layout klienta, finanse all_cases zachowane.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow R25/R41, build, git diff --check.
- Ryzyka: UX historii klienta, sourceCases w /cases, brak regresji finansów i aktywnych ryzyk.


## 2026-06-10 — STAGE231B0-R9-R2 — Cases URL reader repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9: brakowało jawnego searchParams.get('view') w src/pages/Cases.tsx.
- R8 guard dostosowany do R9 modelu open/closed/all, aby regresja R8 dalej sprawdzała intencję, nie stary exact string.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R3 — Closed case banner repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po częściowym R9-R2: `/cases` musi mieć widoczny banner `SPRAWA ZAMKNIĘTA` dla zamkniętej sprawy.
- Guard R9 rozszerzony o data-marker bannera, żeby nie przechodził sam tekst bez realnego elementu UI.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R5 — Client history renderer guard repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R4: Historia klienta renderuje zamknięte sprawy przez wspólny renderer karty, więc guard akceptuje akcje `Otwórz` i `Przywróć sprawę` z renderera, nie tylko literalnie z segmentu Historii.
- Wymuszono widoczny label `SPRAWA ZAMKNIĘTA` w Historii i rendererze zamkniętej karty.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R9-R6 — Right rail guard robust repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R5: guard R9 zakładał literalny `</SimpleFiltersCard>`, a komponent prawych skrótów może być self-closing albo sformatowany inaczej.
- Logika produktu bez zmian; naprawiono elastyczne wycinanie powierzchni prawego panelu w guardzie.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R8 — R8 setter wrapper scan repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R7: poprzedni patcher szukał `toggleCaseView`, którego aktualne ułożenie w `Cases.tsx` nie było stabilnym anchorem.
- Dodano jawny wrapper `setCaseViewStage231B0R8` przez skan końca funkcji `setCaseViewStage231B0R9`, bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R9 — Cases items JSX syntax repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R8: build wykrył błędną składnię JSX `items=[...]` w `src/pages/Cases.tsx`.
- Poprawiono na `items={[...]}` bez zmiany logiki produktu.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R9-R10 — ClientDetail JSX section close repair
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9-R9: build wykrył niedomkniętą strukturę JSX w `ClientDetail.tsx` przy przejściu z głównej sekcji do prawego panelu.
- Dodano brakujące `</section>` przed `<aside className="client-detail-right-rail"...>` bez zmiany logiki produktu.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.
- Testy: R9 guard/test, R8 regression, Stage231B0 regression, delete-flow, build, git diff --check.


## 2026-06-10 — STAGE231B0-R11 — Client width + Cases runtime guard
- Status: LOCAL_ONLY_PREPARED.
- Naprawa po R9 push: `/cases` rzucał runtime `ReferenceError: closedRecordStage231B0R8 is not defined` przy wejściu w widok spraw.
- Naprawa: wolne użycia `closedRecordStage231B0R8` w JSX zastąpiono bezpiecznym `isClosedCaseStatus(record?.status)`.
- UX: `ClientDetail` ma szeroki układ jak widok sprawy, z lewym wyrównaniem i breakpointami skalowania.
- Dodano guard `scripts/check-stage231b0-r11-client-width-and-cases-runtime.cjs` oraz test node.
- Nie ruszano finansów, kosztów, SQL, Google Calendar ani płatności/prowizji.


## 2026-06-10 — STAGE231B0-R12-R7 — Final Cases runtime contract rescue
- Status: LOCAL_ONLY_PREPARED.
- Po R12-R6 zastosowano mocniejszy rescue: helper `renderClosedCaseBannerStage231B0R12`, jeden kontrakt `activeCases/closedCases` przez `useMemo`, `record.status` tylko w dwóch filtrach.
- Guardy R11/R12/R12-R7 pilnują tego samego kontraktu i blokują `closedRecordStage231B0R8` oraz `record?.status`.
- Nie ruszano finansów, SQL, Google Calendar, płatności ani innych modułów.


## 2026-06-10 — STAGE231B0-R13 — Cases map record scope real fix
- Status: LOCAL_ONLY_PREPARED.
- Naprawa realnego błędu po R12/R7 w `filteredCases.map((record, index) => ...)`.
- Usunięto `caseRecord` fallback i lokalny shadow `renderClosedCaseBannerStage231B0R12` z mapy.
- Dodano scoped boolean `isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status)`.
- Usunięto błędny banner z loading row.
- Dodano guard/test R13 oraz zaktualizowano guardy R11/R12/R12-R7.


## 2026-06-10 — STAGE231B0-R13-R2 — Cases map closed logic completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po częściowym R13: guard liczbowy był za ostry, więc zamieniono go na sprawdzanie konkretnych linii logiki.
- Domknięto `attention`, `statusTone`, `compactLifecyclePill`, `nextActionLabel`, `ownerRiskBadges` i banner zamkniętej sprawy na `isCaseClosedStage231B0R13`.
- Guard blokuje powrót `caseRecord` fallback i local shadow helpera w mapie.


## 2026-06-10 — STAGE231B0-R13-R3 — Next action guard and map completion
- Status: LOCAL_ONLY_PREPARED.
- Kontynuacja po R13-R2: guard był zbyt wrażliwy na dokładny polski tekst `Sprawa zamknięta`.
- Znormalizowano `nextActionLabel` i zmieniono guard na strukturę logiczną zamiast pełnego literalnego tekstu.
- Dalej blokowany jest `caseRecord` fallback i local shadow helpera w `filteredCases.map`.


## 2026-06-10 — STAGE231B0-R13-R4 — Guard map window repair
- Status: LOCAL_ONLY_PREPARED.
- R13-R3 guard fałszywie ciął `filteredCases.map` na pierwszym zagnieżdżonym `});`, czyli przed `nextActionLabel`.
- Naprawa: guardy używają szerokiego deterministycznego okna od początku mapy zamiast pierwszego `});`.
- Nie zmieniano logiki biznesowej poza markerem stage; naprawa dotyczy guardów i dokumentacji.


## 2026-06-10 — STAGE231B0-R13-R6 — Owner risk minimal safe call
- Status: LOCAL_ONLY_PREPARED.
- R13-R5 zatrzymał się przed zmianą pliku, bo check starego bloku z HEAD był błędny.
- Naprawa: uszkodzony zakres `ownerRiskBadges -> metaParts` jest zastępowany kompletną, zamkniętą składniowo deklaracją.
- `getCaseOwnerRiskBadges` dostaje bezpieczny kontekst lokalny: lifecycle, nearestCaseAction, nextActionLabel, statusLabel, compactLifecycleLabel, compactLifecyclePill, percent, updatedAt.

## 2026-06-10 — STAGE231B0-R14 — Client detail full-width layout lock
- Status: LOCAL_ONLY_PREPARED.
- Powód: kartoteka klienta nadal jest centrowana/ściśnięta zamiast używać pełnej szerokości od lewego panelu do prawej krawędzi ekranu.
- Zakres: marker route w ClientDetail + CSS lock w visual-stage12-client-detail-vnext.css.
- Kontrakt: brak max-width shell, width 100%, margin-inline 0, stable horizontal spacing during scroll.

## 2026-06-10 � STAGE231B0-R15-R2 � ClientDetail shared canvas width source
- Status: FINALIZE_FOR_PUSH.
- Pow�d: R14 trafi� w z�y DOM node (`ClientMultiContactField`), wi�c nie m�g� rozci�gn�� kartoteki klienta.
- Decyzja: ClientDetail ma u�ywa� wsp�lnego canvasu strony: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"`.
- �r�d�o prawdy szeroko�ci: `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Widok konsumuj�cy kontrakt: `src/pages/ClientDetail.tsx` + `src/styles/visual-stage12-client-detail-vnext.css`.
- R14 guard/test usuni�te jako fa�szywy kontrakt.

## 2026-06-10 � STAGE231B0-R15-R3 � ClientDetail width guard + Polish encoding guard
- Status: FINAL_GUARD_FOR_PUSH.
- Potwierdzenie u�ytkownika: wygl�d kartoteki klienta jest poprawny i ma tak zosta�.
- Guard szeroko�ci: `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`.
- Guard polskich znak�w: `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`.
- Guard pilnuje, �e ClientDetail u�ywa wsp�lnego canvasu: `cf-page-canvas`, `cf-page-canvas--full`, `data-cf-page-canvas="full"` oraz zmiennych `--cf-page-canvas-*`.
- Guard pilnuje usuni�cia b��dnego R14 i braku mojibake/replacement chars w kluczowych plikach kartoteki klienta.
- Naprawiono higien� EOF w `src/pages/ClientDetail.tsx`.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard safe repair R2
- Status: REPAIR_AFTER_PUSHED_FAILED_GUARD_SAFE_R2.
- Powód: pierwsza paczka SAFE miała błąd runnera PowerShell - funkcja przekazywała argumenty natywnym komendom jako pustą tablicę, więc git/node startowały bez parametrów.
- Naprawa: R2 używa jawnych wywołań w PowerShell i naprawia mojibake wyłącznie w skrypcie JS, nie wklejanym terminalu.
- Polish guard wykrywa konkretne sekwencje mojibake, daje line evidence i blokuje blank line at EOF.
- Zasada utrzymana: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard batch repair
- Status: BATCH_REPAIR_AFTER_R2_R3_PARTIALS.
- Powód: R2/R3 częściowo naprawiły pliki, ale R3 zatrzymał się przez zbyt wąski parser dirty paths.
- Naprawa: masowo obsłużono warianty mojibake `ą/ł/ł/ó/·/â€“`, znormalizowano EOF i poprawiono guard pod aktualną kopię ClientDetail.
- Zasada: commit/push tylko po PASS guardów, build i git diff --check.


## 2026-06-10 — STAGE231B0-R15-R4 — Polish guard final batch repair
- Status: FINAL_BATCH_REPAIR_AFTER_DOC_SELF_FAIL.
- Powód: poprzedni run report zawierał przykładowe uszkodzone sekwencje znaków, a guard słusznie skanował też dokumentację etapu.
- Naprawa: dokumentacja etapu nie zapisuje już przykładowych uszkodzonych sekwencji; guard dalej skanuje kod, CSS i dokumentację zakresu R15.
- Guard blokuje uszkodzenia kodowania, puste linie na EOF i brak aktualnych polskich fraz w ClientDetail.
- Commit/push tylko po PASS guardów, build i git diff --check.

## 2026-06-10 Europe/Warsaw — STAGE231D0B-R9 ClientListCard polish + source truth cleanup

Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_PUSH

FAKTY:
- ClientListCard pozostaje 2-wierszowy.
- Finance values są porządkowane jako kompaktowe chipy.
- R8 unscoped CSS rescue zostaje zastąpiony scoped R9 source truth.
- LeadListCard dodany tylko jako mapping w UI Dictionary, bez runtime zmian.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Manual QA nadal wymagany, bo guard nie mierzy odbioru wizualnego.
- Osobny dług: duplicate savedRecord warning w ContextActionDialogs.tsx.

NASTĘPNY KROK:
- Po akceptacji /clients: STAGE231D0C LeadListCard align to ClientListCard source truth.

## 2026-06-11 Europe/Warsaw — STAGE231D0B_R9_R3_RISK

- Risk: guards that scan encoding drift must not contain literal drift tokens in their own source. Use code point construction or skip self-scan deliberately.
- Follow-up: keep manual visual QA for ClientListCard finance chips.

## 2026-06-11 Europe/Warsaw — STAGE231D0B_R9_R4_RISK

- Risk: guards must not be stricter than the source-truth markers generated by the patcher.
- Control: R4 aligns CSS marker literals with guard requirements and keeps manual visual QA as done condition.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10 risk audit

Ryzyko: automatyczny guard nie potwierdza faktycznej geometrii w przeglądarce. Wymagany screenshot /clients. Długie teksty powinny być ucinane przez ellipsis i pokazywać pełny tekst po hover.

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R7 - Client finance chip start alignment

Marker: STAGE231D0B_R10_R7_FINANCE_CHIP_START_ALIGN

Status: LOCAL_APPLY_PREPARED

FAKTY:
- R10/R6 poprawilo ogolny uklad karty klienta i ellipsis/tooltip.
- Manual QA Damiana pokazal, ze karta jest juz dobra, ale chipy finansowe powinny zaczynac tekst w tej samej osi kolumny.
- Ten etap dotyka tylko CSS source truth i guard dokumentujacy decyzje.

DECYZJA DAMIANA:
- "Zarobione lacznie" i "Aktywna prowizja" maja zaczynac sie w tym samym miejscu/kolumnie.
- Dlugosc tekstu moze dyktowac, gdzie chip sie konczy.
- Reszta ukladu zostaje.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Guard nie sprawdza realnej geometrii w przegladarce. Wymagany screenshot /clients po deployu.

NASTEPNY KROK:
- Po PASS i push: sprawdzic /clients, czy oba chipy finansowe startuja w tej samej osi.



---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R8 — finance chip right-edge alignment

Status: LOCAL_APPLIED_PENDING_PUSH_AND_DEPLOY_QA

FAKTY:
- R7 wyrównał finance chipy w złą stronę dla oczekiwanego widoku Damiana.
- R8 nie przebudowuje karty klienta. Zmienia tylko oś wyrównania zielonych chipów finansowych.
- Chipy pozostają o zmiennej długości; prawa krawędź chipów ma być wspólna.

DECYZJA DAMIANA:
- Początek i koniec karty zostają bez zmian.
- Zielone kafelki finansowe mają być wyrównane od prawej strony.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Etap jest wizualny; ostateczne zamknięcie wymaga deployu i ręcznego sprawdzenia /clients.


---
## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R9 finance text start align
Marker: STAGE231D0B_R10_R9_FINANCE_TEXT_START_ALIGN
Status: LOCAL_APPLY_PACKAGE_PREPARED
Scope: ClientListCard on /clients only.
Decision: zielone finance chipy nie maja konczyc sie rowno; teksty "Aktywna prowizja" i "Zarobione lacznie" maja zaczynac sie w jednej osi kolumny, tak jak nazwa/firma w lewej czesci karty. Dlugosc chipa moze dyktowac prawa krawedz.
Tests: npm run check:stage231d0b-client-list-card-freeze; node --test tests/stage231d0b-client-list-card-freeze.test.cjs; git diff --check; npm run build.
Risk: R8 right-edge alignment was visually wrong for Damian's expected reading flow; R9 supersedes R8 by later CSS source-truth override.

## 2026-06-11 Europe/Warsaw - STAGE231D0B-R10/R10 single-grid alignment source truth

Status: LOCAL_APPLY_PREPARED / DO_MANUAL_QA_AND_PUSH.

FAKT: R10/R7/R8/R9 pokazaly, ze przesuwanie finance chipow przez justify-self/place-self nie zamyka problemu wizualnego, bo primary i secondary byly osobnymi gridami.

DECYZJA: ClientListCard ma uzywac jednej fizycznej siatki CSS dla dwoch wierszy: nazwa/firma, telefon/sprawy, email/akcja, finanse/finanse.

ZAKRES: tylko /clients ClientListCard CSS source truth i guard. Nie ruszano leadow, triala, filtrow, top layoutu, SQL ani Supabase.

TESTY: npm run check:stage231d0b-client-list-card-freeze, node --test tests/stage231d0b-client-list-card-freeze.test.cjs, git diff --check, npm run build.

MANUAL QA: /clients po Ctrl+F5; sprawdzic, czy Aktywna prowizja i Zarobione lacznie startuja w jednej osi, tak jak nazwa/firma.


---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0B-R10/R11 fixed column axis

Status: LOCAL_APPLY_READY / DO_MANUAL_QA_AFTER_DEPLOY

FAKT:
- R10/R10 fixed the physical single grid but the grid still used content-sensitive columns, so column starts could move between client cards.
- R10/R11 pins deterministic column widths through CSS variables on .cf-client-list-card-content.

DECYZJA DAMIANA:
- Texts must start in the same place across every client card.
- Longer text may decide where a chip ends, but it must not move the start axis.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual QA is mandatory after deploy: desktop, narrow window, mobile.
- CSS history R7/R8/R9 remains in file as deprecated layers; R10/R11 is the final active override.

## 2026-06-11 Europe/Warsaw - STAGE231D0C LeadListCard client-view freeze

FAKT:
- /clients ClientListCard view accepted visually after R10/R11 fixed column axis.
- /leads should reuse the same card rhythm, fixed axes, compact card size and action column where the fields are semantically reusable.
- This stage does not change lead data semantics, create flow, filters, trial banner, top layout, SQL or Supabase.

DECYZJA DAMIANA:
- Freeze the accepted Clients view.
- Align the Leads tab to this look only for repeated card/shell elements.
- Do not invent a new layout and do not break existing lead semantics.

TESTY:
- npm run check:stage231d0b-client-list-card-freeze
- node scripts/check-stage231d0c-lead-list-card-client-align.cjs
- node --test tests/stage231d0c-lead-list-card-client-align.test.cjs
- git diff --check
- npm run build

RYZYKA:
- Visual guard does not measure browser geometry. Manual QA on /leads and /clients remains required.
- Lead cards contain more badges/meta than client cards; CSS must compress, not delete semantics.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C/R6 risk sweep

Ryzyka: ClientDetail CSS jest historycznie warstwowy; wymagana manualna ocena. Nie ruszano SQL, kosztów, wykresów, LeadListCard runtime ani CaseDetail.

---

## 2026-06-11 19:45 Europe/Warsaw - Risk audit STAGE231D0C/R7 ClientDetail left rail spacing

STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING

FAKTY Z KODU:
- STAGE231D0C/R6 został wdrożony i wypchnięty jako baseline ClientDetail.
- Manual QA wskazał, że lewy rail zaczyna się za wysoko i wizualnie wchodzi w następny poziom względem kart po prawej.

DECYZJA DAMIANA:
- Zachować zaakceptowane górne kafelki ClientDetail.
- Obniżyć lewy rail do poziomu kafelków po prawej i zachować ten sam odstęp między kartami.

ZAKRES:
- CSS spacing only: lewy rail, prawy rail, odstęp między kartami.
- Bez zmian danych, JSX, SQL, kosztów, wykresów, Google Calendar, LeadListCard runtime i CaseDetail.

TESTY/GUARDY:
- scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- regresja: STAGE231D0C ClientDetail baseline guard, STAGE231D0B ClientListCard guard, optional STAGE231B0 R9 guard, build, git diff --check.

---

## 2026-06-11 20:05 Europe/Warsaw - Risk audit STAGE231D0C/R8 ClientDetail left rail spacing guard fix

STAGE231D0C_R8_CLIENT_DETAIL_LEFT_RAIL_SPACING_GUARD_FIX

FAKTY Z KODU:
- STAGE231D0C/R7 patch zastosował spacing lewego raila, ale guard miał zepsuty regex po utracie backslashy.
- R8 nie zmienia runtime poza naprawą guarda/testu i dokumentacją.

DECYZJA DAMIANA:
- Zachować górne kafelki ClientDetail.
- Dokończyć spacing lewego raila bez przebudowy układu.

ZAKRES:
- Naprawa scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs.
- Zachowanie CSS R7 i scope ClientDetail.
- Bez zmian SQL, danych, CaseDetail, LeadListCard runtime, kosztów i wykresów.

TESTY/GUARDY:
- node --check guard R7.
- R7 spacing guard.
- R7 spacing node test.
- STAGE231D0C ClientDetail baseline guard/test.
- STAGE231D0B ClientListCard guard/test.
- Optional STAGE231B0 R9 guard/test.
- git diff --check.
- npm run build.

## 2026-06-11 Europe/Warsaw - STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN

Status: LOCAL_APPLIED / VISUAL_SPACING_FIX / NEED_PUSH

Zakres:
- poprawiono realny desktopowy offset lewego raila w ClientDetail, bo po R7 panel nadal zaczynał za wysoko względem prawego raila;
- zwiększono offset tylko dla desktopu przez CSS variable i silniejszy selektor;
- zachowano zaakceptowany górny układ kafelków, kompaktową aktywną sprawę, dane i routing.

Testy/guardy:
- node scripts/check-stage231d0c-r9-client-detail-left-rail-visual-align.cjs
- node --test tests/stage231d0c-r9-client-detail-left-rail-visual-align.test.cjs
- node scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- node scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- node scripts/check-stage231d0b-client-list-card-freeze.cjs
- git diff --check
- npm run build

Ryzyka:
- finalna akceptacja wymaga screenshotu /clients/<id> po deployu i Ctrl+F5;
- tablet/mobile resetują offset do 0, żeby nie zrobić sztucznej dziury.

---
## 2026-06-11 Europe/Warsaw - STAGE231D0C/R11 ClientDetail left rail axis lock

Marker: STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK

Status: LOCAL_APPLY_READY

Scope:
- desktop-only CSS axis lock for the ClientDetail left rail,
- strengthens previous R7/R9 offset because production screenshot still showed the left rail above the right card axis,
- keeps top overview tiles, compact active case card, data, routing and JSX unchanged.

Tests/guards:
- scripts/check-stage231d0c-r11-client-detail-left-rail-axis-lock.cjs
- tests/stage231d0c-r11-client-detail-left-rail-axis-lock.test.cjs
- R9/R7 regressions where present
- ClientDetail baseline regression
- ClientListCard regression
- git diff --check
- npm run build

Risk audit:
- desktop offset can create too much vertical whitespace on narrow layouts, therefore reset is scoped to max-width 1180px.
- final acceptance requires production screenshot after deploy and Ctrl+F5.

---

## 2026-06-11 HH:mm Europe/Warsaw - STAGE231D0C/R12 ClientDetail left rail measured axis fix

Status: LOCAL_APPLY_PRE_PUSH.
Commit target: fix ClientDetail left rail vertical axis using measured desktop DOM values.

Measured fact from manual DOM audit after clearing debug inline style:
- viewport innerWidth: 1920
- leftFirstTop: 173
- rightFirstTop: 200
- leftMinusRight: -27
- computed left rail margin-top before fix: -36px
- required final desktop margin-top: -9px

Change:
- CSS-only override in src/styles/visual-stage12-client-detail-vnext.css.
- Locks .client-detail-shell > .client-detail-left-rail margin-top to -9px on desktop >=1180px.
- Resets margin/padding/transform on tablet/mobile <=1179px.

Scope not touched:
- JSX, data fetching, Supabase, SQL, costs, charts, active case card structure, CaseDetail, LeadListCard runtime.

Tests required:
- R12 measured-axis guard/test.
- R9 and R7 left rail regressions.
- ClientDetail baseline guard/test.
- ClientListCard freeze regression.
- git diff --check.
- npm run build.

Manual QA after deploy:
- open /clients/<id>, Ctrl+F5.
- verify left Data klienta card starts visually on the same axis as right Najbliższe działania card.
- verify top tiles and active case compact card unchanged.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0C-R2 ClientDetailHeader visual freeze + visible icons

Marker: STAGE231D0C_R2_CLIENT_DETAIL_HEADER_FREEZE
Status: LOCAL_APPLY_PREPARED / DO_TEST_AND_PUSH

Zakres:
- zamrożenie ClientDetailHeader jako wzorca DetailHeader,
- dopisanie stylu widoczności ikon w header buttons,
- dopisanie DetailHeader do UI Dictionary,
- dodanie guarda i testu R2,
- regresja D0C baseline.

Decyzja Damiana:
Header karty klienta detail zostaje wzorcem dla kolejnych kart detail. Ikony w niebieskich przyciskach muszą być widoczne.

Poza zakresem:
- brak SQL,
- brak zmian danych,
- brak zmian aktywnej sprawy,
- brak zmian CaseDetail,
- brak zmian LeadListCard runtime.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.




---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R2 CaseDetail service notes and finance rail

Status: APPLIED_BY_ZIP / READY_FOR_TEST_AND_PUSH

FAKTY Z KODU:
- CaseDetail had CaseQuickActions before the finance rail.
- CaseDetail had an older Stage220A10 duplicated service/notes block before the current service tab source of truth.
- Finance and cost source files already exist; this stage does not add SQL or a new data model.

DECYZJE DAMIANA:
- CaseDetail right rail order: Rozliczenie sprawy -> Szybkie akcje -> Dane sprawy i klienta.
- One CaseServiceTab source of truth.
- One CaseNotesPanel preview plus CaseAllNotesModal.
- Costs use semantic orange/red cost-warning classes, not system-error styling.

TESTY:
- scripts/check-stage231d0d-r2-case-detail-service-notes-finance-rail.cjs
- tests/stage231d0d-r2-case-detail-service-notes-finance-rail.test.cjs
- D0C ClientDetail regression
- npm run build
- git diff --check

RYZYKA:
- CaseDetail still has old build warnings outside this stage.
- Manual QA must confirm modal and right rail order on production.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE

Status: PATCH_RESCUE / CONTINUES_STAGE231D0D_R2

Zakres:
- naprawa częściowo zastosowanego D0D-R3 po guard fail,
- dopisanie widocznego wiersza "Razem do pobrania" do pierwszej karty "Rozliczenie sprawy",
- podpięcie totalu do istniejącego caseCostsSummaryStage231D2.totalToCollectAmount,
- naprawa JSX service tab po usunięciu legacy Stage220A10 duplicate block,
- bez SQL, bez nowego modelu kosztów, bez wykresów.

Testy wymagane:
- D0D-R2 guard/test,
- D0C ClientDetail baseline regression,
- D0B ClientListCard regression,
- npm run build,
- git diff --check.

Audyt ryzyk:
- nie dublować osobnej karty kosztów jako drugiego źródła rozliczenia; wiersz totalu w pierwszej karcie jest obowiązkowy dla skanowalności prawego panelu,
- po deployu manualnie sprawdzić kolejność raila: Rozliczenie -> Szybkie akcje -> Dane sprawy i klienta.

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R3 CaseDetail 100% scale balanced workspace

Status: PREPARED_BY_ZIP / DO_TEST_AND_PUSH

Zakres:
- działania i notatki w jednym środkowym gridzie,
- notatki compact preview: 3 ostatnie,
- prawy rail compact: rozliczenie, szybkie akcje, dane,
- historia wpłat i lista kosztów nie są stale rozlane w railu,
- R2 guard zaktualizowany jako regresja zgodna z R3.

Testy:
- D0D/R3 guard/test,
- D0D/R2 regression guard/test,
- D0C regression,
- D0B regression,
- build,
- git diff --check.



---

## 2026-06-11 Europe/Warsaw - STAGE231D0D-R4 CaseDetail lean service workspace

Status: LOCAL_PACKAGE_APPLIED_PENDING_PUSH

FAKTY Z KODU:
- R4 usuwa widoczną kartę danych sprawy i klienta z głównego right raila bez usuwania danych z systemu.
- R4 usuwa stałe sekcje historii wpłat i kosztów z right raila.
- R4 zachowuje rozliczenie sprawy i szybkie akcje w railu.
- R4 dopina marker data-case-service-tabs-column="true" do tabs card.

TESTY:
- check-stage231d0d-r4-case-detail-lean-service-workspace.cjs
- stage231d0d-r4-case-detail-lean-service-workspace.test.cjs
- R3/R2 regression guards
- D0C regression
- npm run build
- git diff --check

RYZYKA:
- Tabs są wyrównane wizualnie do kolumny działań bez pełnej przebudowy logiki Tabs; przy kolejnym większym refaktorze warto przenieść strukturę logicznie do left-column.
- Historia wpłat i koszty pozostają dostępne przez istniejące przyciski/modale, ale nie są stałą listą w railu.

---

## 2026-06-12 07:39 Europe/Warsaw - STAGE231D0D-R5 spacing / notes lift / quick actions cleanup

Status: READY_FOR_TEST
Zakres:
- notatki podciągnięte do góry bez łamania wspólnego odstępu kafelków,
- wspólny odstęp kafelków: 14px,
- prawy rail delikatnie podniesiony,
- z CaseQuickActions usunięto osobną akcję "Wpłata prowizji",
- wpłata prowizji zostaje w rozliczeniu sprawy.

Ryzyka:
- override CSS musi nie rozjechać mobile/tablet,
- quick actions nie mogą dublować akcji finansowych,
- R2/R3/R4 guardy były składniowo uszkodzone i zostały naprawione.

---

## 2026-06-12 07:58 Europe/Warsaw - STAGE231D0D-R5 repair after red guard push

Status: REPAIR_READY_FOR_TEST

Naprawa:
- usunięto "Wpłata prowizji" z CaseQuickActions,
- dodano "Dodaj koszt" do kompaktowego rozliczenia sprawy,
- dodano spacing marker i wspólny odstęp kafelków 14px,
- dodano micro-lift prawego raila,
- zachowano wpłatę prowizji tylko w rozliczeniu sprawy.

Powód:
Poprzedni R5 został wypchnięty mimo czerwonych guardów po błędzie ścieżek względnych .NET/PowerShell.

---

## 2026-06-12 08:10 Europe/Warsaw - STAGE231D0D-R6 true service grid geometry

Status: READY_FOR_TEST

Zakres:
- przeniesiono tabs do lewej kolumny workspace dla aktywnej zakładki Obsługa,
- lewa kolumna ma teraz: tabs + działania,
- środkowa kolumna ma notatki startujące od góry tego samego gridu,
- prawy rail jest wyrównany do osi true service grid i używa wspólnego gapu,
- nie ruszano SQL, danych, modelu finansów ani modali.

Audyt:
- R5 był technicznie zielony, ale wizualnie nie zamykał celu, bo tabs były poza gridem.
- R6 naprawia strukturę JSX, a guard sprawdza kolejność grid -> left column -> tabs -> actions -> notes.

---

## 2026-06-12 08:28 Europe/Warsaw - STAGE231D0D-R8 tabs card + right rail axis polish

Status: READY_FOR_TEST

Zakres:
- prawy panel z rozliczeniem i szybkimi akcjami podniesiony do osi kafelka danych sprawy,
- zakładki Obsługa / Checklisty / Historia dostały pełny, rozciągnięty kafelek nad Działaniami sprawy,
- zachowany wspólny odstęp kafelków 14px,
- nie ruszano finansów, modali, SQL, danych, handlerów ani quick actions poza stylem układu.

Ryzyka:
- etap jest CSS-only, więc wymaga ręcznego potwierdzenia na 100% zoom,
- lift prawego raila ma reset na węższych ekranach,
- historyczne mojibake w starych wpisach _project nie jest czyszczone w tym etapie.

---

## 2026-06-12 08:58 Europe/Warsaw - STAGE231D0D-R9 tabs center + axis microfix

Status: APPLIED_LOCAL_WAITING_VISUAL_PASS

Zakres:
- pigułki Obsługa / Checklisty / Historia wyśrodkowane w rozciągniętym kafelku,
- środkowa sekcja CaseDetail podniesiona lekko wyżej,
- prawy panel rozliczeń i szybkich akcji dociągnięty do tej samej osi,
- bez zmian w SQL, Supabase, finansach, modalach, handlerach i danych.

Testy:
- R9 guard/test,
- regresje R8/R6/R5/R4/R3/R2/D0C/D0B,
- git diff --check,
- npm run build.
---

## 2026-06-12 14:34 Europe/Warsaw - STAGE231D0E-R1 ClientDetail grid axis align

Status: PREPARED_LOCAL / pending visual PASS before push

Scope:
- CSS-only alignment of ClientDetail workspace columns.
- Align left data card, center column and right upcoming-actions rail to one top axis.
- Force center content under Braki i blokady to keep same width/left edge as the center column.
- Force right rail content under Najbliższe działania to keep same width/left edge as the rail.

User decision:
- "wszystko co pod braki i blokady oraz najbliższe działania musimy wyrównać z kafelkiem dane klienta"

Touched runtime files:
- src/styles/visual-stage12-client-detail-vnext.css

Not touched:
- src/pages/ClientDetail.tsx
- src/components/CaseQuickActions.tsx
- CaseDetail logic
- Supabase / SQL / finance formulas / handlers / modals

Guards:
- scripts/check-stage231d0e-r1-client-detail-grid-axis-align.cjs
- tests/stage231d0e-r1-client-detail-grid-axis-align.test.cjs

Risk audit:
- Visual-only risk: desktop alignment may improve while tablet breakpoint needs manual check.
- No runtime data risk because only CSS and docs/guards are changed.
- Do not mix with failed R11 finance/notes package or old D0B client-list-card guard drift.

<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — Risk audit after STAGE231D0F

Ryzyka:
- Lejek może zostać w przyszłości przypadkiem rozbudowany w kanban, co byłoby sprzeczne z decyzją Damiana.
- Lokalne style kafelków mogą wrócić przy kolejnych poprawkach.
- Prawy rail może znowu stać się ciężką instrukcyjną kartą.
- Zmiany wizualne mogą przypadkiem naruszyć czytelność klikanych filtrów.

Guard:
- blokuje stare lokalne nazwy/styl `DecisionTile`, `StagePill`, `Signal`, `text-3xl`,
- blokuje SQL, wykresy, drag/drop/kanban runtime,
- wymaga wpisów UI Dictionary.
<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_END -->

<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R4 Funnel targeted guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGÓW:
- R2 poprawnie zatrzymał się po czerwonym guardzie.
- R3 zatrzymał się na zbyt szerokim mojibake sweepie, który zaczął czyścić stare historyczne wpisy `_project`.
- To nie jest właściwy zakres dla etapu UI Lejka.

DECYZJA:
- Naprawiamy aktywny zakres STAGE231D0F, nie całą historię projektu.
- Lejek pozostaje listą decyzji właściciela, nie kanbanem.
- Nie ruszać logiki filtrów, Supabase, SQL, płatności, routingu, wykresów ani drag/drop.

R4:
- targetowany repair mojibake tylko dla runtime i aktywnych plików etapu,
- guard STAGE231D0F sprawdza aktywny blok UI Dictionary, CSS i runtime,
- guardy nie failują na własnych definicjach tokenów,
- CaseDetail R4 guard jest podmieniany na bezpieczną wersję z tokenami generowanymi po kodach znaków.

TESTY:
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `node scripts/check-stage231d0d-r4-case-detail-lean-service-workspace.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- W repo nadal mogą istnieć stare historyczne wpisy z mojibake. Nie naprawiać ich w tym etapie.
- Jeżeli chcemy pełne sprzątanie `_project`, to osobny etap: `ENCODING-SWEEP`, bez mieszania z Lejkiem.
<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R2 Funnel color/icon/filter parity

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma już `FunnelOwnerDecisionTile`, `FunnelStageFilterChip`, `FunnelDecisionListCard`.
- `closeflow-metric-tiles.css` ma wspólne tony `blue`, `amber`, `red`, `green`, `purple`.
- Klienci używają wzorca filtrów: `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

DECYZJE DAMIANA:
- Zamysł Lejka zostaje.
- Lejek nie jest kanbanem.
- Kafelki właścicielskie mają mieć kolorowe ikony.
- `Cisza 7+` ma dostać ton `purple`.
- Filtry etapów mają mówić tym samym językiem wizualnym co filtry w Klientach.
- Nie ruszać logiki filtrów, Supabase, SQL, drag/drop ani kanbana.

ZMIANA:
- Dodany marker `STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY`.
- Dodana jawna mapa `FUNNEL_OWNER_TILE_TONE_MAP`.
- `FunnelStageFilterChip` dostaje `data-cf-status-tone`, `cf-status-pill` / `pill` oraz alias `cf-filter-pill`.
- Pasek etapów dostaje `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-filter-strip`, `cf-filter-pills`.
- CSS wymusza widoczne kolorowe ikony w owner tiles.

TESTY:
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `node scripts/check-stage231d0f-funnel-owner-dashboard-visual-alignment.cjs`
- `node --test tests/stage231d0f-funnel-owner-dashboard-visual-alignment.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Nie wolno przez ten etap zmienić działania filtrów ani przerobić Lejka w kanban.
- Nie mieszać w tym commicie wcześniejszych plików `STAGE231D0E`, jeśli nie są osobno domykane.
<!-- STAGE231D0F_R2_FUNNEL_COLOR_FILTER_PARITY_2026_06_12_END -->

<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R3 Funnel icon source truth + records header fix

STATUS: READY_TO_APPLY

FAKTY Z KODU:
- `SalesFunnel.tsx` ma już `FUNNEL_OWNER_TILE_TONE_MAP` i używa `data-eliteflow-metric-tone`.
- `closeflow-metric-tiles.css` ma zmienne source of truth dla ikon i tła ikon.
- `SalesFunnel.tsx` nadal miał dwuliniowy nagłówek rekordów: mały label + `Rekordy w aktywnym widoku`.

DECYZJE DAMIANA:
- Ikony kafelków Lejka mają mieć widoczny kolor.
- Kolor ikon ma iść ze wspólnego source of truth `closeflow-metric-tiles.css`.
- Nie kolorować lokalnie kafelków Lejka losowymi hexami.
- Nagłówek rekordów ma być jednym wierszem.
- Nie ruszać logiki filtrów, SQL, Supabase, kanbana ani drag/drop.

ZMIANA:
- Dodany marker `STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER`.
- W `closeflow-metric-tiles.css` dopisano ogólną regułę `stroke: currentColor` / `color: currentColor` dla SVG ikon metric tiles.
- W `SalesFunnel.tsx` nagłówek rekordów zmieniony na `FunnelRecordsHeaderRow`.
- W `sales-funnel-stage231d0f-visual-alignment.css` dodano CSS dla jednowierszowego nagłówka.

TESTY:
- `node scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `node --test tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Jeśli ikony dalej wyglądają bez koloru, możliwa przyczyna to kolejność ładowania CSS albo zewnętrzne nadpisanie SVG. Guard sprawdza source of truth, ale manual QA nadal jest konieczne.
<!-- STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER_2026_06_12_END -->

<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R5 Funnel records header line repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R4 patcher dalej zatrzymał się na starym fragmencie `<p className="text-xs font-black uppercase tracking...">`.
- Przyczyna: nawet regex R4 nie trafił lokalnego wariantu starego JSX.
- Problem jest w konkretnych liniach starego headera, nie w całym Lejku.

ZMIANA:
- R5 usuwa liniowo stare fragmenty:
  - `visibleLabel` paragraph,
  - stary `h2` rekordów,
  - stary licznik tekstowy.
- R5 wymaga nowego `data-stage231d0f-r5-records-header-line-repair`.
- R5 odświeża R3/R4 guardy, żeby walidowały naprawiony stan bez fałszywego globalnego blokowania.

NIE RUSZAĆ:
- logiki filtrów,
- Supabase,
- SQL,
- kanbana,
- drag/drop,
- STAGE231D0E.

TESTY:
- `node scripts/check-stage231d0f-r5-funnel-records-header-line-repair.cjs`
- `node --test tests/stage231d0f-r5-funnel-records-header-line-repair.test.cjs`
- R4/R3 regression guard/test
- R2 guard/test jeśli istnieją
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma dużo wcześniejszych śladów failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R5_FUNNEL_RECORDS_HEADER_LINE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R6 Funnel UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 runtime patch przeszedł.
- R5 guard zatrzymał etap wyłącznie na brakach w UI Dictionary: `MetricTileIconColorSource` i `FunnelColorToneMap`.
- To jest problem guardu/pamięci projektu, nie logiki Lejka.

ZMIANA:
- R6 dopisuje brakujące pojęcia do aktywnego bloku UI Dictionary.
- R6 guard łączy aktywne bloki R6/R5/R4/R3/R2 zamiast patrzeć tylko w ostatni blok.
- R6 nie dotyka logiki filtrów, Supabase, SQL, drag/drop ani kanbana.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-ui-dictionary-guard-repair.cjs`
- `node --test tests/stage231d0f-r6-funnel-ui-dictionary-guard-repair.test.cjs`
- R5/R4/R3 regression guard/test
- R2 guard/test jeśli istnieją
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree jest brudny po wielu próbach. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R6 Funnel shared filter resilient patch

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R5 shared filter patch zatrzymał się na `SalesFunnel post-patch token missing: data-stage231d0f-r5-stage-filter-no-visible-money`.
- Przyczyna: patcher szukał zbyt szerokiego wariantu całego `<button>` w `FunnelStageFilterChip`.
- Realny `SalesFunnel.tsx` ma stabilny marker `data-stage231d0f-r2-filter-tone={tone}` i widoczny `cf-funnel-stage-filter-chip-value`.

ZMIANA:
- R6 patchuje wyłącznie blok funkcji `FunnelStageFilterChip`, a nie cały plik na ślepo.
- R6 dopina no-visible-money marker po stabilnym atrybucie.
- R6 usuwa widoczną kwotę z chipu, zostawia kwotę w `aria-label` i `title`.
- R6 zachowuje wspólny filtr dla Klientów przez stabilny `cf-contact-cadence-pills`.

TESTY:
- `node scripts/check-stage231d0f-r6-funnel-shared-filter-resilient-patch.cjs`
- `node --test tests/stage231d0f-r6-funnel-shared-filter-resilient-patch.test.cjs`
- R3 guard/test jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R6_FUNNEL_SHARED_FILTER_RESILIENT_PATCH_2026_06_12_END -->

<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R8 Funnel icon tone syntax repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R7 zatrzymał się przed patchowaniem na błędzie składni w patcherze.
- Błąd: niepoprawnie escapowany string `payment: \\'green\\''` w tablicy walidacyjnej.
- To nie jest błąd aplikacji ani koncepcji kolorów.

DECYZJA DAMIANA:
- Układ Lejka jest zamrożony.
- Etap dotyczy tylko spójnej kolorystyki ikon/kafelków.

ZMIANA:
- R8 naprawia składnię patchera.
- R8 dodaje `node --check` dla patchera i guardu przed patchowaniem.
- R8 dodaje `metric-icon-tone-registry.ts`.
- R8 podpina Lejek i operator metric tone contract pod wspólny resolver koloru.
- Kafel `Pieniądze` używa `PaymentEntityIcon`, nie strzałki.

TESTY:
- `node --check payload/scripts/apply-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --check payload/scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node scripts/check-stage231d0f-r8-funnel-icon-tone-syntax-repair.cjs`
- `node --test tests/stage231d0f-r8-funnel-icon-tone-syntax-repair.test.cjs`
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Zmiana ikony `Pieniądze` ze strzałki na ikonę płatności jest świadoma.
- Manual QA wymagany dla realnego koloru SVG.
<!-- STAGE231D0F_R8_FUNNEL_ICON_TONE_SYNTAX_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R9 Funnel icon tone UI Dictionary guard repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R8 patch runtime przeszedł.
- R8 zatrzymał się dopiero na guardzie dokumentacji.
- Brakujący token: `SharedFilterStrip` w aktywnym zakresie UI Dictionary.
- To nie jest problem Lejka ani kolorów ikon.

ZMIANA:
- R9 dopisuje aktywny blok UI Dictionary z literalami:
  - `SharedFilterStrip`
  - `FunnelLayoutFrozen`
  - `FunnelIconToneSourceTruth`
  - `MetricTileIconColorSource`
- R9 odświeża R8 guard, żeby czytał bloki R9/R8/R6/R5/R4 razem.
- R9 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R9/R8 guardów
- R9 guard/test
- R8 regression guard/test
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R9_FUNNEL_ICON_TONE_UI_DICTIONARY_GUARD_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R9 zatrzymał się po dopisaniu UI Dictionary i project memory.
- Błąd: `The property 'check:stage231d0f-r9-funnel-icon-tone-ui-dictionary-guard-repair' cannot be found on this object.`
- Przyczyna: PowerShell `Set-StrictMode` i dostęp do brakującej właściwości w `package.json`.
- To nie jest problem runtime Lejka.

ZMIANA:
- R10 usuwa kruchy dostęp PowerShell `$Pkg.scripts.'...'`.
- Dopisanie scriptów do `package.json` odbywa się przez `node -e`.
- R10 uruchamia R10/R9/R8 guardy i testy.
- R10 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla R10/R9/R8 guardów
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 guard jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R10_FUNNEL_ICON_TONE_POWERSHELL_STRICTMODE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — STAGE231D0F-R11 Funnel R6 regression guard resolver repair

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- R10/R9/R8 guardy i testy przeszły.
- Etap zatrzymał wyłącznie stary R6 regression guard.
- R6 guard oczekiwał literalów `tone: 'blue'`, `tone: 'amber'`, `tone: 'purple'`, `tone: 'red'`, `tone: 'green'`.
- Po R8 te literały zostały celowo zastąpione resolverem `resolveCloseflowMetricIconTone`.

ZMIANA:
- R11 odświeża R6 guard/test, żeby akceptował nowy source of truth.
- R11 odpala R11/R10/R9/R8/R6 guardy i testy.
- R11 nie zmienia runtime Lejka.

TESTY:
- `node --check` dla guardów R11/R10/R9/R8/R6
- R11 guard/test
- R10 guard/test
- R9 guard/test
- R8 guard/test
- R6 refreshed guard/test
- `npm run build`
- `git diff --check`

RYZYKO:
- Local tree ma wcześniejsze ślady failed packages. Push tylko selektywny.
<!-- STAGE231D0F_R11_FUNNEL_R6_REGRESSION_GUARD_RESOLVER_REPAIR_2026_06_12_END -->

<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_START -->
## 2026-06-12 18:30 Europe/Warsaw — STAGE231D0F-R12 Funnel metric colors real CSS enforce

STATUS: READY_TO_APPLY

FAKTY Z QA:
- Po pushu R11 układ Lejka jest OK.
- W Vercel `/funnel` nadal wygląda prawie szaro.
- Problem: kolor nie dochodzi wystarczająco mocno do kafli/SVG.

FAKTY Z KODU:
- `SalesFunnel.tsx` ma `data-eliteflow-metric-tone` i `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` ma tokeny `--cf-metric-tone-*-icon`, ale nie wymuszał pełnego `stroke: currentColor` na SVG i dzieciach SVG.
- `Pieniądze` ma długą wartość i wymaga value-kind.

DECYZJA:
- Układ Lejka zostaje zamrożony.
- R12 zmienia tylko realną kolorystykę kafelków/ikon.
- `Cisza 7+` ma być purple, nie amber.
- Kolor ma być subtelny, nie tęcza.
- Source of truth: `closeflow-metric-tiles.css`.

ZMIANA:
- `FUNNEL_OWNER_TILE_TONE_MAP` ma jawne tony: blue, amber, purple, red, green.
- Dodano `data-cf-metric-value-kind`.
- `closeflow-metric-tiles.css` wymusza SVG `stroke: currentColor`.
- Dodano subtelne tła/bordery kafli per tone.
- Dodano money value sizing.

TESTY:
- `node scripts/check-stage231d0f-r12-funnel-metric-colors-real-css-enforce.cjs`
- `node --test tests/stage231d0f-r12-funnel-metric-colors-real-css-enforce.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA dalej wymagane, bo to etap CSS/render.
- Local tree ma wcześniejsze śmieci; push tylko selektywny.
<!-- STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE_2026_06_12_END -->

<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_START -->
## 2026-06-12 19:20 Europe/Warsaw — STAGE231D0F-R13 Funnel visual color density

STATUS: READY_TO_APPLY

FAKTY Z QA:
- R12 przeszedł technicznie i został wypchnięty.
- Ekran `/funnel` nadal wygląda za blado.
- Problem nie dotyczy już tylko ikon; brakuje warstwy kolorystycznej kafli i rekordów.

DECYZJE DAMIANA:
- Układ Lejka jest zaakceptowany i zamrożony.
- Dodać kolor bez tęczy.
- Kafelki mają mieć kolor w ikonie, wartości i subtelnym surface/accent.
- Rekordy mają dostać lekkie semantyczne akcenty.
- Przyciski `Otwórz` mają być równe i bez łamania.

ZMIANA:
- R13 dodaje `FunnelDecisionSignal tone`.
- R13 dodaje data atrybuty rekordów.
- R13 dodaje tone surface/accent dla kafli w `closeflow-metric-tiles.css`.
- R13 zwiększa open button z 132px do 156px i dodaje nowrap.
- R13 nie zmienia layoutu ani logiki filtrów.

TESTY:
- `node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs`
- `node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- To etap CSS/render, więc manual QA jest obowiązkowy.
- Local tree ma wcześniejsze śmieci; push tylko selektywny.
<!-- STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY_2026_06_12_END -->

<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 20:10 Europe/Warsaw — STAGE231D0G Visual Tile Source Truth Atlas

STATUS: READY_TO_APPLY

FAKTY Z LOGU:
- STAGE231D0F-R13 przeszedł guard/test/build.
- Commit `0b2f6fb2 fix: improve funnel visual color density` został wypchnięty na `dev-rollout-freeze`.
- Damian wizualnie akceptuje Lejek i zamraża go jako baseline.

DECYZJA DAMIANA:
- FunnelMetricTileR13 zostaje źródłem prawdy dla globalnego CloseFlowMetricTileV2.
- Nie przebudowywać całej aplikacji chaotycznie.
- Najpierw source truth, atlas, guard i plan fal.

ZMIANA:
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_SYSTEM.md`.
- Dodano `_project/CLOSEFLOW_VISUAL_TILE_ATLAS.md`.
- Dopisano UI Dictionary: CloseFlowMetricTileV2, CloseFlowMetricToneMap, FunnelMetricTileR13, SharedFilterStrip, RecordListCard, RightRailCard, FinanceMetricTile.
- Dodano guard/test D0G.
- Runtime widoków nie jest przepinany w tym etapie.

TESTY:
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- R13 regression guard/test jeśli istnieje
- `npm run build`
- `git diff --check`

RYZYKO:
- UI Dictionary ma stare duplikaty i historyczne mojibake. Guard D0G skanuje aktywny blok D0G i nowe source truth, nie całą historię słownika.
- Pełny cleanup lokalnych śmieci po starych paczkach zostaje osobnym etapem.
<!-- STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->

<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_START -->
## 2026-06-12 — STAGE231D0G-CLOSEOUT risk audit

Risk audit result:
- D0G can be closed as a documentation/source-truth stage.
- UI Dictionary still has historical duplicate/mojibake entries. Active D0G block is clean enough for next stages.
- Full UI Dictionary cleanup should not be mixed with Leads/Clients migration.
- Working tree has old local artifacts from previous stages; push only selected D0G-CLOSEOUT files.
- Build warning `Duplicate key "savedRecord"` remains non-blocking and should be separate.
<!-- STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12_END -->
<!-- STAGE231D0G_CLOSEOUT_R2_GUARD_SCOPE_REPAIR_2026_06_12_START -->
## 2026-06-12 â€” STAGE231D0G-CLOSEOUT-R2 Guard scope repair

STATUS: READY_TO_RUN

FAKTY:
- D0G guard/test PASS, R13 regression PASS, build PASS.
- Poprzedni closeout guard skanowal cale historyczne pliki centralne.
- Historyczne pliki zawieraja stare mojibake i stare teksty SQL/scope, wiec guard dal falszywy FAIL.

ZMIANA:
- R2 guard skanuje tylko aktywne bloki STAGE231D0G-CLOSEOUT i Obsidian payload.
- R2 nie rusza runtime UI.

TESTY:
- node scripts/check-stage231d0g-closeout-visual-tile-source-truth-atlas.cjs
- node --test tests/stage231d0g-closeout-visual-tile-source-truth-atlas.test.cjs
- node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs
- node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs
- npm run build
- git diff --check
<!-- STAGE231D0G_CLOSEOUT_R2_GUARD_SCOPE_REPAIR_2026_06_12_END -->

<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_START -->
## 2026-06-12 22:05 Europe/Warsaw — STAGE231D0H-N1-R3 Notifications visual source cleanup section bounds

STATUS: READY_TO_APPLY

FAKTY:
- N1 R2 failed during patch on conflict placeholder removal.
- Real conflict card is a standalone right rail `<section>` before the upcoming card.
- R3 removes the whole section using section boundaries.

ZMIANA:
- R3 uses section bounds for conflict card removal.
- R3 preserves N1 scope: visual/source truth only.
- Runtime data logic, filters, localStorage, Supabase, SQL and routing are untouched.

TESTY:
- `node scripts/check-stage231d0h-n1-notifications-visual-source-cleanup.cjs`
- `node --test tests/stage231d0h-n1-notifications-visual-source-cleanup.test.cjs`
- `node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs`
- `node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs`
- `npm run build`
- `git diff --check`

RYZYKO:
- Visual QA `/notifications` required.
- Previous failed N1/N1-R2 copied guard/test/run/obsidian files; R3 overwrites active guard/test and creates final R3 run/obsidian.
<!-- STAGE231D0H_N1_R3_NOTIFICATIONS_VISUAL_SOURCE_CLEANUP_SECTION_BOUNDS_2026_06_12_END -->

## STAGE231F_R3 - ryzyka po etapie
- Produkcyjny zapis workspace wymaga zastosowanej migracji Supabase.
- `verify:closeflow:quiet` jest czerwony przez historyczny mojibake/BOM poza zakresem etapu.
- Build nadal ostrzega o podwojnym kluczu `savedRecord` w `ContextActionDialogs.tsx`.
- Manualny test Damiana na wdrozonym srodowisku pozostaje wymagany.
- `verify:migrations:supabase` ma globalny pre-existing FAIL na dwoch migracjach portalu z 2026-05-02; Stage231F R3 stosuje jawny SKIP dla tego gate.

## CLOSEFLOW_CLIENT_CASE_URGENT_FIX - audyt ryzyka
- Manualny test lokalnego UI nie zostal wykonany automatycznie z powodu blokady localhost w narzedziu przegladarkowym.
- Stary guard Stage228R5 wymaga wpisu w `prebuild`, ktorego aktualny `package.json` nie zawiera.
- Guard Stage231D2 jest czerwony przez brak markera w obcym, aktywnym zakresie 231D.
- Globalny Stage98 mojibake/BOM nadal blokuje `verify:closeflow:quiet`.
- Brak migracji i zmian schematu w tym pakiecie.

## CLOSEFLOW_CASE_FINANCE_UI_REPAIR - audyt ryzyka
- Migracja musi zostac zastosowana na docelowym Supabase; sam kod nie doda kolumny w zdalnej bazie.
- Browser localhost byl zablokowany przez polityke narzedzia, wiec pozostaje test reczny Damiana.
- `verify:closeflow:quiet` nadal blokuje niezwiązany globalny mojibake/BOM.
- `verify:migrations:supabase` nadal blokuja dwie starsze migracje portalu.
- Podwojny klucz `savedRecord` w `ContextActionDialogs` zostal usuniety.
- Znalezione problemy obok zakresu: brak nowych.

## STAGE232B_R4_IDEMPOTENT_REPAIR_2026_06_15

Data: 2026-06-15 21:30 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA
Etap: STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH R4

Zakres techniczny:
- R4 usuwa kruchość patchy R1/R2/R3 opartych o dokładne needle/line ending.
- TodayStable ma jawny marker STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH.
- Kafelek i sekcja Owner Control używają nazwy Wymaga ruchu i liczą actionRequiredRows.
- R6: usunieto z UI odrzucony dopisek techniczny spod kafelka `Wymaga ruchu`; nie wymagac go w testach recznych.
- Najbliższe 7 dni liczy upcomingRowsAll, pokazuje upcomingRowsPreview top 10 i disclosure pokazano 10 z X.
- Zadania używają dynamicznej etykiety: Zadania dziś / Zaległe zadania / Zadania dziś i zaległe / Zadania do obsługi.

Testy wymagane:
- node scripts/check-stage232b-today-owner-control-tiles.cjs
- node --test tests/stage232b-today-owner-control-tiles.test.cjs
- npm run build
- git diff --check

Uwaga:
verify:closeflow:quiet może nadal zgłosić stary niezwiązany guard CaseDetail. To jest zapisane jako SKIP_UNRELATED/DO_ANALIZY, bo STAGE232B dotyczy /today.

Test ręczny Damiana:
- wejść w /today,
- sprawdzić Wymaga ruchu,
- sprawdzić helper pod sekcją,
- sprawdzić zgodność licznik kafelka = licznik sekcji = liczba listy,
- sprawdzić Najbliższe 7 dni: full count i pokazano 10 z X przy ponad 10 rekordach,
- dopiero wtedy zmienić status na PRODUCT_PASS.

## STAGE232B_R6_TODAY_REMOVE_DEV_HELPER_COPY_AND_QUEUE_REPAIR

Data: 2026-06-15 22:05 Europe/Warsaw
Status: RYZYKO_NISKIE / DO_SPRAWDZENIA_RECZNEGO

Ryzyka:
- usuniecie dopisku moze zmniejszyc wyjasnienie znaczenia `Wymaga ruchu`, ale poprawia naturalnosc UI i usuwa developerski komentarz z produktu,
- nalezy pilnowac, zeby przyszle copy produktowe nie bylo dodawane jako techniczne objasnienie,
- stary unrelated guard CaseDetail nadal jest osobnym ryzykiem do osobnego etapu.

## STAGE232B_R8_TODAY_LABEL_AND_HELPER_COPY_FIX

Data: 2026-06-15 22:35 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

Zakres:
- usunieto z /today dopisek developerski: "To nie jest kalendarz...";
- przywrocono i zabezpieczono etykiete kafelka: "Wymaga ruchu";
- guard/test blokuja powrot technicznego/helperowego copy w UI;
- nie ruszano STAGE232A, LeadDetail, CaseDetail, SQL, Google Calendar ani finansow.

Testy:
- node scripts/check-stage232b-today-owner-control-tiles.cjs — PASS;
- node --test tests/stage232b-today-owner-control-tiles.test.cjs — PASS;
- npm run build — PASS;
- verify:closeflow:quiet — SKIP_UNRELATED/DO_ANALIZY dla starego guarda CaseDetail.

Audyt ryzyk:
- R7 ujawnil regresje copy/label: usuniecie helpera nie moze zmieniac kontraktu "Wymaga ruchu";
- dodano guard antyregresyjny na brak dopisku "To nie jest kalendarz" i obecność "Wymaga ruchu";
- CaseDetail guard pozostaje osobnym ryzykiem do osobnego etapu, bez mieszania ze STAGE232B.

## STAGE232A_R4_LEAD_MISSING_BLOCKER_CONTRACT_REPAIR

Data: 2026-06-15 23:35 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

Brak/Blokada ma jawne pola missingKind, blocksProgress i blockScope. Modal i ContextActionDialogs zapisują metadata do historii/no-flicker payloadu. R4 naprawia częściowy stan po nieudanych R1/R2/R3.

Ryzyko: brak pewności utrwalenia metadata w tasku bez audytu API. Ewentualny kolejny etap: API/SQL persistence.

## STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH

Data: 2026-06-15 23:55 Europe/Warsaw
Status: TECH_PUSHED / DO_SPRAWDZENIA_RECZNEGO

Zakres:
- modal Dodaj brak zostaje podpięty pod wizualne źródło prawdy szybkiego dodawania leada: lead-form-vnext;
- karta, nagłówek, sekcje, grid pól, select, checkbox, textarea i footer używają tych samych klas źródłowych;
- logika Brak/Blokada z STAGE232A R4 nie jest refaktorowana;
- dodany guard/test blokuje powrót jasnego, słabo czytelnego standalone shell dla MissingItemQuickActionModal.

Testy:
- node scripts/check-stage232a-r5-missing-item-visual-source.cjs;
- node --test tests/stage232a-r5-missing-item-visual-source.test.cjs;
- npm run build;
- verify:closeflow:quiet traktować jako SKIP_UNRELATED jeśli pada wyłącznie na stary CaseDetail guard.

Audyt ryzyk:
- ryzyko: zmiana CSS może wpływać na modal Brak w lead/client/case, bo komponent jest wspólny;
- guard ogranicza regresję do wizualnego kontraktu, ale manualnie trzeba sprawdzić modal na LeadDetail;
- nie ruszano SQL, API, aktywnych list Brak/Blokada ani CaseDetail.

## 2026-06-16 03:10 Europe/Warsaw - STAGE232A_R5 status sync

Status: TECH_PUSHED / DO_SPRAWDZENIA_RECZNEGO

Korekta dokumentacyjna:
- commit techniczny R5 jest wypchniety do GitHuba: 6a16c71c4f700af756c9d1a616b523e233c32219;
- poprzedni status WDROZONE_ZIP_DO_SPRAWDZENIA byl nieaktualny po pushu;
- Product PASS wymaga nadal recznego potwierdzenia wygladu modala Dodaj brak w przegladarce;
- historyczny verify:closeflow:quiet byl blokowany przez osobny CaseDetail guard, nie przez zakres STAGE232A_R5.


## 2026-06-16 04:08 Europe/Warsaw - STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Zakres:
- LeadDetail aktywne Braki sa filtrowane z linkedTasks/workItems, nie z historii/activity.
- Blokady sa subsetem aktywnych brakow przez explicit blocksProgress albo status zawierajacy block.
- Top card Blokada nie dostaje kazdego braku jako blokady.
- ContextActionDialogs utrwala missingKind, blocksProgress, blockScope i payload na tasku/no-flicker saved record.
- R6-R2 naprawia bledy kruchych kotwic z R6/R6-R1.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- metadata persistence wymaga recznego hard refresh smoke;
- no-flicker moze wygladac dobrze przed reloadem, dlatego test manualny jest obowiazkowy;
- nie ruszano SQL/CaseDetail/Google Calendar/finansow.


## 2026-06-16 04:20 Europe/Warsaw - STAGE232A_R6_R3_CF_RUNTIME_SCOPE_GUARD_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Korekta:
- R6-R2 przeszedl patch, guard R6, test R6 i build.
- verify:closeflow:quiet zatrzymal sie na CF-RUNTIME-00 source truth guard, bo stary guard blokowal pliki R6 jako out-of-scope.
- R6-R3 rozszerza allowlist CF-RUNTIME scope guarda o jawne pliki R6.
- To nie zmienia logiki LeadDetail/ContextActionDialogs; to kompatybilnosc guardow po zamknietym CF-RUNTIME-00.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check


## 2026-06-16 05:05 Europe/Warsaw - STAGE232A_R7_CASE_ITEMS_ITEM_ORDER_SCHEMA_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem produkcyjny:
- Dodanie Braku dla sprawy zwracalo PGRST204: schema cache nie ma kolumny case_items.item_order.
- Błąd blokował zapis Braku.

Zakres:
- api/case-items.ts GET: fallback z order=item_order.asc,created_at.asc na order=created_at.asc.
- api/case-items.ts POST: insertWithVariants próbuje payload z item_order i fallback bez item_order.
- Bez SQL i bez migracji w tym hotfixie.

Testy:
- node scripts/check-stage232a-r7-case-items-item-order-schema-compat.cjs
- node --test tests/stage232a-r7-case-items-item-order-schema-compat.test.cjs
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Jeśli brak na sprawie wymaga trwałego porządku listy, trzeba później zrobić schema check/migrację item_order jako osobny SQL etap.
- Ten hotfix ma przywrócić zapis bez wymuszania migracji.


## 2026-06-16 06:55 Europe/Warsaw - STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8-R4 czesciowo zapisal LeadDetail.tsx i ContextActionDialogs.tsx, a potem zatrzymal sie na data-contract przez zbyt krucha kotwice.
- Ten wpis domyka stan posredni: data-contract, task-route, guard/test, CF-RUNTIME scope, run report i Obsidian payload.

Zakres:
- LeadDetail: aktywne Braki nadal pochodza z linkedTasks, ale renderuja sie jako timeline entries.
- LeadDetail: Najblizsze dzialania wykluczaja aktywne Braki.
- LeadDetail: Braki i blokady licza wszystkie aktywne Braki; top card Blokada liczy tylko subset blokujacy.
- ContextActionDialogs: activity dostaje taskId i explicit blocker status.
- data-contract/task-route: zachowuja missing_item/blocking_missing_item status.

Testy:
- node scripts/check-stage232a-r8-lead-missing-blocker-ui-source-truth.cjs
- node --test tests/stage232a-r8-lead-missing-blocker-ui-source-truth.test.cjs
- guard/test R7
- guard/test R6
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- R8 ma kompatybilnosc po tytule dla starych rekordow bez taskId; dziala tylko gdy istnieje aktywny task, aby historia sama nie wskrzeszala brakow.
- Po deployu wymagany reczny smoke na tym samym leadzie.


## 2026-06-16 07:10 Europe/Warsaw - STAGE232A_R8_R6_R6_GUARD_COMPAT_CLOSURE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8-R5 domknal kod i nowy guard/test R8, ale stary guard R6 byl zbyt literalny.
- R6 guard szukal dokladnego tokenu isActiveMissingItemTaskStage232AR6(entry), mimo ze R8 zachowal zrodlo linkedTasks przez successor helper isActiveMissingItemTaskStage232AR8(entry, leadMissingActivityMetadataStage232AR8).

Zakres:
- Aktualizacja scripts/check-stage232a-r6-lead-missing-active-source.cjs.
- Aktualizacja tests/stage232a-r6-lead-missing-active-source.test.cjs.
- Brak zmian funkcjonalnych w UI ponad R8-R5.

Testy:
- R8 guard/test
- R7 guard/test
- R6 guard/test po kompatybilnosci
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check


## 2026-06-16 21:35 Europe/Warsaw - STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R8 poprawil klasyfikacje Brak/Blokada, ale top card Blokada nadal pokazywal akcje per-item: Rozwiaz brak / Usun brak.
- Gdy istnieje aktywna blokada, top card nie mial przycisku Dodaj brak, wiec uzytkownik mial wrazenie limitu jednego braku.
- Wlasciwy model: top card = summary + Dodaj brak + Zobacz wszystkie braki; akcje Rozwiaz/Usun tylko przy konkretnych brakach w zoltym akordeonie.

Zakres:
- LeadDetail top card Blokada jest summary-only.
- Dodaj brak jest dostepne zawsze, niezaleznie od liczby aktywnych blokad.
- Zobacz wszystkie braki otwiera akordeon Braki i blokady i scrolluje do Dzialania leada.
- Akcje Rozwiaz brak / Usun brak zostaja tylko w liscie per-item.
- Dla grupy blockers w akordeonie widoczne sa tylko akcje brakowe, bez Edytuj/Jutro.

Testy:
- node scripts/check-stage232a-r9-blocker-top-card-summary.cjs
- node --test tests/stage232a-r9-blocker-top-card-summary.test.cjs
- R8/R6/R7 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- Zmiana dotyka tylko LeadDetail UI. Wymagany manual smoke: dodaj drugi brak, zobacz liste, rozwiaz/usun z listy.


## 2026-06-16 21:50 Europe/Warsaw - STAGE232A_R9_R2_R8_GUARD_COMPAT_CLOSURE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R9-R1 zapisal top card summary i nowy guard/test R9, ale stary guard R8 byl zbyt literalny.
- R8 guard wymagal tokenu group.key === 'blockers' || isMissingItemTimelineEntry(entry), a R9 celowo zastapil to osobnym branch modelem missing-only.

Zakres:
- Aktualizacja R8 guard/test, aby akceptowaly R9 missing-only branch.
- Brak nowych zmian UI ponad R9-R1.
- Utrzymane R8 warunki: aktywne Braki z linkedTasks, render timeline, wykluczenie z Najblizsze dzialania, count/items wszystkich aktywnych brakow.

Testy:
- R9 guard/test
- R8 guard/test po kompatybilnosci
- R6 guard/test
- R7 guard/test
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check


## 2026-06-16 22:45 Europe/Warsaw - STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Top decision cards na LeadDetail nie byly dosc konsekwentnie spiete z kolorystyka rozwijanych list.
- Modal Dodaj brak wizualnie odstawal od szybkiego dodawania leada i wygladal jak osobny komponent.
- Damian wskazal jedno zrodlo prawdy wizualne: quick lead form / lead-form-vnext.

Zakres:
- LeadDetail top cards: blue/green/amber/red soft-tone palette zgodna z rozwijanymi listami.
- MissingItemQuickActionModal: jawny R10 marker i data attr dla quick-lead visual source.
- stage232a-missing-item-visual-source.css: dark quick-lead shell, white inputs, sticky footer, consistent buttons.
- Guard/test R10.

Testy:
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- R9/R8/R6 guardy regresyjne
- CF-RUNTIME guard
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- To jest etap wizualny: konieczny manual smoke na LeadDetail z modalem Dodaj brak i top cardami.
- Nie ruszano źródeł danych ani logiki zapisu.


## 2026-06-16 23:45 Europe/Warsaw - STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R10 poprawil kolory top cardow i modal, ale po screenshocie Damiana wewnetrzny kafelek/empty state w rozwinietej liscie Braki i blokady nadal wygladal neutralnie.
- Decyzja: nie wystarczy zolty header grupy. Wewnetrzny pusty kafelek i wiersze w grupie blockers musza miec amber/missing tone.

Zakres:
- LeadDetail dodaje jawne data attr dla empty state i wierszy w grupie blockers.
- visual-stage14 dodaje R10-R1 CSS: amber background/border/text dla empty state i wierszy w Braki i blokady.
- Dodany guard/test R10-R1.
- Dodany mirror placementu do _project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md.

Testy:
- node scripts/check-stage232a-r10-r1-missing-group-inner-tone.cjs
- node --test tests/stage232a-r10-r1-missing-group-inner-tone.test.cjs
- R10/R9/R8 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- Zmiana wizualna CSS, bez zmian danych. Wymaga manualnego smoke na ekranie.


## 2026-06-17 00:15 Europe/Warsaw - STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- R10/R10-R1 przeszly technicznie, ale efekt wizualny na screenshocie nadal byl slaby.
- Same pastelowe tla nie zbudowaly czytelnej hierarchii w sekcji Dzialania leada.
- Damian polecil: zajmij sie ty.

Zakres:
- Dodany globalny CSS override importowany z index.css, aby wygrac z kolejnością starych stage CSS.
- Sekcja Dzialania leada dostaje twardsza hierarchie: biala rama sekcji, mocniejszy border, pasek akcentu po lewej, wyrazniejsze badge i empty states.
- Braki i blokady dostaja mocniejszy amber/missing tone wewnatrz, nie tylko na headerze.
- Notatki pozostaja neutralne.
- Dodany guard/test R10-R2.

Testy:
- node scripts/check-stage232a-r10-r2-lead-action-groups-visual-polish.cjs
- node --test tests/stage232a-r10-r2-lead-action-groups-visual-polish.test.cjs
- R10-R1/R10/R9/R8 guardy regresyjne
- CF-RUNTIME guard
- build
- verify:closeflow:quiet
- git diff --check

Ryzyka:
- To nadal etap wizualny. Guard potwierdza kontrakt CSS, ale ostateczna ocena jest ze screenshota.


## 2026-06-17 01:05 Europe/Warsaw - STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Pierwsza paczka STAGE232J_R1 zatrzymala sie przed zapisem, bo szukala blednej kotwicy Layout marker.
- Aktualny Layout ma importy na gorze i blok komentarzy przed useWorkspace; nie ma fragmentu */ + pusta linia + import useWorkspace.
- R1-R1 naprawia tylko kotwice patchera i wdraza ten sam runtime scroll fix.

Zakres runtime:
- Layout: route-scoped useEffect dla /leads.
- CSS: route-scoped selector dla main[data-current-section=leads] i content scroll owner.
- Guard/test STAGE232J_R1.
- Mirror do centralnej kolejki 04.

Testy:
- node scripts/check-stage232j-leads-scroll-top-cut.cjs
- node --test tests/stage232j-leads-scroll-top-cut.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Layout jest globalny, ale fix jest zawężony do location.pathname === '/leads'.
- Manualny smoke /leads jest obowiazkowy.


## 2026-06-17 02:05 Europe/Warsaw - STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR / STAGE232A_R11_R1_MISSING_MODAL_CONST_ANCHOR_FIX

Status: PASS_LOCAL_DO_SPRAWDZENIA

Problem:
- Pierwsza paczka R11 zatrzymala sie przed zapisem, bo patcher mial zbyt szczegolowa kotwice R10 const.
- Aktualny komponent ma R10 const z tekstem o dark modal surface i nie moze byc patchowany po wczesniejszej wymianie tekstu.
- R11-R1 uzywa robust regex replacement dla calego const block.

Zakres:
- MissingItemQuickActionModal: R10 const przepisany na light lead-form-vnext source; dodany marker R11 i R11-R1.
- stage232a-missing-item-visual-source.css: ciemny shell R10 zastapiony jasnym +Lead source.
- Guard/test R11.
- STAGE232D_R1 nadal zostaje nastepnym runtime etapem.

Testy:
- node scripts/check-stage232a-r11-missing-modal-quick-lead-visual-source.cjs
- node --test tests/stage232a-r11-missing-modal-quick-lead-visual-source.test.cjs
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- Wizualnie dotyka wspolnego modala Brak. Manualny smoke wymagany po deployu.


## 2026-06-17 02:20 Europe/Warsaw - STAGE232A_R11_R2_R10_GUARD_COMPAT

Status: GUARD_COMPAT_FOR_R11

Problem:
- R11 poprawnie zmienil modal Brak na jasny +Lead source truth.
- Stary guard R10 nadal wymagal dark shell background #0f172a.
- To byl konflikt aktywnych zrodel prawdy: R10 dark shell vs R11 jasny +Lead.

Zakres:
- Zaktualizowano R10 guard/test jako compatibility guard.
- R10 nadal pilnuje markerow top card i quick-lead source, ale dark missing modal shell jest deprecated.
- R11 pozostaje aktualnym zrodlem prawdy modala Brak.

Testy:
- node scripts/check-stage232a-r11-missing-modal-quick-lead-visual-source.cjs
- node --test tests/stage232a-r11-missing-modal-quick-lead-visual-source.test.cjs
- node scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs
- node --test tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check


## 2026-06-17 02:35 Europe/Warsaw - STAGE232A_R11_R3_R10_GUARD_CONTRACT_RELAX

Status: GUARD_COMPAT_FOR_R11

Problem:
- R11-R2 naprawil ciemny shell contract, ale R10 guard zaczal wymagac literalnej klasy lead-detail-action-accordion-group--blockers w LeadDetail.tsx.
- To jest zbyt szczegolowy warunek: klasa moze byc w CSS albo powstac runtime i nie musi istniec literalnie w komponencie.
- R11-R3 luzuje kontrakt R10 do stabilnych markerow stage lineage i aktywnego R11 light modal source truth.

Zakres:
- Zaktualizowano R10 guard/test bez cofania R11.
- Guard nadal blokuje powrot dark #0f172a/#111827 shell.
- R11 pozostaje aktualnym source truth modala Brak.


## 2026-06-17 03:30 Europe/Warsaw - STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE

Status: DO_APPLY_ZIP / SCREENSHOT_DRIVEN_REPAIR

Problem:
- Damian pokazal screenshot: Brak po R11 jest jasny, a Nowy lead jest ciemny.
- R11 wybral zle zrodlo prawdy: statyczny jasny lead-form-vnext zamiast realnego ciemnego runtime +Lead modal.
- R12 deprecjonuje R11 light interpretation i ustawia aktywne zrodlo: dark Nowy lead modal match.

Zakres:
- MissingItemQuickActionModal const markers.
- stage232a-missing-item-visual-source.css dark shell/section/white fields/blue CTA.
- R10/R11 compatibility guard/test rewrite.
- R12 guard/test.

Ryzyka:
- To celowo odwraca R11. Manualny smoke musi porownac Brak z Nowy lead.


## 2026-06-17 05:05 Europe/Warsaw - STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE

Status: DO_APPLY_ZIP / SCREENSHOT_DRIVEN_HEADER_REPAIR

Problem:
- R13 i R13-R1 zatrzymaly sie przez zbyt szczegolowe kotwice TSX.
- Screenshot pokazuje realny problem w headerze: widac dodatkowe top-left teksty "Brak" i context.
- R13-R2 naprawia to CSS-only przez ukrycie dodatkowych elementow w headerze modala Brak.

Zakres:
- CSS-only override w stage232a-missing-item-visual-source.css.
- Nowy guard/test R13-R2.
- Aktualizacja CF runtime allowlist i dokumentacji.
- Nie dotyka TSX ani logiki danych.

Testy:
- node scripts/check-stage232a-r13-r2-header-css-source-override.cjs
- node --test tests/stage232a-r13-r2-header-css-source-override.test.cjs
- node scripts/check-stage232a-r12-missing-modal-match-plus-lead-dark-source.cjs
- node --test tests/stage232a-r12-missing-modal-match-plus-lead-dark-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Ryzyka:
- CSS hide moze ukryc subtitle tylko w modal headerze Brak. To jest zamierzone.
- Dane i context nie sa usuwane z modelu, tylko z top-left headera.


## 2026-06-17 16:05 Europe/Warsaw - STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX

Status: DO_APPLY_ZIP / RUNTIME_FIX_R1_R1

Problem:
- Poprzedni R1 padl przez zbyt sztywna kotwice w activity-truth.ts.
- Realny bug pozostaje: lead ma status Skontaktowany, ale kafelek Cisza / ryzyko nadal pokazuje stara cisze.

Decyzja:
- Naprawa idzie w zrodle prawdy: updateLeadInSupabase + buildActivityTruth.
- Patch Skontaktowany/Kontakt wykonany stampuje lastContactAt.
- Tworzony jest best-effort activity eventType=manual_contact_done dla tego samego leadId.
- Activity truth traktuje status Skontaktowany jako explicit contact truth.
- Future follow-up/event nie resetuje kontaktu tylko z powodu slowa kontakt/telefon.

Testy:
- node scripts/check-stage232d-owner-contact-done-runtime-fix.cjs
- node --test tests/stage232d-owner-contact-done-runtime-fix.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check

Manual smoke:
- Klik Kontakt wykonany / ustaw Skontaktowany.
- Kafelek Cisza ma zniknac bez F5.
- Po F5 cisza nie wraca.


## 2026-06-17 17:05 Europe/Warsaw - STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT

Ryzyko: case_items jako drugie źródło prawdy; płaska agregacja ClientDetail bez źródła; Owner Control przed stabilizacją I1/I2.


## 2026-06-17 21:15 Europe/Warsaw - STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP_R7 / RUNTIME

Zakres:
- CaseDetail Braki/Blokady jako task/work item missing_item z caseId,
- explicit button data-context-action-kind="blocker",
- case_items tylko legacy/checklist compatibility,
- resolve/delete dla missing_item,
- historia: missing_item_created/resolved/deleted,
- bez SQL, bez ClientDetail, bez Owner Control cross-entity.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: DO_APPLY_ZIP / VISUAL_FIX

Zakres:
- poprawa czytelności modala "Dodaj brak" na ciemnym shellu,
- tytuł, labelki, checkbox helper i tekst pól wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Braków/Blokad.

## 2026-06-18 00:25 Europe/Warsaw - STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Zakres:
- ClientDetail agreguje directClientMissingItems, leadMissingItems i caseMissingItems.
- Kazdy aktywny Brak/Blokada ma source badge: [Klient], [Lead], [Sprawa].
- Filtry: Wszystkie / Klient / Leady / Sprawy / Blokady / Braki.
- Resolve/delete dziala na zrodlowym missing_item task/work item przez istniejace handlery po item.id.
- Historia nie jest aktywnym zrodlem listy.
- Bez SQL i bez Owner Control runtime.

## 2026-06-18 01:00 Europe/Warsaw - STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Usuwanie Braku u klienta zwracalo METHOD_NOT_ALLOWED.

Zmiana:
- ClientDetail delete Braku klienta przechodzi na soft-delete przez updateTaskInSupabase.
- Fizyczny deleteTaskFromSupabase nie jest uzywany w handlerze Braku klienta.
- Task dostaje status 'deleted' i payload stage232i2DeleteMode='soft_delete_no_method_delete'.
- Aktywna lista filtruje deleted, wiec wpis znika po usunieciu.
- Bez SQL i bez Owner Control.

## 2026-06-18 02:25 Europe/Warsaw - STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Powód:
- METHOD_NOT_ALLOWED dotyczy kosza w CaseDetail legacy case_items/checklist.
- Nie dotyczy ClientDetail missing_item.

Zmiana:
- aktywne deleteCaseItemFromSupabase(item.id) zastąpione przez updateCaseItemInSupabase({ status: 'rejected' }),
- brak znika jak po Odrzuć,
- bez SQL, bez Owner Control, bez ClientDetail.

## 2026-06-18 03:05 Europe/Warsaw - STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail task delete rzucał ReferenceError: getLinkedNoteForTaskStage231H_R1D2_R15C is not defined.

Audyt:
- błąd jest w CaseDetail task branch,
- poprawny helper istnieje jako findCaseNoteForFollowUpTaskStage231H_R1D2_R15C,
- ClientDetail nie zawiera tej referencji,
- LeadDetail/TodayStable mają osobne delete flow, nie są źródłem tego ReferenceError.

Zmiana:
- task delete używa zdefiniowanego helpera,
- dodano guard/test blokujący niezdefiniowany helper.

## 2026-06-18 03:45 Europe/Warsaw - STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail missing_item po usunięciu migał, ale nadal był widoczny.

Audyt:
- filtr CaseDetail dla missing_item uznawał za zamknięte tylko done/completed/accepted,
- brakowało deleted/rejected/resolved/archived/cancelled/canceled,
- ClientDetail ma szerszą listę statusów i dlatego zachowuje się poprawniej.

Zmiana:
- CaseDetail missing_item inactive filter rozszerzony,
- delete branch zapisuje status deleted przez updateTaskInSupabase,
- local state setTasks zamyka row natychmiast.

## 2026-06-18 04:45 Europe/Warsaw - STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Brak zapisany jako task missing_item był wizualnie pokazywany jako Zadanie, szczególnie w LeadDetail.

Audyt:
- ContextActionDialogs zapisuje type/kind/status missing_item,
- LeadDetail buildTimeline każdy task mapuje jako task,
- render wiersza korzystał z entry.kind i wypisywał "Zadanie" mimo że isMissingItemTimelineEntry rozpoznawał Brak.

Zmiana:
- LeadDetail renderuje missing_item jako Brak albo Blokada,
- status wiersza dla missing_item pokazuje Brak/Blokada zamiast Zaległe,
- no-flicker mutation niesie displayKind/businessKind.

## 2026-06-18 05:35 Europe/Warsaw - STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- Braki były w dobrej grupie, ale renderowały się jako Zadanie/Zaległe.
- W CaseDetail Brak wpadał do Wszystkie aktywne jako zwykły task.

Audyt:
- STAGE232N działa dla entries z missing metadata,
- zrzut ekranu pokazuje przypadek activity-bridged missing bez metadanych na timeline entry,
- CaseDetail buildWorkItems nie używał activity missing_item_created do wzbogacenia tasków.

Zmiana:
- LeadDetail markeruje active missing entries jako stage232oMissingItem,
- ContextActionDialogs wysyła enriched savedRecord,
- CaseDetail wzbogaca taski z activity metadata przed buildWorkItems.

## 2026-06-18 14:05 Europe/Warsaw - STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail nie ładował widoku po STAGE232O.
- Runtime: taskWithMissingBridgeStage232O is not defined.

Audyt:
- taskWithMissingBridgeStage232O istnieje w useMemo openTasksWithNoteFollowUpPreviewStage231H_R1D2_R11,
- buildWorkItems jest funkcją zewnętrzną i nie ma dostępu do tej zmiennej,
- buildWorkItems powinien operować na swoim lokalnym task, bo dostaje już wzbogacone taski.

Zmiana:
- buildWorkItems używa task w getTaskNoteFollowUpPreviewStage231H_R1D2_R11,
- dodano guard/test scope.

## 2026-06-18 15:05 Europe/Warsaw - STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Problem:
- CaseDetail Braki i blokady miały licznik, ale nie renderowały wiersza po rozwinięciu.

Audyt:
- count i items bazują na workItems.filter(entry.kind === 'missing'),
- group.items.map renderuje WorkItemRow,
- WorkItemRow zwraca null, jeśli isCaseActivitySourceForWorkRow(entry.source),
- helper uznawał samo payload za activity,
- missing_item task ma payload, więc był liczony, ale ukryty.

Zmiana:
- payload-only nie oznacza activity,
- activity detection wymaga eventType/actorType i wyklucza work-row shape,
- guard/test blokują regresję.

## 2026-06-18 15:35 Europe/Warsaw - STAGE232R_MISSING_ITEM_RENDER_FREEZE_GUARD

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Decyzja:
- Damian potwierdził: po STAGE232Q jest OK.
- Zamrażamy zachowanie Brak/Blokada.

Guard blokuje:
- LeadDetail missing_item jako "Zadanie",
- CaseDetail puste rows przy liczniku Braki i blokady > 0 z powodu payload-only activity,
- powrót payload-only detection w isCaseActivitySourceForWorkRow,
- utratę enriched missing record w ContextActionDialogs.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R5 risk audit

- Ryzyko usuniete: R16O guard/test wymagal obsolete xl:w-[1100px] i mogl zmusic kolejnego developera do cofania finalnego R16Z_R4 layoutu.
- R16Z_R5 aktualizuje R16O tak, aby chronil wiring/parity, ale uznawal finalny layout 760px/flex.
- Ryzyko pozostale: manual smoke klient + lead jest wymagany przed STAGE232K.
- Ryzyko pozostale: lokalne untracked backupy .stage232i4_* i stare artefakty moga robic szum; nie uzywac git add .
- Czego nie ruszano: SQL, finanse, Google Calendar, billing/trial, Owner Control runtime, CaseDetail runtime.

## STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: LOCAL APPLY CONTINUATION / guards consolidated before final smoke and push.
Scope: CF-RUNTIME-00 and R16Z_R5 close guard allow the R5_R5 ClientDetail operational center test compatibility repair and R6 final allowlist files. No SQL, finance, Calendar, billing, Owner Control runtime or CaseDetail runtime touched.

## STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL

Date/time: 2026-06-21 Europe/Warsaw
Status: APPLIED_LOCAL_PENDING_VERIFY_AND_SMOKE
Scope: guard/test compatibility continuation for polish-mojibake-audit. The audit now skips local stage backup artifacts and huge text-like files before reading them, preventing ERR_STRING_TOO_LONG during verify:closeflow:quiet. No product logic, SQL, finance, Calendar, Owner Control runtime or CaseDetail runtime touched.

## STAGE232I4_R16Z_R8 risk audit

Manual smoke exposed stale priority high in LeadDetail missing item blocker toggle. Risk: manager UI may show success while persisted source truth still classifies item as blocker. Fix requires status, priority, blocksProgress and payload to be persisted together. Do not close R16Z/R5 or start STAGE232K before Lead F5 smoke passes.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R9 risk audit

Status: TECH_APPLIED_LOCAL / OWNER_SMOKE_REQUIRED.

Zakres:
- Naprawa realnego bug smoke: LeadDetail -> Zobacz wszystkie braki -> checkbox Blokuje wracal jako zaznaczony po silent refresh/F5.
- Przyczyna: MissingItemsManagerDialog.isManagerItemBlocker liczyl blokade przez OR z
aw.status/raw.priority, wiec stare dane activity bridge mogly nadpisac swieze locksProgress=false.
- Naprawa: jawne item.isBlocker / item.blocksProgress ma pierwszenstwo przed raw/payload/status/priority fallback.

Testy:
- R9 guard/test.
- R8 regression.
- R16Z_R5 close regression.
- build / verify / diff-check.

Manual smoke:
- LeadDetail: odznacz Blokuje, F5, checkbox ma zostac odznaczony; zaznacz ponownie, F5, checkbox ma zostac zaznaczony.

Nie ruszac:
- SQL, RLS, finanse, Calendar, billing/trial, Owner Control runtime, CaseDetail runtime.

## 2026-06-21 Europe/Warsaw - STAGE232I4_R16Z_R10 risk audit
Risk: old missing_item_created/activity bridge metadata can override newer task state if not timestamped and if direct task state is not used first. Fixed for LeadDetail missing checkbox classifier.


## STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE

- data/czas: 2026-06-21 Europe/Warsaw
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK after Damian manual smoke confirmation.
- closes: STAGE232I4_R16Z_R9 and STAGE232I4_R16Z_R10.
- owner smoke: LEAD SMOKE PASS, CLIENT REGRESSION PASS.
- guard scope: CF-RUNTIME active allowlist owns diff scope; R16Z_R5 close guard must not keep dead R10 allowlist constants.
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH.
- forbidden scope: no SQL, no finance, no Calendar, no billing, no Owner Control runtime, no ClientDetail runtime, no CaseDetail runtime.

Risk audit: do not create dead allowlist constants after guard execution; next closures must patch active guard data structures or explicitly mark guard as non-scope guard.


# STAGE232I4_R16Z_R10_R3_R4_OVERWRITE_GUARDS_FINAL

- data/czas: 2026-06-21 HH:mm Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_PUSHED / CLOSED / OWNER_SMOKE_OK
- owner smoke: LEAD PASS, CLIENT REGRESSION PASS, reported by Damian
- closes: STAGE232I4_R16Z_R10 and R16Z close/status sync
- next: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
- no SQL, no ClientDetail runtime, no CaseDetail runtime, no Calendar, no billing, no Owner Control runtime

<!-- STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS -->

## 2026-06-22 Europe/Warsaw — STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS

Status: APPLIED_PENDING_TEST_OR_PUSH.

Zakres:
- commissionStatus jest wyliczany z opłaconych wpłat prowizji, nie z ręcznego pola legacy,
- edytor finansów nie pokazuje aktywnego selecta statusu prowizji,
- buildCaseFinancePatch nie utrwala ręcznego paid/partially_paid,
- lista Lista wpłat prowizji dostaje tylko płatności type=commission,
- label brzmi Pozostało prowizji do zapłaty.

Nie dotykano: SQL/RLS, Braki/Blokady, MissingItemsManagerDialog, Owner Control, Google Calendar, billing/trial, Node_RED_Kabelki.

Ryzyko: stare commissionStatus=paid/partially_paid nie może maskować braku wpłat prowizji.

<!-- STAGE232K_R1C_CASE_COMMISSION_STATUS_RED_GUARD_REPAIR -->

## 2026-06-22 12:20 Europe/Warsaw — STAGE232K_R1C ryzyko

R1B został wypchnięty mimo czerwonych testów/guardów. Ten wpis koryguje procesowo etap: nie traktować R1B jako zamkniętego PASS. Domknięcie dopiero po R1C PASS i nowym commicie.
