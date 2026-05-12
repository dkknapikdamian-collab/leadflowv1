# CloseFlow — Calendar Month Chip Overlap Fix V1 Audit

Generated: 2026-05-12T05:02:36.191Z

Verdict: **PASS**

## Failures

- none

## Relevant rows

- src/pages/Calendar.tsx:109 [calendar-month-chip] `import '../styles/closeflow-calendar-month-chip-overlap-fix-v1.css';`
- src/pages/Calendar.tsx:624 [cfCalendarKind] `node.dataset.cfCalendarKind = kind;`
- src/pages/Calendar.tsx:629 [cfCalendarRowKind] `parent.dataset.cfCalendarRowKind = kind;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:21 [calendar-month-chip] `--cf-calendar-month-chip-overlap-fix-v1: 1;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:52 [grid-template-columns] `grid-template-columns: auto minmax(0, 1fr) !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:65 [line-height] `line-height: 1 !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:66 [white-space] `white-space: nowrap !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:68 [text-overflow] `text-overflow: clip !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:92 [line-height] `line-height: 18px !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:93 [white-space] `white-space: nowrap !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:95 [text-overflow] `text-overflow: ellipsis !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:126 [line-height] `line-height: 18px !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:129 [white-space] `white-space: nowrap !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:131 [text-overflow] `text-overflow: clip !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:145 [line-height] `line-height: 18px !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:146 [white-space] `white-space: nowrap !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:148 [text-overflow] `text-overflow: ellipsis !important;`
- src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css:178 [cf-calendar-tooltip] `#root [data-cf-page-header-v2="calendar"] ~ * [data-cf-calendar-tooltip="true"] {`
- src/styles/closeflow-calendar-color-tooltip-v2.css:39 [line-height] `line-height: 1 !important;`
- src/styles/closeflow-calendar-color-tooltip-v2.css:41 [white-space] `white-space: nowrap !important;`
- src/styles/closeflow-calendar-color-tooltip-v2.css:114 [cf-calendar-tooltip] `#root [data-cf-page-header-v2="calendar"] ~ * [data-cf-calendar-tooltip="true"] {`
- src/styles/closeflow-calendar-skin-only-v1.css:210 [text-overflow] `text-overflow: ellipsis !important;`
