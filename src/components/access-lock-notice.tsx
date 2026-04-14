import { AlertTriangle, CreditCard, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buildWorkspaceAccessMeta, type WorkspaceLike } from '../lib/access';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

export default function AccessLockNotice({ workspace }: { workspace?: WorkspaceLike | null }) {
  const meta = buildWorkspaceAccessMeta(workspace);
  if (meta.hasWriteAccess) return null;

  return (
    <Card className="border border-rose-500/20 bg-rose-500/6 shadow-none">
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-rose-500/12 p-3 text-rose-500">
            {meta.state === 'payment_failed' ? <CreditCard className="h-5 w-5" /> : meta.state === 'canceled' ? <ShieldAlert className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-semibold app-text">Tryb podglądu</p>
            <p className="mt-1 text-sm app-muted">{meta.blockedReason}</p>
          </div>
        </div>
        <Button asChild className="rounded-2xl">
          <Link to="/billing">Odblokuj zapis</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
