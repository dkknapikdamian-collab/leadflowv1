import { useEffect, useState } from 'react';
import {
  getClientAuthSnapshot,
  subscribeClientAuthSnapshot,
  type ClientAuthSnapshot,
} from '../lib/client-auth';

export function useClientAuthSnapshot() {
  const [snapshot, setSnapshot] = useState<ClientAuthSnapshot>(() => getClientAuthSnapshot());

  useEffect(() => {
    setSnapshot(getClientAuthSnapshot());
    return subscribeClientAuthSnapshot((nextSnapshot) => {
      setSnapshot(nextSnapshot);
    });
  }, []);

  return snapshot;
}
