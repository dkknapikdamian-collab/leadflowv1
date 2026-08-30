export type CaseMutationOperation = 'create' | 'update';

export function getCaseMutationErrorMessage(error: unknown, operation: CaseMutationOperation) {
  const rawMessage = error && typeof error === 'object' && 'message' in error
    ? String((error as { message?: unknown }).message || '')
    : String(error || '');
  const message = rawMessage.toLowerCase();

  if (message.includes('client_not_found') || message.includes('nie znaleziono klienta')) {
    return 'Nie znaleziono wybranego klienta. Wybierz go ponownie.';
  }
  if (message.includes('auth_workspace_required') || message.includes('workspace')) {
    return 'Sesja workspace wygasła. Odśwież stronę i spróbuj ponownie.';
  }
  if (message.includes('case_id_missing_after_create')) {
    return 'Sprawa została zapisana, ale system nie zwrócił jej identyfikatora. Odśwież listę i sprawdź zapis.';
  }
  return operation === 'create'
    ? 'Nie udało się utworzyć sprawy. Spróbuj ponownie.'
    : 'Nie udało się zapisać zmian w sprawie. Spróbuj ponownie.';
}
