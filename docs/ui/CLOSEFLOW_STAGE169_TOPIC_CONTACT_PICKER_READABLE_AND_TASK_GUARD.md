# CloseFlow Stage169 — Topic Contact Picker Readable + Task Guard

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Problem

In modal panels the source/contact picker can render unreadable options, likely white text on white background after the unified dark modal motif.

User also wants task modal to keep the same source-linking option as event modal.

## Facts from repo

`src/components/topic-contact-picker.tsx` is the shared component for the visible field:

- default label: `Powiąż z tematem lub kontaktem`
- default placeholder: `Wpisz lead, klienta, sprawę, e-mail lub telefon`

`src/pages/Tasks.tsx` already imports and uses `TopicContactPicker` for task forms. Stage169 guards that this remains true.

## Decision

Add explicit topic/contact picker markers and CSS:

```tsx
data-topic-contact-picker="true"
data-topic-contact-picker-input="true"
data-topic-contact-picker-dropdown="true"
data-topic-contact-picker-option="true"
```

Then force readable option panels:

```css
background: #ffffff;
color: #0f172a;
```

## Guard

`node scripts/check-stage169-topic-contact-picker-readable.cjs`
