"use client";

import Link from "next/link";
import { HomeTranslation } from "@/components/home/types";

export function QuickActions({ t }: { t: HomeTranslation }) {
  const actions = [
    { href: "/diary", icon: "📝", title: t.quickActionNewEntry, text: t.quickActionNewEntryText },
    { href: "/statistics", icon: "📊", title: t.quickActionStats, text: t.quickActionStatsText },
    { href: "/insights", icon: "💡", title: t.quickActionInsights, text: t.quickActionInsightsText },
  ];

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">{t.quickActionsEyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">{t.quickActionsTitle}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-3xl border border-violet-100 bg-white p-5 shadow-lg shadow-violet-100/60 transition hover:-translate-y-1 hover:border-violet-200"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-xl">{action.icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{action.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{action.text}</p>
            <p className="mt-4 text-sm font-semibold text-violet-700 transition group-hover:translate-x-0.5">{t.openAction}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
