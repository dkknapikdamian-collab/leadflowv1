# STAGE230B R8 - title preview guard hotfix

Status: LOCAL_ONLY_PACKAGE_APPLIED_PENDING_TESTS

## Zakres
- Naprawia kontrakt getDraftTitle dla quick capture: Szybki szkic + preview raw tekstu.
- Naprawia guard/test Stage230B po R7.
- Nie dodaje AI parsera, SQL, Gemini, Cloudflare ani endpointu parse.

## Ryzyka
- Lokalny working tree ma inne zmiany spoza Stage230B; commit musi byc selektywny.
- Manual QA nadal wymagane na /ai-drafts i mobile dictation.
