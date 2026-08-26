# FORTECA 002 — BROWSER PROOF

Reference: `docs/ui/reference/forteca-calm-light/002_today_customize_view.webp`
Implementation commit: 9f4c95f7
Route: `/` -> click Widok

Steps:
1. Open `/`, click Widok (data-today-view-toggle)
2. Overlay shows: title Dostosuj widok, description Wybierz które kafelki..., header actions Przywróć domyślne (ghost) + Pokaż wszystko (outline)
3. Grid 8 checkboxes (sm:grid-cols-2 lg:grid-cols-4, gap 2), each label flex gap 3 rounded-2xl border, icon 8x8 rounded-2xl bg-slate-100
4. Footer Anuluj (ghost) + Zapisz (primary) bar border-t slate-100, gap 2, justify-end
5. Interactions: checkbox toggles writeTodayVisibleSections localStorage, Przywróć domyślne resets to TODAY_SECTION_KEYS, Pokaż wszystko shows all, Anuluj/Zapisz close setTodayViewOpen false, ESC closes via Dialog

Comparison to WebP:
- Modal composition light 16 radius, header copy Dostosuj widok PASS
- Checkbox group + Przywróć domyślne + Zapisz footer PASS (reorder not faked per contract — reorder deferred)
- Border subtle #E5EAF2, spacing 8 grid, no overflow
- Overlay does not intercept underlying tile clicks (verified)

Result: PASS
