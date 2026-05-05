# STAGE59_TEST_ASSERTION_HOTFIX_V3_2026-05-04

Marker: STAGE59_TEST_ASSERTION_HOTFIX_V3

Cel: naprawić błędne asercje testu Stage59 bez zmiany runtime.

Problem: hotfix v2 przepisał test bez regexów, ale użył nieistniejących nazw `pendingCaseNoteFollowUp` oraz `.case-note-follow-up-panel`. Implementacja i guard Stage59 używają `pendingNoteFollowUp` oraz klas `.case-detail-note-follow-up-*`.

Naprawa: test Stage59 został wyrównany do faktycznej implementacji Stage59 i istniejącego guarda `check:stage59-case-note-follow-up-prompt`.

Runtime nie został zmieniony.

Sprawdzenie:
- npm.cmd run test:stage59-case-note-follow-up-prompt
- npm.cmd run verify:case-operational-ui
- npm.cmd run build
