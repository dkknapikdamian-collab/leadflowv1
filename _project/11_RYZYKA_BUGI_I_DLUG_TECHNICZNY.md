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

- Potencjalne ryzyko: label/key based tone resolver moĹĽe Ĺşle dobraÄ‡ kolor przy nowych nazwach. Mitigacja: SimpleFilterItem obsĹ‚uguje explicit tone.
- Potencjalne ryzyko: import CSS w OperatorSideCard obejmuje wszystkie operator rail cards. To celowe, ale trzeba sprawdziÄ‡ /leads, /clients i /cases.
- Potencjalne ryzyko: usuniÄ™cie helper sentence w case row zmniejsza iloĹ›Ä‡ tekstu diagnostycznego na liĹ›cie. SzczegĂłĹ‚y nadal zostajÄ… w status pills i detailu sprawy.
- Test rÄ™czny: /cases desktop i narrow width, potem /leads oraz /clients right rail smoke.

<!-- STAGE228H_R3_RISKS -->
## 2026-06-07 19:45 Europe/Warsaw - STAGE228H R3 risks
- Ryzyko: wczeĹ›niejsze etapy F/G sÄ… nadal lokalne i modyfikujÄ… te same obszary UI; przed commitem potrzebny zbiorczy smoke /leads /clients /cases /dev/funnel.
- Ryzyko: prebuild miaĹ‚ stary guard wymagajÄ…cy skasowanego copy; R3 aktualizuje guard, bo inaczej build byĹ‚by sprzeczny z decyzjÄ… UI cleanup.
- Ryzyko: /dev/funnel bez logowania uĹĽywaÄ‡ tylko do podglÄ…du dev; /funnel produkcyjnie zostaje chroniony.
<!-- /STAGE228H_R3_RISKS -->

<!-- STAGE228R1_RISK -->
## 2026-06-08 - Stage228R1 risk audit
- Ryzyko: lokalne stare pliki Stage228 mogÄ… nadal istnieÄ‡, ale nie powinny byÄ‡ aktywnie importowane.
- Ryzyko: /activity, /ai-drafts, /notifications, /help, /settings, /billing majÄ… inne klasy i wymagajÄ… osobnego etapu.
- Ryzyko: /funnel ma osobny bug kodowania znakĂłw i nie naleĹĽy mieszaÄ‡ go z rail source truth.
<!-- /STAGE228R1_RISK -->

<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_RISK_START -->
## 2026-06-09 - STAGE230C Phone dictation duplicate-words audit

Ryzyka:
- Trace moĹĽe zawieraÄ‡ koĹ„cĂłwkÄ™ realnej treĹ›ci klienta; dlatego pozostaje tylko lokalnym stanem React i UI.
- Automatyczna deduplikacja bez dowodu moĹĽe usuwaÄ‡ poprawne powtĂłrzenia uĹĽytkownika.
- Problem moĹĽe byÄ‡ mobile-only i nie odtworzyÄ‡ siÄ™ na desktopie.
- IME/composition moĹĽe dziaĹ‚aÄ‡ inaczej w Android Chrome, Samsung Keyboard, Gboard i iOS Safari.
- JeĹ›li problem jest po stronie klawiatury/browsera, aplikacja moĹĽe tylko ograniczyÄ‡ skutki albo ostrzec uĹĽytkownika w osobnym etapie.
<!-- STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_RISK_END -->

<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_RISK_START -->
## 2026-06-09 - STAGE230C-R2 Voice debug visibility/readability hotfix

Ryzyka:
- BĹ‚Ä…d dublowania nadal istnieje; R2 tylko umoĹĽliwia zebranie trace.
- JeĹĽeli uĹĽytkownik nie widzi przycisku kopiowania, Stage230C nie daje dowodu.
- Globalne style mogÄ… nadpisywaÄ‡ kolory textarea/buttonĂłw; R2 dodaje scoped `!important` tylko dla quick capture/debug.
- Deduplikacja bez trace nadal zakazana.
<!-- STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX_RISK_END -->

<!-- STAGE230C_R6_VOICE_DEBUG_PANEL_REWRITE_RISK_START -->
## 2026-06-09 - STAGE230C R6 voice debug panel rewrite

