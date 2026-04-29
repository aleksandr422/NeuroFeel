"use client";

import { Card } from "@/components/ui/Card";
import { SAFETY_RESOURCES } from "@/lib/safety/resources";
import { useLanguage } from "@/lib/useLanguage";

export default function PrivacyPage() {
  const { t, language } = useLanguage();
  const resources = SAFETY_RESOURCES[language];
  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-10">
      <Card>
        <h1 className="text-3xl font-semibold">{t.privacySafety}</h1>
        <p className="mt-3 text-[var(--color-text-muted)]">{t.privacyText}</p>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">{t.privacyStoreTitle}</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[var(--color-text-muted)]">
          <li>{t.privacyStoreEntries}</li>
          <li>{t.privacyStoreMood}</li>
          <li>{t.privacyStoreProfile}</li>
          <li>{t.privacyStorePin}</li>
          <li>{t.privacyStoreSession}</li>
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">{t.privacyNoTitle}</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[var(--color-text-muted)]">
          <li>{t.privacyNoServers}</li>
          <li>{t.privacyNoTraining}</li>
          <li>{t.privacyNoThirdParty}</li>
          <li>{t.privacyNoTelemetry}</li>
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">{t.privacyLocalTitle}</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[var(--color-text-muted)]">
          <li>{t.privacyLocalClear}</li>
          <li>{t.privacyLocalUninstall}</li>
          <li>{t.privacyLocalBrowserAccess}</li>
        </ul>
      </Card>
      <Card tone="muted">
        <h2 className="text-xl font-semibold">{t.privacyUnder18Title}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t.privacyUnder18Text}</p>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
          {resources.map((item) => (
            <li key={item.name} className="rounded-[var(--radius-md)] bg-white p-3">
              <p className="font-medium text-[var(--color-text)]">{item.name}</p>
              <p>{item.purpose}</p>
              {item.phone ? <p>{item.phone}</p> : null}
              {item.url ? <p><a className="text-[var(--color-primary-600)] underline" href={item.url}>{item.url}</a></p> : null}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">{t.privacyContactTitle}</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t.privacyContactText}</p>
      </Card>
    </main>
  );
}
