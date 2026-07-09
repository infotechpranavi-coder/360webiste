'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

const DISMISS_STORAGE_KEY = 'skygo_offer_popup_dismissed_at';

function canShowPopup(settings: SiteSettings, dismissedAt: number | null) {
  if (!settings.offerPopupEnabled) return false;
  if (!settings.offerPopupImageUrl?.trim() || !settings.offerPopupTitle?.trim()) return false;

  const repeatMs = Math.max(10, settings.offerPopupRepeatIntervalSeconds ?? 320) * 1000;
  if (dismissedAt && Date.now() - dismissedAt < repeatMs) return false;
  return true;
}

export default function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedulePopup = useCallback(
    (popupSettings: SiteSettings) => {
      clearTimer();

      const dismissedRaw = localStorage.getItem(DISMISS_STORAGE_KEY);
      const dismissedAt = dismissedRaw ? Number(dismissedRaw) : null;
      if (!canShowPopup(popupSettings, dismissedAt)) return;

      const delayMs = Math.max(0, popupSettings.offerPopupInitialDelaySeconds ?? 3) * 1000;
      timerRef.current = setTimeout(() => setOpen(true), delayMs);
    },
    [clearTimer]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled && data.success && data.data) {
          setSettings(data.data);
          schedulePopup(data.data);
        }
      } catch (error) {
        console.error('Failed to load offer popup settings:', error);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [clearTimer, schedulePopup]);

  const handleClose = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    setOpen(false);
    clearTimer();

    if (settings?.offerPopupEnabled && settings.offerPopupImageUrl && settings.offerPopupTitle) {
      const repeatMs = Math.max(10, settings.offerPopupRepeatIntervalSeconds ?? 320) * 1000;
      timerRef.current = setTimeout(() => setOpen(true), repeatMs);
    }
  };

  if (!open || !settings?.offerPopupImageUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close offer popup"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-xl sm:max-w-2xl overflow-hidden rounded-[32px] border border-white/20 bg-[#111827] shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] min-h-[320px] sm:min-h-[380px]">
          <Image
            src={settings.offerPopupImageUrl}
            alt={settings.offerPopupTitle || 'Special offer'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
            {settings.offerPopupSubtitle?.trim() ? (
              <span className="mb-4 inline-flex rounded-full bg-[#bd9245] px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg">
                {settings.offerPopupSubtitle}
              </span>
            ) : null}
            <h2 className="text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
              {settings.offerPopupTitle}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
