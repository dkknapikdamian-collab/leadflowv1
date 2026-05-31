# CloseFlow Stage213A - Supabase public Data API grants

## FAKTY
- Przygotowano migrację pod jawne GRANT-y dla Supabase Data API.
- Zakres: public schema, role authenticated i service_role.
- Nie otwieramy tabel prywatnych dla anon.
- RLS zostaje osobną warstwą bezpieczeństwa.

## DECYZJE DAMIANA
- Wdrażamy lokalnie najpierw.
- Potem SQL ma zostać uruchomiony w Supabase.
- Push do GitHuba robimy później, razem z kolejną paczką.

## TESTY
- node scripts/check-stage213a-supabase-public-data-api-grants.cjs

## NASTĘPNY KROK
- Odpalić guard.
- Skopiować SQL z migracji do Supabase SQL Editor i uruchomić na właściwym projekcie CloseFlow.
- Po Supabase sprawdzić aplikację i Vercel.

## AKTUALIZACJA - AUDYT RLS
- Audyt RLS wykonany w Supabase SQL Editor.
- Wszystkie widoczne tabele w public mają ls_enabled = true.
- Następny krok: sprawdzić GRANT-y dla uthenticated i service_role.

## AKTUALIZACJA - SUPABASE WDROŻONE
- Migracja jawnych GRANT-ów dla Data API została uruchomiona w Supabase SQL Editor.
- RLS audit: wszystkie widoczne tabele public mają ls_enabled = true.
- GRANT audit: wszystkie widoczne tabele mają komplet praw dla uthenticated i service_role.
- non nie dostał pełnych praw do tabel.
- Stage213A można uznać za wykonany.
- Następny osobny etap: ograniczenie liczby zapytań do Supabase, bo to dotyczy limitów/egress/API usage, nie samych GRANT-ów.

## AKTUALIZACJA - SUPABASE WDROŻONE
- Migracja jawnych GRANT-ów dla Data API została uruchomiona w Supabase SQL Editor.
- RLS audit: wszystkie widoczne tabele public mają ls_enabled = true.
- GRANT audit: wszystkie widoczne tabele mają komplet praw dla uthenticated i service_role.
- non nie dostał pełnych praw do tabel.
- Stage213A można uznać za wykonany.
- Następny osobny etap: ograniczenie liczby zapytań do Supabase, bo to dotyczy limitów/egress/API usage, nie samych GRANT-ów.
