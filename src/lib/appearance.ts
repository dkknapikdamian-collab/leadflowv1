export type SkinId = 'forteca-light' | 'forteca-dark' | 'midnight' | 'sandstone';

export interface SkinOption {
  id: SkinId;
  label: string;
  description: string;
  toastTheme: 'light' | 'dark';
}

export const SKIN_OPTIONS: SkinOption[] = [
  {
    id: 'forteca-light',
    label: 'CloseDock Light',
    description: 'Jasna, czysta skórka do pracy dziennej.',
    toastTheme: 'light',
  },
  {
    id: 'forteca-dark',
    label: 'CloseDock Dark',
    description: 'Ciemna wersja głównej skórki, dobra wieczorem i na telefonie.',
    toastTheme: 'dark',
  },
  {
    id: 'midnight',
    label: 'Midnight Graphite',
    description: 'Nowoczesna grafitowa wersja z mocniejszym kontrastem.',
    toastTheme: 'dark',
  },
  {
    id: 'sandstone',
    label: 'Sandstone',
    description: 'Jaśniejsza, cieplejsza skórka z miękkimi powierzchniami.',
    toastTheme: 'light',
  },
];

export const DEFAULT_SKIN: SkinId = 'forteca-light';

export function isSkinId(value: string | null | undefined): value is SkinId {
  return SKIN_OPTIONS.some((skin) => skin.id === value);
}

export function getSkinOption(skin: SkinId): SkinOption {
  return SKIN_OPTIONS.find((item) => item.id === skin) ?? SKIN_OPTIONS[0];
}
