"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { DiaryInput } from "@/components/DiaryInput";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { NavPill } from "@/components/ui/NavPill";
import { consumeFlashMessage, exportEntriesJson, getEntries, markExportedNow, resetOnboarding, setAuthenticated } from "@/lib/storage";
import { DiaryEntry } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const [flash] = useState<string | null>(() => consumeFlashMessage());
  const [entries, setEntries] = useState<DiaryEntry[]>(() => getEntries());
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayEntry = useMemo(() => entries.find((entry) => entry.date.slice(0, 10) === todayKey) ?? null, [entries, todayKey]);
  const writeLabel = todayEntry ? t.writeAddToday : t.writeToday;

  useEffect(() => {
    const handler = () => setWriteOpen(true);
    window.addEventListener("minddiary:open-writer", handler as EventListener);
    return () => window.removeEventListener("minddiary:open-writer", handler as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/app" className="text-lg font-bold text-[var(--color-text)]">MindDiary</Link>
          <div className="hidden items-center gap-2 md:flex">
            <NavPill href="/app" active={pathname === "/app"}>{t.todayNav}</NavPill>
            <NavPill href="/app/journal" active={pathname.startsWith("/app/journal")}>{t.diaryNav}</NavPill>
            <NavPill href="/app/analytics" active={pathname.startsWith("/app/analytics")}>{t.analyticsNav}</NavPill>
          </div>
          <div className="relative flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="primary" onClick={() => setWriteOpen(true)}>{writeLabel}</Button>
            <Button variant="ghost" iconOnly size="sm" onClick={() => setMenuOpen((v) => !v)} aria-label={t.openUserMenu}>☻</Button>
            {menuOpen ? (
              <div className="absolute right-0 top-12 z-50 w-56 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1 shadow-[var(--shadow-card-hover)]">
                <Link href="/app/settings" className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-100)]">{t.settings}</Link>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([exportEntriesJson()], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${t.exportFileName}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    markExportedNow();
                    setMenuOpen(false);
                  }}
                  className="block w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-100)]"
                >
                  {t.exportJson}
                </button>
                <button type="button" onClick={() => { resetOnboarding(); setMenuOpen(false); router.push("/app"); }} className="block w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-100)]">{t.restartOnboarding}</button>
                <button type="button" onClick={() => { setAuthenticated(false); router.push("/"); }} className="block w-full rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-[var(--color-danger-500)] hover:bg-[var(--color-danger-100)]">{t.logout}</button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <main>{children}</main>
      {flash ? <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-[var(--radius-pill)] bg-[var(--color-primary-500)] px-4 py-2 text-sm text-white shadow-[var(--shadow-card-hover)]">{flash}</div> : null}
      <Button
        variant="primary"
        className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] z-30 md:hidden"
        onClick={() => setWriteOpen(true)}
      >
        {writeLabel}
      </Button>
      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title={writeLabel}>
        <DiaryInput
          editingEntry={todayEntry}
          onEntryAdded={(entry) => setEntries((prev) => [entry, ...prev])}
          onEntryUpdated={(updatedEntry) => setEntries((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)))}
          onDone={() => setWriteOpen(false)}
          initialText={t.firstEntryPrompt}
        />
      </Modal>
    </div>
  );
}
