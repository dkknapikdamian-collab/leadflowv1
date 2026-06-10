# 2026-06-10 — STAGE231B0_R8_CASE_ARCHIVE_RELATION_TRUTH\n\n## Status\nLOCAL_ONLY_PREPARED / R6_CLIENTDETAIL_FLEXIBLE_REPAIR\n\n## Zakres\nNaprawa R8 po częściowym R4: ClientDetail active/closed relation truth, restore z klienta, CSS, guard/test.\n\n## Testy\n- check-stage231b0-r8\n- node test R8\n- Stage231B0 regression\n- delete-flow R25/R41\n- build\n- git diff --check\n

## R8_DUPLICATE_CONST_BUILD_REPAIR
- Build failed on `src/pages/Cases.tsx` because partial patching produced `const leadsById = useMemo(  const leadsById = useMemo(`.
- Repair removes duplicated const/useMemo/useCallback anchors across touched TSX files before full guard/build.



## R9_DUPLICATE_TOGGLE_BUILD_REPAIR
- Build failed on duplicate `toggleCaseView` in `src/pages/Cases.tsx`.
- Repair removes the legacy non-URL-aware toggle and extends guard coverage for this class of regression.

