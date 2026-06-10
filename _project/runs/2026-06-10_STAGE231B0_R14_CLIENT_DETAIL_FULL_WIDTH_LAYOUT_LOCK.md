# STAGE231B0-R14 — Client detail full-width layout lock

Status: LOCAL_ONLY_PREPARED

## Change
- Add page marker to ClientDetail root.
- Add CSS full-width lock scoped through the marker.
- Add guard/test.

## Manual test
1. Open client detail.
2. Verify header/card starts near left content edge after sidebar, not centered.
3. Verify right edge extends to available app width.
4. Scroll page and confirm horizontal spacing does not shift.
5. Compare with Today/Clients page spacing.
