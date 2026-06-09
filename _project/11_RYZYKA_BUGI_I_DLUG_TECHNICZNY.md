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
