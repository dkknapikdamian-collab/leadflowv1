export type ClientAuthSnapshot = {
  uid: string;
  email: string;
  fullName: string;
};

const AUTH_SNAPSHOT_STORAGE_KEY = 'closeflow:client-auth-snapshot';

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

export function getClientAuthSnapshot(): ClientAuthSnapshot {
  if (memorySnapshot.uid || memorySnapshot.email || memorySnapshot.fullName) {
    return memorySnapshot;
  }

  if (!canUseStorage()) {
    return memorySnapshot;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_SNAPSHOT_STORAGE_KEY);
    if (!raw) return memorySnapshot;

    const parsed = JSON.parse(raw) as Partial<ClientAuthSnapshot>;
    memorySnapshot = normalizeSnapshot(parsed);
    return memorySnapshot;
  } catch {
    return memorySnapshot;
  }
}

export function setClientAuthSnapshot(input?: Partial<ClientAuthSnapshot> | null) {
  memorySnapshot = normalizeSnapshot(input);

  if (!canUseStorage()) return;

  if (!memorySnapshot.uid && !memorySnapshot.email && !memorySnapshot.fullName) {
    window.localStorage.removeItem(AUTH_SNAPSHOT_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_SNAPSHOT_STORAGE_KEY, JSON.stringify(memorySnapshot));
}

export function clearClientAuthSnapshot() {
  memorySnapshot = {
    uid: '',
    email: '',
    fullName: '',
  };

  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_SNAPSHOT_STORAGE_KEY);
}
