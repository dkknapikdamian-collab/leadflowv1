const fs = require('fs');

const tsxPath = 'src/pages/Templates.tsx';
const cssPath = 'src/styles/closeflow-template-modal-source-truth-stage181n.css';

let src = fs.readFileSync(tsxPath, 'utf8');
let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

const before = src;

// 1. Extend type union.
src = src.replace(
  /type TemplateItemType = 'file' \| 'text' \| 'decision' \| 'access';/,
  "type TemplateItemType = 'file' | 'text' | 'decision' | 'access' | 'meeting' | 'payment' | 'materials' | 'other';"
);

// 2. Add customTypeName to draft type.
if (!src.includes('customTypeName?: string;')) {
  src = src.replace(
    `type TemplateItemDraft = {
  title: string;
  description: string;
  type: TemplateItemType;
  isRequired: boolean;
};`,
    `type TemplateItemDraft = {
  title: string;
  description: string;
  type: TemplateItemType;
  customTypeName?: string;
  isRequired: boolean;
};`
  );
}

// 3. Expand options.
const optionsRe = /const ITEM_TYPE_OPTIONS: \{ value: TemplateItemType; label: string; badgeClassName: string \}\[] = \[[\s\S]*?\];/m;
const optionsNext = `const ITEM_TYPE_OPTIONS: { value: TemplateItemType; label: string; badgeClassName: string }[] = [
  { value: 'file', label: 'Plik', badgeClassName: 'border-sky-200 bg-sky-50 text-sky-700' },
  { value: 'text', label: 'Tekst / brief', badgeClassName: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
  { value: 'decision', label: 'Decyzja / akceptacja', badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700' },
  { value: 'access', label: 'Dostęp / login', badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  { value: 'meeting', label: 'Spotkanie / telefon', badgeClassName: 'border-blue-200 bg-blue-50 text-blue-700' },
  { value: 'payment', label: 'Płatność / faktura', badgeClassName: 'border-rose-200 bg-rose-50 text-rose-700' },
  { value: 'materials', label: 'Materiały / zdjęcia', badgeClassName: 'border-violet-200 bg-violet-50 text-violet-700' },
  { value: 'other', label: 'Inne', badgeClassName: 'border-slate-200 bg-slate-50 text-slate-700' },
];`;

if (!optionsRe.test(src)) {
  throw new Error('Could not find ITEM_TYPE_OPTIONS block.');
}
src = src.replace(optionsRe, optionsNext);

// 4. Normalize custom type name.
if (!src.includes('customTypeName: item.type ===')) {
  src = src.replace(
    `      type: item.type || 'file',
      isRequired: item.isRequired !== false,`,
    `      type: item.type || 'file',
      customTypeName: item.type === 'other' ? (item.customTypeName || '').trim() : '',
      isRequired: item.isRequired !== false,`
  );
}

// 5. Add label helper for cards.
if (!src.includes('function getTemplateItemTypeLabel')) {
  src = src.replace(
    `function itemTypeMeta(type?: TemplateItemType) {
  return ITEM_TYPE_OPTIONS.find((entry) => entry.value === type) || ITEM_TYPE_OPTIONS[0];
}

function getTemplateItemCount(template: TemplateRecord) {`,
    `function itemTypeMeta(type?: TemplateItemType) {
  return ITEM_TYPE_OPTIONS.find((entry) => entry.value === type) || ITEM_TYPE_OPTIONS[0];
}

function getTemplateItemTypeLabel(item: TemplateItemDraft) {
  if (item.type === 'other') {
    return item.customTypeName?.trim() || 'Inne';
  }
  return itemTypeMeta(item.type).label;
}

function getTemplateItemCount(template: TemplateRecord) {`
  );
}

// 6. Make existing card badges show custom label.
src = src.replace(
  /<Badge variant="outline" className=\{meta\.badgeClassName\}>\{meta\.label\}<\/Badge>/g,
  `<Badge variant="outline" className={meta.badgeClassName}>{getTemplateItemTypeLabel(item)}</Badge>`
);

