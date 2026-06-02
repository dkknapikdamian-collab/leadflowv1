# Stage216M-R10 - środek klienta jako centrum pracy

## FAKTY
- Wdrożenie dotyczy CloseFlow / LeadFlow.
- Repo: `dkknapikdamian-collab/leadflowv1`.
- Branch: `dev-rollout-freeze`.
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- Zakres: tylko środkowa kolumna ClientDetail.

## DECYZJE DAMIANA
- Klient ma zachować system wizualny leada, ale nie kopiować ślepo workflow leada.
- W kliencie centrum pracy ma prowadzić do aktywnych spraw.

## HIPOTEZY AI
- Najlepsza hierarchia środka klienta: kafelki -> aktywne sprawy -> notatki -> zakładki.
- Notatki są kontekstem klienta, a aktywne sprawy są główną pracą operacyjną.

## ZAKRES WDROŻENIA
- Dodano CSS source truth dla kolejności środkowej kolumny klienta.
- Aktywne sprawy ustawiono przed notatkami.
- Notatki pozostają w środkowej kolumnie.

## TESTY
- Stage216M-R10 guard.
- `git diff --check`.
- `npm run build`.

## CZEGO NIE RUSZANO
- Prawa szyna.
- API.
- Supabase.
- Płatności.
- Dane.
- Stage216D.

## NASTĘPNY KROK
Stage216M-R11: prawa szyna ClientDetail hard render, szczególnie widoczność `Finanse klienta`.
