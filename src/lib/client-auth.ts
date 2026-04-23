export type ClientAuthSnapshot = {
  uid: string;
  email: string;
  fullName: string;
};

const AUTH_SNAPSHOT_STORAGE_KEY = 'closeflow:client-auth-snapshot';
const AUTH_SNAPSHOT_EVENT = 'closeflow:client-auth-snapshot-changed';

let memorySnapshot: ClientAuthSnapshot = {
  uid: '',
  email: '',
  fullName: '',
};

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function normalizeSnapshot(input?: Partial<ClientAuthSnapshot> | null): ClientAuthSnapshot {
  return {
    uid: typeof input?.uid === 'string' ? input.uid.trim() : '',
    email: typeof input?.email === 'string' ? input.email.trim() : '',
    fullName: typeof input?.fullName === 'string' ? input.fullName.trim() : '',
  };
}

function readStoredSnapshot(): ClientAuthSnapshot {
  if (!canUseStorage()) {
    return memorySnapshot;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_SNAPSHOT_STORAGE_KEY);
    if (!raw) return memorySnapshot;

    const parsed = JSON.parse(raw) as Partial<ClientAuthSnapshot>;
    return normalizeSnapshot(parsed);
  } catch {
    return memorySnapshot;
  }
}

function emitSnapshotChanged(snapshot: ClientAuthSnapshot) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<ClientAuthSnapshot>(AUTH_SNAPSHOT_EVENT, {
      detail: snapshot,
    }),
  );
}

export function getClientAuthSnapshot(): ClientAuthSnapshot {
  if (memorySnapshot.uid || memorySnapshot.email || memorySnapshot.fullName) {
    return memorySnapshot;
  }

  memorySnapshot = readStoredSnapshot();
  return memorySnapshot;
}

export function setClientAuthSnapshot(input?: Partial<ClientAuthSnapshot> | null) {
  memorySnapshot = normalizeSnapshot(input);

  if (canUseStorage()) {
    if (!memorySnapshot.uid && !memorySnapshot.email && !memorySnapshot.fullName) {
      window.localStorage.removeItem(AUTH_SNAPSHOT_STORAGE_KEY);
    } else {
      window.localStorage.setItem(AUTH_SNAPSHOT_STORAGE_KEY, JSON.stringify(memorySnapshot));
    }
  }

  emitSnapshotChanged(memorySnapshot);
}

export function clearClientAuthSnapshot() {
  setClientAuthSnapshot({
    uid: '',
    email: '',
    fullName: '',
  });
}

export function subscribeClientAuthSnapshot(listener: (snapshot: ClientAuthSnapshot) => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ClientAuthSnapshot>).detail;
    listener(normalizeSnapshot(detail));
  };

  window.addEventListener(AUTH_SNAPSHOT_EVENT, handler as EventListener);
  return () => {
    window.removeEventListener(AUTH_SNAPSHOT_EVENT, handler as EventListener);
  };
}
