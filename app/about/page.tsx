"use client";

import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/lib/useLanguage";

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Card>
        <h1 className="text-3xl font-semibold">{t.navFeatures}</h1>
        <p className="mt-3 text-[var(--color-text-muted)]">{t.featuresTitle}</p>
      </Card>
    </main>
  );
}
