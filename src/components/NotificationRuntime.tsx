/* PWA_STAGE13_NOTIFICATION_RUNTIME_SAFE: runtime powiadomień bez offline sejfu danych i bez ukrytych klików poza aplikację. */
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { fetchCalendarBundleFromSupabase } from '../lib/calendar-items';
import { useWorkspace } from '../hooks/useWorkspace';
import {
  buildRuntimeNotificationItems,
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  recordDeliveredNotification,
  supportsBrowserNotifications,
  hasDeliveredNotification,
  getNotificationDeliveryKey,
} from '../lib/notifications';
import { getReminderSettings } from '../lib/reminders';

type NotificationRuntimeProps = {
  enabled: boolean;
};

function isInternalNotificationLink(link: string) {
  return typeof link === 'string' && link.startsWith('/') && !link.startsWith('//');
}

export default function NotificationRuntime({ enabled }: NotificationRuntimeProps) {
  const scanPendingRef = useRef(false);
  const { profile, workspace, loading } = useWorkspace();

  useEffect(() => {
    if (!enabled) return;
    if (loading) return;
    if (!workspace?.id) return;

    let cancelled = false;

    const runScan = async () => {
      if (scanPendingRef.current) return;
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
      scanPendingRef.current = true;

      try {
        const bundle = await fetchCalendarBundleFromSupabase();
        if (cancelled) return;

        const items = buildRuntimeNotificationItems(bundle, new Date());
        const reminderSettings = getReminderSettings();
        const permission = getBrowserNotificationPermission();
        const browserEnabled =
          reminderSettings.browserNotificationsEnabled
          && (typeof profile?.browserNotificationsEnabled === 'boolean'
            ? profile.browserNotificationsEnabled
            : getBrowserNotificationsEnabled());
        const liveEnabled = reminderSettings.liveNotificationsEnabled;
        const pageVisible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;

        if (!liveEnabled) return;

        for (const item of items) {
          const deliveryKey = getNotificationDeliveryKey(item.key);
          if (hasDeliveredNotification(deliveryKey)) continue;

          recordDeliveredNotification(item, deliveryKey);

          if (!pageVisible && browserEnabled && permission === 'granted' && supportsBrowserNotifications()) {
            const notification = new Notification(item.title, {
              body: item.body,
              tag: deliveryKey,
            });
            notification.onclick = () => {
              window.focus();
              if (isInternalNotificationLink(item.link)) {
                window.location.assign(item.link);
              }
            };
          } else {
            toast(item.title, {
              description: item.body,
              duration: 6000,
            });
          }
        }
      } catch (error) {
        console.warn('NOTIFICATION_RUNTIME_SCAN_FAILED', error);
      } finally {
        scanPendingRef.current = false;
      }
    };

    void runScan();
    const interval = window.setInterval(() => {
      void runScan();
    }, 60_000);

    const handleFocus = () => {
      void runScan();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [enabled, loading, profile?.browserNotificationsEnabled, workspace?.id]);

  return null;
}
