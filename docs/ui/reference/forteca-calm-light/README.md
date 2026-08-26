# Forteca Calm Light — UI reference pack

This directory contains owner-approved **visual reference mockups** for the future CloseFlow / LeadFlow / CaseFlow UI direction.

## Scope

**This pack is complete for the mockups generated so far: Parts 1–4, files `001`–`040`.**

It is **not** the full planned 144-view reference map. Views `041`–`144` belong to later parts and have not been generated yet, so they are intentionally absent.

## Hard rules

- **One image = one view/state.**
- Images are **REFERENCE_ONLY**. They are not proof that the current runtime implements the shown layout, control or behavior.
- `Forteca` is a **working mockup label**, not a final market-brand decision.
- The current repo code/runtime and canonical Visual SOT override a generated mockup whenever there is a conflict.
- Do not infer new product features from decorative or accidentally generated details.
- Use the numbered filename + `manifest.json` label as the intended identity of each reference.
- Assets are stored as high-quality WebP to preserve the original 1672×941 reference dimensions while keeping repository size reasonable.

## Important known deviations

- `039_case_detail_checklists.webp` and `040_case_detail_history.webp` contain extra AI-generated Case Detail tabs. These extra tabs are **not canonical functionality**.
- For Case Detail, the canonical main tabs remain:
  1. `Obsługa`
  2. `Checklisty`
  3. `Historia`
- Use 039 only as the style/layout reference for **Checklisty** and 040 only as the style/layout reference for **Historia**.

## Corrected mapping

A prior package version accidentally swapped the semantic mapping of files 032 and 033. This V2 pack fixes it:

- `032_cases_all.webp` = **Sprawy — Wszystkie**
- `033_cases_waiting_for_client.webp` = **Sprawy — Czekają na klienta**

## Included reference groups

- `001–003`: Dziś + global add
- `004–020`: Leady, Lead Detail and lead dialogs/actions
- `021–031`: Klienci, Client Detail and client dialogs/actions
- `032–040`: Sprawy + Case Detail tabs

## Verification

Use `VERIFY_REFERENCE_PACK.ps1` before publication. It verifies:
- exactly 40 WebP files,
- numbering 001–040 without gaps,
- every file present in `manifest.json`,
- dimensions,
- byte size,
- SHA-256 checksums.

The publisher script uses a **temporary clone** and does not switch/reset/stash/clean the user's dirty canonical local checkout.
