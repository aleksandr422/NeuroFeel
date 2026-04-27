"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/useLanguage";

export function NavBar() {
  const { t } = useLanguage();
  const links = [
    { href: "/", label: t.home },
    { href: "/diary", label: t.diary },
    { href: "/chat", label: t.chat },
    { href: "/statistics", label: t.statistics },
    { href: "/insights", label: t.insights },
    { href: "/settings", label: t.settings },
  ];

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-full px-3 py-1 text-sm text-slate-700 hover:bg-slate-100">
            {link.label}
          </Link>
        ))}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
