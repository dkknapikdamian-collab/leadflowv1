# CloseFlow A1 - Client note / event modal / lead visibility finalizer

Status: blocking runtime/data finalizer.

## Zakres

- clientId in ActivityInput and fetchActivitiesFromSupabase.
- DELETE activity helper: deleteActivityFromSupabase.
- activities API supports client_id in GET/POST/PATCH and scoped DELETE.
- ClientDetail reads client activities by clientId.
- client note event type is canonical client_note.
- legacy note event types remain supported: client_note, client_note_added, client_note_dictated, dictated_note, note_added.
- new lead create clears search/filter and strips stale client/case ids.

## Manual smoke test

1. Open a client.
2. Add or dictate a client note.
3. The note appears as a normal note.
4. Delete the note. No ReferenceError.
5. Reload client. The note stays deleted.
6. Add a lead while a search/filter is active. The new lead is visible after save.