// 7. Replace Radix Select inside rebuilt modal with native select + custom input.
const selectBlockRe = /<Select value=\{item\.type\} onValueChange=\{\(value\) => updateDraftItem\(index, \{ type: value as TemplateItemType \}\)\}>\s*<SelectTrigger className="cf-template-modal-v2-select">\s*<SelectValue \/>\s*<\/SelectTrigger>\s*<SelectContent>\s*\{ITEM_TYPE_OPTIONS\.map\(\(option\) => \(\s*<SelectItem key=\{option\.value\} value=\{option\.value\}>\{option\.label\}<\/SelectItem>\s*\)\)\}\s*<\/SelectContent>\s*<\/Select>/m;

const nativeSelect = `<div className="cf-template-modal-v2-type-grid">
                          <select
                            className="cf-template-modal-v2-select-native"
                            value={item.type}
                            onChange={(event) => {
                              const nextType = event.target.value as TemplateItemType;
                              updateDraftItem(index, {
                                type: nextType,
                                customTypeName: nextType === 'other' ? item.customTypeName || '' : '',
                              });
                            }}
                          >
                            {ITEM_TYPE_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>

                          {item.type === 'other' ? (
                            <Input
                              value={item.customTypeName || ''}
                              onChange={(event) => updateDraftItem(index, { customTypeName: event.target.value })}
                              placeholder="Wpisz własną nazwę typu, np. Audyt, Umowa, Zdjęcia..."
                              className="cf-template-modal-v2-input cf-template-modal-v2-custom-type-input"
                            />
                          ) : null}
                        </div>`;

if (selectBlockRe.test(src)) {
  src = src.replace(selectBlockRe, nativeSelect);
} else if (!src.includes('cf-template-modal-v2-select-native')) {
  throw new Error('Could not find template type Select block to replace.');
}

// 8. Append CSS for native select and custom input.
const cssBlock = `

/* CLOSEFLOW_STAGE181O_TEMPLATE_TYPE_OTHER_LOCAL
   LOCAL ONLY
   Type selector is native and readable. "Inne" reveals custom type name input.
*/
.cf-template-modal-v2-type-grid {
  display: grid !important;
  gap: 9px !important;
}

.cf-template-modal-v2-select-native {
  width: 100% !important;
  min-height: 44px !important;
  border: 1px solid #d0d5dd !important;
  border-radius: 16px !important;
  background: #ffffff !important;
  color: #111827 !important;
  padding: 10px 13px !important;
  font-size: 14px !important;
  font-weight: 750 !important;
  line-height: 1.2 !important;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.08) !important;
  outline: none !important;
  appearance: auto !important;
}

.cf-template-modal-v2-select-native:focus {
  border-color: #93c5fd !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.16) !important;
}

.cf-template-modal-v2-select-native option {
  background: #ffffff !important;
  color: #111827 !important;
}

.cf-template-modal-v2-custom-type-input {
  margin-top: 0 !important;
}
`;

if (!css.includes('CLOSEFLOW_STAGE181O_TEMPLATE_TYPE_OTHER_LOCAL')) {
  css += cssBlock;
}

fs.writeFileSync(tsxPath, src, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

const next = fs.readFileSync(tsxPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  "'meeting'",
  "'payment'",
  "'materials'",
  "'other'",
  'customTypeName?: string',
  'customTypeName: item.type ===',
  'function getTemplateItemTypeLabel',
  'cf-template-modal-v2-select-native',
  'cf-template-modal-v2-custom-type-input',
  'Wpisz własną nazwę typu',
]) {
  if (!next.includes(token)) failures.push('Templates.tsx missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181O_TEMPLATE_TYPE_OTHER_LOCAL',
  '.cf-template-modal-v2-select-native',
  '.cf-template-modal-v2-type-grid',
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181O local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (before === next) {
  console.log('No Templates.tsx changes needed. Stage181O already present.');
} else {
  console.log('Patched Stage181O locally.');
}

console.log('OK Stage181O local: template type selector has more options and custom "Inne" input.');