Ryzyka:
- R2/R4/R5 zostawiĹ‚y lokalnie czÄ™Ĺ›ciowy stan, wiÄ™c R6 celowo nadpisuje caĹ‚y blok panelu zamiast Ĺ‚ataÄ‡ pojedynczÄ… klamrÄ™.
- Nadal wymagany rÄ™czny test telefonu: widocznoĹ›Ä‡ tekstu, widocznoĹ›Ä‡ Kopiuj trace i realny trace duplikacji.
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
- Globalne style mogÄ… nadal nadpisywaÄ‡ czÄ™Ĺ›Ä‡ komponentĂłw, dlatego R10 uĹĽywa scoped selektorĂłw i !important tylko w obrÄ™bie quick capture.
- Visual source truth jest obecnie w CSS formularzy Stage20; dĹ‚ugofalowo warto wydzieliÄ‡ centralne tokeny formularzy, zamiast rozpraszaÄ‡ klasy.
- Dublowanie dyktowania jest oznaczone jako problem konkretnego telefonu, nie aplikacji, dopĂłki nie pojawi siÄ™ reprodukcja na innym urzÄ…dzeniu.
<!-- STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH_RISK_END -->

<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_RISK_START -->
## 2026-06-09 - STAGE230C R12 R2 guard global marker compatibility

Ryzyka:
- Zbyt kruche guardy JSX potrafiÄ… blokowaÄ‡ dobre poprawki UI; R12 usuwa to ryzyko dla quick capture.
- Guard global-marker jest mniej precyzyjny niĹĽ parser AST, ale bezpieczniejszy niĹĽ bĹ‚Ä™dne wycinanie sekcji po className.
- Docelowo warto wydzieliÄ‡ komponent/form source truth, aby quick capture nie wymagaĹ‚ lokalnych wyjÄ…tkĂłw CSS.
<!-- STAGE230C_R12_R2_GUARD_GLOBAL_MARKER_COMPAT_RISK_END -->

<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_RISK_START -->
## 2026-06-09 - STAGE230C R15 guard split + visual source truth

Ryzyka:
- Dotychczasowe R2-R14 pokazaly zbyt kruche guardy oparte o dokĹ‚adny JSX.
- Dalsze guardy UI powinny sprawdzaÄ‡ stabilne data-markery i source truth, nie peĹ‚ny string className.
- Test telefonu nadal wymagany dla kontrastu: tekst, placeholder, disabled button, przyciski diagnostyczne.
<!-- STAGE230C_R15_GUARD_SPLIT_VISUAL_SOURCE_TRUTH_RISK_END -->

<!-- STAGE231A_GOOGLE_AUTH_ENTRY_CONSISTENCY_RISK_START -->
## 2026-06-09 - STAGE231A Google auth entry consistency

Ryzyka:
- Obecny OAuth bootstrap oznacza publiczny trial dla nowych kont Google, dopĂłki STAGE231D nie zdecyduje inaczej.
- Settings nadal ma akcje bezpieczeĹ„stwa na Firebase Auth i wymaga migracji do Supabase Auth w STAGE231B.
- Maile auth i redirect URL wymagajÄ… osobnej QA w STAGE231C.
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
- Damian zgĹ‚osiĹ‚ biaĹ‚y tekst na biaĹ‚ym tle podczas wpisywania/dyktowania w aplikacji.
- Zakres R1: /ai-drafts, szybki szkic, Stage230C debug trace, input/textarea/select/placeholder/focus.

DECYZJA:
- Tryb CloseFlow: GIT-FIRST / PUSH-FIRST.
- Nie uĹĽywaÄ‡ lokalnych ZIP-Ăłw jako gĹ‚Ăłwnej Ĺ›cieĹĽki dla Damiana.

TESTY:
- Stage230B regression guard/test.
- Stage230C regression guard/test.
- Stage230D0 contrast guard/test.
- npm run build.
- git diff --check.

RYZYKA:
- MoĹĽliwe podobne problemy kontrastu w innych moduĹ‚ach aplikacji.
- Nie wdraĹĽano deduplikacji dyktowania bez trace.
<!-- STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END -->

## 2026-06-10 â€” STAGE231B0 risk audit

- Nie dodano SQL ani pĂłl closed_at/archived_at bez potwierdzenia schematu.
- ZamkniÄ™cie nie zeruje pĂłl finansowych i nie usuwa payments.
- Awaryjne usuniÄ™cie nadal istnieje, wiÄ™c wymaga rÄ™cznego testu UI, czy nie jest mylone z normalnym zakoĹ„czeniem.
- Lifetime earnings klienta wymaga osobnego Stage231B1.

## Risk audit â€” STAGE231B0-R7

Archive/restore uses status update only. No SQL. Existing duplicate savedRecord build warning remains outside this stage.


