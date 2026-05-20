# 2026-05-20 - Stage125A fresh Supabase core API smoke confirmed

## Status

POTWIERDZONE PRZEZ DAMIANA.

## Zakres

CloseFlow / LeadFlow po przepieciu na nowy Supabase project ref:

- nowy Supabase project ref: `amrxiaetdocrywnnkoct`
- stary Supabase project ref: `ydntsbkiqwkabhjjlkew`
- public app: `https://closeflowapp.vercel.app`
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`

## FAKTY Z POPRZEDNIEGO HOTFIXA

Po fresh restore nowego Supabase endpointy listowe wykladaly sie na brakujacych kolumnach:

- `leads.currency`
- `cases.currency`

Naprawa zostala wykonana przez migracje repo:

- `supabase/migrations/20260520171000_leads_cases_currency_prereq.sql`

Commit hotfixa:

- `6d975bd Add Supabase currency columns for leads and cases`

## TEST RECZNY / BROWSER API SMOKE

Damian potwierdzil po wykonaniu kolejnego etapu: `Dziala`.

Potwierdzenie dotyczy core API smoke po hotfixie currency, ktory mial sprawdzic zalogowana produkcje:

- `/api/me`
- `/api/clients`
- `/api/leads`
- `/api/cases`
- `/api/cases?includeArchived=1`
- `/api/payments`

## WERDYKT

Core API po fresh Supabase restore jest uznane za dzialajace na podstawie recznego potwierdzenia Damiana.

## DECYZJE

- Nie robimy recznego SQL w Supabase SQL Editor.
- Kolejne braki schematu, jezeli sie pojawia, naprawiamy migracja w repo.
- Import leadow ze starego Supabase zostaje osobnym etapem po stabilizacji core API i po mapowaniu kolumn.
- Google login oraz Google Calendar po nowym Supabase sa osobnymi tematami i wymagaja reconnect/config check.

## NASTEPNY ETAP

Stage125B - Google login + Google Calendar reconnect po fresh Supabase.

Zakres Stage125B:

1. Przeczytac konfiguracje auth i Google Calendar w repo.
2. Sprawdzic, czy Google login jest skonfigurowany dla nowego Supabase projektu.
3. Sprawdzic redirect/callback URL-e po zmianie Supabase project ref.
4. Sprawdzic tabele/tokeny Google Calendar w nowym Supabase.
5. Przygotowac reconnect flow: stare tokeny nie byly przenoszone, wiec uzytkownik laczy Google Calendar od nowa.
6. Dopiero po potwierdzeniu auth/calendar przejsc do Resend, Stripe, storage/uploadow i AI.

## RYZYKA

- Nowy Supabase moze miec brak konfiguracji OAuth provider Google.
- Vercel env moze nadal miec czesc zmiennych powiazanych ze starym projektem lub starymi callbackami.
- Google Calendar tokens ze starego Supabase nie sa przeniesione i nie powinny byc traktowane jako aktywne.

## Czego nie ruszano

- Nie zmieniano kodu runtime.
- Nie robiono migracji.
- Nie importowano danych ze starego Supabase.
- Nie ruszano Google Calendar ani OAuth.
- Nie ruszano Stripe, Resend, storage ani AI.

## Zapis do Obsidiana

Wymagane / wykonane rownolegle:

- Obsidian folder: `10_PROJEKTY/CloseFlow_Lead_App`
- wpis: `2026-05-20 - CloseFlow fresh Supabase core API smoke confirmed.md`
- typ wpisu: test reczny / wdrozenie / next step
