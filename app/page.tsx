"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isAuthenticated, setAuthenticated } from "@/lib/storage";
import { useLanguage } from "@/lib/useLanguage";

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  // By Hakkobyan: keep authenticated visitors on the in-app experience.
  const authenticated = typeof window !== "undefined" && isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      router.replace("/app");
    }
  }, [authenticated, router]);

  if (authenticated) return null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-[var(--color-text)]">MindDiary</Link>
        <div className="flex items-center gap-2">
          <Link href="/how-it-works"><Button variant="ghost">{t.navHowItWorks}</Button></Link>
          <Link href="/privacy"><Button variant="ghost">{t.privacySafety}</Button></Link>
          <LanguageSwitcher />
          <Button variant="secondary" onClick={() => { setAuthenticated(true); router.push("/app"); }}>{t.navLogin}</Button>
          <Button variant="primary" onClick={() => { setAuthenticated(true); router.push("/app"); }}>{t.startFree}</Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <Card>
          {/* By Hakkobyan: concise hero content keeps the first visit focused. */}
          <h1 className="text-4xl font-bold">{t.heroTitleStart} <span className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] bg-clip-text text-transparent">{t.heroTitleHighlight}</span></h1>
          <p className="mt-3 text-[var(--color-text-muted)]">{t.heroSubtitle}</p>
          <div className="mt-5"><Button variant="primary" onClick={() => { setAuthenticated(true); router.push("/app"); }}>{t.startFree}</Button></div>
          <p className="mt-2 text-xs text-[var(--color-text-subtle)]">{t.disclaimer}</p>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">{t.stepsTitle}</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--color-text-muted)]">
            <li>{t.step1Title}</li>
            <li>{t.step2Title}</li>
            <li>{t.step3Title}</li>
          </ol>
        </Card>
        <Card tone="muted">
          <p className="text-sm text-[var(--color-text-muted)]">{t.privacyText}</p>
        </Card>
      </main>
    </div>
  );
}
