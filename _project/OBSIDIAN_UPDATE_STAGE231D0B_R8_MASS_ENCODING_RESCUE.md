# STAGE231D0B-R8 — Mass encoding guard rescue

Data: 2026-06-10 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## Status

LOCAL_ONLY_PACKAGE_PREPARED / REPAIR_BAD_PUSH / DO_NOT_PUSH_UNTIL_PASS

## Decyzja

Kafelek klienta ma pokazywać:
- Aktywna prowizja
- Zarobione łącznie
- Sprawy
- czystą najbliższą akcję bez prefiksu Najbliższa akcja: w samym slocie

Kafelek klienta nie ma pokazywać:
- Leady
- Aktywna sprawa

## Audyt ryzyk

Problem był klasą błędu, nie pojedynczą etykietą. R8 resetuje allowlistę STAGE231D0B do HEAD, usuwa artefakty failed retry i przepisuje clean kontrakt etapu. Globalne historyczne mojibake w _project są raportowane, ale nie blokują naprawy ClientListCard, chyba że dotyczą plików kontraktu STAGE231D0B.