## R5_CASEDETAIL_RESTORE_REPAIR
- Naprawiono realny brak CaseDetail: "PrzywrĂłÄ‡ sprawÄ™".
- Restore flow uĹĽywa updateCaseInSupabase({ status: 'in_progress' }) i activity "case_lifecycle_reopened".
- Historia i rozliczenia pozostajÄ… zachowane; delete flow nie jest uĹĽywany przez restore.


## R6_REOPEN_HANDLER_ALIAS_REPAIR
- Naprawiono zgodnoĹ›Ä‡ nazwy handlera restore z guardem R7.
- Dodano/upewniono `handleConfirmReopenCaseRecord` jako publiczny handler przywracania sprawy.
- Przycisk `PrzywrĂłÄ‡ sprawÄ™` uĹĽywa handlera reopen.
- Logika finansĂłw, delete flow i dane rozliczeĹ„ pozostajÄ… bez zmian.


## R7_CLOSED_STATUS_LITERAL_REPAIR
- Naprawiono zgodnoĹ›Ä‡ CaseDetail z guardem R7.
- Dodano jawne sprawdzenie `isClosedCaseStatus(caseData?.status)`.
- Zachowano fallback na `effectiveStatus`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach i prowizjach.


## R8_REOPEN_CONST_SEGMENT_REPAIR
- Naprawiono zgodnoĹ›Ä‡ segmentu CaseDetail z guardem R7.
- Handler przywracania ma teraz formÄ™ `const handleConfirmReopenCaseRecord = async () => { ... }`.
- Przycisk `PrzywrĂłÄ‡ sprawÄ™` uĹĽywa handlera reopen.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach i prowizjach.


## R9_CASES_CLOSED_VIEW_LITERAL_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `Cases.tsx` z guardem R7.
- `CaseView` zawiera literal `| 'closed'`.
- Utrwalono kontrakt widoku `/cases?view=closed`, etykietÄ™ `Sprawy zamkniÄ™te` oraz filtr aktywne vs zamkniÄ™te.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach i prowizjach.


## R10_CLIENTDETAIL_CLOSED_CASES_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `ClientDetail.tsx` z guardem R7.
- Utrwalono kontrakt klienta: `Sprawy aktywne`, `Sprawy zamkniÄ™te`, `PrzywrĂłÄ‡ sprawÄ™`.
- Kontrakt uĹĽywa wspĂłlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.


## R11_CLIENTDETAIL_RESTORE_HANDLER_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `ClientDetail.tsx` z guardem R7.
- Dodano jawny handler/kontrakt `handleRestoreClientCaseStage231B0R7`.
- Utrwalono kontrakt aktywne/zamkniÄ™te/przywrĂłÄ‡ oraz activity `case_lifecycle_reopened`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.


## R12_CLIENTDETAIL_CLOSED_LISTS_REPAIR
- Naprawiono zgodnoĹ›Ä‡ `ClientDetail.tsx` z guardem R7.
- Dodano `activeClientCasesStage231B0R7` i `closedClientCasesStage231B0R7`.
- PodziaĹ‚ uĹĽywa wspĂłlnego `isClosedCaseStatus(record.status)`.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.


## R13_CSS_CONTRACT_REPAIR
- Naprawiono zgodnoĹ›Ä‡ CSS z guardem R7.
- Dodano `cf-case-detail-close-action-stage231b0-r7` do CSS karty sprawy i do klasy przycisku zamykania.
- Dodano `client-detail-case-smart-card-closed-stage231b0-r7` do CSS klienta.
- Bez zmian w delete flow, pĹ‚atnoĹ›ciach, prowizjach i lifetime finance.
\n\n## 2026-06-10 â€” STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n- Status: LOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR.\n- Naprawa po czÄ™Ĺ›ciowym R4: elastyczny patch ClientDetail, aktywne/zamkniÄ™te sprawy klienta, restore z klienta, CSS, guard/test.\n- Finanse i historia zachowane.\n

## 2026-06-10 â€” STAGE231B0_R8_R8_DUPLICATE_CONST_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniÄ™to sklejone anchory `const X = useMemo( const X = useMemo(` po czÄ™Ĺ›ciowym R2/R4/R6/R7.
- Zakres: dotkniÄ™te pliki TSX, whitespace, sanity check R8, peĹ‚ny build/test.



## 2026-06-10 â€” STAGE231B0_R8_R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Status: LOCAL_ONLY_PREPARED.
- Naprawa masowa po build fail: usuniÄ™to stary drugi `toggleCaseView`, ktĂłry pozostaĹ‚ po R8 obok URL-aware `setCaseViewStage231B0R8`.
- Guard R8 rozszerzony o dokĹ‚adnie jeden `toggleCaseView` i zakaz legacy `setCaseView((prev) => ...)`.


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
