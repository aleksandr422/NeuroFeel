"use client";

import Link from "next/link";

export function StatsEmptyState({ title, subtitle, buttonLabel }: { title: string; subtitle: string; buttonLabel: string }) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-10 text-center shadow-xl shadow-violet-100/60">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-3xl">📉</div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">{subtitle}</p>
      <Link
        href="/diary"
        className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-[#6D5EF5] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-300/50 transition hover:-translate-y-0.5"
      >
        {buttonLabel}
      </Link>
    </section>
  );
}
