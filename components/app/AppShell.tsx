"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChartLine, Home, Menu, Plus, Settings, ShieldCheck, X } from "lucide-react";
import { DiaryInput } from "@/components/DiaryInput";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NavPill } from "@/components/ui/NavPill";
import { consumeFlashMessage, exportEntriesJson, getEntries, markExportedNow, resetOnboarding, setAuthenticated } from "@/lib/storage";
import { DiaryEntry } from "@/lib/types";
import { useLanguage } from "@/lib/useLanguage";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = drawerRef.current?.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])");
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const first = drawerRef.current?.querySelector<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])");
    first?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const navItems = [
    { href: "/app", label: t.todayNav, icon: Home, active: pathname === "/app" },
    { href: "/app/journal", label: t.diaryNav, icon: BookOpen, active: pathname.startsWith("/app/journal") },
    { href: "/app/analytics", label: t.analyticsNav, icon: ChartLine, active: pathname.startsWith("/app/analytics") },
    { href: "/app/settings", label: t.settings, icon: Settings, active: pathname.startsWith("/app/settings") },
  ];
  const dashboardView = pathname === "/app";

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--color-border)] bg-white px-4 py-4 lg:flex lg:w-[200px] xl:w-60">
        <nav aria-label="Главная навигация" className="flex h-full flex-col gap-3">
          <div className="flex items-center gap-2 px-2">
            <Menu size={16} className="text-[var(--color-text-muted)]" aria-hidden />
            <Link href="/app" className="text-[var(--fs-lg)] font-[var(--fw-semibold)] text-[var(--color-text)]">MindDiary</Link>
          </div>
          <div className="mt-3 space-y-2">
            {navItems.map((item) => (
              <NavPill key={item.href} href={item.href} active={item.active} className="w-full min-w-0 justify-start gap-2 px-4">
                <item.icon size={16} />
                {item.label}
              </NavPill>
            ))}
          </div>
          <div className="grow" />
          <Card tone="muted" padding="sm">
            <p className="text-sm font-semibold">Это не терапия</p>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">MindDiary помогает замечать паттерны. Не заменяет специалиста.</p>
            <Link href="/about/scope" className="mt-2 inline-block text-xs text-[var(--color-primary-600)] underline">Подробнее</Link>
            <ShieldCheck size={20} className="mt-2 text-[var(--color-primary-500)]" aria-hidden />
          </Card>
        </nav>
      </aside>
      {drawerOpen ? <button type="button" className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setDrawerOpen(false)} aria-label="Закрыть меню" /> : null}
      <aside ref={drawerRef} className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-[var(--color-border)] bg-white px-4 py-4 transition-transform lg:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <nav aria-label="Главная навигация" className="flex h-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link href="/app" className="text-lg font-bold text-[var(--color-text)]">MindDiary</Link>
            <Button variant="ghost" iconOnly size="sm" aria-label="Закрыть меню" onClick={() => setDrawerOpen(false)}><X size={16} /></Button>
          </div>
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={`inline-flex min-h-11 items-center justify-start gap-2 rounded-[var(--radius-pill)] px-4 text-sm font-[var(--fw-semibold)] ${item.active ? "bg-[var(--color-primary-500)] text-white" : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-100)]"}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="grow" />
          <Card tone="muted" padding="sm">
            <p className="text-sm font-semibold">Это не терапия</p>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">MindDiary помогает замечать паттерны. Не заменяет специалиста.</p>
            <Link href="/about/scope" className="mt-2 inline-block text-xs text-[var(--color-primary-600)] underline">Подробнее</Link>
            <ShieldCheck size={20} className="mt-2 text-[var(--color-primary-500)]" aria-hidden />
          </Card>
        </nav>
      </aside>
      <div className="transition-opacity duration-150">
        <header className={`z-30 ${dashboardView ? "" : "sticky top-0 border-b border-[var(--color-border)] bg-white/90 backdrop-blur"}`}>
          <div className={`flex items-center gap-3 px-4 py-3 lg:pl-[216px] lg:pr-6 xl:pl-[272px] ${dashboardView ? "pt-6" : ""}`}>
            <Button variant="ghost" iconOnly size="sm" className="lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Открыть меню">
              <Menu size={17} />
            </Button>
            <div className="ml-auto flex items-center gap-3">
              <LanguageSwitcher />
              <Button variant="primary" onClick={() => setWriteOpen(true)} className="hidden items-center gap-2 sm:inline-flex"><Plus size={16} />{writeLabel}</Button>
              <div className="relative">
                <Button variant="ghost" iconOnly size="sm" onClick={() => setMenuOpen((v) => !v)} aria-label={t.openUserMenu}>
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-text)]" />
                </Button>
                {menuOpen ? (
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1 shadow-[var(--shadow-card-hover)]">
                    <Link href="/app/settings" className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-100)]">Профиль</Link>
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
          </div>
        </header>
        <main className="px-4 py-4 lg:pl-[216px] lg:pr-6 xl:pl-[272px]">{children}</main>
      </div>
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
