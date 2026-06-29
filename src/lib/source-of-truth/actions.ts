export type AppActionKey =
  | 'lead.remove'
  | 'case.remove'
  | 'client.remove'
  | 'task.remove'
  | 'event.remove'
  | 'missingItem.remove'
  | 'record.copyLink'
  | 'lead.copyEmail'
  | 'lead.copyPhone'
  | 'case.copyLink'
  | 'client.copyLink'
  | 'task.markDone'
  | 'event.markDone'
  | 'case.markDone'
  | 'missingItem.resolve'
  | 'task.restore'
  | 'event.restore'
  | 'case.restore'
  | 'lead.restore'
  | 'task.snooze'
  | 'event.snooze'
  | 'task.postpone'
  | 'event.postpone';

export type AppActionTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export type AppActionVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type AppActionGroup = 'record-removal' | 'copy-link' | 'mark-done' | 'restore' | 'snooze';

export type AppActionConfirmTone = 'default' | 'destructive';

export type AppActionConfirmCopy = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmTone: AppActionConfirmTone;
};

export type AppActionMeta = {
  key: AppActionKey;
  group: AppActionGroup;
  label: string;
  ariaLabel: string;
  tone: AppActionTone;
  variant: AppActionVariant;
  loadingLabel?: string;
  disabledLabel?: string;
  disabledReason?: string;
  requiresConfirmation: boolean;
  confirmation?: AppActionConfirmCopy;
};

const removalConfirmation = (
  title: string,
  description: string,
  confirmLabel: string,
): AppActionConfirmCopy => ({
  title,
  description,
  confirmLabel,
  cancelLabel: 'Anuluj',
  confirmTone: 'destructive',
});

