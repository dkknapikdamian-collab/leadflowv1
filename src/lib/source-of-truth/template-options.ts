export type TemplateItemTypeValue =
  | 'file'
  | 'text'
  | 'decision'
  | 'access'
  | 'meeting'
  | 'payment'
  | 'materials'
  | 'other';

export type TemplateItemDraft = {
  title: string;
  description: string;
  type: TemplateItemTypeValue;
  customTypeName?: string;
  isRequired: boolean;
};

export type TemplateRecord = {
  id: string;
  name?: string;
  items?: TemplateItemDraft[];
};

export type TemplateDraft = {
  name: string;
  items: TemplateItemDraft[];
};

export type TemplateItemTypeMeta = {
  value: TemplateItemTypeValue;
  label: string;
  badgeClassName: string;
};

export const TEMPLATE_ITEM_TYPE_OPTIONS: readonly TemplateItemTypeMeta[] = [
  { value: 'file', label: 'Plik', badgeClassName: 'border-sky-200 bg-sky-50 text-sky-700' },
  { value: 'text', label: 'Tekst / brief', badgeClassName: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
  { value: 'decision', label: 'Decyzja / akceptacja', badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700' },
  { value: 'access', label: 'Dostęp / login', badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  { value: 'meeting', label: 'Spotkanie / telefon', badgeClassName: 'border-blue-200 bg-blue-50 text-blue-700' },
  { value: 'payment', label: 'Płatność / faktura', badgeClassName: 'border-rose-200 bg-rose-50 text-rose-700' },
  { value: 'materials', label: 'Materiały / zdjęcia', badgeClassName: 'border-violet-200 bg-violet-50 text-violet-700' },
  { value: 'other', label: 'Inne', badgeClassName: 'border-slate-200 bg-slate-50 text-slate-700' },
] as const;

export const EMPTY_TEMPLATE_ITEM: TemplateItemDraft = {
  title: '',
  description: '',
  type: 'file',
  isRequired: true,
};

export function getTemplateItemTypeMeta(type?: unknown) {
  const raw = typeof type === 'string' ? type.trim().toLowerCase() : '';
  return TEMPLATE_ITEM_TYPE_OPTIONS.find((entry) => entry.value === raw) || TEMPLATE_ITEM_TYPE_OPTIONS[0];
}

export function getTemplateItemTypeLabel(item: TemplateItemDraft) {
  if (item.type === 'other') {
    return item.customTypeName?.trim() || 'Inne';
  }

  return getTemplateItemTypeMeta(item.type).label;
}

export function normalizeTemplateItems(items?: readonly Partial<TemplateItemDraft>[]) {
  if (!items?.length) return [];

  return items.map((item) => ({
    title: item.title?.trim() || '',
    description: item.description?.trim() || '',
    type: getTemplateItemTypeMeta(item.type).value,
    isRequired: item.isRequired !== false,
  }));
}

export function createEmptyTemplateItem(): TemplateItemDraft {
  return { ...EMPTY_TEMPLATE_ITEM };
}

export function createEmptyTemplateDraft(): TemplateDraft {
  return {
    name: '',
    items: [createEmptyTemplateItem()],
  };
}

export function getTemplateItemCount(template: TemplateRecord) {
  return normalizeTemplateItems(template.items).length;
}

export function getRequiredTemplateItemCount(template: TemplateRecord) {
  return normalizeTemplateItems(template.items).filter((item) => item.isRequired).length;
}
