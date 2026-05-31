# STAGE180C — naprawa skryptu Stage180B i guard polskich znaków

## Cel etapu
Naprawić błąd wdrożenia Stage180B, w którym PowerShell 5.1 odczytał skrypt bezpiecznie dla UTF-8 w zły sposób i rozbił polskie znaki w komunikatach `throw`.

## Fakty
- Stage180 przebudował zakładkę `/help` w `Zgłoszenia`.
- Stage180B miał usunąć tekst pod nagłówkiem formularza i dodać guard polskich znaków.
- Stage180B nie wystartował, bo `APPLY_closeflow_stage180b_support_copy_polish_guard.ps1` zawierał polskie znaki w kodzie PowerShell i parser pokazał `Unexpected token`.

## Decyzje Damiana
- Usunąć tekst: `Wybierz typ sprawy i opisz temat. Formularz zapisuje zgłoszenie w jednym miejscu, zamiast rozrzucać błędy po czacie.`
- Dodać guard polskich znaków.
- Pracować lokalnie, bez pushu.

## Zakres zmian
- `src/pages/SupportCenter.tsx`
  - usuwa niechciany opis formularza,
  - poprawia drobne przecinki w copy,
  - dodaje marker `SUPPORT_REQUESTS_POLISH_COPY_GUARD_STAGE180B`,
  - dodaje atrybut `data-support-copy-stage`.
- `scripts/check-stage180b-support-copy-polish.cjs`
  - pilnuje braku niechcianego tekstu,
  - pilnuje poprawnych polskich znaków,
  - blokuje mojibake typu `Ä`, `Å`, `Ĺ`, `Â`, `â`, `�` w plikach ekranu zgłoszeń.
- `scripts/check-stage180c-apply-wrapper-ascii.cjs`
  - kontrolny guard dla paczki naprawczej.

## Czego nie ruszano
- Supabase schema.
- API zgłoszeń.
- RLS.
- Deployment.
- Push do GitHuba.

## Testy automatyczne
- `node scripts/check-stage180b-support-copy-polish.cjs`
- `node scripts/check-stage180c-apply-wrapper-ascii.cjs`
- `npm run build`

## Następny krok
Po wdrożeniu wejść lokalnie na `/help` i sprawdzić, czy pod nagłówkiem formularza nie ma już usuwanego tekstu oraz czy prawa kolumna ma poprawne polskie znaki.