export const APP_ACTIONS: Record<AppActionKey, AppActionMeta> = {
  'lead.remove': {
    key: 'lead.remove',
    group: 'record-removal',
    label: 'Usuń leada',
    ariaLabel: 'Usuń leada',
    tone: 'danger',
    variant: 'destructive',
    loadingLabel: 'Usuwanie leada...',
    disabledLabel: 'Nie można usunąć leada',
    disabledReason: 'Akcja jest zablokowana dla bieżącego stanu leada.',
    requiresConfirmation: true,
    confirmation: removalConfirmation(
      'Usunąć leada?',
      'Ta akcja usuwa leada z aktywnej pracy. Nie zmienia historii spraw ani płatności.',
      'Usuń leada',
    ),
  },
  'case.remove': {
    key: 'case.remove',
    group: 'record-removal',
    label: 'Usuń sprawę',
    ariaLabel: 'Usuń sprawę',
    tone: 'danger',
    variant: 'destructive',
    loadingLabel: 'Usuwanie sprawy...',
    disabledLabel: 'Nie można usunąć sprawy',
    disabledReason: 'Akcja jest zablokowana dla bieżącego stanu sprawy.',
    requiresConfirmation: true,
    confirmation: removalConfirmation(
      'Usunąć sprawę?',
      'Ta akcja usuwa sprawę z aktywnej pracy. Nie usuwa klienta ani historii płatności poza istniejącym runtime.',
      'Usuń sprawę',
    ),
  },
  'client.remove': {
    key: 'client.remove',
    group: 'record-removal',
    label: 'Usuń klienta',
    ariaLabel: 'Usuń klienta',
    tone: 'danger',
    variant: 'destructive',
    loadingLabel: 'Usuwanie klienta...',
    disabledLabel: 'Nie można usunąć klienta',
    disabledReason: 'Akcja jest zablokowana dla bieżącego stanu klienta.',
    requiresConfirmation: true,
    confirmation: removalConfirmation(
      'Usunąć klienta?',
      'Ta akcja usuwa klienta zgodnie z istniejącym runtime. Przed potwierdzeniem sprawdź powiązane leady i sprawy.',
      'Usuń klienta',
    ),
  },
  'task.remove': {
    key: 'task.remove',
    group: 'record-removal',
    label: 'Usuń zadanie',
    ariaLabel: 'Usuń zadanie',
    tone: 'danger',
    variant: 'destructive',
    loadingLabel: 'Usuwanie zadania...',
    disabledLabel: 'Nie można usunąć zadania',
    disabledReason: 'Akcja jest zablokowana dla bieżącego stanu zadania.',
    requiresConfirmation: true,
    confirmation: removalConfirmation(
      'Usunąć zadanie?',
      'Ta akcja usuwa zadanie z aktywnej listy pracy zgodnie z istniejącym handlerem.',
      'Usuń zadanie',
    ),
  },
  'event.remove': {
    key: 'event.remove',
    group: 'record-removal',
    label: 'Usuń wydarzenie',
    ariaLabel: 'Usuń wydarzenie',
    tone: 'danger',
    variant: 'destructive',
    loadingLabel: 'Usuwanie wydarzenia...',
    disabledLabel: 'Nie można usunąć wydarzenia',
    disabledReason: 'Akcja jest zablokowana dla bieżącego stanu wydarzenia.',
    requiresConfirmation: true,
    confirmation: removalConfirmation(
      'Usunąć wydarzenie?',
      'Ta akcja usuwa wydarzenie z aktywnej pracy zgodnie z istniejącym handlerem.',
      'Usuń wydarzenie',
    ),
  },
  'missingItem.remove': {
    key: 'missingItem.remove',
    group: 'record-removal',
    label: 'Usuń brak',
    ariaLabel: 'Usuń brak lub blokadę',
    tone: 'danger',
    variant: 'destructive',
    loadingLabel: 'Usuwanie braku...',
    disabledLabel: 'Nie można usunąć braku',
    disabledReason: 'Akcja jest zablokowana dla bieżącego stanu braku.',
    requiresConfirmation: true,
    confirmation: removalConfirmation(
      'Usunąć brak?',
      'Ta akcja usuwa aktywny brak lub blokadę zgodnie ze źródłowym rekordem work item.',
      'Usuń brak',
    ),
  },
  'record.copyLink': {
    key: 'record.copyLink',
    group: 'copy-link',
    label: 'Kopiuj link',
    ariaLabel: 'Kopiuj link do rekordu',
    tone: 'neutral',
    variant: 'ghost',
    loadingLabel: 'Kopiowanie linku...',
    disabledLabel: 'Brak linku do skopiowania',
    requiresConfirmation: false,
  },
  'lead.copyEmail': {
    key: 'lead.copyEmail',
    group: 'copy-link',
    label: 'Kopiuj e-mail',
    ariaLabel: 'Kopiuj adres e-mail leada',
    tone: 'neutral',
    variant: 'ghost',
    loadingLabel: 'Kopiowanie e-maila...',
    disabledLabel: 'Brak adresu e-mail',
    requiresConfirmation: false,
  },
  'lead.copyPhone': {
    key: 'lead.copyPhone',
    group: 'copy-link',
    label: 'Kopiuj telefon',
    ariaLabel: 'Kopiuj numer telefonu leada',
    tone: 'neutral',
    variant: 'ghost',
    loadingLabel: 'Kopiowanie telefonu...',
    disabledLabel: 'Brak numeru telefonu',
    requiresConfirmation: false,
  },
  'case.copyLink': {
    key: 'case.copyLink',
    group: 'copy-link',
    label: 'Kopiuj link',
    ariaLabel: 'Kopiuj link do sprawy',
    tone: 'neutral',
    variant: 'ghost',
    loadingLabel: 'Kopiowanie linku...',
    disabledLabel: 'Brak linku do sprawy',
    requiresConfirmation: false,
  },
  'client.copyLink': {
    key: 'client.copyLink',
    group: 'copy-link',
    label: 'Kopiuj link',
    ariaLabel: 'Kopiuj link do klienta',
    tone: 'neutral',
    variant: 'ghost',
    loadingLabel: 'Kopiowanie linku...',
    disabledLabel: 'Brak linku do klienta',
    requiresConfirmation: false,
  },
  'task.markDone': {
    key: 'task.markDone',
    group: 'mark-done',
    label: 'Oznacz jako zrobione',
    ariaLabel: 'Oznacz zadanie jako zrobione',
    tone: 'success',
    variant: 'default',
    loadingLabel: 'Oznaczanie zadania...',
    disabledLabel: 'Zadanie jest już zamknięte',
    requiresConfirmation: false,
  },
  'event.markDone': {
    key: 'event.markDone',
    group: 'mark-done',
    label: 'Oznacz jako zrobione',
    ariaLabel: 'Oznacz wydarzenie jako zrobione',
    tone: 'success',
    variant: 'default',
    loadingLabel: 'Oznaczanie wydarzenia...',
    disabledLabel: 'Wydarzenie jest już zamknięte',
    requiresConfirmation: false,
  },
  'case.markDone': {
    key: 'case.markDone',
    group: 'mark-done',
    label: 'Zamknij sprawę',
    ariaLabel: 'Oznacz sprawę jako zrobioną',
    tone: 'success',
    variant: 'default',
    loadingLabel: 'Zamykanie sprawy...',
    disabledLabel: 'Sprawa jest już zamknięta',
    requiresConfirmation: false,
  },
  'missingItem.resolve': {
    key: 'missingItem.resolve',
    group: 'mark-done',
    label: 'Uzupełnione',
    ariaLabel: 'Oznacz brak jako uzupełniony',
    tone: 'success',
    variant: 'default',
    loadingLabel: 'Oznaczanie braku...',
    disabledLabel: 'Brak jest już rozwiązany',
    requiresConfirmation: false,
  },
  'task.restore': {
    key: 'task.restore',
    group: 'restore',
    label: 'Przywróć zadanie',
    ariaLabel: 'Przywróć zadanie do pracy',
    tone: 'primary',
    variant: 'outline',
    loadingLabel: 'Przywracanie zadania...',
    disabledLabel: 'Nie można przywrócić zadania',
    requiresConfirmation: false,
  },
  'event.restore': {
    key: 'event.restore',
    group: 'restore',
    label: 'Przywróć wydarzenie',
    ariaLabel: 'Przywróć wydarzenie do pracy',
    tone: 'primary',
    variant: 'outline',
    loadingLabel: 'Przywracanie wydarzenia...',
    disabledLabel: 'Nie można przywrócić wydarzenia',
    requiresConfirmation: false,
  },
  'case.restore': {
    key: 'case.restore',
    group: 'restore',
    label: 'Przywróć sprawę',
    ariaLabel: 'Przywróć sprawę do pracy',
    tone: 'primary',
    variant: 'outline',
    loadingLabel: 'Przywracanie sprawy...',
    disabledLabel: 'Nie można przywrócić sprawy',
    requiresConfirmation: false,
  },
  'lead.restore': {
    key: 'lead.restore',
    group: 'restore',
    label: 'Przywróć leada',
    ariaLabel: 'Przywróć leada do pracy',
    tone: 'primary',
    variant: 'outline',
    loadingLabel: 'Przywracanie leada...',
    disabledLabel: 'Nie można przywrócić leada',
    requiresConfirmation: false,
  },
  'task.snooze': {
    key: 'task.snooze',
    group: 'snooze',
    label: 'Odłóż zadanie',
    ariaLabel: 'Odłóż zadanie na później',
    tone: 'warning',
    variant: 'secondary',
    loadingLabel: 'Odkładanie zadania...',
    disabledLabel: 'Nie można odłożyć zadania',
    requiresConfirmation: false,
  },
  'event.snooze': {
    key: 'event.snooze',
    group: 'snooze',
    label: 'Odłóż wydarzenie',
    ariaLabel: 'Odłóż wydarzenie na później',
    tone: 'warning',
    variant: 'secondary',
    loadingLabel: 'Odkładanie wydarzenia...',
    disabledLabel: 'Nie można odłożyć wydarzenia',
    requiresConfirmation: false,
  },
  'task.postpone': {
    key: 'task.postpone',
    group: 'snooze',
    label: 'Przełóż zadanie',
    ariaLabel: 'Przełóż termin zadania',
    tone: 'warning',
    variant: 'secondary',
    loadingLabel: 'Przekładanie zadania...',
    disabledLabel: 'Nie można przełożyć zadania',
    requiresConfirmation: false,
  },
  'event.postpone': {
    key: 'event.postpone',
    group: 'snooze',
    label: 'Przełóż wydarzenie',
    ariaLabel: 'Przełóż termin wydarzenia',
    tone: 'warning',
    variant: 'secondary',
    loadingLabel: 'Przekładanie wydarzenia...',
    disabledLabel: 'Nie można przełożyć wydarzenia',
    requiresConfirmation: false,
  },
};

