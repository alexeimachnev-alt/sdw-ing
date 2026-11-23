import { useEffect, useCallback } from 'react';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  sendData: (data: string) => void;
  openLink: (url: string) => void;
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
  };
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function useTelegram() {
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

  useEffect(() => {
    if (!tg) return;
    try {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0B0D10');
      tg.setBackgroundColor('#0B0D10');
    } catch {
      // Safe fallback in desktop browser preview
    }
  }, [tg]);

  const hapticImpact = useCallback(
    (style: 'light' | 'medium' | 'heavy' = 'light') => {
      try {
        tg?.HapticFeedback?.impactOccurred(style);
      } catch {}
    },
    [tg]
  );

  const hapticSuccess = useCallback(() => {
    try {
      tg?.HapticFeedback?.notificationOccurred('success');
    } catch {}
  }, [tg]);

  const hapticSelection = useCallback(() => {
    try {
      tg?.HapticFeedback?.selectionChanged();
    } catch {}
  }, [tg]);

  const user = tg?.initDataUnsafe?.user;
  const userName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '';

  const sendLeadData = useCallback(
    (payload: Record<string, unknown>) => {
      const body = {
        ...payload,
        source: 'sdv_telegram_mini_app',
        telegramUserId: user?.id ?? null,
        telegramUsername: user?.username ?? null,
        timestamp: new Date().toISOString(),
      };

      if (API_URL) {
        fetch(`${API_URL}/api/lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).catch((err) => console.error('[SDV API Error]', err));
        return true;
      }

      if (tg?.sendData) {
        try {
          tg.sendData(JSON.stringify(body));
          return true;
        } catch {
          console.log('[SDV TMA Payload]', body);
          return false;
        }
      }

      console.log('[SDV TMA Preview Payload]', body);
      return false;
    },
    [tg, user]
  );

  const useBackButton = (isVisible: boolean, onBack: () => void) => {
    useEffect(() => {
      if (!tg?.BackButton) return;
      if (isVisible) {
        tg.BackButton.show();
        tg.BackButton.onClick(onBack);
      } else {
        tg.BackButton.hide();
      }
      return () => {
        tg.BackButton?.offClick(onBack);
      };
    }, [isVisible, onBack]);
  };

  return {
    tg,
    user,
    userName,
    hapticImpact,
    hapticSuccess,
    hapticSelection,
    sendLeadData,
    useBackButton,
  };
}
