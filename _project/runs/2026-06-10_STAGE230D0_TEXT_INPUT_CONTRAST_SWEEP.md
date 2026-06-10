# STAGE230D0 — Text/Input Contrast Sweep

Data: 2026-06-10 Europe/Warsaw  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Tryb: GIT-FIRST / PUSH-FIRST  

## FAKTY

- Stage230B quick capture musi zostać zachowany.
- Stage230C phone dictation trace musi zostać zachowany.
- Damian zgłosił krytyczny problem UI: tekst wpisywany i dyktowany w aplikacji jest biały na białym tle.
- Problem potraktowano jako klasę błędu kontrastu inputów/textarea/debug UI, nie jako pojedynczy lokalny kosmetyk.

## ZMIENIONE PLIKI

- src/styles/visual-stage9-ai-drafts-vnext.css
- scripts/check-stage230d0-text-input-contrast-sweep.cjs
- tests/stage230d0-text-input-contrast-sweep.test.cjs
- _project/03_CURRENT_STAGE.md
- _project/06_GUARDS_AND_TESTS.md
- _project/08_CHANGELOG_AI.md
- _project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md
- _project/13_TEST_HISTORY.md
- _project/runs/2026-06-10_STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP.md
- _project/obsidian_updates/2026-06-10_STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP.md

## ZAKRES

Naprawiono kontrast tekstu w obszarze /ai-drafts:
- input,
- textarea,
- select,
- option,
- placeholder,
- focus state,
- Stage230C debug trace,
- przyciski trace.

## TESTY / GUARDY

Do wykonania:
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node scripts/check-stage230d0-text-input-contrast-sweep.cjs
- node --test tests/stage230d0-text-input-contrast-sweep.test.cjs
- npm run build
- git diff --check

## RYZYKA

- Poprawka jest celowo scoped do /ai-drafts; podobne problemy w innych modułach wymagają kolejnego sweepu.
- Zastosowano -webkit-text-fill-color, bo mobile/Chrome/Safari potrafią nadpisywać kolor tekstu w inputach.
- Nie wdrożono deduplikacji dyktowania, bo Stage230C ma najpierw zebrać trace.
- Nie zmieniano AI parsera, Supabase schema ani approval engine.

## MANUAL QA ONLINE

Po deployu:
1. Wejść na /ai-drafts.
2. Wpisać tekst w szybkim szkicu.
3. Użyć dyktowania telefonu.
4. Włączyć Debug dyktowania.
5. Sprawdzić, czy tekst, placeholder, trace i przyciski są czytelne.
6. Skopiować trace, jeśli nadal występują powtórzenia słów.
