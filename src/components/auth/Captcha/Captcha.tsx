import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { CaptchaProps } from '@/types/auth';

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: () => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

const RECAPTCHA_SCRIPT_ID = 'google-recaptcha-v2';

function RecaptchaPlaceholder({
  onVerify,
  className,
}: {
  onVerify: (verified: boolean) => void;
  className?: string;
}) {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    const next = !checked;
    setChecked(next);
    onVerify(next);
  };

  return (
    <div
      className={cn(
        'inline-flex max-w-full items-center justify-between gap-4 rounded border border-[#d3d3d3] bg-[#f9f9f9] px-3 py-2.5 shadow-sm',
        className,
      )}
      role="group"
      aria-label="reCAPTCHA verification"
    >
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          className="h-[22px] w-[22px] cursor-pointer rounded border-[#c1c1c1] accent-auth-primary"
          aria-label="I'm not a robot"
        />
        <span className="text-sm text-ink">I&apos;m not a robot</span>
      </label>

      <div className="flex shrink-0 flex-col items-center gap-0.5">
        <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
          <path fill="#1c3aa9" d="M32 4c15.5 0 28 12.5 28 28S47.5 60 32 60 4 47.5 4 32 16.5 4 32 4z" />
          <path fill="#4285f4" d="M32 8c13.3 0 24 10.7 24 24s-10.7 24-24 24S8 45.3 8 32 18.7 8 32 8z" />
          <path fill="#fff" d="M26 22h12v4H30v6h6v4H26v8h-4V22h4zm14 0h4v24h-4V22z" />
        </svg>
        <span className="text-[9px] font-medium text-ink-muted">reCAPTCHA</span>
        <span className="text-[8px] text-ink-light">Privacy - Terms</span>
      </div>
    </div>
  );
}

export function Captcha({ onVerify, className }: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

  useEffect(() => {
    onVerify(false);
  }, [onVerify]);

  useEffect(() => {
    if (!siteKey) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.grecaptcha || widgetIdRef.current !== null) return;

      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: () => onVerify(true),
        'expired-callback': () => onVerify(false),
        'error-callback': () => onVerify(false),
      });
    };

    if (window.grecaptcha) {
      setScriptLoaded(true);
      renderWidget();
      return;
    }

    window.onRecaptchaLoad = () => {
      setScriptLoaded(true);
      renderWidget();
    };

    if (!document.getElementById(RECAPTCHA_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = RECAPTCHA_SCRIPT_ID;
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    return () => {
      widgetIdRef.current = null;
    };
  }, [siteKey, onVerify]);

  if (!siteKey) {
    return <RecaptchaPlaceholder onVerify={onVerify} className={className} />;
  }

  return (
    <div className={cn('min-h-[78px]', className)} aria-live="polite">
      <div ref={containerRef} />
      {!scriptLoaded && <p className="text-xs text-ink-muted">Loading reCAPTCHA...</p>}
    </div>
  );
}
