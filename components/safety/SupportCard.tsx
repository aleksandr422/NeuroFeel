"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SAFETY_RESOURCES } from "@/lib/safety/resources";
import { useLanguage } from "@/lib/useLanguage";

export function SupportCard({
  open,
  onContinue,
  onHideSession,
}: {
  open: boolean;
  onContinue: () => void;
  onHideSession: () => void;
}) {
  const { language, t } = useLanguage();
  const ref = useRef<HTMLDivElement | null>(null);
  const resources = SAFETY_RESOURCES[language];

  useEffect(() => {
    if (!open) return;
    ref.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <Card tone="muted" className="animate-[fadeIn_120ms_ease-out]">
      <div ref={ref} tabIndex={-1} role="region" aria-live="polite" aria-label={t.safetyCardTitle}>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{t.safetyCardTitle}</h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t.safetyCardText}</p>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
          {resources.map((item) => (
            <li key={item.name} className="rounded-[var(--radius-md)] bg-white p-3">
              <p className="font-medium text-[var(--color-text)]">{item.name}</p>
              <p>{item.purpose}</p>
              {item.phone ? <p>{item.phone}</p> : null}
              {item.url ? <p><a className="text-[var(--color-primary-600)] underline" href={item.url} target="_blank" rel="noreferrer">{item.url}</a></p> : null}
              {item.hours ? <p>{item.hours}</p> : null}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onContinue}>{t.safetyContinue}</Button>
          <button type="button" onClick={onHideSession} className="text-sm text-[var(--color-text-muted)] underline">{t.safetyHideSession}</button>
        </div>
      </div>
    </Card>
  );
}
