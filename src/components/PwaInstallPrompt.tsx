import { useEffect, useMemo, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { Button } from './ui/button';

type BeforeInstallPromptChoice = {
  outcome: 'accepted' | 'dismissed';
  platform: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<BeforeInstallPromptChoice>;
};

const DISMISSED_STORAGE_KEY = 'closeflow:pwa-install:dismissed:v2';

function isStandaloneDisplayMode() {
  if (typeof window === 'undefined') return false;

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    navigatorWithStandalone.standalone === true
  );
}

function readDismissedFlag() {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(DISMISSED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeDismissedFlag() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(DISMISSED_STORAGE_KEY, '1');
  } catch {
    // Best effort only.
  }
}

export function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => readDismissedFlag());
  const [installed, setInstalled] = useState(() => isStandaloneDisplayMode());
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      writeDismissedFlag();
      setDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const shouldShow = useMemo(() => {
    if (installed) return false;
    if (dismissed) return false;
    return Boolean(installPrompt);
  }, [dismissed, installPrompt, installed]);

  const handleDismiss = () => {
    writeDismissedFlag();
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      setIsInstalling(true);
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      setInstallPrompt(null);

      if (choice.outcome === 'accepted') {
        writeDismissedFlag();
        setDismissed(true);
      }
    } catch {
      setInstallPrompt(null);
    } finally {
      setIsInstalling(false);
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed inset-x-3 bottom-20 z-50 md:left-auto md:right-6 md:bottom-6 md:w-[360px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Smartphone className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">Dodaj CloseFlow do ekranu głównego telefonu</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Otwieraj aplikację jak zwykłą apkę, bez szukania jej w przeglądarce.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-xl px-3 text-xs font-bold"
                onClick={handleInstall}
                disabled={isInstalling}
              >
                <Download className="mr-2 h-4 w-4" />
                {isInstalling ? 'Dodawanie...' : 'Dodaj do ekranu'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-9 rounded-xl px-3 text-xs font-bold text-slate-500"
                onClick={handleDismiss}
              >
                Nie teraz
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Ukryj instalację PWA"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
