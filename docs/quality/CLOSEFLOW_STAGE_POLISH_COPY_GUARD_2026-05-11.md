# CLOSEFLOW_STAGE_POLISH_COPY_GUARD_2026-05-11

## Status
Repair2: guard polskich znaków działa zbiorczo na plikach etapu oraz na plikach zmienionych w `git diff`.

## Cel
Nowe etapy mają blokować mojibake i błędy kodowania zbiorczo, zanim trafią do commita. Nie poprawiamy pojedynczych słów ręcznie po fakcie, tylko skanujemy cały zakres etapu.

## Zakres domyślny
`check:closeflow-stage-polish-guard` skanuje:

- stałą listę plików danego etapu,
- pliki zmienione względem `HEAD`,
- pliki staged.

## Tryb szeroki
Dla większego skanu można odpalić:

```powershell
$env:CLOSEFLOW_POLISH_GUARD_SCOPE="all"; npm.cmd run check:closeflow-stage-polish-guard; Remove-Item Env:CLOSEFLOW_POLISH_GUARD_SCOPE
```

Tryb `all` skanuje foldery `src`, `api`, `scripts`, `docs` i `supabase`, z pominięciem `dist`, `node_modules`, `.git`, `.vercel`, `coverage` oraz `.closeflow-recovery-backups`.

## Zasada techniczna
Skrypt nie zawiera dosłownych uszkodzonych znaków. Markery są zapisane jako kody Unicode, żeby guard nie wykrywał samego siebie.

## Kryterium
Guard ma wypisać wszystkie trafienia z plikiem, linią, kolumną i krótkim wycinkiem tekstu.
