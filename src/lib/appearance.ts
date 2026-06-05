export type SkinId = 'forteca-light';

export interface SkinOption {
  id: SkinId;
  label: string;
  description: string;
  toastTheme: 'light' | 'dark';
}

export const SKIN_OPTIONS: SkinOption[] = [
  {
    id: 'forteca-light',
    label: 'Klasyczny jasny',
    description: 'Główny motyw CloseFlow.',
    toastTheme: 'light',
  },
];

export const DEFAULT_SKIN: SkinId = 'forteca-light';

export function isSkinId(value: string | null | undefined): value is SkinId {
  return value === DEFAULT_SKIN;
}

export function getSkinOption(_skin: SkinId): SkinOption {
  return SKIN_OPTIONS[0];
}