export const RECORD_REMOVAL_ACTION_KEYS: readonly AppActionKey[] = [
  'lead.remove',
  'case.remove',
  'client.remove',
  'task.remove',
  'event.remove',
  'missingItem.remove',
];

export const COPY_LINK_ACTION_KEYS: readonly AppActionKey[] = [
  'record.copyLink',
  'lead.copyEmail',
  'lead.copyPhone',
  'case.copyLink',
  'client.copyLink',
];

export const MARK_DONE_ACTION_KEYS: readonly AppActionKey[] = [
  'task.markDone',
  'event.markDone',
  'case.markDone',
  'missingItem.resolve',
];

export const RESTORE_ACTION_KEYS: readonly AppActionKey[] = [
  'task.restore',
  'event.restore',
  'case.restore',
  'lead.restore',
];

export const SNOOZE_ACTION_KEYS: readonly AppActionKey[] = [
  'task.snooze',
  'event.snooze',
  'task.postpone',
  'event.postpone',
];

export function isAppActionKey(value: unknown): value is AppActionKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(APP_ACTIONS, value);
}

export function getAppActionMeta(actionKey: AppActionKey): AppActionMeta {
  return APP_ACTIONS[actionKey];
}

export function getAppActionLabel(actionKey: AppActionKey): string {
  return getAppActionMeta(actionKey).label;
}

export function getAppActionAriaLabel(actionKey: AppActionKey): string {
  return getAppActionMeta(actionKey).ariaLabel;
}

export function getAppActionConfirmCopy(actionKey: AppActionKey): AppActionConfirmCopy | null {
  return getAppActionMeta(actionKey).confirmation ?? null;
}

export function requiresAppActionConfirmation(actionKey: AppActionKey): boolean {
  return getAppActionMeta(actionKey).requiresConfirmation === true;
}
