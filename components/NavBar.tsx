"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/useLanguage";
import { Button } from "@/components/ui/Button";
import { NavPill } from "@/components/ui/NavPill";

export function NavBar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const appLinks = [
    { href: "/", label: t.home },
    { href: "/diary", label: t.diary },
    { href: "/statistics", label: t.statistics },
    { href: "/insights", label: t.insights },
    { href: "/settings", label: t.settings },
  ];
  const landingLinks = [
    { href: "/#features", label: t.navFeatures },
    { href: "/#how-it-works", label: t.navHowItWorks },
    { href: "/#reviews", label: t.navReviews },
    { href: "/#faq", label: t.navFaq },
  ];

  return (
    <nav className="sticky top-0 z-30 border-b border-violet-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-slate-900">
          MindDiary
        </Link>
        <div className="hidden items-center gap-3 rounded-full border border-violet-100 bg-violet-50/40 p-1.5 shadow-sm lg:flex">
          {appLinks.map((link) => (
            <NavPill key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavPill>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            variant="ghost"
            size="sm"
            iconOnly
            className="lg:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            ☰
          </Button>
          <LanguageSwitcher />
          <Link href="/chat"><Button variant="secondary" size="md">{t.navLogin}</Button></Link>
          <Link href="/diary"><Button variant="primary" size="md">{t.newEntry}</Button></Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl gap-2.5 overflow-x-auto px-4 pb-2">
        {appLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition lg:hidden ${
              pathname === link.href
                ? "border-transparent bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] text-white shadow-md shadow-violet-200/80"
                : "border-violet-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {mobileOpen ? (
        <div className="mx-auto grid max-w-6xl gap-2 px-4 pb-3 lg:hidden">
          {landingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-2 text-sm text-violet-700"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/settings" onClick={() => setMobileOpen(false)} className="rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm text-slate-700">
            {t.settings}
          </Link>
        </div>
      ) : null}
      <div className="mx-auto hidden max-w-6xl gap-2 overflow-x-auto px-4 pb-3 lg:flex">
        {landingLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-violet-100 bg-violet-50/60 px-3 py-1.5 text-xs text-violet-700 transition hover:bg-violet-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
