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
