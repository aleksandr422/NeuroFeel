"use client";

import { HomeTranslation } from "@/components/home/types";

export function Footer({ t }: { t: HomeTranslation }) {
  return (
    <footer id="faq" className="rounded-3xl border border-violet-100 bg-white px-6 py-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-slate-900">MindDiary</p>
          <p className="text-sm text-slate-500">{t.footerTagline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <a href="#features" className="transition hover:text-violet-700">
            {t.navFeatures}
          </a>
          <a href="#how-it-works" className="transition hover:text-violet-700">
            {t.navHowItWorks}
          </a>
          <a href="#reviews" className="transition hover:text-violet-700">
            {t.navReviews}
          </a>
          <a href="#faq" className="transition hover:text-violet-700">
            {t.navFaq}
          </a>
        </div>
      </div>
    </footer>
  );
}
