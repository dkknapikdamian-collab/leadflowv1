import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';

export function useFirebaseSession(auth: Auth) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return [user, loading] as const;
}
