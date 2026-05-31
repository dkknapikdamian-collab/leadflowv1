# STAGE180E — Support visible copy fix

## Cel
Naprawić widoczne copy ekranu `/help` po Stage180, bo Stage180D poprawiał głównie guard i nie dawał oczekiwanej zmiany wizualnej.

## Fakty
- Praca lokalna, bez pushu.
- Dotyczy CloseFlow / LeadFlow, branch `dev-rollout-freeze`.
- Ekran `/help` ma działać jako `Zgłoszenia`, nie ogólna `Pomoc`.

## Decyzje Damiana
- Usunąć opis: `Wybierz typ sprawy i opisz temat. Formularz zapisuje zgłoszenie w jednym miejscu, zamiast rozrzucać błędy po czacie.`
- Poprawić polskie znaki i widoczne frazy.
- Dodać guard, żeby copy nie wróciło.

## Zakres
- `src/pages/SupportCenter.tsx`
- `scripts/check-stage180e-support-visible-copy.cjs`
- raport `_project/reports/STAGE180E_SUPPORT_VISIBLE_COPY_FIX_2026-05-30.md`

## Testy automatyczne
- `node scripts/check-stage180e-support-visible-copy.cjs`
- `npm run build`

## Test ręczny
1. Zatrzymać aktualny dev server.
2. Uruchomić `npm run dev -- --host 0.0.0.0 --port 3000`.
3. Wejść na `http://localhost:3000/help`.
4. Wykonać twarde odświeżenie strony.
5. Sprawdzić, że skasowany opis nie jest widoczny, a fraza brzmi `Nie wiem, jak użyć funkcji`.

## Czego nie ruszano
- Supabase schema.
- RLS.
- API support requests.
- Deployment.
- Push do GitHuba.
